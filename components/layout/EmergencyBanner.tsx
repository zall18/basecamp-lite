"use client";

import React from "react";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useEventStore } from "@/lib/store/use-event-store";
import { formatTime } from "@/lib/utils";

export function EmergencyBanner() {
  const { event, resolveSos } = useEventStore();
  const activeAlert = event.sosAlerts.find((alert) => !alert.isResolved);

  if (!activeAlert) return null;

  return (
    <div className="w-full bg-gradient-to-r from-rose-900/90 via-rose-600/95 to-red-900/90 text-white px-4 py-3 shadow-xl shadow-rose-900/30 border-b border-rose-400/40 sticky top-0 z-50 animate-in slide-in-from-top duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl animate-bounce">
            <AlertTriangle className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-rose-950/80 px-2 py-0.5 rounded text-rose-200 border border-rose-500/30">
                🚨 D-DAY SOS EMERGENCY
              </span>
              <span className="text-xs text-rose-200 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {formatTime(activeAlert.createdAt)}
              </span>
              <span className="text-xs font-medium text-rose-100">
                dari {activeAlert.senderName}
              </span>
            </div>
            <p className="text-sm font-semibold text-white mt-0.5 leading-snug">
              {activeAlert.message}
            </p>
          </div>
        </div>

        <button
          onClick={() => resolveSos(activeAlert.id)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-rose-50 text-rose-900 text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Tandai Masalah Teratasi
        </button>
      </div>
    </div>
  );
}
