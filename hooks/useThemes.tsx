//src/hooks/useThemes.tsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { THEMES_DATA } from '@/lib/themes';
import { safeParseJson } from '@/lib/safeJson';

export function useThemes() {
  const router = useRouter();
  
  const [currentTheme, setCurrentTheme] = useState<string>('brutalism');
  const [subdomain, setSubdomain] = useState<string>(''); 
  const [userPlan, setUserPlan] = useState<string>('FREE');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'pro' | 'favorites'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const dataLoaded = React.useRef(false);

  // Sinkronisasi data saat mount
  useEffect(() => {
    const fetchCurrentTheme = async () => {
      try {
        const res = await fetch('/api/appearance?mode=lite');
        if (res.ok) {
          const data = await res.json();
          if (data) {
            if (data.siteAppearance?.themeTemplate) setCurrentTheme(data.siteAppearance.themeTemplate);
            if (data.profile?.subdomain) setSubdomain(data.profile.subdomain);
            if (data.plan) setUserPlan(data.plan.toUpperCase());
            
            // Ambil favorit dari tabel ThemeFavorite
            try {
              const favRes = await fetch('/api/themes/favorite');
              if (favRes.ok) {
                const favData = await favRes.json();
                setFavorites(Array.isArray(favData.favorites) ? favData.favorites : []);
              }
            } catch {
              setFavorites([]);
            }
          }
        }
      } catch (error) {
        console.error("Gagal memuat data saat ini:", error);
      } finally {
        setIsLoading(false);
        // Tandai bahwa data awal sudah masuk, sekarang perubahan boleh disimpan ke DB
        setTimeout(() => {
            dataLoaded.current = true;
        }, 100);
      }
    };
    
    fetchCurrentTheme();
  }, []);

  // Toggle favorit via API baru (ThemeFavorite table)
  const toggleFavorite = async (themeId: string) => {
    // Optimistic update
    const isFav = favorites.includes(themeId);
    const updatedFavorites = isFav
      ? favorites.filter((id) => id !== themeId)
      : [...favorites, themeId];
    setFavorites(updatedFavorites);
    toast(isFav ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit ❤️', { id: `fav-${themeId}` });

    try {
      await fetch('/api/themes/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId }),
      });
    } catch {
      // Rollback jika gagal
      setFavorites(favorites);
    }
  }; 

  const handleUseTheme = async (themeId: string, themeName: string) => {
    const theme = THEMES_DATA.find(t => t.id === themeId);
    if (!theme) return;

    if (!theme.isAvailable) {
      toast(`Tema ${themeName} akan segera hadir!`, {
        id: `theme-coming-soon-${themeId}`,
        icon: '🔒'
      });
      return;
    }

    // LOGIKA TEASER: Jika tema adalah PRO dan user adalah FREE, jangan simpan ke DB.
    // Langsung arahkan ke Editor dengan query param untuk PREVIEW.
    if (theme.isPro && userPlan === 'FREE') {
      toast.success(`Pratinjau tema ${themeName} aktif!`, {
        id: `theme-preview-${themeId}`,
        icon: '✨'
      });
      
      router.push(`/dashboard/appearance?previewTheme=${themeId}`);
      return;
    }

    // Jika tema FREE atau user sudah PRO, simpan ke database seperti biasa
    const toastId = toast.loading(`Menerapkan tema ${themeName}...`, {
      id: 'apply-theme-loading'
    });
    
    try {
      const res = await fetch('/api/appearance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeTemplate: themeId })
      });

      if (res.ok) {
        toast.success('Tema berhasil diterapkan!', { 
            id: toastId
        });
        
        setCurrentTheme(themeId);
        setTimeout(() => {
          router.push('/dashboard/appearance'); 
        }, 800);
      } else {
        throw new Error('Gagal');
      }

    } catch (error) {
      toast.error('Gagal menerapkan tema.', { id: toastId });
    }
  };

  const handleProComingSoon = () => {
    toast('Fitur Pro Creator Editor masih dalam tahap pengembangan.', {
      id: 'pro-editor-coming-soon',
      icon: '✨'
    });
  };



  const allThemes = THEMES_DATA;
  const themes = THEMES_DATA;

  return {
    state: {
      currentTheme,
      subdomain,
      userPlan,
      isLoading,
      activeFilter,
      favorites
    },
    actions: {
      handleUseTheme,
      handleProComingSoon,
      setActiveFilter,
      toggleFavorite
    },
    themes: allThemes
  };
}
