import { RoleType } from "@/types";

export interface RolePermission {
  canManageRundown: boolean;
  canShiftOvertime: boolean;
  canManageLogistics: boolean;
  canManageAllTasks: boolean;
  canTriggerSos: boolean;
  canResolveSos: boolean;
  canExportDebrief: boolean;
  roleTitle: string;
  roleBadgeText: string;
  description: string;
}

export const ROLE_PERMISSIONS: Record<RoleType, RolePermission> = {
  LEAD: {
    canManageRundown: true,
    canShiftOvertime: true,
    canManageLogistics: true,
    canManageAllTasks: true,
    canTriggerSos: true,
    canResolveSos: true,
    canExportDebrief: true,
    roleTitle: "Ketua Pelaksana / BPH",
    roleBadgeText: "👑 Akses Penuh (Leader)",
    description: "Memiliki kontrol administratif penuh terhadap seluruh modul, pergeseran waktu, dan persetujuan LPJ.",
  },
  STAGE_EVENT: {
    canManageRundown: true,
    canShiftOvertime: true,
    canManageLogistics: false,
    canManageAllTasks: false,
    canTriggerSos: true,
    canResolveSos: true,
    canExportDebrief: false,
    roleTitle: "Divisi Acara (Stage Manager)",
    roleBadgeText: "🎤 Kendali Panggung & Waktu",
    description: "Memegang wewenang Dynamic Overtime Recalculator (+5m, +10m), catatan Cue Sticky, dan status sesi aktif.",
  },
  LOGISTICS: {
    canManageRundown: false,
    canShiftOvertime: false,
    canManageLogistics: true,
    canManageAllTasks: false,
    canTriggerSos: true,
    canResolveSos: true,
    canExportDebrief: false,
    roleTitle: "Logistik & Perlengkapan",
    roleBadgeText: "📦 Kendali Alat & Barang",
    description: "Mengawasi barang pinjaman kampus, verifikasi foto serah terima, dan kontak vendor perlengkapan.",
  },
  CONSUMPTION: {
    canManageRundown: false,
    canShiftOvertime: false,
    canManageLogistics: true,
    canManageAllTasks: false,
    canTriggerSos: true,
    canResolveSos: false,
    canExportDebrief: false,
    roleTitle: "Divisi Konsumsi",
    roleBadgeText: "🍱 Kendali Katering & Makanan",
    description: "Mengubah status pesanan katering hingga 'Sudah Dibagikan' dan menghubungkan langsung ke driver katering.",
  },
  MEDIA_DOCS: {
    canManageRundown: false,
    canShiftOvertime: false,
    canManageLogistics: false,
    canManageAllTasks: false,
    canTriggerSos: true,
    canResolveSos: false,
    canExportDebrief: false,
    roleTitle: "PDD & Dokumentasi",
    roleBadgeText: "📷 Kru Lapangan (Read-only Stage)",
    description: "Memantau waktu sesi dan cue dokumentasi, memperbarui tugas foto, serta mengirim sinyal darurat lapangan jika ada kendala.",
  },
  PUBLIC_RELATIONS: {
    canManageRundown: false,
    canShiftOvertime: false,
    canManageLogistics: false,
    canManageAllTasks: false,
    canTriggerSos: true,
    canResolveSos: false,
    canExportDebrief: false,
    roleTitle: "Humas & Medpar",
    roleBadgeText: "🤝 Kru Lapangan (Read-only Stage)",
    description: "Memantau kehadiran pembicara/VIP, membagikan link publik ke audiens, dan mengirim Ping Nudge ke panitia lain.",
  },
  VOLUNTEER: {
    canManageRundown: false,
    canShiftOvertime: false,
    canManageLogistics: false,
    canManageAllTasks: false,
    canTriggerSos: true,
    canResolveSos: false,
    canExportDebrief: false,
    roleTitle: "Volunteer / Panitia Lapangan",
    roleBadgeText: "👤 Kru Lapangan Terbatas",
    description: "Hanya dapat memperbarui tugas yang ditugaskan ke dirinya sendiri. Perubahan jadwal rundown dan logistik diproteksi.",
  },
};

export function getRolePermissions(role: string): RolePermission {
  return ROLE_PERMISSIONS[role as RoleType] || ROLE_PERMISSIONS.VOLUNTEER;
}
