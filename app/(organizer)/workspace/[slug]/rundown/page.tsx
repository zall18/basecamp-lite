"use client";

import React, { useState } from "react";
import { Clock, Plus, Sparkles, Filter } from "lucide-react";
import { NowPlayingBar } from "@/components/rundown/NowPlayingBar";
import { RundownTimeline } from "@/components/rundown/RundownTimeline";
import { useEventStore } from "@/lib/store/use-event-store";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function RundownPage() {
  const { event, addRundownItem } = useEventStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [cueNotes, setCueNotes] = useState("");

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const lastItem = [...event.rundowns].sort((a, b) => a.order - b.order).pop();
    const startTime = lastItem ? new Date(lastItem.endTime) : new Date();
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    addRundownItem({
      order: (lastItem?.order || 0) + 1,
      title: title.trim(),
      speaker: speaker.trim() || undefined,
      startTime,
      endTime,
      cueNotes: cueNotes.trim() || undefined,
      isCurrent: false,
    });

    setTitle("");
    setSpeaker("");
    setCueNotes("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-violet-400" />
            <span>Live Run-down & Stage Mode</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Jadwal acara dinamis dengan sinkronisasi realtime dan kalkulator geser waktu (+5m, +10m).
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="gap-1.5 font-bold self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Sesi Acara</span>
        </Button>
      </div>

      {/* Now Playing Neon Bar */}
      <NowPlayingBar />

      {/* Timeline Rundown */}
      <RundownTimeline />

      {/* Modal Add Rundown */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="➕ Tambah Sesi Acara Baru"
        description="Masukkan informasi sesi baru yang akan disisipkan ke dalam rundown hari-H."
      >
        <form onSubmit={handleAddSession} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Judul Sesi
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Q&A Bersama Pemateri"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Pemateri / PIC
              </label>
              <input
                type="text"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                placeholder="Contoh: MC & Tim Acara"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Durasi (Menit)
              </label>
              <input
                type="number"
                min={5}
                max={240}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Stage Cue Sticky (Catatan Khusus Operator Panggung)
            </label>
            <textarea
              rows={2}
              value={cueNotes}
              onChange={(e) => setCueNotes(e.target.value)}
              placeholder="Contoh: Siapkan mic wireless nomor 2, putar background music instrumental lembut."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="md" type="submit">
              Simpan Sesi
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
