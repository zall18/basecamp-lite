"use client";

import React, { useState } from "react";
import {
  Clock,
  MessageSquare,
  Play,
  CheckCircle2,
  Lock,
  Pencil,
  Trash2,
  Save,
} from "lucide-react";
import { useEventStore } from "@/lib/store/use-event-store";
import { formatTime } from "@/lib/utils";
import { getRolePermissions } from "@/lib/permissions";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { RundownItem } from "@/types";

export function RundownTimeline() {
  const {
    event,
    setActiveRundownItem,
    editRundownItem,
    deleteRundownItem,
    userRole,
  } = useEventStore();
  const permissions = getRolePermissions(userRole);
  const rundowns = [...event.rundowns].sort((a, b) => a.order - b.order);

  // Edit State
  const [editingItem, setEditingItem] = useState<RundownItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSpeaker, setEditSpeaker] = useState("");
  const [editCueNotes, setEditCueNotes] = useState("");

  const handleOpenEdit = (item: RundownItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditSpeaker(item.speaker || "");
    setEditCueNotes(item.cueNotes || "");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editTitle.trim()) return;

    editRundownItem(editingItem.id, {
      title: editTitle.trim(),
      speaker: editSpeaker.trim() || undefined,
      cueNotes: editCueNotes.trim() || undefined,
    });

    setEditingItem(null);
  };

  const handleDelete = (itemId: string, title: string) => {
    if (confirm(`Hapus sesi "${title}" dari jadwal rundown?`)) {
      deleteRundownItem(itemId);
    }
  };

  return (
    <div className="space-y-3.5">
      {rundowns.length === 0 && (
        <div className="p-8 rounded-2xl glass-card border border-dashed border-white/10 text-center space-y-2">
          <Clock className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">Belum Ada Sesi Rundown</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Klik tombol &ldquo;Tambah Sesi Acara&rdquo; di atas untuk mulai menyusun jadwal hari-H.
          </p>
        </div>
      )}

      {rundowns.map((item) => {
        const isCurrent = item.isCurrent;
        return (
          <div
            key={item.id}
            className={`glass-card rounded-2xl p-4 sm:p-5 transition-all relative overflow-hidden ${
              isCurrent
                ? "border-violet-500/50 bg-gradient-to-r from-violet-950/40 via-slate-900/80 to-slate-900/60 shadow-lg shadow-violet-900/20"
                : "border-white/5 hover:border-white/15"
            }`}
          >
            {isCurrent && (
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-violet-500 to-cyan-400" />
            )}

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {/* Order Index & Status indicator */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    isCurrent
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/30 ring-2 ring-violet-400/40"
                      : "bg-slate-800/80 text-slate-400 border border-white/5"
                  }`}
                >
                  #{item.order}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTime(item.startTime)} - {formatTime(item.endTime)}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-400/30 animate-pulse">
                        Sesi Berlangsung
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mt-1">
                    {item.title}
                  </h3>

                  {item.speaker && (
                    <p className="text-xs text-slate-300 font-medium mt-0.5">
                      PIC / Narasumber: <span className="text-cyan-300">{item.speaker}</span>
                    </p>
                  )}

                  {/* Stage Cue Sticky Note */}
                  {item.cueNotes && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 flex items-start gap-2.5">
                      <MessageSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-[11px] text-amber-300 uppercase tracking-wider">
                          Stage Cue Sticky (Operator & Sound):
                        </span>
                        <span>{item.cueNotes}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                {/* Edit & Delete Controls for Stage Managers / Leads */}
                {permissions.canManageRundown && (
                  <div className="flex items-center gap-1 mr-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition-colors"
                      title="Edit Sesi Ini"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Hapus Sesi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {!isCurrent ? (
                  permissions.canManageRundown ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setActiveRundownItem(item.id)}
                      className="text-xs gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Jadikan Sesi Aktif</span>
                    </Button>
                  ) : (
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-white/5">
                      <Lock className="w-3 h-3 text-slate-600" /> Wewenang Acara
                    </span>
                  )
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Live On Stage
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Edit Session Modal */}
      {editingItem && (
        <Modal
          isOpen={Boolean(editingItem)}
          onClose={() => setEditingItem(null)}
          title="✏️ Edit Sesi Rundown"
          description="Sesuaikan judul sesi, pemateri/PIC, dan instruksi stage cue operator."
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Judul Sesi
              </label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pemateri / PIC
              </label>
              <input
                type="text"
                value={editSpeaker}
                onChange={(e) => setEditSpeaker(e.target.value)}
                placeholder="Cth: MC, Keynote Speaker, Tim Acara"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Stage Cue Sticky (Catatan Operator Suara & Layar)
              </label>
              <textarea
                rows={3}
                value={editCueNotes}
                onChange={(e) => setEditCueNotes(e.target.value)}
                placeholder="Instruksi operator suara, slide presentasi, atau timer."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setEditingItem(null)}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="md"
                type="submit"
                className="gap-1.5 font-bold"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
