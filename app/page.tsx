"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Radio,
  Zap,
  Clock,
  Package,
  Coffee,
  AlertTriangle,
  ArrowRight,
  Shield,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CreateEventModal } from "@/components/event/CreateEventModal";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useEventStore } from "@/lib/store/use-event-store";

export default function LandingPage() {
  const router = useRouter();
  const { event } = useEventStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0D13] text-slate-100 flex flex-col selection:bg-violet-500 selection:text-white">
      {/* Glow Ambient Blobs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 glass-panel border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-white">
                Basecamp<span className="text-violet-400">Lite</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                v1.0 Community
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href={`/workspace/${event.slug}`}>
              <Button variant="ghost" size="sm" className="text-xs">
                Coba Demo Acara
              </Button>
            </Link>
            <Button
              variant="cyan"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="text-xs font-bold gap-1.5 shadow-cyan-500/25"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Buat Acara Baru</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border border-violet-500/30 text-violet-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Platform Manajemen Acara Komunitas Anti-Ribet</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Kendali Hari-H Acara.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-300">
              Tanpa Spam Chat WhatsApp.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Khusus panitia mahasiswa, GDG on Campus, dan komunitas teknologi. Live Run-down Sync, Radar Logistik, Task Nudge kasual (&ldquo;Kopi Dulu Bos&rdquo;), dan SOS Emergency Beacon.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsCreateOpen(true)}
              className="w-full sm:w-auto text-base font-bold gap-2 px-8 py-4 glow-violet"
            >
              <Zap className="w-5 h-5" />
              <span>Buat Basecamp Acara (&lt; 90 Detik)</span>
            </Button>

            <Link href={`/workspace/${event.slug}`} className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto text-base font-semibold gap-2 px-6 py-4"
              >
                <span>Buka Demo Hackathon</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 pt-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Bebas Form Rumit
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> PIN Akses 6 Digit
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Realtime Sync
            </span>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-card rounded-2xl p-6 border border-white/5 hover:border-violet-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-400/30 flex items-center justify-center text-violet-400 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Live Run-down Sync</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Pemateri molor? Stage Manager cukup klik <span className="text-amber-400 font-bold">+5m</span> atau <span className="text-amber-400 font-bold">+10m</span>. Sistem otomatis menggeser sisa jadwal ke bawah tanpa edit manual!
              </p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/5 hover:border-pink-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-pink-600/20 border border-pink-400/30 flex items-center justify-center text-pink-400 mb-4">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Radar Logistik & Katering</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Awasi status barang pinjaman kampus, lacak pesanan konsumsi (Belum Diambil $\rightarrow$ Menuju Lokasi $\rightarrow$ Tiba), dan upload bukti foto serah terima.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/5 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-4">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Casual Task Nudge</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Sungkan nagih tugas teman sebaya? Gunakan preset ping santai: <span className="text-cyan-300 font-bold">&ldquo;☕ Kopi Dulu Bos&rdquo;</span> atau <span className="text-cyan-300 font-bold">&ldquo;👀 Any Update?&rdquo;</span> dengan cooldown timer 10 menit.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/5 hover:border-rose-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-600/20 border border-rose-400/30 flex items-center justify-center text-rose-400 mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">D-Day SOS Emergency Beacon</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Kabel HDMI putus? Token listrik bunyi? Satu kali pencet, seluruh layar HP panitia memunculkan banner merah darurat dalam hitungan detik.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-500">
        Basecamp Lite — Dirancang untuk Komunitas Mahasiswa & Non-Corporate Tech Events.
      </footer>

      {/* Modal Comprehensive Event Creation */}
      <CreateEventModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
