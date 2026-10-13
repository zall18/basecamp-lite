export const ROLE_LABELS: Record<string, { label: string; color: string; badgeClass: string }> = {
  LEAD: {
    label: "BPH (Ketua / Koordinator)",
    color: "#8B5CF6",
    badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  STAGE_EVENT: {
    label: "Divisi Acara",
    color: "#06B6D4",
    badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  },
  LOGISTICS: {
    label: "Logistik & Perlengkapan",
    color: "#F59E0B",
    badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  CONSUMPTION: {
    label: "Konsumsi",
    color: "#EC4899",
    badgeClass: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  },
  MEDIA_DOCS: {
    label: "PDD & Dokumentasi",
    color: "#3B82F6",
    badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  PUBLIC_RELATIONS: {
    label: "Humas & Medpar",
    color: "#10B981",
    badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  VOLUNTEER: {
    label: "Volunteer / Panitia",
    color: "#94A3B8",
    badgeClass: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  },
};

export const TASK_STATUS_LABELS: Record<string, { label: string; badgeClass: string }> = {
  TODO: {
    label: "Belum Dimulai",
    badgeClass: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  },
  IN_PROGRESS: {
    label: "Sedang Dikerjakan",
    badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  },
  BLOCKED: {
    label: "Ada Kendala",
    badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  },
  DONE: {
    label: "Selesai",
    badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
};

export const ITEM_STATUS_LABELS: Record<string, { label: string; badgeClass: string; step: number }> = {
  NOT_PICKED_UP: {
    label: "Belum Diambil",
    badgeClass: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    step: 1,
  },
  ON_THE_WAY: {
    label: "Sedang Menuju Lokasi",
    badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30 animate-pulse",
    step: 2,
  },
  DELIVERED: {
    label: "Tiba di Tempat",
    badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    step: 3,
  },
  RETURNED: {
    label: "Sudah Dikembalikan",
    badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    step: 4,
  },
};

/**
 * Mendapatkan konfigurasi label status yang kontekstual antara barang fisik dan konsumsi/makanan
 */
export function getItemStatusConfig(status: string, category: string = "") {
  const isFood = category.toLowerCase().includes("konsumsi");

  switch (status) {
    case "NOT_PICKED_UP":
      return {
        label: isFood ? "Belum Diambil dari Vendor" : "Belum Diambil",
        shortLabel: isFood ? "1. Belum Diambil" : "1. Belum",
        badgeClass: "bg-slate-500/20 text-slate-300 border-slate-500/30",
        step: 1,
      };
    case "ON_THE_WAY":
      return {
        label: isFood ? "Driver Menuju Lokasi Acara" : "Sedang Menuju Lokasi",
        shortLabel: isFood ? "2. Menuju Lokasi" : "2. Menuju Lokasi",
        badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30 animate-pulse",
        step: 2,
      };
    case "DELIVERED":
      return {
        label: isFood ? "Tiba di Tempat (Siap Dibagikan)" : "Tiba di Tempat (Sedang Digunakan)",
        shortLabel: isFood ? "3. Siap Bagikan" : "3. Tiba di Tempat",
        badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        step: 3,
      };
    case "RETURNED":
      return {
        label: isFood ? "Sudah Dibagikan ke Peserta" : "Sudah Dikembalikan",
        shortLabel: isFood ? "4. Sudah Dibagikan" : "4. Sudah Dikembalikan",
        badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        step: 4,
      };
    default:
      return {
        label: "Belum Diambil",
        shortLabel: "Belum",
        badgeClass: "bg-slate-500/20 text-slate-300 border-slate-500/30",
        step: 1,
      };
  }
}

/**
 * Format durasi detik menjadi teks ramah pengguna (misal: '12 menit 30 detik', '45 detik', '1 jam 15 menit')
 */
export function formatDurationHuman(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0 detik";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours} jam${minutes > 0 ? ` ${minutes} menit` : ""}`;
  }
  if (minutes > 0) {
    return `${minutes} menit${seconds > 0 ? ` ${seconds} detik` : ""}`;
  }
  return `${seconds} detik`;
}

export const NUDGE_PRESETS = [
  {
    id: "coffee",
    label: "☕ Kopi Dulu Bos",
    desc: "Pengingat santai & bersahabat",
    message: "Santai tapi aman kan? Jangan lupa gas tugasnya ya!",
  },
  {
    id: "update",
    label: "👀 Any Update?",
    desc: "Tanya progres tanpa kesan bossy",
    message: "Halo! Boleh minta kabar progres tugas ini sebentar?",
  },
  {
    id: "fire",
    label: "🔥 Api Asap",
    desc: "Mendesak untuk persiapan sesi dekat",
    message: "Urgensi tinggi! Tugas ini ditunggu untuk persiapan sesi berikutnya.",
  },
  {
    id: "ready",
    label: "🚀 Siap Meluncur?",
    desc: "Cek kesiapan jelang hari-H",
    message: "Semangat! Tinggal selangkah lagi menuju acara kita.",
  },
];

export const NUDGE_COOLDOWN_MINUTES = 10;
