"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { useEventStore } from "@/lib/store/use-event-store";
import { KeyRound, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

import { Suspense } from "react";
import { NotificationToast } from "@/components/ui/NotificationToast";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hasUnlockedWorkspace, unlockWorkspace } = useEventStore();
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockWorkspace(pinInput.trim());
    if (success) {
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  if (!hasUnlockedWorkspace) {
    return (
      <div className="min-h-screen bg-[#0B0D13] flex items-center justify-center p-4">
        <div className="w-full max-w-sm glass-panel p-6 rounded-2xl border border-white/10 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Akses Ruang Panitia</h2>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Masukkan PIN 6 Digit rahasia acara untuk mengakses ruang kerja panitia.
          </p>

          <form onSubmit={handleUnlock} className="space-y-3">
            <input
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              placeholder="PIN 6 Digit (Cth: 260426)"
              className="w-full text-center tracking-widest text-lg font-mono font-bold py-3 px-4 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-violet-500"
            />

            {pinError && (
              <p className="text-xs text-rose-400 flex items-center justify-center gap-1 font-medium">
                <ShieldAlert className="w-3.5 h-3.5" />
                PIN salah! Cek kembali atau hubungi ketua acara.
              </p>
            )}

            <Button variant="primary" size="md" type="submit" className="w-full font-bold">
              Buka Basecamp
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D13] flex flex-col">
      <Suspense fallback={null}>
        <EmergencyBanner />
      </Suspense>
      <Suspense fallback={<div className="h-16 w-full glass-panel" />}>
        <Navbar />
      </Suspense>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <NotificationToast />
    </div>
  );
}
