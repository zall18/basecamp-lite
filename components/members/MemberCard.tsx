"use client";

import React from "react";
import { MessageCircle, CheckSquare, Package, Phone } from "lucide-react";
import { EventMember } from "@/types";
import { ROLE_LABELS } from "@/lib/constants";
import { useEventStore } from "@/lib/store/use-event-store";

interface MemberCardProps {
  member: EventMember;
}

export function MemberCard({ member }: MemberCardProps) {
  const { event } = useEventStore();
  const roleConfig = ROLE_LABELS[member.role] || ROLE_LABELS.VOLUNTEER;

  const activeTasks = event.tasks.filter((t) => t.assigneeId === member.id && t.status !== "DONE");
  const assignedGear = event.logistics.filter((l) => l.picId === member.id && l.status !== "RETURNED");

  const cleanPhone = member.phone ? member.phone.replace(/[^0-9]/g, "") : null;

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/5 hover:border-violet-500/30 transition-all flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-violet-600/40 to-cyan-500/30 border border-violet-400/30 flex items-center justify-center font-bold text-white text-base shadow-md">
              {member.name[0]}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{member.name}</h3>
              {member.customTag && (
                <span className="text-[11px] text-slate-400 font-medium block">
                  {member.customTag}
                </span>
              )}
            </div>
          </div>

          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${roleConfig.badgeClass}`}
          >
            {roleConfig.label}
          </span>
        </div>

        {/* Assigned duties */}
        <div className="space-y-2 mt-4 pt-3 border-t border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
              Tugas Aktif:
            </span>
            <span className="font-bold text-white">
              {activeTasks.length} tugas
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              Barang Dipegang:
            </span>
            <span className="font-bold text-white">
              {assignedGear.length} barang
            </span>
          </div>
        </div>
      </div>

      {/* WhatsApp Action Button */}
      {cleanPhone ? (
        <a
          href={`https://wa.me/${cleanPhone}?text=Halo%20${encodeURIComponent(member.name)}%2C%20ada%20update%20acara%20Basecamp%20Lite`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>Chat WhatsApp ({member.phone})</span>
        </a>
      ) : (
        <div className="text-center py-2 text-xs text-slate-500">
          Nomor WhatsApp belum terdaftar
        </div>
      )}
    </div>
  );
}
