// hooks/useTrash.ts
import { useState, useEffect, useCallback } from "react";
import { showToast } from "@/lib/customToast";

const PAGE_SIZE = 10;

export function useTrash() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [confirmPurgeAll, setConfirmPurgeAll] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fetch halaman pertama (reset state)
  const fetchTrash = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/trash?page=1&limit=${PAGE_SIZE}`);
      if (!res.ok) throw new Error("Gagal fetch trash");
      const data = await res.json();
      setItems(data.items || []);
      setTotalCount(data.total ?? 0);
      setCurrentPage(1);
      setHasMore(data.hasMore ?? false);
    } catch {
      showToast({ message: "Gagal memuat data trash", id: "trash-err", icon: "fa-exclamation-triangle" });
    } finally {
      setTimeout(() => setIsLoading(false), 400);
    }
  }, []);

  // Load more — append ke items yang ada
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    const nextPage = currentPage + 1;
    try {
      setIsLoadingMore(true);
      const res = await fetch(`/api/trash?page=${nextPage}&limit=${PAGE_SIZE}`);
      if (!res.ok) throw new Error("Gagal fetch halaman berikutnya");
      const data = await res.json();
      setItems((prev) => [...prev, ...(data.items || [])]);
      setTotalCount(data.total ?? 0);
      setCurrentPage(nextPage);
      setHasMore(data.hasMore ?? false);
    } catch {
      showToast({ message: "Gagal memuat lebih banyak", id: "trash-more-err", icon: "fa-exclamation-triangle" });
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, hasMore, isLoadingMore]);

  useEffect(() => { fetchTrash(); }, [fetchTrash]);

  const restore = async (id: string, type: string) => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/trash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore", id, type }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast({ message: data.message || "Berhasil dipulihkan", id: "restore-ok", icon: "fa-undo" });
        await fetchTrash();
      } else {
        showToast({ message: data.error || "Gagal memulihkan", id: "restore-err", icon: "fa-exclamation-circle" });
      }
    } catch {
      showToast({ message: "Gagal terhubung ke server", id: "restore-net", icon: "fa-wifi" });
    } finally {
      setProcessingId(null);
    }
  };

  const purge = async (id: string, type: string) => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/trash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "purge", id, type }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast({ message: "Dihapus permanen", id: "purge-ok", icon: "fa-trash-alt" });
        await fetchTrash();
      } else {
        showToast({ message: data.error || "Gagal menghapus", id: "purge-err", icon: "fa-exclamation-circle" });
      }
    } catch {
      showToast({ message: "Gagal terhubung ke server", id: "purge-net", icon: "fa-wifi" });
    } finally {
      setProcessingId(null);
    }
  };

  const purgeAll = async () => {
    setProcessingId("all");
    try {
      const res = await fetch("/api/trash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "purge_all" }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast({ message: data.message || "Trash dikosongkan", id: "purge-all-ok", icon: "fa-trash" });
        await fetchTrash();
      } else {
        showToast({ message: data.error || "Gagal mengosongkan", id: "purge-all-err", icon: "fa-exclamation-circle" });
      }
    } catch {
      showToast({ message: "Gagal terhubung ke server", id: "purge-all-net", icon: "fa-wifi" });
    } finally {
      setProcessingId(null);
      setConfirmPurgeAll(false);
    }
  };

  const getDaysLeft = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / 86400000));
  };

  return {
    state: { items, isLoading, isLoadingMore, totalCount, hasMore, currentPage, confirmPurgeAll, processingId },
    actions: { restore, purge, purgeAll, loadMore, setConfirmPurgeAll, getDaysLeft, refetch: fetchTrash },
  };
}
