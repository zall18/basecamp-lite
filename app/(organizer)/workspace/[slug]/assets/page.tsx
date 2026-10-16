"use client";

import React, { useState } from "react";
import { FolderOpen, Plus, Wifi, ExternalLink } from "lucide-react";
import { useEventStore } from "@/lib/store/use-event-store";
import { WifiCredentialCard } from "@/components/assets/WifiCredentialCard";
import { AssetCard } from "@/components/assets/AssetCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function AssetsPage() {
  const { event, addAsset } = useEventStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("Drive & File");

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = `https://${cleanUrl}`;
    }

    addAsset({
      title: title.trim(),
      url: cleanUrl,
      category,
    });

    setTitle("");
    setUrl("");
    setCategory("Drive & File");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-cyan-400" />
            <span>Quick Asset Hub & Pinned Cards</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tautan operasional krusial yang bebas dari tenggelam di chat WhatsApp: Drive, Sheet Presensi, Slido Q&A, dan Kredensial Wi-Fi.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="gap-1.5 font-bold self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tautan</span>
        </Button>
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

      {/* Modal Add Quick Asset */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="➕ Sematkan Tautan / File Penting"
        description="Sematkan link penting agar seluruh panitia bisa mengaksesnya tanpa tenggelam di grup chat."
      >
        <form onSubmit={handleAddAsset} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Judul Tautan <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Form Presensi Peserta / Slide Pembicara"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              URL Tautan <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://drive.google.com/... atau forms.gle/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="Drive & File">Drive & File</option>
              <option value="Formulir">Formulir / Spreadsheet</option>
              <option value="Presentasi">Presentasi / Slide</option>
              <option value="Interaktif">Interaktif / Slido</option>
              <option value="Dokumen">Dokumen Panduan</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setIsAddModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="cyan"
              size="md"
              type="submit"
              className="gap-1.5 font-bold"
            >
              <span>Sematkan Tautan</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
