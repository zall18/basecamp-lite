"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  Calendar,
  MapPin,
  Wifi,
  KeyRound,
  User,
  Phone,
  Sparkles,
  GraduationCap,
  Laptop,
  Users,
  FileCode,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useEventStore } from "@/lib/store/use-event-store";
import { EventTemplateType } from "@/lib/event-templates";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TEMPLATE_CARDS: {
  id: EventTemplateType;
  title: string;
  badge: string;
  desc: string;
  icon: any;
  color: string;
}[] = [
  {
    id: "workshop",
    title: "Workshop & Seminar",
    badge: "Paling Populer",
    desc: "Preset rundown materi & hands-on, logistik proyektor, mic wireless, dan snack box katering.",
    icon: GraduationCap,
    color: "from-violet-600 to-indigo-600",
  },
  {
    id: "hackathon",
    title: "Hackathon / Lomba",
    badge: "Kompetisi",
    desc: "Preset rundown briefing & pitching juri, terminal colokan listrik, dan router backup 5G.",
    icon: Laptop,
    color: "from-cyan-600 to-blue-600",
  },
  {
    id: "gathering",
    title: "Gathering / Raker",
    badge: "Komunitas",
    desc: "Preset rundown santai ice breaking & evaluasi, sound portable, dan prasmanan makan siang.",
    icon: Users,
    color: "from-pink-600 to-rose-600",
  },
  {
    id: "blank",
    title: "Mulai dari Nol (Kosong)",
    badge: "Kustom Penuh",
    desc: "Tanpa data bawaan. Anda bebas menyusun rundown, tugas, dan barang dari awal sesuai kebutuhan.",
    icon: FileCode,
    color: "from-slate-700 to-slate-800",
  },
];

export function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
  const router = useRouter();
  const { createNewEvent } = useEventStore();

  const [step, setStep] = useState<1 | 2>(1);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [template, setTemplate] = useState<EventTemplateType>("workshop");

  React.useEffect(() => {
    try {
      setDate(new Date().toISOString().split("T")[0]);
    } catch {
      setDate("2026-10-15");
    }
  }, []);

  const [creatorName, setCreatorName] = useState("");
  const [creatorPhone, setCreatorPhone] = useState("");
  const [passcode, setPasscode] = useState("260426");
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPass, setWifiPass] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !creatorName.trim()) return;

    const newSlug = createNewEvent({
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      location: location.trim() || undefined,
      template,
      creatorName: creatorName.trim(),
      creatorPhone: creatorPhone.trim() || undefined,
      passcode: passcode.trim() || "260426",
      wifiSSID: wifiSSID.trim() || undefined,
      wifiPass: wifiPass.trim() || undefined,
    });

    onClose();
    router.push(`/workspace/${newSlug}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🚀 Buat Basecamp Acara Baru"
      description="Siapkan ruang koordinasi panitia & live run-down hanya dalam waktu kurang dari 90 detik."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Step Indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                step === 1
                  ? "bg-violet-600 text-white"
                  : "bg-emerald-600 text-white"
              }`}
            >
              {step === 1 ? "1" : <Check className="w-3.5 h-3.5" />}
            </span>
            <span
              className={`text-xs font-semibold ${
                step === 1 ? "text-white" : "text-slate-400"
              }`}
            >
              1. Info Acara & Template
            </span>
          </div>

          <div className="h-0.5 w-8 bg-white/10" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                step === 2
                  ? "bg-violet-600 text-white"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              2
            </span>
            <span
              className={`text-xs font-semibold ${
                step === 2 ? "text-white" : "text-slate-500"
              }`}
            >
              2. Kredensial & Hari-H
            </span>
          </div>
        </div>

        {/* STEP 1: Event Info & Template Selection */}
        {step === 1 && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nama Acara <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Workshop Cloud & AI 2026 / Seminar Nasional"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  Tanggal Pelaksanaan <span className="text-rose-400">*</span>
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
                  Lokasi Venue
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Cth: Auditorium Gd. Riset Lt. 4"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Deskripsi Singkat / Tagline
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Cth: Koordinasi panggung, logistik, dan task nudge bebas spam untuk panitia hari-H."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 resize-none"
              />
            </div>

            {/* Template Selection Grid */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Pilih Template Bawaan Acara
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TEMPLATE_CARDS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = template === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setTemplate(item.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? "bg-violet-600/20 border-violet-500 shadow-md shadow-violet-950/40"
                          : "bg-slate-900/60 border-white/10 hover:border-white/20 hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shrink-0`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-white text-xs">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/10">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <Button variant="ghost" size="sm" type="button" onClick={onClose}>
                Batal
              </Button>
              <Button
                variant="cyan"
                size="md"
                type="button"
                disabled={!title.trim()}
                onClick={() => setStep(2)}
                className="gap-1.5 font-bold"
              >
                <span>Lanjut ke Langkah 2</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Creator Identity & Day-H Credentials */}
        {step === 2 && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs text-slate-300">
              <span className="font-bold text-white block mb-0.5">
                👑 Identitas Ketua Pelaksana
              </span>
              <span>
                Akun Anda otomatis diset sebagai <strong>Leader (Akses Penuh)</strong> dengan kendali penuh atas rundown, overtime, dan logistik.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-violet-400" />
                  Nama Anda (Ketua/Inisiator) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="Contoh: Rian Pratama"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  Nomor WhatsApp Anda
                </label>
                <input
                  type="tel"
                  value={creatorPhone}
                  onChange={(e) => setCreatorPhone(e.target.value)}
                  placeholder="+6281234567890"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                PIN Akses Panitia (6 Digit) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Cth: 260426"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono tracking-widest focus:outline-none focus:border-violet-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                PIN ini dibagikan ke panitia Anda untuk membuka ruang kerja.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                  Wi-Fi Venue SSID (Opsional)
                </label>
                <input
                  type="text"
                  value={wifiSSID}
                  onChange={(e) => setWifiSSID(e.target.value)}
                  placeholder="Cth: Auditorium-Guest-5G"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password Wi-Fi Venue
                </label>
                <input
                  type="text"
                  value={wifiPass}
                  onChange={(e) => setWifiPass(e.target.value)}
                  placeholder="Cth: SeminarKeren2026!"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setStep(1)}
                className="gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </Button>

              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={!creatorName.trim()}
                className="gap-1.5 font-bold"
              >
                <Zap className="w-4 h-4 text-cyan-300" />
                <span>Luncurkan Basecamp Acara</span>
              </Button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}
