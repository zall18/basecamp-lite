"use client";

import React from "react";
import { Clock, MessageSquare, Play, CheckCircle2 } from "lucide-react";
import { useEventStore } from "@/lib/store/use-event-store";
import { formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function RundownTimeline() {
  const { event, setActiveRundownItem } = useEventStore();
  const rundowns = [...event.rundowns].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-3.5">
      {rundowns.map((item, idx) => {
        const isCurrent = item.isCurrent;
        return (
          <div
            key={item.id}
            className={`glass-card rounded-2xl p-4 sm:p-5 transition-all relative overflow-hidden ${
              isCurrent
                ? "border-violet-500/50 bg-gradient-to-r from-violet-950/40 via-slate-900/80 to-slate-900/60 shadow-lg shadow-violet-900/20"
                : "border-white/5 hover:border-white/15"
            }`}
          >
            {isCurrent && (
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-violet-500 to-cyan-400" />
            )}

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {/* Order Index & Status indicator */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    isCurrent
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/30 ring-2 ring-violet-400/40"
                      : "bg-slate-800/80 text-slate-400 border border-white/5"
                  }`}
                >
                  #{item.order}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTime(item.startTime)} - {formatTime(item.endTime)}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-400/30 animate-pulse">
                        Sesi Berlangsung
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mt-1">
                    {item.title}
                  </h3>

                  {item.speaker && (
                    <p className="text-xs text-slate-300 font-medium mt-0.5">
                      PIC / Narasumber: <span className="text-cyan-300">{item.speaker}</span>
                    </p>
                  )}

                  {/* Stage Cue Sticky Note */}
                  {item.cueNotes && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 flex items-start gap-2.5">
                      <MessageSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-[11px] text-amber-300 uppercase tracking-wider">
                          Stage Cue Sticky (Operator & Sound):
                        </span>
                        <span>{item.cueNotes}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                {!isCurrent ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveRundownItem(item.id)}
                    className="text-xs gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Jadikan Sesi Aktif</span>
                  </Button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Live On Stage
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
