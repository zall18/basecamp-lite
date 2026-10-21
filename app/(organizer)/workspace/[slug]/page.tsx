"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  Package,
  CheckSquare,
  Users,
  FolderOpen,
  FileText,
  ArrowRight,
  Sparkles,
  Settings,
  Plus,
  RotateCcw,
  Calendar,
  MapPin,
  KeyRound,
} from "lucide-react";
import { NowPlayingBar } from "@/components/rundown/NowPlayingBar";
import { WifiCredentialCard } from "@/components/assets/WifiCredentialCard";
import { useEventStore } from "@/lib/store/use-event-store";
import { TaskCard } from "@/components/tasks/TaskCard";
import { MemberCard } from "@/components/members/MemberCard";
import { Button } from "@/components/ui/Button";
import { EditEventModal } from "@/components/event/EditEventModal";
import { CreateEventModal } from "@/components/event/CreateEventModal";
import { formatDate } from "@/lib/utils";

export default function WorkspaceOverviewPage() {
  const router = useRouter();
  const { event, resetToDemoEvent } = useEventStore();
  const slug = event.slug;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const pendingTasks = event.tasks.filter((t) => t.status !== "DONE").slice(0, 3);
  const keyMembers = event.members.slice(0, 3);

  const handleResetDemo = () => {
    if (confirm("Kembalikan ke data demo 'Tech Talk & Hackathon 2026'?")) {
      resetToDemoEvent();
      router.push("/workspace/tech-talk-hackathon-2026");
    }
  };

  return (
    <div className="space-y-6">
      {/* 0. Event Management Header Bar */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-violet-950/30">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30">
              BASECAMP KONTROL
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Calendar className="w-3 h-3 text-cyan-400" />
              {formatDate(event.date)}
            </span>
            {event.location && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                {event.location}
              </span>
            )}
          </div>
          <h1 className="text-lg sm:text-xl font-black text-white">
            {event.title}
          </h1>
          {event.description && (
            <p className="text-xs text-slate-300 mt-0.5 line-clamp-1 max-w-2xl">
              {event.description}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="text-xs font-semibold gap-1.5"
            title="Edit judul, tanggal, lokasi venue, Wi-Fi, dan PIN acara"
          >
            <Settings className="w-3.5 h-3.5 text-violet-400" />
            <span>Edit Info Acara</span>
          </Button>

          <Button
            variant="cyan"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="text-xs font-bold gap-1.5"
            title="Buat acara baru untuk kegiatan Anda sendiri"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Acara Baru</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetDemo}
            className="text-xs text-slate-400 hover:text-white p-2"
            title="Kembalikan ke data demo bawaan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* 1. Live Now Playing Stage Bar */}
      <NowPlayingBar />

      {/* 2. Wi-Fi & Quick Access Card */}
      <WifiCredentialCard />

      {/* 3. Section Grid: Quick Navigation & Bird-Eye View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority Tasks & Nudges */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Tugas Prioritas Hari-H
              </h3>
            </div>
            <Link
              href={`/workspace/${slug}/tasks`}
              className="text-xs text-violet-400 hover:text-violet-300 font-medium inline-flex items-center gap-1"
            >
              Lihat Semua ({event.tasks.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {pendingTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <Link
              href={`/workspace/${slug}/rundown`}
              className="glass-card p-3.5 rounded-xl border border-white/5 hover:border-violet-500/40 text-center group cursor-pointer"
            >
              <Clock className="w-5 h-5 text-violet-400 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white block">Jadwal Rundown</span>
              <span className="text-[10px] text-slate-400">{event.rundowns.length} Sesi</span>
            </Link>

            <Link
              href={`/workspace/${slug}/logistics`}
              className="glass-card p-3.5 rounded-xl border border-white/5 hover:border-pink-500/40 text-center group cursor-pointer"
            >
              <Package className="w-5 h-5 text-pink-400 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white block">Radar Logistik</span>
              <span className="text-[10px] text-slate-400">
                {event.logistics.length} Barang • {event.logistics.filter((l) => Boolean(l.photoProof)).length} Bukti
              </span>
            </Link>

            <Link
              href={`/workspace/${slug}/assets`}
              className="glass-card p-3.5 rounded-xl border border-white/5 hover:border-cyan-500/40 text-center group cursor-pointer"
            >
              <FolderOpen className="w-5 h-5 text-cyan-400 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white block">Assets & FAQ</span>
              <span className="text-[10px] text-slate-400">
                {(event.faqs || []).length} FAQ • {event.assets.length} Link
              </span>
            </Link>

            <Link
              href={`/workspace/${slug}/debrief`}
              className="glass-card p-3.5 rounded-xl border border-white/5 hover:border-emerald-500/40 text-center group cursor-pointer"
            >
              <FileText className="w-5 h-5 text-emerald-400 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white block">LPJ & Debrief</span>
              <span className="text-[10px] text-slate-400">Export Siap</span>
            </Link>
          </div>
        </div>

        {/* Right 1 Col: Key Panitia & Quick WhatsApp */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Kontak Cepat Panitia
              </h3>
            </div>
            <Link
              href={`/workspace/${slug}/members`}
              className="text-xs text-violet-400 hover:text-violet-300 font-medium inline-flex items-center gap-1"
            >
              Semua ({event.members.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {keyMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </div>

      {/* Edit & Create Event Modals */}
      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
