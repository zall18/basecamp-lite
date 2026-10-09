"use client";

import React from "react";
import { Users, UserPlus } from "lucide-react";
import { useEventStore } from "@/lib/store/use-event-store";
import { MemberCard } from "@/components/members/MemberCard";

export default function MembersPage() {
  const { event } = useEventStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Users className="w-5 h-5 text-violet-400" />
          <span>Direktori Panitia & Matriks Peran</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Daftar seluruh panitia aktif beserta tugas yang sedang diemban, barang pinjaman yang dibawa, dan akses chat WhatsApp 1-klik.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {event.members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
