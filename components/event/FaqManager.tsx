"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  MessageSquareQuote,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useEventStore } from "@/lib/store/use-event-store";
import { getRolePermissions } from "@/lib/permissions";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FaqItem } from "@/types";

export function FaqManager() {
  const { event, userRole, addFaq, editFaq, deleteFaq } = useEventStore();
  const permissions = getRolePermissions(userRole);
  const canEdit = permissions.canManageRundown; // Lead & Stage Event can manage public content

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const faqs = event.faqs || [];

  const handleOpenAdd = () => {
    setEditingFaqId(null);
    setQuestion("");
    setAnswer("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq: FaqItem) => {
    setEditingFaqId(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    if (editingFaqId) {
      editFaq(editingFaqId, {
        question: question.trim(),
        answer: answer.trim(),
      });
    } else {
      addFaq({
        question: question.trim(),
        answer: answer.trim(),
      });
    }

    setIsModalOpen(false);
    setEditingFaqId(null);
    setQuestion("");
    setAnswer("");
  };

  const handleDelete = (faqId: string, qText: string) => {
    if (confirm(`Hapus pertanyaan FAQ: "${qText}"?`)) {
      deleteFaq(faqId);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Editor FAQ & Informasi Publik Peserta
              </h3>
              <p className="text-xs text-slate-400">
                Informasi dan FAQ di bawah ini akan langsung tampil di halaman publik peserta.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <a
            href={`/e/${event.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-colors"
          >
            <span>Preview Publik</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </a>

          {canEdit && (
            <Button
              variant="cyan"
              size="sm"
              onClick={handleOpenAdd}
              className="text-xs font-bold gap-1.5 shadow-md shadow-cyan-950/40"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah FAQ</span>
            </Button>
          )}
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/20 transition-all group flex flex-col justify-between gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/50 text-cyan-300 border border-cyan-500/30 font-bold">
                    Q{index + 1}
                  </span>
                  <h4 className="text-sm font-bold text-white leading-snug">{faq.question}</h4>
                </div>
                <p className="text-xs text-slate-300 pl-7 leading-relaxed whitespace-pre-line">
                  {faq.answer}
                </p>
              </div>

              {canEdit && (
                <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(faq)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors cursor-pointer"
                    title="Edit FAQ"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(faq.id, faq.question)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Hapus FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {faqs.length === 0 && (
          <div className="text-center py-10 px-4 rounded-xl bg-slate-900/30 border border-dashed border-white/10 flex flex-col items-center">
            <MessageSquareQuote className="w-8 h-8 text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-slate-300">Belum ada pertanyaan FAQ untuk peserta</p>
            <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
              Tambahkan informasi penting seperti e-sertifikat, tata tertib, parkir venue, atau cara bertanya sesi Q&A.
            </p>
            {canEdit && (
              <Button
                variant="cyan"
                size="sm"
                onClick={handleOpenAdd}
                className="font-bold text-xs gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Pertanyaan Pertama</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal Add / Edit FAQ */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFaqId(null);
        }}
        title={editingFaqId ? "✏️ Edit Pertanyaan FAQ Peserta" : "➕ Tambah Pertanyaan FAQ Baru"}
        description="Informasi ini akan langsung tersinkronisasi ke halaman publik peserta tanpa perlu reload."
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Pertanyaan Peserta <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Contoh: Apakah panitia menyediakan sertifikat kehadiran?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Jawaban Panitia <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Contoh: Ya! Tautan klaim e-sertifikat akan dirilis panitia melalui formulir online di akhir acara."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingFaqId(null);
              }}
            >
              Batal
            </Button>
            <Button
              variant="cyan"
              size="md"
              type="submit"
              className="font-bold gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editingFaqId ? "Simpan Perubahan" : "Publikasikan FAQ"}</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
