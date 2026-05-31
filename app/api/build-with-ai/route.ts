import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      promptSource, // 'manual' | 'existing_profile'
      prompt,
      updateProfession,
      updateBio,
      updateTheme,
      lockedTheme,
      updateContent // Menggantikan updateProjects
    } = body;

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true, siteAppearance: true }
    });

    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    let finalPrompt = prompt;

    if (promptSource === 'existing_profile') {
      const existingProf = dbUser.profile?.profession || "(Belum ada profesi)";
      const existingBio = dbUser.profile?.bio || "(Belum ada bio)";

      let themeInstruction = `Pilihlah TEMA yang BENAR-BENAR BERBEDA dan PALING COCOK untuk profesi tersebut (misal: jika programmer pilih acid/monolith, jika penulis pilih editorial, jika video pilih cinematic, jika desainer pilih bentogrid, dll). Jangan selalu memilih tema yang sama!`;
      
      if (lockedTheme) {
         themeInstruction = `PENGGUNA TELAH MENGUNCI TEMA KE "${lockedTheme}". Kamu WAJIB mereturn nilai "${lockedTheme}" pada key "theme" di JSON! Fokuslah mencocokkan gaya bahasa customTexts, warna, dan font agar sangat pas dengan nuansa tema ${lockedTheme} tersebut.`;
      }

      finalPrompt = `Konteks Profil Saat Ini:
Profesi: ${existingProf}
Bio: ${existingBio}

Instruksi Tambahan dari Sistem: ${prompt || 'Tolong buatkan ulang agar lebih menarik.'}

PENTING: Analisis profesi di atas dengan saksama. ${themeInstruction}`;
    }

    if (!finalPrompt || !finalPrompt.trim()) {
      return NextResponse.json({ error: "Prompt tidak boleh kosong." }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    const ALL_KEYS = [
      "about_desc", "about_title", "aura_close_btn", "aura_copy_email", 
      "aura_footer_title1", "aura_footer_top", "aura_hero_title1", "aura_marquee", 
      "aura_modal_player", "aura_model_label", "aura_nav_awards", "aura_nav_cta", 
      "aura_nav_work", "aura_scroll_text", "awards_empty", "awards_label", 
      "awards_subtitle", "awards_title", "awards_view", "cta_subtitle", "cta_title", 
      "editorial_archive", "editorial_awards_sub", "editorial_awards_t1", 
      "editorial_footer_copy", "editorial_footer_t1", "editorial_footer_top", 
      "editorial_hero_btn", "editorial_hero_copy", "editorial_hero_t1", 
      "editorial_hero_top", "editorial_modal_close", "editorial_modal_top", 
      "editorial_model_tag", "editorial_models_sub", "editorial_models_t1", 
      "editorial_nav_available", "editorial_nav_awards", "editorial_nav_work", 
      "editorial_testi_t1", "editorial_works_sub", "editorial_works_t1", 
      "explore_archive", "footer_btn", "footer_desc", "footer_rights", "footer_title", 
      "hero_badge", "hero_cta1", "hero_cta2", "hero_title", "lm_awards_label", 
      "lm_badge_text", "lm_ethos_desc", "lm_ethos_h1", "lm_ethos_h2", "lm_ethos_h3", 
      "lm_ethos_label", "lm_expertise_desc", "lm_expertise_title", "lm_footer_cta", 
      "lm_footer_location", "lm_footer_prompt", "lm_hero_h1", "lm_hero_h2", 
      "lm_hero_h3", "lm_location", "lm_testi_label", "midnight_3d_layer", 
      "midnight_3d_title", "midnight_3d_top", "midnight_archive", "midnight_awards_title", 
      "midnight_awards_top", "midnight_btn_contact", "midnight_modal_close", 
      "midnight_modal_f1", "midnight_modal_f2", "midnight_modal_top", "midnight_scene_label", 
      "midnight_scroll", "midnight_testi_title", "midnight_testi_top", "models_subtitle", 
      "models_title", "nav_about", "nav_cta", "nav_services", "nav_work", 
      "noir_archive_displaying", "noir_archive_label", "noir_cert_designation", 
      "noir_cert_issuer", "noir_cert_status", "noir_cert_year", "noir_contact_button", 
      "noir_contact_label", "noir_explore_label", "noir_footer_connect", "noir_footer_eof", 
      "noir_footer_status", "noir_img_ref", "noir_img_res", "noir_models_assets", 
      "noir_overview_label", "noir_stats_uptime", "noir_ticker_location", 
      "noir_ticker_status", "noir_ticker_title", "obsidian_3d_badge", "obsidian_3d_label", 
      "obsidian_3d_title", "portfolio_label", "portfolio_title", "portfolio_view_all", 
      "projects_subtitle", "projects_title", "services_label", "services_title", 
      "spatial_asset_label", "spatial_close_btn", "spatial_copy_email", "spatial_footer_cta", 
      "spatial_footer_title1", "spatial_footer_title2", "spatial_hero_title1", 
      "spatial_model_label", "spatial_photo_label", "spatial_video_label", "stat_1_label", 
      "stat_1_val", "stat_2_label", "stat_2_val", "stat_3_label", "stat_3_val", 
      "stats_archive", "stats_awards", "stats_exp", "stats_projects", "stats_recognition", 
      "stats_time", "stats_total", "tech_subtitle", "tech_title", "testimonials_label", 
      "testimonials_subtitle", "testimonials_title", "vf_3d_metadata", "vf_3d_rendering", 
      "vf_3d_title", "vf_btn_explore", "vf_btn_next", "vf_btn_prev", "vf_cert_verify", 
      "vf_dir", "vf_festivals_title", "vf_footer_d1", "vf_footer_wrap", "vf_hud_iso", 
      "vf_hud_rec", "vf_hud_tc", "vf_log_file", "vf_log_title", "vf_modal_bot_l", 
      "vf_modal_bot_r", "vf_modal_exit", "vf_modal_play", "vf_modal_tc", "vf_modal_top_r1", 
      "vf_modal_top_r2", "vf_nav_contact", "vf_nav_log", "vf_nav_reel", "vf_reel_title", 
      "vf_reviews_title", "smooth_scroll", "hero_greeting", "hero_desc", "hero_scroll"
    ];

    const THEME_PREFIX_MAP: Record<string, string> = {
      'viewfinder': 'vf_',
      'absolute-noir': 'noir_',
      'layered-monolith': 'lm_',
      'midnight-emulsion': 'midnight_',
      'obsidian-reel': 'obsidian_',
      'spatial': 'spatial_',
      'aura-kinetic': 'aura_',
      'editorial': 'editorial_'
    };

    let targetKeys = ALL_KEYS;
    if (lockedTheme) {
      const prefix = THEME_PREFIX_MAP[lockedTheme] || null;
      targetKeys = ALL_KEYS.filter(key => {
        const isThemeSpecific = Object.values(THEME_PREFIX_MAP).some(p => key.startsWith(p));
        if (isThemeSpecific) {
           return prefix && key.startsWith(prefix);
        }
        return true;
      });
    }

    const customTextsSchema = targetKeys.map(k => `    "${k}": "Isi dengan teks gaya bebas yang cocok dengan tema"`).join(',\n');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `Kamu adalah asisten desainer web Portfo.be. Kembalikan HANYA JSON murni dengan struktur persis ini:
{
  "profession": "Gelar profesi 1-3 kata",
  "bio": "Bio 2-3 kalimat menarik",
  "theme": "pilih salah satu: spatial, obsidian-reel, aura-kinetic, editorial, minimalist, midnight-emulsion, viewfinder, split, monolith, absolute-noir, cinematic, acid, bentogrid, brutalism, layered-monolith, kinetic-avant-garde, nexus-noir",
  "themeColor": "kode warna hex",
  "fontFamily": "pilih: Inter, Space Mono, serif",
  "cardStyle": "pilih: hard-shadow, flat, soft-shadow",
  "buttonShape": "pilih: hard, rounded, pill",
  "splashScreen": true/false,
  "customTexts": {
${customTextsSchema}
  },
  "dummyProjects": [{"title":"", "description":"", "tags":["",""], "projectType":"pilih: image, video, atau 3d. Jika punya banyak skill (misal foto & video), kombinasikan tipenya!", "mediaUrl":"lihat aturan"}],
  "dummyTestimonials": [{"clientName":"", "company":"", "content":"", "rating":5, "avatarUrl":"https://ui-avatars.com/api/?name=nama&background=random"}],
  "dummyLinks": [{"platform":"", "url":""}],
  "dummyCertificates": [{"title":"", "issuer":"", "year":"2023", "description":""}]
}
Aturan Penting:
1. Pilihan "theme" akan menentukan keseluruhan nuansa portofolio.
2. Buat "customTexts" dengan gaya bahasa (tone) yang COCOK dengan tema yang kamu pilih! (Misal: Jika memilih tema "brutalism", gunakan gaya bahasa mesin kaku seperti "INDEX_OF_WORK", "END OF TRANSMISSION". Jika tema "cinematic", gunakan gaya film elegan).
3. Aturan mediaUrl untuk dummyProjects:
- Jika projectType "image": https://picsum.photos/seed/[keyword]/800/600
- Jika projectType "video": https://www.w3schools.com/html/mov_bbb.mp4
- Jika projectType "3d": https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb
Wajib isi semua dummy (masing-masing 3 item proyek, dan 2 item untuk yang lain). Gunakan Bahasa Indonesia untuk sebagian besar teks, kecuali untuk tema yang cocok menggunakan Bahasa Inggris (seperti Brutalism/Cinematic).`,
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent(finalPrompt);
    const text = (await result.response).text();
    const resultJson = JSON.parse(text);

    // Update DB
    const updateProfileData: any = {};
    if (updateProfession && resultJson.profession) updateProfileData.profession = resultJson.profession;
    if (updateBio && resultJson.bio) updateProfileData.bio = resultJson.bio;

    if (Object.keys(updateProfileData).length > 0) {
      // Pastikan profile exists
      if (dbUser.profile) {
        await prisma.profile.update({
          where: { userId: dbUser.id },
          data: updateProfileData
        });
      }
    }

    if (updateTheme && resultJson) {
      const validThemes = ['spatial', 'obsidian-reel', 'aura-kinetic', 'editorial', 'minimalist', 'midnight-emulsion', 'viewfinder', 'split', 'monolith', 'absolute-noir', 'cinematic', 'acid', 'bentogrid', 'brutalism', 'layered-monolith', 'kinetic-avant-garde', 'nexus-noir'];
      let themeToSave = resultJson.theme?.toLowerCase() || 'minimalist';
      if (!validThemes.includes(themeToSave)) {
        themeToSave = 'minimalist'; // fallback
      }

      const updateAppearanceData: any = { themeTemplate: themeToSave };
      if (resultJson.themeColor) updateAppearanceData.themeColor = resultJson.themeColor;
      if (resultJson.fontFamily) {
        updateAppearanceData.fontHeading = resultJson.fontFamily;
        updateAppearanceData.fontBody = resultJson.fontFamily;
      }
      if (resultJson.cardStyle) updateAppearanceData.cardStyle = resultJson.cardStyle;
      if (resultJson.buttonShape) updateAppearanceData.buttonShape = resultJson.buttonShape;
      if (typeof resultJson.splashScreen === 'boolean') updateAppearanceData.splashScreen = resultJson.splashScreen;

      if (resultJson.customTexts && typeof resultJson.customTexts === 'object') {
        updateAppearanceData.customTexts = JSON.stringify(resultJson.customTexts);
      }

      if (dbUser.siteAppearance) {
        await prisma.siteAppearance.update({
          where: { userId: dbUser.id },
          data: updateAppearanceData
        });
      }
    }

    if (updateContent) {
      // 1. Injeksi Proyek
      if (resultJson.dummyProjects && Array.isArray(resultJson.dummyProjects)) {
        for (const proj of resultJson.dummyProjects) {
          await prisma.project.create({
            data: {
              title: proj.title || "Proyek Tanpa Judul",
              description: proj.description || "",
              mediaUrl: proj.mediaUrl || "https://picsum.photos/seed/random/800/600",
              tags: JSON.stringify(proj.tags || []),
              projectType: proj.projectType || "image",
              userId: dbUser.id
            }
          });
        }
      }

      // 2. Injeksi Testimoni
      if (resultJson.dummyTestimonials && Array.isArray(resultJson.dummyTestimonials)) {
        for (const t of resultJson.dummyTestimonials) {
          await prisma.testimonial.create({
            data: {
              clientName: t.clientName || "Klien Anonim",
              company: t.company || "",
              content: t.content || "Kerja yang luar biasa!",
              rating: t.rating || 5,
              avatarUrl: t.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.clientName || "A")}&background=random`,
              userId: dbUser.id
            }
          });
        }
      }

      // 3. Injeksi Links
      if (resultJson.dummyLinks && Array.isArray(resultJson.dummyLinks)) {
        for (const l of resultJson.dummyLinks) {
          await prisma.link.create({
            data: {
              platform: l.platform || "Website",
              url: l.url || "https://example.com",
              userId: dbUser.id
            }
          });
        }
      }

      // 4. Injeksi Sertifikat
      if (resultJson.dummyCertificates && Array.isArray(resultJson.dummyCertificates)) {
        for (const cert of resultJson.dummyCertificates) {
          await prisma.certificate.create({
            data: {
              title: cert.title || "Sertifikat Keahlian",
              issuer: cert.issuer || "Institusi Resmi",
              year: cert.year ? String(cert.year) : new Date().getFullYear().toString(),
              description: cert.description || "",
              status: "VERIFIED",
              userId: dbUser.id
            }
          });
        }
      }
    }

    // Sisipkan subdomain agar UI bisa membuat link "Lihat Web"
    resultJson.subdomain = dbUser.profile?.subdomain || "";

    // Bersihkan resultJson agar hanya mengembalikan data yang benar-benar diminta user (checkbox)
    if (!updateProfession) delete resultJson.profession;
    if (!updateBio) delete resultJson.bio;
    if (!updateTheme) {
      delete resultJson.theme;
      delete resultJson.themeColor;
      delete resultJson.fontFamily;
      delete resultJson.cardStyle;
      delete resultJson.buttonShape;
      delete resultJson.splashScreen;
      delete resultJson.customTexts;
    }
    if (!updateContent) {
      delete resultJson.dummyProjects;
      delete resultJson.dummyTestimonials;
      delete resultJson.dummyLinks;
      delete resultJson.dummyCertificates;
    }

    return NextResponse.json({
      success: true,
      data: resultJson
    });

  } catch (error: any) {
    console.error("Build with AI Error:", error);
    return NextResponse.json({ error: error.message || "Gagal membangun dengan AI" }, { status: 500 });
  }
}
