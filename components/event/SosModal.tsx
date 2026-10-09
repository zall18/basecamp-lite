"use client";

import React, { useState } from "react";
import { AlertTriangle, Send } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useEventStore } from "@/lib/store/use-event-store";

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SosModal({ isOpen, onClose }: SosModalProps) {
  const { triggerSos, userName } = useEventStore();
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState(userName || "Panitia Lapangan");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    triggerSos(message.trim(), sender.trim());
    setMessage("");
    onClose();
  };

  const presetAlerts = [
    "🔌 Kabel HDMI panggung rusak / kedip-kedip, butuh pengganti!",
    "🎤 Baterai mic wireless habis, butuh baterai cadangan sekarang!",
    "⚡ Token listrik gedung bunyi / bermasalah!",
    "🍱 Vendor katering belum datang, sesi makan siang sudah dekat!",
    "🏥 Ada peserta pingsan/butuh pertolongan medis pertama!",
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🚨 D-Day SOS Emergency Beacon"
      description="Peringatan ini akan memunculkan banner merah mencolok di HP & laptop seluruh panitia dalam hitungan detik."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Nama Pelapor (PIC Lapangan)
          </label>
          <input
            type="text"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
            placeholder="Contoh: Dimas (Stage Manager)"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Jelaskan Masalah Kritis
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500 transition-colors resize-none"
            placeholder="Contoh: Kabel HDMI utama putus, butuh cadangan di ruang operator panggung segera!"
          />
        </div>

        {/* Preset quick buttons */}
        <div>
          <span className="block text-[11px] font-medium text-slate-400 mb-1.5">
            Atau pilih template kilat:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {presetAlerts.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setMessage(preset)}
                className="text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/20 text-rose-200 transition-colors cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>
            Gunakan hanya untuk keadaan darurat yang membutuhkan tindakan segera dari divisi terkait.
          </span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="danger"
            size="md"
            type="submit"
            disabled={!message.trim()}
            className="gap-2 font-bold"
          >
            <Send className="w-4 h-4" />
            <span>Sebarkan Sinyal SOS Sekarang</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
