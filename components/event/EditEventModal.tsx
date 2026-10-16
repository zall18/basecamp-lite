"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Wifi,
  KeyRound,
  FileText,
  Save,
  RotateCcw,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useEventStore } from "@/lib/store/use-event-store";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditEventModal({ isOpen, onClose }: EditEventModalProps) {
  const { event, updateEventDetails } = useEventStore();

  const [title, setTitle] = useState(event.title || "");
  const [description, setDescription] = useState(event.description || "");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState(event.location || "");
  const [passcode, setPasscode] = useState(event.passcode || "260426");
  const [wifiSSID, setWifiSSID] = useState(event.wifiSSID || "");
  const [wifiPass, setWifiPass] = useState(event.wifiPass || "");

  // Update form whenever modal opens or event changes
  useEffect(() => {
    if (isOpen) {
      setTitle(event.title || "");
      setDescription(event.description || "");
      try {
        setDate(new Date(event.date).toISOString().split("T")[0]);
      } catch {
        setDate(new Date().toISOString().split("T")[0]);
      }
      setLocation(event.location || "");
      setPasscode(event.passcode || "260426");
      setWifiSSID(event.wifiSSID || "");
      setWifiPass(event.wifiPass || "");
    }
  }, [isOpen, event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateEventDetails({
      title: title.trim(),
      description: description.trim() || undefined,
      date: new Date(date).toISOString(),
      location: location.trim() || undefined,
      passcode: passcode.trim() || "260426",
      wifiSSID: wifiSSID.trim() || null,
      wifiPass: wifiPass.trim() || null,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚙️ Edit Informasi & Pengaturan Acara"
      description="Ubah nama acara, lokasi venue, kredensial Wi-Fi, dan PIN akses panitia."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Nama Acara <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              Tanggal Pelaksanaan
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Lokasi / Venue
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Cth: Auditorium Lantai 4"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Deskripsi / Catatan Acara
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            PIN Akses Panitia 6 Digit
          </label>
          <input
            type="text"
            maxLength={6}
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono tracking-widest focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-cyan-400" />
              Wi-Fi Venue SSID
            </label>
            <input
              type="text"
              value={wifiSSID}
              onChange={(e) => setWifiSSID(e.target.value)}
              placeholder="Cth: Auditorium-5G"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password Wi-Fi
            </label>
            <input
              type="text"
              value={wifiPass}
              onChange={(e) => setWifiPass(e.target.value)}
              placeholder="Cth: password123"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" size="md" type="submit" className="gap-1.5 font-bold">
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
