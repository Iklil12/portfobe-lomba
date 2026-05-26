// constants/navigation.ts

export const APP_COMMANDS = [
  { id: "nav-ov", title: "Dashboard Overview", group: "Navigasi", icon: "fa-layer-group", link: "/dashboard", type: "link", keywords: "home beranda" },
  { id: "nav-pj", title: "Proyek & Karya", group: "Konten", icon: "fa-paint-roller", link: "/dashboard/projects", type: "link", keywords: "portfolio list" },
  { id: "nav-th", title: "Koleksi Tema", group: "Desain", icon: "fa-palette", link: "/dashboard/themes", type: "link", keywords: "tampilan warna" },
  { id: "set-pr", title: "Edit Profil & Bio", group: "Pengaturan", icon: "fa-user-edit", link: "/dashboard/profile", type: "link", keywords: "nama foto avatar" },
  { id: "set-ps", title: "Ganti Password", group: "Keamanan", icon: "fa-key", link: "/dashboard/settings?tab=security", type: "link", keywords: "sandi security" },
  { id: "act-cp", title: "Salin Link Portofolio", group: "Aksi Cepat", icon: "fa-copy", action: "copy_link", type: "action", keywords: "share bagikan url" },
];