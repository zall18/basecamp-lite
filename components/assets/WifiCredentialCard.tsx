"use client";

import React, { useState } from "react";
import { Wifi, Copy, Check, MapPin } from "lucide-react";
import { useEventStore } from "@/lib/store/use-event-store";
import { Button } from "@/components/ui/Button";

export function WifiCredentialCard() {
  const { event } = useEventStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (event.wifiPass) {
      navigator.clipboard.writeText(event.wifiPass);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-slate-900/60 to-slate-900/40 relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Wifi className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              Akses Internet Hari-H
            </span>
            <h3 className="text-base font-bold text-white mt-1">Wi-Fi Resmi Lokasi</h3>
          </div>
        </div>

        {event.location && (
          <span className="text-xs text-slate-400 hidden sm:flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            {event.location}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/5">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Nama Jaringan (SSID)
          </span>
          <p className="text-sm font-mono font-bold text-white mt-0.5">
            {event.wifiSSID || "Event-Guest-WiFi"}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Password Wi-Fi
            </span>
            <p className="text-sm font-mono font-bold text-cyan-300 mt-0.5">
              {event.wifiPass || "BukaPanitia2026"}
            </p>
          </div>
          <Button
            variant="cyan"
            size="sm"
            onClick={handleCopy}
            className="text-xs font-bold gap-1 min-h-[36px]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-950" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
