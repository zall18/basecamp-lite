"use client";

import React, { useState } from "react";
import { FolderOpen, Plus, Wifi } from "lucide-react";
import { useEventStore } from "@/lib/store/use-event-store";
import { WifiCredentialCard } from "@/components/assets/WifiCredentialCard";
import { AssetCard } from "@/components/assets/AssetCard";
import { Button } from "@/components/ui/Button";

export default function AssetsPage() {
  const { event } = useEventStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-cyan-400" />
          <span>Quick Asset Hub & Pinned Cards</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Tautan operasional krusial yang bebas dari tenggelam di chat WhatsApp: Drive, Sheet Presensi, Slido Q&A, dan Kredensial Wi-Fi.
        </p>
      </div>

      {/* Wi-Fi Pinned Card */}
      <WifiCredentialCard />

      {/* Grid of Pinned Link Assets */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3">
          Tautan Tersemat ({event.assets.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {event.assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </div>
    </div>
  );
}
