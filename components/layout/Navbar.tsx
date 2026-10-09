"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Radio,
  Calendar,
  AlertTriangle,
  ExternalLink,
  Shield,
  Layers,
  Clock,
  Package,
  CheckSquare,
  Users,
  FolderOpen,
  FileText,
} from "lucide-react";
import { useEventStore } from "@/lib/store/use-event-store";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { SosModal } from "@/components/event/SosModal";

export function Navbar() {
  const pathname = usePathname();
  const { event, userRole, userName } = useEventStore();
  const [isSosOpen, setIsSosOpen] = useState(false);

  const isPublicPage = pathname?.startsWith("/e/");
  const slug = event.slug;

  const navLinks = [
    { href: `/workspace/${slug}`, label: "Overview", icon: Layers },
    { href: `/workspace/${slug}/rundown`, label: "Run-down", icon: Clock },
    { href: `/workspace/${slug}/logistics`, label: "Logistik", icon: Package },
    { href: `/workspace/${slug}/tasks`, label: "Tugas & Nudge", icon: CheckSquare },
    { href: `/workspace/${slug}/assets`, label: "Asset & Wi-Fi", icon: FolderOpen },
    { href: `/workspace/${slug}/members`, label: "Panitia", icon: Users },
    { href: `/workspace/${slug}/debrief`, label: "LPJ Debrief", icon: FileText },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand & Event Title */}
            <div className="flex items-center gap-4">
              <Link href={`/workspace/${slug}`} className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
                  <Radio className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                      Basecamp<span className="text-violet-400">Lite</span>
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      LIVE
                    </span>
                  </div>
                  <h1 className="text-xs text-slate-400 font-medium truncate max-w-[200px] sm:max-w-[280px]">
                    {event.title}
                  </h1>
                </div>
              </Link>

              <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 pl-3 border-l border-white/10">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{formatDate(event.date)}</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5">
              {/* SOS Emergency Trigger Button */}
              <Button
                variant="danger"
                size="sm"
                onClick={() => setIsSosOpen(true)}
                className="font-bold flex items-center gap-1.5 bg-rose-600/90 hover:bg-rose-600 border border-rose-400/50 shadow-rose-900/40"
              >
                <AlertTriangle className="w-4 h-4 text-amber-200" />
                <span>SOS Beacon</span>
              </Button>

              {/* Mode Switcher */}
              {isPublicPage ? (
                <Link href={`/workspace/${slug}`}>
                  <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
                    <Shield className="w-3.5 h-3.5 text-violet-400" />
                    <span>Ruang Panitia</span>
                  </Button>
                </Link>
              ) : (
                <Link href={`/e/${slug}`} target="_blank">
                  <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Lihat Halaman Publik</span>
                  </Button>
                </Link>
              )}

              {/* User Identity Chip */}
              <div className="hidden md:flex items-center gap-2 pl-3 border-l border-white/10 text-xs">
                <div className="w-7 h-7 rounded-lg bg-violet-600/30 border border-violet-400/30 text-violet-300 font-bold flex items-center justify-center">
                  {userName[0]}
                </div>
                <div className="text-left leading-tight">
                  <div className="text-slate-200 font-medium">{userName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Peran: {userRole}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sub Navigation Bar for Organizer Workspace */}
          {!isPublicPage && (
            <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none border-t border-white/5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? "bg-violet-600/25 text-violet-300 border border-violet-500/40 shadow-sm shadow-violet-500/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-violet-400" : "text-slate-400"}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* SOS Trigger Modal */}
      <SosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
    </>
  );
}
