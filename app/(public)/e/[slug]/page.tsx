"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  Wifi,
  ExternalLink,
  Shield,
  HelpCircle,
  Radio,
} from "lucide-react";
import { useEventStore } from "@/lib/store/use-event-store";
import { formatDate, formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function PublicEventHubPage() {
  const { event } = useEventStore();
  const rundowns = [...event.rundowns].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-[#0B0D13] text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 glass-panel border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Radio className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight text-white">
              Basecamp<span className="text-violet-400">Lite</span> Public Hub
            </span>
          </div>

          <Link href={`/workspace/${event.slug}`}>
            <Button variant="secondary" size="sm" className="text-xs font-semibold gap-1.5">
              <Shield className="w-3.5 h-3.5 text-violet-400" />
              <span>Login Panitia</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-violet-500/30 bg-gradient-to-b from-violet-950/30 to-slate-900/60 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              EVENT HUB RESMI
            </span>
            <span className="text-xs text-slate-400">Read-Only View</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            {event.title}
          </h1>

          {event.description && (
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {event.description}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2.5 text-slate-300">
              <div className="p-2 rounded-lg bg-slate-800 text-violet-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tanggal</span>
                <span className="font-semibold text-white">{formatDate(event.date)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-slate-300">
              <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Lokasi Venue</span>
                <span className="font-semibold text-white">{event.location || "TBA"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Public Wi-Fi Card */}
        {event.wifiSSID && (
          <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 bg-cyan-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  Koneksi Internet Peserta
                </span>
                <p className="text-sm font-bold text-white mt-0.5">
                  SSID: <span className="font-mono text-cyan-300">{event.wifiSSID}</span>
                </p>
              </div>
            </div>

            {event.wifiPass && (
              <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono">
                <span className="text-slate-400 text-[10px] block">Password:</span>
                <span className="font-bold text-white">{event.wifiPass}</span>
              </div>
            )}
          </div>
        )}

        {/* Public Rundown */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-bold text-white">Jadwal Acara (Live Run-down)</h2>
          </div>

          <div className="space-y-3">
            {rundowns.map((item) => (
              <div
                key={item.id}
                className={`glass-card rounded-2xl p-4 sm:p-5 border transition-all ${
                  item.isCurrent
                    ? "border-violet-500/40 bg-violet-950/30 shadow-lg shadow-violet-950/20"
                    : "border-white/5"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {formatTime(item.startTime)} - {formatTime(item.endTime)}
                      </span>
                      {item.isCurrent && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                          Sedang Berlangsung
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">{item.title}</h3>
                    {item.speaker && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        PIC / Pembicara: <span className="text-slate-200">{item.speaker}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Informasi & FAQ Peserta</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
              <p className="font-bold text-white">Apakah ada sertifikat untuk peserta?</p>
              <p className="text-slate-400 mt-1">
                Ya! Tautan klaim e-sertifikat akan dirilis panitia melalui link Google Form di akhir sesi acara.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
              <p className="font-bold text-white">Bagaimana cara mengajukan pertanyaan pada sesi Q&A?</p>
              <p className="text-slate-400 mt-1">
                Silakan akses room Slido resmi acara melalui link atau scan QR yang ditampilkan di layar panggung.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        Ditenagai oleh <span className="text-violet-400 font-semibold">Basecamp Lite</span> — Platform Manajemen Acara Anti-Ribet
      </footer>
    </div>
  );
}
