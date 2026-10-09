"use client";

import React from "react";
import { PlayCircle, Clock, FastForward, Plus, Minus } from "lucide-react";
import { useEventStore } from "@/lib/store/use-event-store";
import { formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function NowPlayingBar() {
  const { event, adjustRundownTime } = useEventStore();
  const rundowns = [...event.rundowns].sort((a, b) => a.order - b.order);

  const currentIndex = rundowns.findIndex((r) => r.isCurrent);
  const currentItem = currentIndex !== -1 ? rundowns[currentIndex] : rundowns[0];
  const nextItem = currentIndex !== -1 && currentIndex + 1 < rundowns.length ? rundowns[currentIndex + 1] : null;

  if (!currentItem) return null;

  return (
    <div className="w-full glass-card rounded-2xl p-4 sm:p-5 border border-violet-500/30 relative overflow-hidden bg-gradient-to-r from-violet-950/40 via-slate-900/60 to-cyan-950/40 shadow-xl shadow-violet-950/20">
      {/* Animated glowing neon progress line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 animate-pulse" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Active Session Info */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-violet-600/30 border border-violet-400/40 flex items-center justify-center shrink-0 shadow-lg shadow-violet-600/20">
            <PlayCircle className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-500/25 text-violet-300 border border-violet-400/30">
                NOW PLAYING
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-cyan-400" />
                {formatTime(currentItem.startTime)} - {formatTime(currentItem.endTime)}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
              {currentItem.title}
            </h2>
            {currentItem.speaker && (
              <p className="text-xs text-cyan-300 font-medium mt-0.5">
                Pemateri / PIC: {currentItem.speaker}
              </p>
            )}
          </div>
        </div>

        {/* Center / Right: Dynamic Overtime Recalculator */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
          {/* Overtime Controls */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-white/10">
            <span className="text-[11px] font-semibold text-slate-400 px-2 hidden sm:inline">
              Geser Waktu:
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustRundownTime(currentItem.id, 5)}
              className="text-xs font-bold text-amber-300 border-amber-500/30 hover:bg-amber-500/10 min-h-[36px]"
              title="Tambah 5 menit & geser sesi setelahnya"
            >
              <Plus className="w-3 h-3" /> 5m
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustRundownTime(currentItem.id, 10)}
              className="text-xs font-bold text-amber-300 border-amber-500/30 hover:bg-amber-500/10 min-h-[36px]"
              title="Tambah 10 menit & geser sesi setelahnya"
            >
              <Plus className="w-3 h-3" /> 10m
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustRundownTime(currentItem.id, -5)}
              className="text-xs font-bold text-slate-400 border-white/10 hover:bg-white/5 min-h-[36px]"
              title="Potong 5 menit"
            >
              <Minus className="w-3 h-3" /> 5m
            </Button>
          </div>

          {/* Up Next Badge */}
          {nextItem && (
            <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-white/10 flex items-center gap-2">
              <FastForward className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="text-left text-xs truncate max-w-[180px]">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Up Next ({formatTime(nextItem.startTime)})</div>
                <div className="text-slate-200 font-medium truncate">{nextItem.title}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
