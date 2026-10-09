"use client";

import React, { useState, useEffect } from "react";
import { Coffee, Send, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useEventStore } from "@/lib/store/use-event-store";
import { NUDGE_PRESETS, NUDGE_COOLDOWN_MINUTES } from "@/lib/constants";
import { Task } from "@/types";

interface NudgeModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NudgeModal({ task, isOpen, onClose }: NudgeModalProps) {
  const { sendNudge, userName, event } = useEventStore();
  const [selectedPreset, setSelectedPreset] = useState(NUDGE_PRESETS[0]);
  const [successNotice, setSuccessNotice] = useState(false);

  if (!task) return null;

  const assignee = event.members.find((m) => m.id === task.assigneeId);

  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [remainingMinutes, setRemainingMinutes] = useState(0);

  useEffect(() => {
    if (!task?.lastNudgeAt) {
      setIsOnCooldown(false);
      setRemainingMinutes(0);
      return;
    }
    const diff = (Date.now() - new Date(task.lastNudgeAt).getTime()) / 60000;
    if (diff < NUDGE_COOLDOWN_MINUTES) {
      setIsOnCooldown(true);
      setRemainingMinutes(Math.ceil(NUDGE_COOLDOWN_MINUTES - diff));
    } else {
      setIsOnCooldown(false);
      setRemainingMinutes(0);
    }
  }, [task?.lastNudgeAt, isOpen]);

  const handleSendNudge = () => {
    const sent = sendNudge(task.id, userName || "Panitia", selectedPreset.label);
    if (sent) {
      setSuccessNotice(true);
      setTimeout(() => {
        setSuccessNotice(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="☕ Task Nudge (Ping Santai)"
      description={`Kirim pengingat kasual ke ${assignee ? assignee.name : "PIC tugas"} tanpa canggung.`}
    >
      <div className="space-y-4">
        {/* Target task summary */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Target Tugas:
          </span>
          <p className="text-sm font-semibold text-white mt-0.5">{task.title}</p>
          {task.lastNudgeBy && (
            <span className="text-[11px] text-slate-400 mt-1 block">
              Terakhir dinudge: <span className="text-violet-300">{task.lastNudgeBy}</span>
            </span>
          )}
        </div>

        {isOnCooldown ? (
          <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
            <Clock className="w-4 h-4 shrink-0 text-amber-400 animate-spin" />
            <div>
              <p className="font-semibold">Cooldown Anti-Spam Aktif</p>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                Tugas ini baru saja dinudge. Tunggu {remainingMinutes} menit lagi sebelum mengirim ping berikutnya.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Pilih Gaya Ping Kasual:
            </label>
            <div className="space-y-2">
              {NUDGE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedPreset(preset)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedPreset.id === preset.id
                      ? "bg-violet-600/20 border-violet-500/50 shadow-md shadow-violet-900/20"
                      : "bg-slate-900/50 border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{preset.label}</span>
                    <span className="text-[11px] text-slate-400">{preset.desc}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 italic">
                    &ldquo;{preset.message}&rdquo;
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {successNotice && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Nudge berhasil terkirim! Temanmu akan menerima ping santai ini.</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Tutup
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={isOnCooldown || successNotice}
            onClick={handleSendNudge}
            className="gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Kirim Nudge Sekarang</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
