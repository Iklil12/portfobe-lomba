import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useSWR, { mutate } from 'swr';
import { showToast } from '@/lib/customToast';
import toast from 'react-hot-toast';

export function useProfile() {
  const { data: session, status, update } = useSession();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [initialSubdomain, setInitialSubdomain] = useState("");
  const [subdomainStatus, setSubdomainStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [githubUsername, setGithubUsername] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const isFormValid = firstName.trim() !== "" && profession.trim() !== "" && subdomainStatus !== 'taken';

  // ✅ Gunakan useSWR — dilindungi SWRConfig global (focusThrottleInterval, dedupingInterval)
  // null key saat belum authenticated = tidak fetch sama sekali
  const { data: profileData, isLoading: isSWRLoading } = useSWR(
    status === 'authenticated' ? '/api/profile' : null
  );

  const isLoadingData = status === 'loading' || (status === 'authenticated' && isSWRLoading);

  // Isi form state HANYA saat data dari SWR berubah (bukan tiap session update)
  useEffect(() => {
    if (!profileData) return;

    const names = (profileData.fullName || session?.user?.name || "").split(" ");
    setFirstName(names[0] || "");
    setLastName(names.slice(1).join(" ") || "");

    const dbSubdomain = profileData.profile?.subdomain || profileData.subdomain || "";
    const emailPrefix = (session?.user?.email || "").split('@')[0] || "user";
    setSubdomain(dbSubdomain || emailPrefix);
    setInitialSubdomain(dbSubdomain || emailPrefix);

    setProfession(profileData.profession || profileData.profile?.profession || "");
    setBio(profileData.bio || profileData.profile?.bio || "");

    const avatar = profileData.avatarUrl || profileData.avatar || profileData.profile?.avatarUrl;
    setAvatarUrl(avatar || (session?.user as any)?.avatar || session?.user?.image || "");

    const githubIntegration = profileData.integrations?.find((i: any) => i.provider === 'GITHUB');
    setGithubUsername(githubIntegration ? githubIntegration.providerId : null);
  }, [profileData]); // ← HANYA bereaksi ke data, bukan session object

  useEffect(() => {
    if (!subdomain || subdomain === initialSubdomain) {
      setSubdomainStatus('idle');
      return;
    }

    const timeoutId = setTimeout(async () => {
      setSubdomainStatus('checking');
      try {
        const res = await fetch(`/api/profile/check-subdomain?subdomain=${subdomain}`);
        const data = await res.json();
        if (data.available) {
          setSubdomainStatus('available');
        } else {
          setSubdomainStatus('taken');
        }
      } catch (error) {
        setSubdomainStatus('idle');
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [subdomain, initialSubdomain]);

  const handleRemoveAvatar = () => {
    setAvatarUrl("");
    showToast({
      message: "Foto dihapus. Klik Simpan untuk memperbarui database.",
      id: "remove-avatar-toast",
      icon: "fa-trash-alt"
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      showToast({
        message: "Formulir tidak valid. Periksa kembali isian Anda.",
        id: "invalid-form-toast",
        icon: "fa-exclamation-triangle"
      });
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading('Menyimpan profil...', {
      style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
    });

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          subdomain,
          profession,
          bio,
          avatar: avatarUrl
        }),
      });

      if (response.ok) {
        toast.success("Profil berhasil diperbarui!", {
          id: toastId,
          duration: 3000,
          style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' },
          iconTheme: { primary: '#22c55e', secondary: '#0a0a0a' }
        });
        setInitialSubdomain(subdomain);

        mutate('/api/dashboard/sync');

        await update({
          ...session,
          user: {
            ...session?.user,
            image: avatarUrl,
            avatar: avatarUrl,
            name: `${firstName} ${lastName}`.trim(),
            subdomain: subdomain,
            profession: profession,
            bio: bio
          }
        });

      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Gagal menyimpan perubahan.", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Kesalahan jaringan. Coba lagi.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    state: {
      session,
      status,
      firstName,
      lastName,
      subdomain,
      subdomainStatus,
      profession,
      bio,
      avatarUrl,
      githubUsername,
      isSaving,
      isLoadingData,
      isFormValid,
    },
    actions: {
      setFirstName,
      setLastName,
      setSubdomain,
      setProfession,
      setBio,
      setAvatarUrl,
      handleRemoveAvatar,
      handleSave,
    }
  };
}
