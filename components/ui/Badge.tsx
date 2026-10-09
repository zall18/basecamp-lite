import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "violet" | "cyan" | "amber" | "emerald" | "rose";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-800/80 text-slate-300 border-white/10",
    violet: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    rose: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm gap-1.5",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
