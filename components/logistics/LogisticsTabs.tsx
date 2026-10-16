"use client";

import React, { useState } from "react";
import {
  Package,
  Utensils,
  Camera,
  CheckCircle,
  Clock,
  Phone,
  Image as ImageIcon,
  ChevronRight,
  Lock,
} from "lucide-react";
import { useEventStore } from "@/lib/store/use-event-store";
import { getItemStatusConfig } from "@/lib/constants";
import { getRolePermissions } from "@/lib/permissions";
import { ItemStatus } from "@/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Trash2, Plus } from "lucide-react";

export function LogisticsTabs() {
  const {
    event,
    userRole,
    updateLogisticsStatus,
    uploadLogisticsProof,
    addLogisticsItem,
    deleteLogisticsItem,
  } = useEventStore();
  const permissions = getRolePermissions(userRole);
  const canEdit = permissions.canManageLogistics;

  const [activeTab, setActiveTab] = useState<"gear" | "food" | "proof">("gear");
  const [selectedItemForProof, setSelectedItemForProof] = useState<string | null>(null);
  const [proofUrlInput, setProofUrlInput] = useState("");

  // Add Item Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Elektronik / Alat");
  const [newItemVendorPhone, setNewItemVendorPhone] = useState("");

  const gearItems = event.logistics.filter((item) => item.category !== "Konsumsi");
  const foodItems = event.logistics.filter((item) => item.category === "Konsumsi");
  const verifiedItems = event.logistics.filter((item) => Boolean(item.photoProof));

  const handleStatusChange = (itemId: string, newStatus: ItemStatus) => {
    if (!canEdit) return;
    updateLogisticsStatus(itemId, newStatus);
  };

  const handleSaveProof = () => {
    if (selectedItemForProof && proofUrlInput.trim()) {
      uploadLogisticsProof(selectedItemForProof, proofUrlInput.trim());
      setProofUrlInput("");
      setSelectedItemForProof(null);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    addLogisticsItem({
      name: newItemName.trim(),
      category: newItemCategory,
      status: "NOT_PICKED_UP",
      vendorPhone: newItemVendorPhone.trim() || undefined,
    });

    setNewItemName("");
    setNewItemVendorPhone("");
    setIsAddModalOpen(false);
  };

  const handleDeleteItem = (itemId: string, itemName: string) => {
    if (confirm(`Hapus "${itemName}" dari daftar logistik?`)) {
      deleteLogisticsItem(itemId);
    }
  };

  const sampleProofImages = [
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80",
  ];

  return (
    <div className="space-y-5">
      {/* Role Permission Alert if Read-Only */}
      {!canEdit && (
        <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-slate-300 flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong className="text-amber-300">Mode Pantau Lapangan:</strong> Anda masuk dengan peran{" "}
            <strong>{permissions.roleTitle}</strong>. Tombol update status inventaris dinonaktifkan demi keamanan.
          </span>
        </div>
      )}

      {/* Tab Switcher & Add Item Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("gear")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === "gear"
                ? "bg-violet-600/30 text-violet-300 border border-violet-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Alat & Pinjaman ({gearItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("food")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === "food"
                ? "bg-pink-600/30 text-pink-300 border border-pink-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Konsumsi & Katering ({foodItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("proof")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === "proof"
                ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Bukti Serah Terima ({verifiedItems.length})</span>
          </button>
        </div>

        {canEdit && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs font-bold gap-1.5 self-start sm:self-auto shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Barang / Konsumsi</span>
          </Button>
        )}
      </div>

      {/* Tab 1: Gear & Tools */}
      {activeTab === "gear" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gearItems.map((item) => {
            const pic = event.members.find((m) => m.id === item.picId);
            const statusConfig = getItemStatusConfig(item.status, item.category);

            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-4 sm:p-5 border border-white/5 hover:border-violet-500/30 transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${statusConfig.badgeClass}`}
                      >
                        {statusConfig.label}
                      </span>
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Hapus Barang"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mt-2 leading-snug">
                    {item.name}
                  </h3>
                  {pic && (
                    <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                      <span className="text-slate-400">PIC Peminjam:</span>
                      <span className="font-semibold text-violet-300">{pic.name}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-2 flex-wrap">
                  {/* Status pipeline selector */}
                  <div className="flex items-center gap-1">
                    {(["NOT_PICKED_UP", "ON_THE_WAY", "DELIVERED", "RETURNED"] as ItemStatus[]).map(
                      (st) => (
                        <button
                          key={st}
                          disabled={!canEdit}
                          onClick={() => handleStatusChange(item.id, st)}
                          className={`text-[10px] px-2 py-1 rounded-lg border transition-all ${
                            !canEdit ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                          } ${
                            item.status === st
                              ? "bg-violet-600 text-white border-violet-400 font-bold"
                              : "bg-slate-900/60 text-slate-400 border-white/5 hover:text-white"
                          }`}
                        >
                          {st === "NOT_PICKED_UP" && "Belum"}
                          {st === "ON_THE_WAY" && "Jalan"}
                          {st === "DELIVERED" && "Tiba"}
                          {st === "RETURNED" && "Kembali"}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    disabled={!canEdit}
                    onClick={() => {
                      setSelectedItemForProof(item.id);
                      setProofUrlInput(item.photoProof || "");
                    }}
                    className={`inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 ${
                      !canEdit ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{item.photoProof ? "Lihat/Ubah Foto" : "Unggah Bukti"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Food & Consumption */}
      {activeTab === "food" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {foodItems.map((item) => {
            const pic = event.members.find((m) => m.id === item.picId);
            const statusConfig = getItemStatusConfig(item.status, item.category);

            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-4 sm:p-5 border border-white/5 hover:border-pink-500/30 transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-pink-950/40 text-pink-300 border border-pink-500/20">
                      Konsumsi Acara
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${statusConfig.badgeClass}`}
                      >
                        {statusConfig.label}
                      </span>
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Hapus Konsumsi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mt-2 leading-snug">
                    {item.name}
                  </h3>
                  {pic && (
                    <p className="text-xs text-slate-300 mt-1">
                      PIC: <span className="font-semibold text-pink-300">{pic.name}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-3 border-t border-white/5">
                  {/* Pipeline Quick Buttons */}
                  <div className="grid grid-cols-4 gap-1">
                    {(["NOT_PICKED_UP", "ON_THE_WAY", "DELIVERED", "RETURNED"] as ItemStatus[]).map(
                      (st) => (
                        <button
                          key={st}
                          disabled={!canEdit}
                          onClick={() => handleStatusChange(item.id, st)}
                          className={`text-[10px] py-1.5 px-1 rounded-lg border text-center transition-all font-medium ${
                            !canEdit ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                          } ${
                            item.status === st
                              ? "bg-pink-600 text-white border-pink-400 shadow-sm"
                              : "bg-slate-900/60 text-slate-400 border-white/5 hover:text-white"
                          }`}
                        >
                          {st === "NOT_PICKED_UP" && "1. Belum"}
                          {st === "ON_THE_WAY" && "2. Menuju"}
                          {st === "DELIVERED" && "3. Sampai"}
                          {st === "RETURNED" && "4. Dibagikan"}
                        </button>
                      )
                    )}
                  </div>

                  {item.vendorPhone && (
                    <a
                      href={`https://wa.me/${item.vendorPhone.replace(/\+/g, "")}?text=Halo%20Vendor%2C%20konfirmasi%20status%20pesanan%20Basecamp%20Lite`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Hubungi Vendor via WhatsApp ({item.vendorPhone})</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Proof Gallery */}
      {activeTab === "proof" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {verifiedItems.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-2xl overflow-hidden border border-white/10 group"
              >
                <div className="h-44 w-full bg-slate-900 relative overflow-hidden">
                  {item.photoProof && (
                    <img
                      src={item.photoProof}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 text-emerald-400 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Terverifikasi
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-mono text-slate-400">{item.category}</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{item.name}</h4>
                  <button
                    disabled={!canEdit}
                    onClick={() => {
                      setSelectedItemForProof(item.id);
                      setProofUrlInput(item.photoProof || "");
                    }}
                    className={`mt-3 text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 ${
                      !canEdit ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    Ganti Foto Serah Terima <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {verifiedItems.length === 0 && (
            <div className="text-center py-12 glass-card rounded-2xl border border-white/5">
              <Camera className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Belum ada foto serah terima yang diunggah.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Quick Proof Upload */}
      <Modal
        isOpen={Boolean(selectedItemForProof)}
        onClose={() => setSelectedItemForProof(null)}
        title="📸 Unggah Bukti Serah Terima Logistik"
        description="Ambil foto atau masukkan URL foto barang pinjaman/pesanan sebagai bukti fisik di lapangan."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              URL Foto Bukti Serah Terima
            </label>
            <input
              type="text"
              value={proofUrlInput}
              onChange={(e) => setProofUrlInput(e.target.value)}
              placeholder="https://... atau pilih sampel di bawah"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <span className="block text-[11px] text-slate-400 mb-2 font-medium">
              Atau pilih sampel foto verifikasi cepat:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {sampleProofImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setProofUrlInput(img)}
                  className={`h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    proofUrlInput === img ? "border-cyan-400 scale-95" : "border-white/10 opacity-70"
                  }`}
                >
                  <img src={img} alt="sample" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedItemForProof(null)}
            >
              Batal
            </Button>
            <Button
              variant="cyan"
              size="sm"
              onClick={handleSaveProof}
              disabled={!proofUrlInput.trim()}
            >
              Simpan Bukti Verifikasi
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Add Logistics Item */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="➕ Tambah Barang / Konsumsi Acara"
        description="Masukkan perlengkapan fisik pinjaman atau pesanan katering untuk dipantau statusnya di hari-H."
      >
        <form onSubmit={handleAddItem} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nama Barang / Menu Konsumsi <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Contoh: Kabel HDMI 10m / Snack Box Katering 100 Porsi"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kategori
              </label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                <option value="Elektronik / Alat">Elektronik / Alat</option>
                <option value="Pinjaman Kampus">Pinjaman Kampus</option>
                <option value="Konsumsi">Konsumsi / Katering</option>
                <option value="Perlengkapan">Perlengkapan & Dekorasi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                No. WhatsApp Vendor / PIC
              </label>
              <input
                type="tel"
                value={newItemVendorPhone}
                onChange={(e) => setNewItemVendorPhone(e.target.value)}
                placeholder="+6281234567890"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-violet-500"
              />
            </div>
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
              variant="primary"
              size="md"
              type="submit"
              className="gap-1.5 font-bold"
            >
              <span>Simpan Barang</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
