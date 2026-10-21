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
  Trash2,
  Plus,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { useEventStore } from "@/lib/store/use-event-store";
import { getItemStatusConfig } from "@/lib/constants";
import { getRolePermissions } from "@/lib/permissions";
import { ItemStatus } from "@/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

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

  // Proof Modal State
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [proofMode, setProofMode] = useState<"existing" | "new">("new");
  const [selectedItemForProof, setSelectedItemForProof] = useState<string>("");
  const [proofPhotoUrl, setProofPhotoUrl] = useState("");
  const [newProofName, setNewProofName] = useState("");
  const [newProofCategory, setNewProofCategory] = useState("Elektronik / Alat");
  const [newProofPicId, setNewProofPicId] = useState("");
  const [fileError, setFileError] = useState("");

  // Add Item Modal State (Tab 1 / Tab 2)
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

  const openProofModalForNew = () => {
    setProofMode("new");
    setSelectedItemForProof("");
    setProofPhotoUrl("");
    setNewProofName("");
    setNewProofCategory("Elektronik / Alat");
    setNewProofPicId(event.members[0]?.id || "");
    setFileError("");
    setIsProofModalOpen(true);
  };

  const openProofModalForExisting = (itemId: string, currentPhoto?: string | null) => {
    setProofMode("existing");
    setSelectedItemForProof(itemId);
    setProofPhotoUrl(currentPhoto || "");
    setFileError("");
    setIsProofModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError("Format file harus berupa gambar (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError("Ukuran file maksimal 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProofPhotoUrl(reader.result as string);
    };
    reader.onerror = () => {
      setFileError("Gagal membaca file gambar.");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofPhotoUrl.trim()) {
      setFileError("Pilih atau ambil foto bukti serah terima terlebih dahulu.");
      return;
    }

    if (proofMode === "new" || event.logistics.length === 0) {
      if (!newProofName.trim()) {
        setFileError("Nama barang / serah terima wajib diisi.");
        return;
      }
      addLogisticsItem({
        name: newProofName.trim(),
        category: newProofCategory,
        status: "DELIVERED",
        photoProof: proofPhotoUrl.trim(),
        picId: newProofPicId || undefined,
      });
    } else {
      if (!selectedItemForProof) {
        setFileError("Pilih barang yang diserahterimakan dari daftar.");
        return;
      }
      uploadLogisticsProof(selectedItemForProof, proofPhotoUrl.trim());
    }

    setIsProofModalOpen(false);
    setProofPhotoUrl("");
    setNewProofName("");
    setSelectedItemForProof("");
  };

  const handleRemoveProof = (itemId: string, itemName: string) => {
    if (confirm(`Hapus foto bukti serah terima untuk "${itemName}"?`)) {
      uploadLogisticsProof(itemId, "");
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

      {/* Tab Switcher & Contextual Action Buttons */}
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

        {/* Action Button: Context-aware */}
        {canEdit && (
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {activeTab === "proof" ? (
              <Button
                variant="cyan"
                size="sm"
                onClick={openProofModalForNew}
                className="text-xs font-bold gap-1.5 shadow-md shadow-cyan-900/30"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Unggah Bukti Serah Terima</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="text-xs font-bold gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Barang / Konsumsi</span>
              </Button>
            )}
          </div>
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
                    onClick={() => openProofModalForExisting(item.id, item.photoProof)}
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

          {gearItems.length === 0 && (
            <div className="col-span-full text-center py-12 glass-card rounded-2xl border border-white/5">
              <Package className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Belum ada barang atau alat pinjaman yang dicatat.</p>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-3 text-xs text-violet-400 hover:underline font-semibold cursor-pointer"
                >
                  + Tambah Barang Pertama
                </button>
              )}
            </div>
          )}
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

                  <div className="flex items-center justify-between gap-2 pt-1">
                    {item.vendorPhone ? (
                      <a
                        href={`https://wa.me/${item.vendorPhone.replace(/\+/g, "")}?text=Halo%20Vendor%2C%20konfirmasi%20status%20pesanan%20Basecamp%20Lite`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Hubungi Vendor</span>
                      </a>
                    ) : (
                      <div />
                    )}

                    <button
                      disabled={!canEdit}
                      onClick={() => openProofModalForExisting(item.id, item.photoProof)}
                      className={`inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 ${
                        !canEdit ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{item.photoProof ? "Foto Ada" : "Unggah Bukti"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {foodItems.length === 0 && (
            <div className="col-span-full text-center py-12 glass-card rounded-2xl border border-white/5">
              <Utensils className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Belum ada pesanan konsumsi yang dicatat.</p>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-3 text-xs text-pink-400 hover:underline font-semibold cursor-pointer"
                >
                  + Tambah Konsumsi Pertama
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Proof Gallery */}
      {activeTab === "proof" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Dokumentasikan bukti fisik serah terima pinjaman kampus, vendor, atau katering di venue hari-H.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {verifiedItems.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-2xl overflow-hidden border border-white/10 group flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 w-full bg-slate-900 relative overflow-hidden">
                    {item.photoProof && (
                      <img
                        src={item.photoProof}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 text-emerald-400 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Terverifikasi
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1.5 leading-snug">{item.name}</h4>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-white/5">
                  <button
                    disabled={!canEdit}
                    onClick={() => openProofModalForExisting(item.id, item.photoProof)}
                    className={`text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 ${
                      !canEdit ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    Ganti Foto <ChevronRight className="w-3 h-3" />
                  </button>

                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProof(item.id, item.name)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Hapus Bukti Foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {verifiedItems.length === 0 && (
            <div className="text-center py-14 px-4 glass-card rounded-2xl border border-dashed border-cyan-500/30 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-3 shadow-lg shadow-cyan-950/40">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">Belum Ada Bukti Serah Terima</h3>
              <p className="text-xs text-slate-400 max-w-md mt-1 mb-5">
                Mulai dari template kosong atau belum sempat mencatat daftar logistik? Anda dapat langsung mengambil foto kamera atau mengunggah foto serah terima barang di lapangan sekarang.
              </p>
              {canEdit && (
                <Button
                  variant="cyan"
                  size="md"
                  onClick={openProofModalForNew}
                  className="font-bold gap-2 text-xs shadow-lg shadow-cyan-900/40"
                >
                  <Camera className="w-4 h-4" />
                  <span>📸 Unggah Bukti Serah Terima Pertama</span>
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal Comprehensive Proof Upload (Supports Blank Template & Existing Items) */}
      <Modal
        isOpen={isProofModalOpen}
        onClose={() => {
          setIsProofModalOpen(false);
          setFileError("");
        }}
        title="📸 Unggah Bukti Fisik Serah Terima"
        description="Ambil foto langsung kamera atau upload file gambar sebagai bukti serah terima barang/konsumsi di lapangan."
      >
        <form onSubmit={handleSaveProof} className="space-y-4 pt-1">
          {/* Mode Selector (Only show if there are existing logistics items) */}
          {event.logistics.length > 0 && (
            <div className="flex rounded-xl bg-slate-900 p-1 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setProofMode("existing")}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all cursor-pointer ${
                  proofMode === "existing"
                    ? "bg-cyan-600 text-white font-bold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Pilih Barang Terdaftar
              </button>
              <button
                type="button"
                onClick={() => setProofMode("new")}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all cursor-pointer ${
                  proofMode === "new"
                    ? "bg-cyan-600 text-white font-bold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                + Catat Barang Baru Lapangan
              </button>
            </div>
          )}

          {/* Mode 1: Pilih dari Barang yang Ada */}
          {proofMode === "existing" && event.logistics.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pilih Barang / Pesanan <span className="text-rose-400">*</span>
              </label>
              <select
                value={selectedItemForProof}
                onChange={(e) => setSelectedItemForProof(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="">-- Pilih Barang dari Daftar --</option>
                {event.logistics.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.category}) {item.photoProof ? "— [Sudah Ada Foto]" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Mode 2: Catat Barang Baru di Lapangan (Crucial for Blank Templates) */}
          {(proofMode === "new" || event.logistics.length === 0) && (
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-900/60 border border-white/10">
              <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Catat Serah Terima Baru di Lapangan</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Barang / Konsumsi Diserahterimakan <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newProofName}
                  onChange={(e) => setNewProofName(e.target.value)}
                  placeholder="Contoh: Kabel Roll 20m Aula / Nasi Kotak Katering 50 Box"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={newProofCategory}
                    onChange={(e) => setNewProofCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="Elektronik / Alat">Elektronik / Alat</option>
                    <option value="Konsumsi">Konsumsi / Katering</option>
                    <option value="Pinjaman Kampus">Pinjaman Kampus</option>
                    <option value="Perlengkapan">Perlengkapan & Dekorasi</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    PIC / Penerima
                  </label>
                  <select
                    value={newProofPicId}
                    onChange={(e) => setNewProofPicId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    {event.members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Photo File / Camera Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Foto Bukti Fisik <span className="text-rose-400">*</span>
            </label>

            {proofPhotoUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-950 max-h-56 group">
                <img
                  src={proofPhotoUrl}
                  alt="Preview Bukti"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <label className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" /> Ambil / Ganti Foto
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setProofPhotoUrl("")}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-cyan-950/10 hover:bg-cyan-950/20">
                <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-2">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-white">
                  Ambil Foto Kamera / Pilih Gambar dari Perangkat
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  Mendukung kamera HP langsung atau file JPG, PNG, WebP (Maksimal 5MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}

            {fileError && (
              <p className="text-xs text-rose-400 mt-1.5 font-medium">{fileError}</p>
            )}
          </div>

          {/* Quick Presets for Demo */}
          <div className="pt-1">
            <span className="block text-[11px] text-slate-400 mb-2 font-medium">
              Atau gunakan foto sampel cepat (1-klik demo):
            </span>
            <div className="grid grid-cols-3 gap-2">
              {sampleProofImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setProofPhotoUrl(img);
                    setFileError("");
                  }}
                  className={`h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    proofPhotoUrl === img ? "border-cyan-400 scale-95" : "border-white/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="sample" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => {
                setIsProofModalOpen(false);
                setFileError("");
              }}
            >
              Batal
            </Button>
            <Button
              variant="cyan"
              size="md"
              type="submit"
              disabled={!proofPhotoUrl}
              className="font-bold gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Simpan Bukti Verifikasi</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Add Logistics Item (Tab 1 & Tab 2) */}
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
