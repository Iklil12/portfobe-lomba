import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { mutate } from 'swr';
import { useSearchParams } from 'next/navigation';
import { showToast } from '@/lib/customToast';
import { safeParseJson } from '@/lib/safeJson';

export function useThemeEditor() {
  const searchParams = useSearchParams();
  const previewTheme = searchParams.get('previewTheme');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [showProModal, setShowProModal] = useState(false);

  // --- STATE UNTUK DATA PROFIL ---
  const [fullName, setFullName] = useState("Nama Anda");
  const [profession, setProfession] = useState("Profesi / Bio Singkat");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [isLive, setIsLive] = useState(true);
  const [dbData, setDbData] = useState<any>({});

  // --- STATE UNTUK TEMA & PENGATURAN ---
  const [activeTheme, setActiveTheme] = useState("brutalism");
  const [themeColor, setThemeColor] = useState("#000000");
  const [fontHeading, setFontHeading] = useState("Space Mono");
  const [fontBody, setFontBody] = useState("Inter");
  const [buttonShape, setButtonShape] = useState("hard");
  const [cardStyle, setCardStyle] = useState("hard-shadow");
  const [splashScreen, setSplashScreen] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const dataLoaded = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resApp = await fetch('/api/appearance', { cache: 'no-store' });
        let appData: any = {};

        if (resApp.ok) {
          appData = await resApp.json();

          if (appData) {
            if (appData.profile) {
              if (appData.profile.fullName) setFullName(appData.profile.fullName);
              if (appData.profile.profession) setProfession(appData.profile.profession);
              if (appData.profile.bio) setBio(appData.profile.bio);
              if (appData.profile.avatarUrl) setAvatarUrl(appData.profile.avatarUrl);
              if (appData.profile.subdomain) setSubdomain(appData.profile.subdomain);
            }

            if (appData.isLive !== undefined) setIsLive(appData.isLive);

            if (appData.siteAppearance) {
              const sa = appData.siteAppearance;
              
              // LOGIKA TEASER: Gunakan tema dari URL jika ada (Preview Mode)
              // Jika tidak ada, baru gunakan tema dari database
              if (previewTheme) {
                setActiveTheme(previewTheme);
              } else if (sa.themeTemplate) {
                setActiveTheme(sa.themeTemplate);
              }

              if (sa.themeColor) setThemeColor(sa.themeColor);
              if (sa.fontHeading) setFontHeading(sa.fontHeading);
              if (sa.fontBody) setFontBody(sa.fontBody);
              if (sa.buttonShape) setButtonShape(sa.buttonShape);
              if (sa.cardStyle) setCardStyle(sa.cardStyle);
              if (sa.splashScreen !== undefined && sa.splashScreen !== null) {
                setSplashScreen(sa.splashScreen);
              }

              if (sa.favoriteThemes !== undefined) {
                // Ambil dari ThemeFavorite table langsung
              }
            }
          }
        }

        setDbData(appData);

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

      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
          dataLoaded.current = true;
        }, 500);
      }
    };
    fetchData();
  }, [previewTheme]); // Re-run jika previewTheme berubah

  // Toggle favorit via API baru (ThemeFavorite table) + optimistic update
  const toggleFavorite = async (themeId: string) => {
    const isFav = favorites.includes(themeId);
    const updated = isFav ? favorites.filter(id => id !== themeId) : [...favorites, themeId];
    setFavorites(updated);
    toast(isFav ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit ❤️', {
      id: `fav-${themeId}`,
      style: { borderRadius: '10px', background: '#333', color: '#fff', fontSize: '12px' }
    });
    try {
      await fetch('/api/themes/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId }),
      });
    } catch {
      setFavorites(favorites); // rollback
    }
  };

  const saveDesign = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Menyimpan desain...', {
      style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
    });

    try {
      const res = await fetch('/api/appearance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeTemplate: activeTheme, themeColor, fontHeading, fontBody, buttonShape, cardStyle, splashScreen
        })
      });

      if (res.ok) {
        mutate('/api/dashboard/sync');
        toast.dismiss(toastId);

        if (!isLive) {
          setShowOfflineModal(true);
        } else {
          showToast({ message: 'Desain berhasil dipublikasikan!', id: toastId, icon: 'fa-check-circle' });
        }
      } else {
        const errorData = await res.json();
        // Jika backend menolak karena user FREE memilih tema PRO
        if (res.status === 403 && (errorData.code === 'THEME_LOCKED' || errorData.code === 'FEATURE_LOCKED')) {
          toast.dismiss(toastId);
          setShowProModal(true); 
        } else {
          throw new Error('Gagal menyimpan');
        }
      }
    } catch (error) {
      showToast({ message: 'Terjadi kesalahan server.', id: toastId, icon: 'fa-exclamation-triangle' });
    } finally {
      setIsSaving(false);
    }
  };



  // Persiapan data untuk Live Preview
  const livePreviewData = {
    ...dbData,
    profile: { fullName, profession, bio, avatarUrl, subdomain }
  };
  
  const livePreviewTheme = { 
    themeTemplate: activeTheme, 
    themeColor, 
    fontHeading, 
    fontBody, 
    buttonShape, 
    cardStyle, 
    splashScreen 
  };

  return {
    state: {
      isLoading,
      isSaving,
      isEditorCollapsed,
      showOfflineModal,
      isLive,
      subdomain,
      
      activeTheme,
      themeColor,
      fontHeading,
      fontBody,
      buttonShape,
      cardStyle,
      splashScreen,
      isThemeModalOpen,
      showProModal,

      livePreviewData,
      livePreviewTheme,
      favorites
    },
    actions: {
      setIsEditorCollapsed,
      setShowOfflineModal,
      setActiveTheme,
      setThemeColor,
      setFontHeading,
      setFontBody,
      setButtonShape,
      setCardStyle,
      setSplashScreen,
      setIsThemeModalOpen,
      setShowProModal,
      saveDesign,
      toggleFavorite
    }
  };
}
