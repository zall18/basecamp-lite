"use client";

import React, { useState, useEffect } from "react";
import { Coffee, Send, Clock, CheckCircle2, MessageCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useEventStore } from "@/lib/store/use-event-store";
import { NUDGE_PRESETS, NUDGE_COOLDOWN_MINUTES, formatDurationHuman } from "@/lib/constants";
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

  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [remainingFormatted, setRemainingFormatted] = useState("");

  const assignee = task ? event.members.find((m) => m.id === task.assigneeId) : null;

  // Real-time live countdown timer (ticks every 1s)
  useEffect(() => {
    if (!task?.lastNudgeAt || !isOpen) {
      setIsOnCooldown(false);
      setRemainingFormatted("");
      return;
    }

    const checkCooldown = () => {
      const lastNudgeMs = new Date(task.lastNudgeAt!).getTime();
      const elapsedMs = Date.now() - lastNudgeMs;
      const cooldownMs = NUDGE_COOLDOWN_MINUTES * 60 * 1000;

      // Cooldown only active if elapsed between 0 and 10 minutes
      if (elapsedMs >= 0 && elapsedMs < cooldownMs) {
        const remainingSec = Math.ceil((cooldownMs - elapsedMs) / 1000);
        setIsOnCooldown(true);
        setRemainingFormatted(formatDurationHuman(remainingSec));
      } else {
        setIsOnCooldown(false);
        setRemainingFormatted("");
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, [task?.lastNudgeAt, isOpen]);

  if (!task) return null;

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

  const cleanPhone = assignee?.phone ? assignee.phone.replace(/[^0-9]/g, "") : null;
  const waText = encodeURIComponent(
    `Halo ${assignee?.name || "Kawan"}! ${selectedPreset.label}\n"${selectedPreset.message}"\n\n📌 Terkait tugas: ${task.title}\nBasecamp Lite Event Hub`
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="☕ Task Nudge (Ping Santai)"
      description={`Kirim pengingat kasual in-app ke ${assignee ? assignee.name : "PIC tugas"} tanpa canggung.`}
    >
      <div className="space-y-4">
        {/* Target task summary */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Target Tugas:
            </span>
            {assignee && (
              <span className="text-xs text-violet-300 font-semibold">
                PIC: {assignee.name}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-white mt-1">{task.title}</p>
          {task.lastNudgeBy && (
            <span className="text-[11px] text-slate-400 mt-1 block">
              Terakhir dinudge: <span className="text-amber-300 font-medium">{task.lastNudgeBy}</span>
            </span>
          )}
        </div>

        {isOnCooldown ? (
          <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3 animate-in fade-in">
            <Clock className="w-5 h-5 shrink-0 text-amber-400 animate-spin mt-0.5" />
            <div>
              <p className="font-bold text-sm text-amber-200">Cooldown Anti-Spam Aktif</p>
              <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                Tugas ini baru saja diping. Untuk menjaga kenyamanan tim, cooldown aktif selama{" "}
                <span className="font-black text-white px-1.5 py-0.5 bg-amber-950 rounded border border-amber-500/40 font-mono">
                  {remainingFormatted}
                </span>{" "}
                lagi sebelum bisa diping kembali.
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
                      ? "bg-violet-600/25 border-violet-500/60 shadow-md shadow-violet-900/20"
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
            <span>Notifikasi In-App berhasil dikirim ke {assignee?.name || "rekan panitia"}!</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-white/10">
          {/* Optional Direct WhatsApp shortcut */}
          {cleanPhone ? (
            <a
              href={`https://wa.me/${cleanPhone}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer text-center"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kirim via WhatsApp</span>
            </a>
          ) : (
            <div />
          )}

          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Tutup
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={isOnCooldown || successNotice}
              onClick={handleSendNudge}
              className="gap-2 font-bold"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Ping In-App</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
