"use client";

import React, { useEffect } from "react";
import { Coffee, AlertTriangle, X, Bell } from "lucide-react";
import { useEventStore } from "@/lib/store/use-event-store";

export function NotificationToast() {
  const { activeToast, dismissToast } = useEventStore();

  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        dismissToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeToast, dismissToast]);

  if (!activeToast) return null;

  const isSos = activeToast.type === "sos";

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
      <div
        className={`glass-panel p-4 rounded-2xl border shadow-2xl backdrop-blur-xl relative flex items-start gap-3 ${
          isSos
            ? "border-rose-500/50 bg-rose-950/90 shadow-rose-950/50"
            : "border-violet-500/50 bg-slate-900/90 shadow-violet-950/50"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isSos
              ? "bg-rose-600/30 text-rose-300 border border-rose-500/40 animate-bounce"
              : "bg-violet-600/30 text-violet-300 border border-violet-500/40"
          }`}
        >
          {isSos ? <AlertTriangle className="w-5 h-5 text-rose-400" /> : <Coffee className="w-5 h-5 text-amber-400" />}
        </div>

        <div className="flex-1 pr-4">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isSos
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  : "bg-violet-500/20 text-violet-300 border border-violet-500/30"
              }`}
            >
              {isSos ? "🚨 SOS Alert" : "☕ Ping Nudge"}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Baru saja</span>
          </div>

          <h4 className="text-sm font-bold text-white mt-1 leading-snug">
            {activeToast.title}
          </h4>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
            {activeToast.message}
          </p>
        </div>

        <button
          onClick={dismissToast}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
