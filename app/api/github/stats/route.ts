import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Cache TTL: 15 menit. GitHub hanya dipanggil jika cache sudah kedaluwarsa.
// Semua pengunjung berbagi satu cache yang sama → aman dari rate limit.
const CACHE_TTL_MINUTES = 15;

// Fallback GitHub colors for languages
const GITHUB_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  React: '#61dafb',
  Shell: '#89e051',
  'Objective-C': '#438eff',
  Other: '#8b949e'
};

function getLanguageColor(language: string) {
  return GITHUB_COLORS[language] || '#8b949e';
}

function buildStatsFromRepos(repos: any[], username: string, detailedLanguages: any[]) {
  // Ambil 3 repo teratas: urutkan berdasarkan stars (desc), jika sama pakai push date (desc)
  const filteredRepos = repos.filter(repo => !repo.fork);
  const displayRepos = filteredRepos.length > 0 ? filteredRepos : repos;

  const topRepos = [...displayRepos]
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return 0;
    })
    .slice(0, 3)
    .map(repo => ({
      name: repo.name || repo.full_name || 'Untitled Repository',
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      watchers: repo.watchers_count || 0,
      language: repo.language || null,
      languageColor: getLanguageColor(repo.language || ''),
      description: repo.description || null,
      url: repo.html_url || '#'
    }));

  return {
    username,
    languages: detailedLanguages,
    topRepo: topRepos[0] || null,
    topRepos,
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const bustCache = searchParams.get('bust') === '1';

    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
    }

    const integration = await prisma.integration.findUnique({
      where: { userId_provider: { userId, provider: 'GITHUB' } }
    });

    if (!integration || !integration.providerId) {
      return NextResponse.json({ error: 'GitHub integration not found' }, { status: 404 });
    }

    const now = new Date();

    if (bustCache && integration.updatedAt) {
      const lastUpdate = new Date(integration.updatedAt).getTime();
      const secondsSinceLastUpdate = Math.floor((now.getTime() - lastUpdate) / 1000);
      
      if (secondsSinceLastUpdate < 60) {
        return NextResponse.json(
          { error: `Silakan tunggu ${60 - secondsSinceLastUpdate} detik lagi sebelum memperbarui.` }, 
          { status: 429 }
        );
      }
    }

    if (
      !bustCache &&
      integration.cachedData &&
      integration.cacheExpiresAt &&
      integration.cacheExpiresAt > now
    ) {
      const cached = JSON.parse(integration.cachedData);
      return NextResponse.json(cached, {
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
      });
    }

    const username = integration.providerId;
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfobe-App'
    };

    if (clientId && clientSecret) {
      headers['Authorization'] = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
    }

    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, {
      cache: 'no-store',
      headers: headers
    });

    if (!res.ok) {
      if (integration.cachedData) {
        return NextResponse.json(JSON.parse(integration.cachedData), {
          headers: { 'Cache-Control': 'public, s-maxage=60' }
        });
      }
      if (res.status === 404) return NextResponse.json({ error: 'GitHub user not found' }, { status: 404 });
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const repos = await res.json();

    if (!Array.isArray(repos) || repos.length === 0) {
      const emptyResult = { username, languages: [], topRepo: null };
      return NextResponse.json(emptyResult, {
        headers: { 'Cache-Control': 'public, s-maxage=60' }
      });
    }

    // --- Ambil Detail Bahasa dari Top 15 Repo (untuk akurasi tanpa merusak rate limit) ---
    const topReposForLangs = repos.filter((r: any) => !r.fork).slice(0, 15);
    const languageAggr: Record<string, number> = {};
    let totalBytes = 0;

    await Promise.all(topReposForLangs.map(async (repo: any) => {
      try {
        const langRes = await fetch(repo.languages_url, { headers, next: { revalidate: 3600 } });
        if (langRes.ok) {
          const langs = await langRes.json();
          for (const [name, bytes] of Object.entries(langs)) {
            languageAggr[name] = (languageAggr[name] || 0) + (bytes as number);
            totalBytes += (bytes as number);
          }
        }
      } catch (e) {
        console.error('Error fetching languages for repo:', repo.name);
      }
    }));

    // Proses Bahasa: Ambil Top 3 + Gabungkan Sisanya ke "Other"
    const sortedLangs = Object.entries(languageAggr)
      .sort(([, a], [, b]) => b - a);
      
    const top3 = sortedLangs.slice(0, 3);
    const rest = sortedLangs.slice(3);
    
    let detailedLanguages = top3.map(([name, bytes]) => ({
      name,
      percent: totalBytes > 0 ? parseFloat(((bytes / totalBytes) * 100).toFixed(1)) : 0,
      color: getLanguageColor(name)
    }));
    
    if (rest.length > 0) {
      const otherBytes = rest.reduce((acc, [, bytes]) => acc + bytes, 0);
      detailedLanguages.push({
        name: 'Other',
        percent: totalBytes > 0 ? parseFloat(((otherBytes / totalBytes) * 100).toFixed(1)) : 0,
        color: getLanguageColor('Other')
      });
    }

    const statsData = buildStatsFromRepos(repos, username, detailedLanguages);

    const expiresAt = new Date(now.getTime() + CACHE_TTL_MINUTES * 60 * 1000);
    await prisma.integration.update({
      where: { userId_provider: { userId, provider: 'GITHUB' } },
      data: {
        cachedData: JSON.stringify(statsData),
        cacheExpiresAt: expiresAt,
      }
    });

    return NextResponse.json(statsData, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
    });

  } catch (error) {
    console.error('GitHub API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
