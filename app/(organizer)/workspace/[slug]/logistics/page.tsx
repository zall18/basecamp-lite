"use client";

import React from "react";
import { Package } from "lucide-react";
import { LogisticsTabs } from "@/components/logistics/LogisticsTabs";

export default function LogisticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Package className="w-5 h-5 text-amber-400" />
          <span>Radar Logistik & Konsumsi</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Pantau keberadaan peralatan pinjaman, status pengantaran pesanan konsumsi vendor, dan upload bukti foto serah terima.
        </p>
      </div>

      <LogisticsTabs />
    </div>
  );
}
