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
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [showProModal, setShowProModal] = useState(false);

  // --- STATE UNTUK DATA PROFIL ---
  const [fullName, setFullName] = useState("Nama Anda");
  const fullNameRef = useRef(fullName);
  useEffect(() => { fullNameRef.current = fullName; }, [fullName]);
  
  const [profession, setProfession] = useState("Profesi / Bio Singkat");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("Indonesia");
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
  const [customTexts, setCustomTexts] = useState<Record<string, string>>({});
  const customTextsRef = useRef(customTexts);
  useEffect(() => { customTextsRef.current = customTexts; }, [customTexts]);
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
              if (appData.profile.location) setLocation(appData.profile.location);
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
              
              if (sa.customTexts) {
                const parsedTexts = safeParseJson(sa.customTexts, {});
                setCustomTexts(parsedTexts || {});
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

  // Listener untuk pesan dari iframe preview (Inline Editing)
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'INLINE_EDIT' && event.data?.entity === 'profile') {
        const { field, value } = event.data;
        
        let finalField = field;
        let finalValue = value;

        // Gabungkan firstName dan lastName menjadi fullName
        if (field === 'firstName') {
          finalField = 'fullName';
          const lastName = fullNameRef.current.split(' ').slice(1).join(' ');
          finalValue = `${value} ${lastName}`.trim();
          setFullName(finalValue);
        } else if (field === 'lastName') {
          finalField = 'fullName';
          const firstName = fullNameRef.current.split(' ')[0];
          finalValue = `${firstName} ${value}`.trim();
          setFullName(finalValue);
        } else {
          // 1. Update State Lokal agar UI berubah seketika
          if (field === 'fullName') setFullName(value);
          if (field === 'bio') setBio(value);
          if (field === 'profession') setProfession(value);
          if (field === 'location') setLocation(value);
        }
      } else if (event.data?.type === 'INLINE_EDIT' && event.data?.entity === 'appearance') {
        const { field, value } = event.data;
        setCustomTexts({ ...customTextsRef.current, [field]: value });
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const updateCustomText = (field: string, value: string) => {
    setCustomTexts((prev: any) => ({ ...prev, [field]: value }));
  };

  const saveDesign = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Menyimpan desain...', {
      style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
    });

    try {
      const payload = { 
        themeTemplate: activeTheme, 
        themeColor, 
        fontHeading, 
        fontBody, 
        buttonShape, 
        cardStyle, 
        splashScreen,
        customTexts // TAMBAHAN: Kirim customTexts ke server
      };
      
      // 1. Minimum 2 second delay promise
      const delayPromise = new Promise(resolve => setTimeout(resolve, 2000));
      
      // 2. API Fetch promises (Appearance & Profile in parallel)
      const appearancePromise = fetch('/api/appearance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const profilePromise = fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, profession, bio, location })
      });

      // Tunggu semuanya selesai (delay dipaksa minimal 2 detik meskipun fetch instan)
      const [resApp, resProf] = await Promise.all([appearancePromise, profilePromise, delayPromise]);

      if (resApp.ok && resProf.ok) {
        mutate('/api/dashboard/sync');
        toast.dismiss(toastId);

        if (!isLive) {
          setShowOfflineModal(true);
        } else {
          showToast({ message: 'Desain berhasil dipublikasikan!', id: toastId, icon: 'fa-check-circle' });
        }
      } else {
        // Cek jika error berasal dari api appearance (misal tema terkunci)
        if (!resApp.ok) {
          const errorData = await resApp.json().catch(() => ({}));
          // Jika backend menolak karena user FREE memilih tema PRO
          if (resApp.status === 403 && (errorData.code === 'THEME_LOCKED' || errorData.code === 'FEATURE_LOCKED')) {
            toast.dismiss(toastId);
            setShowProModal(true); 
            return;
          }
        }
        throw new Error('Gagal menyimpan');
      }
    } catch (error) {
      showToast({ message: 'Terjadi kesalahan server.', id: toastId, icon: 'fa-exclamation-triangle' });
    } finally {
      setIsSaving(false);
    }
  };

  const generateAiDesign = async () => {
    setIsAiLoading(true);
    const toastId = toast.loading('AI sedang menganalisis profil Anda...', {
      style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
    });

    try {
      const res = await fetch('/api/build-with-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptSource: 'existing_profile',
          updateTheme: true,
          lockedTheme: activeTheme,
          prompt: `Berikan saya rekomendasi kombinasi desain (warna, font, bentuk elemen) dan gaya penulisan teks yang PALING COCOK untuk tema ${activeTheme} berdasarkan profil saya.`
        })
      });

      if (!res.ok) throw new Error('Gagal mendapatkan rekomendasi AI');
      const jsonRes = await res.json();
      
      if (jsonRes.success && jsonRes.data) {
        const data = jsonRes.data;
        if (data.theme) setActiveTheme(data.theme);
        if (data.themeColor) setThemeColor(data.themeColor);
        if (data.fontFamily) {
          setFontHeading(data.fontFamily);
          setFontBody(data.fontFamily);
        }
        if (data.cardStyle) setCardStyle(data.cardStyle);
        if (data.buttonShape) setButtonShape(data.buttonShape);
        if (data.splashScreen !== undefined) setSplashScreen(data.splashScreen);
        if (data.customTexts) setCustomTexts(data.customTexts);

        showToast({ message: 'Rekomendasi desain berhasil diterapkan!', id: toastId, icon: 'fa-magic' });
        mutate('/api/dashboard/sync'); 
      }
    } catch (error) {
      console.error(error);
      showToast({ message: 'Terjadi kesalahan AI.', id: toastId, icon: 'fa-exclamation-triangle' });
    } finally {
      setIsAiLoading(false);
    }
  };



  // Persiapan data untuk Live Preview
  const livePreviewData = {
    ...dbData,
    profile: { fullName, profession, bio, avatarUrl, subdomain, location }
  };
  
  const livePreviewTheme = { 
    themeTemplate: activeTheme, 
    themeColor, 
    fontHeading, 
    fontBody, 
    buttonShape, 
    cardStyle, 
    splashScreen,
    customTexts
  };

  return {
    state: {
      isLoading,
      isSaving,
      isAiLoading,
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
      toggleFavorite,
      updateCustomText,
      generateAiDesign
    }
  };
}
