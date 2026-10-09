"use client";

import React from "react";
import Link from "next/link";
import {
  Clock,
  Package,
  CheckSquare,
  Users,
  FolderOpen,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { NowPlayingBar } from "@/components/rundown/NowPlayingBar";
import { WifiCredentialCard } from "@/components/assets/WifiCredentialCard";
import { useEventStore } from "@/lib/store/use-event-store";
import { TaskCard } from "@/components/tasks/TaskCard";
import { MemberCard } from "@/components/members/MemberCard";

export default function WorkspaceOverviewPage() {
  const { event } = useEventStore();
  const slug = event.slug;

  const pendingTasks = event.tasks.filter((t) => t.status !== "DONE").slice(0, 3);
  const keyMembers = event.members.slice(0, 3);

  return (
    <div className="space-y-6">
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
              <span className="text-[10px] text-slate-400">{event.logistics.length} Barang</span>
            </Link>

            <Link
              href={`/workspace/${slug}/assets`}
              className="glass-card p-3.5 rounded-xl border border-white/5 hover:border-cyan-500/40 text-center group cursor-pointer"
            >
              <FolderOpen className="w-5 h-5 text-cyan-400 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white block">Pinned Links</span>
              <span className="text-[10px] text-slate-400">{event.assets.length} Tautan</span>
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
    </div>
  );
}
