"use client";

import React, { useState } from "react";
import { FileText, Copy, Printer, CheckCircle, Package, Clock, Award, Check } from "lucide-react";
import { useEventStore } from "@/lib/store/use-event-store";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function LPJReportView() {
  const { event } = useEventStore();
  const [copied, setCopied] = useState(false);

  // Statistics Calculation
  const totalTasks = event.tasks.length;
  const completedTasks = event.tasks.filter((t) => t.status === "DONE").length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  const totalLogistics = event.logistics.length;
  const returnedLogistics = event.logistics.filter((l) => l.status === "RETURNED").length;
  const logisticsReturnRate = totalLogistics > 0 ? Math.round((returnedLogistics / totalLogistics) * 100) : 100;

  const totalRundown = event.rundowns.length;
  const totalAlerts = event.sosAlerts.length;
  const resolvedAlerts = event.sosAlerts.filter((a) => a.isResolved).length;

  const markdownContent = `# Laporan Pertanggungjawaban (LPJ) & Evaluasi Acara
## ${event.title}
**Tanggal Pelaksanaan:** ${formatDate(event.date)}
**Lokasi:** ${event.location || "-"}

---

### 1. Ringkasan Eksekutif & Statistik Kinerja
- **Tingkat Penyelesaian Tugas:** ${completedTasks}/${totalTasks} (${taskCompletionRate}%)
- **Status Pengembalian Logistik:** ${returnedLogistics}/${totalLogistics} (${logisticsReturnRate}%)
- **Total Sesi Acara:** ${totalRundown} sesi terlaksana
- **Insiden SOS Darurat Hari-H:** ${resolvedAlerts}/${totalAlerts} masalah terselesaikan

---

### 2. Rekapitulasi Logistik & Pengembalian
${event.logistics
  .map(
    (l) => `- [${l.status === "RETURNED" ? "x" : " "}] ${l.name} (${l.category}) - Status: ${l.status}`
  )
  .join("\n")}

---

### 3. Rekapitulasi Tugas Panitia
${event.tasks
  .map(
    (t) => `- [${t.status === "DONE" ? "x" : " "}] ${t.title} - Status: ${t.status}`
  )
  .join("\n")}

---
*Dibuat secara otomatis melalui Basecamp Lite Platform.*
`;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Actions */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30">
            Post-Event Snapshot
          </span>
          <h2 className="text-lg font-bold text-white mt-1">
            Debrief Acara & Laporan LPJ Otomatis
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kompilasi seluruh data hari-H, persentase tugas on-time, dan audit logistik siap pakai.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="cyan"
            size="sm"
            onClick={handleCopyMarkdown}
            className="flex-1 sm:flex-none font-bold"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Format Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Markdown LPJ</span>
              </>
            )}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            className="flex-1 sm:flex-none"
          >
            <Printer className="w-4 h-4 text-slate-300" />
            <span>Cetak / Simpan PDF</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-violet-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Tugas Selesai</span>
            <CheckCircle className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {taskCompletionRate}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {completedTasks} dari {totalTasks} tugas tuntas
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-amber-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Pengembalian Logistik</span>
            <Package className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {logisticsReturnRate}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {returnedLogistics} dari {totalLogistics} barang kembali
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-cyan-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Sesi Terlaksana</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {totalRundown} Sesi
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Tersinkronisasi secara live
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Insiden Teratasi</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {resolvedAlerts}/{totalAlerts}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Zero unresolved blockers
          </p>
        </div>
      </div>

      {/* Markdown Preview Box */}
      <div className="glass-card rounded-2xl p-5 border border-white/10">
        <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
          <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-violet-400" />
            Preview Dokumen Markdown LPJ
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            Format: GitHub Flavored Markdown
          </span>
        </div>
        <pre className="p-4 rounded-xl bg-slate-950 text-slate-300 text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed border border-white/5">
          {markdownContent}
        </pre>
      </div>
    </div>
  );
}
