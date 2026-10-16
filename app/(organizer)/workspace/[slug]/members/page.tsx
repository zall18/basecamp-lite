"use client";

import React, { useState } from "react";
import { Users, UserPlus, Plus } from "lucide-react";
import { useEventStore } from "@/lib/store/use-event-store";
import { MemberCard } from "@/components/members/MemberCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { RoleType } from "@/types";

export default function MembersPage() {
  const { event, addMember } = useEventStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<RoleType>("VOLUNTEER");
  const [phone, setPhone] = useState("");
  const [customTag, setCustomTag] = useState("");

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addMember({
      name: name.trim(),
      role,
      phone: phone.trim() || undefined,
      customTag: customTag.trim() || undefined,
    });

    setName("");
    setPhone("");
    setCustomTag("");
    setRole("VOLUNTEER");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-400" />
            <span>Direktori Panitia & Matriks Peran</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar seluruh panitia aktif beserta tugas yang sedang diemban, barang pinjaman yang dibawa, dan akses chat WhatsApp 1-klik.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="gap-1.5 font-bold self-start sm:self-auto shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Panitia</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {event.members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>

      {/* Modal Add Member */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="➕ Tambah Anggota Panitia Baru"
        description="Daftarkan panitia baru ke direktori acara untuk memudahkan koordinasi dan penugasan."
      >
        <form onSubmit={handleAddMember} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nama Lengkap / Panggilan <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Dimas Wahyu"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Divisi / Peran
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as RoleType)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                <option value="LEAD">Ketua Pelaksana / BPH</option>
                <option value="STAGE_EVENT">Divisi Acara (Stage)</option>
                <option value="LOGISTICS">Divisi Logistik</option>
                <option value="CONSUMPTION">Divisi Konsumsi</option>
                <option value="MEDIA_DOCS">PDD & Dokumentasi</option>
                <option value="PUBLIC_RELATIONS">Humas & Medpar</option>
                <option value="VOLUNTEER">Volunteer Lapangan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Jabatan / Custom Tag
              </label>
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Cth: Stage Manager, Sound Eng"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nomor WhatsApp
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+6281234567890"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-violet-500"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Diperlukan untuk fitur tombol chat WhatsApp 1-klik di direktori panitia.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setIsAddModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              className="gap-1.5 font-bold"
            >
              <span>Simpan Panitia</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
