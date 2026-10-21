"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useEventStore } from "@/lib/store/use-event-store";

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({ showLabel = false, className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useEventStore();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer border ${
        isLight
          ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 shadow-sm"
          : "bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
      } ${className}`}
      title={isLight ? "Beralih ke Night Theme (Gelap)" : "Beralih ke Light Theme (Terang)"}
      aria-label="Toggle Theme"
    >
      {isLight ? (
        <Sun className="w-4 h-4 text-amber-500 shrink-0 animate-spin-slow" />
      ) : (
        <Moon className="w-4 h-4 text-cyan-400 shrink-0" />
      )}

      {showLabel && (
        <span className="text-xs font-semibold">
          {isLight ? "Mode Terang" : "Mode Gelap"}
        </span>
      )}
    </button>
  );
}
