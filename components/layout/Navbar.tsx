"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Radio,
  Calendar,
  AlertTriangle,
  ExternalLink,
  Shield,
  Layers,
  Clock,
  Package,
  CheckSquare,
  Users,
  FolderOpen,
  FileText,
  Bell,
  Coffee,
  Check,
  ChevronDown,
  Sparkles,
  Lock,
  Plus,
  RotateCcw,
} from "lucide-react";
import { useEventStore } from "@/lib/store/use-event-store";
import { formatDate } from "@/lib/utils";
import { getRolePermissions, ROLE_PERMISSIONS } from "@/lib/permissions";
import { RoleType } from "@/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SosModal } from "@/components/event/SosModal";
import { CreateEventModal } from "@/components/event/CreateEventModal";

const SIMULATED_PROFILES: { name: string; role: RoleType; title: string; desc: string }[] = [
  {
    name: "Rian (Lead)",
    role: "LEAD",
    title: "Ketua Pelaksana",
    desc: "Akses Penuh: Overtime rundown, modifikasi logistik, trigger & resolve SOS, export LPJ.",
  },
  {
    name: "Dimas",
    role: "STAGE_EVENT",
    title: "Divisi Acara & Stage Manager",
    desc: "Akses Khusus Panggung: Dynamic Overtime (+5m/+10m), Stage Cue Sticky, ganti sesi aktif.",
  },
  {
    name: "Alya",
    role: "LOGISTICS",
    title: "Divisi Logistik & Alat",
    desc: "Akses Barang: Ubah status serah terima, upload foto bukti pengembalian alat.",
  },
  {
    name: "Budi",
    role: "CONSUMPTION",
    title: "Divisi Konsumsi & Katering",
    desc: "Akses Katering: Ubah status distribusi makanan hingga 'Sudah Dibagikan'.",
  },
  {
    name: "Sarah (Volunteer)",
    role: "VOLUNTEER",
    title: "Volunteer / Kru Lapangan",
    desc: "Akses Terbatas: Read-only untuk jadwal & logistik, hanya kelola checklist tugas sendiri.",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const {
    event,
    userRole,
    userName,
    setUserIdentity,
    notifications,
    markAllNotificationsRead,
  } = useEventStore();
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const permissions = getRolePermissions(userRole);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const isPublicPage = pathname?.startsWith("/e/");
  const slug = event.slug;

  const navLinks = [
    { href: `/workspace/${slug}`, label: "Overview", icon: Layers },
    { href: `/workspace/${slug}/rundown`, label: "Run-down", icon: Clock },
    { href: `/workspace/${slug}/logistics`, label: "Logistik", icon: Package },
    { href: `/workspace/${slug}/tasks`, label: "Tugas & Nudge", icon: CheckSquare },
    { href: `/workspace/${slug}/assets`, label: "Asset & Wi-Fi", icon: FolderOpen },
    { href: `/workspace/${slug}/members`, label: "Panitia", icon: Users },
    { href: `/workspace/${slug}/debrief`, label: "LPJ Debrief", icon: FileText },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand & Event Title */}
            <div className="flex items-center gap-4">
              <Link href={`/workspace/${slug}`} className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
                  <Radio className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                      Basecamp<span className="text-violet-400">Lite</span>
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      LIVE
                    </span>
                  </div>
                  <h1 className="text-xs text-slate-400 font-medium truncate max-w-[180px] sm:max-w-[260px]">
                    {event.title}
                  </h1>
                </div>
              </Link>

              <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400 pl-3 border-l border-white/10">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{formatDate(event.date)}</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Notification Center Popover Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2 rounded-xl bg-slate-900 border border-white/10 hover:border-violet-500/50 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Pusat Notifikasi In-App"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-600 text-[10px] font-bold text-white flex items-center justify-center animate-pulse border border-slate-900">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown Panel */}
                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-2xl border border-white/15 p-4 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-violet-400" />
                        <h3 className="text-xs font-bold text-white">Notifikasi In-App</h3>
                        {unreadCount > 0 && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                            {unreadCount} Baru
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllNotificationsRead}
                          className="text-[11px] text-violet-400 hover:text-violet-300 font-medium cursor-pointer"
                        >
                          Tandai Dibaca
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-500">
                          Belum ada notifikasi masuk.
                        </div>
                      ) : (
                        notifications.map((notif) => {
                          const isSos = notif.type === "sos";
                          const isNudge = notif.type === "nudge";
                          return (
                            <div
                              key={notif.id}
                              className={`p-3 rounded-xl border text-xs transition-colors ${
                                notif.read
                                  ? "bg-slate-900/50 border-white/5 text-slate-400"
                                  : isSos
                                  ? "bg-rose-950/40 border-rose-500/40 text-slate-200"
                                  : "bg-violet-950/30 border-violet-500/30 text-slate-200"
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <div
                                  className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                                    isSos
                                      ? "bg-rose-500/20 text-rose-400"
                                      : isNudge
                                      ? "bg-amber-500/20 text-amber-400"
                                      : "bg-violet-500/20 text-violet-400"
                                  }`}
                                >
                                  {isSos ? (
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                  ) : isNudge ? (
                                    <Coffee className="w-3.5 h-3.5" />
                                  ) : (
                                    <Clock className="w-3.5 h-3.5" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-bold text-white truncate text-xs">
                                      {notif.title}
                                    </span>
                                    <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                                      {new Date(notif.timestamp).toLocaleTimeString("id-ID", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                                    {notif.message}
                                  </p>
                                  {notif.senderName && (
                                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                                      Dari: <span className="text-cyan-300">{notif.senderName}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* SOS Emergency Trigger Button */}
              <Button
                variant="danger"
                size="sm"
                onClick={() => setIsSosOpen(true)}
                className="font-bold flex items-center gap-1.5 bg-rose-600/90 hover:bg-rose-600 border border-rose-400/50 shadow-rose-900/40"
              >
                <AlertTriangle className="w-4 h-4 text-amber-200" />
                <span className="hidden sm:inline">SOS Beacon</span>
              </Button>

              {/* Mode Switcher */}
              {isPublicPage ? (
                <Link href={`/workspace/${slug}`}>
                  <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
                    <Shield className="w-3.5 h-3.5 text-violet-400" />
                    <span>Ruang Panitia</span>
                  </Button>
                </Link>
              ) : (
                <Link href={`/e/${slug}`} target="_blank">
                  <Button variant="secondary" size="sm" className="hidden lg:inline-flex">
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Halaman Publik</span>
                  </Button>
                </Link>
              )}

              {/* Buat Acara Baru Button */}
              <Button
                variant="cyan"
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
                className="hidden md:inline-flex text-xs font-bold gap-1 shadow-cyan-500/20"
                title="Buat acara baru untuk kegiatan Anda"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Acara Baru</span>
              </Button>

              {/* RBAC Role Switcher Chip */}
              <button
                type="button"
                onClick={() => setIsRoleModalOpen(true)}
                className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-white/10 text-xs hover:opacity-90 transition-opacity text-left cursor-pointer group"
                title="Klik untuk ganti peran panitia (Simulasi Hak Akses RBAC)"
              >
                <div className="w-7 h-7 rounded-lg bg-violet-600/30 border border-violet-400/30 text-violet-300 font-bold flex items-center justify-center shrink-0 group-hover:border-violet-400">
                  {userName[0]}
                </div>
                <div className="hidden sm:block leading-tight">
                  <div className="text-slate-200 font-semibold group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                    {userName}
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono">
                    {permissions.roleBadgeText.split(" ")[0]} {userRole}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Sub Navigation Bar for Organizer Workspace */}
          {!isPublicPage && (
            <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none border-t border-white/5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? "bg-violet-600/25 text-violet-300 border border-violet-500/40 shadow-sm shadow-violet-500/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-violet-400" : "text-slate-400"}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* SOS Trigger Modal */}
      <SosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />

      {/* RBAC Role Switcher Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Simulasi Hak Akses Panitia (RBAC Security)"
        description="Pilih akun panitia di bawah untuk menguji pembatasan hak akses modul (Rundown, Overtime, Logistik, dan LPJ)."
      >
        <div className="space-y-3 pt-2">
          <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs text-slate-300 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Keamanan Data Acara Terjaga:</span>
              <span>
                Anggota biasa atau volunteer tidak bisa sembarangan menggeser rundown, mengacak jadwal acara, atau mengubah inventaris logistik. Hanya Leader dan Koordinator Divisi terkait yang memegang wewenang edit.
              </span>
            </div>
          </div>

          <div className="space-y-2 mt-3">
            {SIMULATED_PROFILES.map((profile) => {
              const isSelected = userRole === profile.role;
              return (
                <div
                  key={profile.role}
                  onClick={() => {
                    setUserIdentity(profile.name, profile.role);
                    setIsRoleModalOpen(false);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left flex items-start justify-between gap-3 ${
                    isSelected
                      ? "bg-violet-600/20 border-violet-500 shadow-md shadow-violet-950/40"
                      : "bg-slate-900/60 border-white/10 hover:border-white/20 hover:bg-slate-900"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{profile.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-white/10">
                        {profile.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {profile.desc}
                    </p>
                  </div>

                  <div className="shrink-0 mt-1">
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsRoleModalOpen(false)}
            >
              Tutup
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
