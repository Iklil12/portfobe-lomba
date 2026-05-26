import { useState, useEffect } from 'react';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import { showToast } from '@/lib/customToast';

export type ProjectType = 'video' | 'photo' | 'certificate' | '3d' | null;

export function useProjects() {
  // Baca plan dari cache SWR yang sudah ada — TANPA network request baru
  const { data: syncData } = useSWR('/api/dashboard/sync');
  const cachedPlan = (syncData?.layout?.plan || 'FREE') as 'FREE' | 'PRO';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectType, setProjectType] = useState<ProjectType>(null);
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'photo' | 'certificate' | '3d' | string>('all');
  
  const [projectCount, setProjectCount] = useState(0);
  const [certCount, setCertCount] = useState(0);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState(""); 
  
  const [certIssuer, setCertIssuer] = useState("");
  const [certYear, setCertYear] = useState("");
  const [certStatus, setCertStatus] = useState("");
  const [projectTags, setProjectTags] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, title: string, type: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const [projRes, certRes] = await Promise.all([
          fetch('/api/projects').catch(() => null),
          fetch('/api/certificates').catch(() => null),
        ]);

        const projJson = projRes?.ok ? await projRes.json() : { data: [], meta: { total: 0 } };
        const certJson = certRes?.ok ? await certRes.json() : { data: [], meta: { total: 0 } };

        setProjectCount(projJson.meta?.total || 0);
        setCertCount(certJson.meta?.total || 0);
        // Plan diambil dari SWR cache, tidak perlu setUserPlan di sini

        const projArray = Array.isArray(projJson.data) ? projJson.data : (Array.isArray(projJson) ? projJson : []);
        const certArray = Array.isArray(certJson.data) ? certJson.data : (Array.isArray(certJson) ? certJson : []);

        const formattedProj = projArray.map((p: any) => ({ ...p, itemType: 'project' }));
        const formattedCert = certArray.map((c: any) => ({ ...c, itemType: 'certificate', projectType: 'certificate' }));

        const combined = [...formattedProj, ...formattedCert].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setItems(combined);
      } catch (error) {
        console.error("Gagal mengambil data", error);
      } finally {
        setTimeout(() => setIsLoading(false), 600);
      }
    };

  useEffect(() => {
    setMounted(true);
    fetchAllData(); 
  }, []);

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingId(item.id);
      setProjectType(item.projectType as ProjectType);
      setProjectTitle(item.title);
      setProjectDescription(item.description || "");
      setMediaUrl(item.mediaUrl || "");
      
      if (item.itemType === 'certificate') {
        setCertIssuer(item.issuer || "");
        setCertYear(item.year || "");
        setCertStatus(item.status || "");
        setProjectTags([]);
      } else {
        setCertIssuer("");
        setCertYear("");
        setCertStatus("");
        // Parse tags dari JSON string
        try {
          setProjectTags(Array.isArray(item.tags) ? item.tags : JSON.parse(item.tags || "[]"));
        } catch {
          setProjectTags([]);
        }
      }
    } else {
      setEditingId(null);
      setProjectType(null);
      setProjectTitle("");
      setProjectDescription("");
      setMediaUrl("");
      setCertIssuer("");
      setCertYear("");
      setCertStatus("");
      setProjectTags([]);
    }
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setEditingId(null);
      setProjectType(null);
    }, 300); 
    document.body.style.overflow = 'unset'; 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle) {
      showToast({ message: 'Judul wajib diisi!', id: 'err-title', icon: 'fa-exclamation-circle' });
      return;
    }
    if (!mediaUrl) {
      showToast({ message: 'Aset visual wajib dilampirkan!', id: 'err-media', icon: 'fa-image' });
      return;
    }
    if (projectType === 'certificate' && (!certIssuer || !certYear || !certStatus)) {
      showToast({ message: 'Lembaga, Tahun, dan Pencapaian/Status wajib diisi untuk sertifikat!', id: 'err-cert', icon: 'fa-exclamation-triangle' });
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(editingId ? 'Menyimpan perubahan...' : 'Mempublikasikan data...');
    const endpoint = projectType === 'certificate' ? '/api/certificates' : '/api/projects';
    const method = editingId ? 'PATCH' : 'POST';

    const payload = projectType === 'certificate' 
      ? { id: editingId, title: projectTitle, description: projectDescription, mediaUrl, issuer: certIssuer, year: certYear, status: certStatus }
      : { id: editingId, title: projectTitle, description: projectDescription, mediaUrl, projectType, tags: projectTags };
    
    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingId ? 'Data diperbarui!' : 'Data berhasil dipublikasikan!', { id: toastId });
        handleCloseModal();
        fetchAllData(); 
        setActiveTab(projectType || 'all'); 
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Terjadi kesalahan sistem.', { id: toastId });
      }
    } catch (error) {
      toast.error("Gagal terhubung ke server.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (id: string, title: string, type: string) => {
    setItemToDelete({ id, title, type });
    document.body.style.overflow = 'hidden'; 
  };

  const cancelDelete = () => {
    setItemToDelete(null);
    document.body.style.overflow = 'unset';
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const endpoint = itemToDelete.type === 'certificate' 
      ? `/api/certificates?id=${itemToDelete.id}` 
      : `/api/projects?id=${itemToDelete.id}`;
    
    try {
      const response = await fetch(endpoint, { method: 'DELETE' });
      if (response.ok) {
        showToast({ message: 'Data berhasil dihapus.', id: 'del-success', icon: 'fa-trash-alt' });
        fetchAllData(); 
      } else {
        const errorData = await response.json();
        showToast({ message: errorData.error || 'Gagal menghapus data.', id: 'del-err', icon: 'fa-exclamation-triangle' });
      }
    } catch (error) {
      showToast({ message: 'Gagal terhubung ke server.', id: 'del-net-err', icon: 'fa-wifi' });
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
      document.body.style.overflow = 'unset';
    }
  };

  const filteredItems = items.filter(p => {
    if (activeTab === 'all') return true;
    // Filter by tag
    if (activeTab.startsWith('tag:')) {
      const tag = activeTab.slice(4);
      try {
        const tags = Array.isArray(p.tags) ? p.tags : JSON.parse(p.tags || '[]');
        return tags.includes(tag);
      } catch { return false; }
    }
    // Filter by projectType
    return p.projectType === activeTab;
  });

  return {
    state: {
      mounted,
      isModalOpen,
      projectType,
      items,
      isLoading,
      activeTab,
      editingId,
      projectTitle,
      projectDescription,
      mediaUrl,
      certIssuer,
      certYear,
      certStatus,
      projectTags,
      isSubmitting,
      itemToDelete,
      isDeleting,
      filteredItems,
      userPlan: cachedPlan,
      projectCount,
      certCount
    },
    actions: {
      setProjectType,
      setActiveTab,
      setProjectTitle,
      setProjectDescription,
      setMediaUrl,
      setCertIssuer,
      setCertYear,
      setCertStatus,
      setProjectTags,
      handleOpenModal,
      handleCloseModal,
      handleSubmit,
      confirmDelete,
      cancelDelete,
      executeDelete
    }
  };
}
