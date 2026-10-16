"use client";

import React, { useState } from "react";
import { CheckSquare, Plus, Coffee, Filter } from "lucide-react";
import { useEventStore } from "@/lib/store/use-event-store";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function TasksPage() {
  const { event, addTask } = useEventStore();
  const [filterDivision, setFilterDivision] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [taskStatus, setTaskStatus] = useState<"TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE">("TODO");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      title: taskTitle.trim(),
      assigneeId: assigneeId || undefined,
      status: taskStatus,
    });

    setTaskTitle("");
    setAssigneeId("");
    setTaskStatus("TODO");
    setIsAddModalOpen(false);
  };

  const filteredTasks = event.tasks.filter((task) => {
    if (filterDivision === "ALL") return true;
    const assignee = event.members.find((m) => m.id === task.assigneeId);
    return assignee?.role === filterDivision;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === "TODO");
  const inProgressTasks = filteredTasks.filter((t) => t.status === "IN_PROGRESS");
  const blockedTasks = filteredTasks.filter((t) => t.status === "BLOCKED");
  const doneTasks = filteredTasks.filter((t) => t.status === "DONE");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-cyan-400" />
            <span>Tugas Panitia & Sistem Task Nudge</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola tugas operasional hari-H dan kirimkan ping santai (&ldquo;Kopi Dulu Bos&rdquo;, &ldquo;Any Update?&rdquo;) tanpa canggung.
          </p>
        </div>

        {/* Action Button & Division Filter */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="gap-1.5 font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tugas</span>
          </Button>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterDivision}
              onChange={(e) => setFilterDivision(e.target.value)}
              aria-label="Filter berdasarkan divisi panitia"
              className="text-xs bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              <option value="ALL">Semua Divisi</option>
              <option value="LEAD">BPH (Ketua)</option>
              <option value="STAGE_EVENT">Divisi Acara</option>
              <option value="LOGISTICS">Logistik & Perlengkapan</option>
              <option value="CONSUMPTION">Konsumsi</option>
              <option value="MEDIA_DOCS">PDD & Dokumentasi</option>
              <option value="PUBLIC_RELATIONS">Humas & Medpar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Column 1: Belum Dimulai */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Belum Dimulai ({todoTasks.length})
            </span>
          </div>
          <div className="space-y-3">
            {todoTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {todoTasks.length === 0 && (
              <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-xs text-slate-500">
                Tidak ada tugas
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Sedang Dikerjakan */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Sedang Dikerjakan ({inProgressTasks.length})
            </span>
          </div>
          <div className="space-y-3">
            {inProgressTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {inProgressTasks.length === 0 && (
              <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-xs text-slate-500">
                Tidak ada tugas
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Ada Kendala */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Ada Kendala ({blockedTasks.length})
            </span>
          </div>
          <div className="space-y-3">
            {blockedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {blockedTasks.length === 0 && (
              <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-xs text-slate-500">
                Tidak ada kendala
              </div>
            )}
          </div>
        </div>

        {/* Column 4: Selesai */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Selesai ({doneTasks.length})
            </span>
          </div>
          <div className="space-y-3">
            {doneTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {doneTasks.length === 0 && (
              <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-xs text-slate-500">
                Belum ada tugas selesai
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Add Task */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="➕ Tambah Tugas Operasional Baru"
        description="Buat checklist tugas hari-H dan delegasikan langsung ke anggota panitia."
      >
        <form onSubmit={handleAddTask} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Judul Tugas <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Contoh: Briefing Tim Konsumsi & Driver Katering"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                PIC / Penanggung Jawab
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                <option value="">-- Pilih Anggota Panitia --</option>
                {event.members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Status Awal
              </label>
              <select
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                <option value="TODO">Belum Dimulai</option>
                <option value="IN_PROGRESS">Sedang Dikerjakan</option>
                <option value="BLOCKED">Ada Kendala</option>
                <option value="DONE">Selesai</option>
              </select>
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
              <span>Simpan Tugas</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
