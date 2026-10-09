"use client";

import React, { useState } from "react";
import { Coffee, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Task, TaskStatus } from "@/types";
import { TASK_STATUS_LABELS, ROLE_LABELS } from "@/lib/constants";
import { useEventStore } from "@/lib/store/use-event-store";
import { NudgeModal } from "@/components/tasks/NudgeModal";
import { Button } from "@/components/ui/Button";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { event, updateTaskStatus } = useEventStore();
  const [isNudgeOpen, setIsNudgeOpen] = useState(false);

  const assignee = event.members.find((m) => m.id === task.assigneeId);
  const statusInfo = TASK_STATUS_LABELS[task.status] || TASK_STATUS_LABELS.TODO;
  const roleInfo = assignee ? ROLE_LABELS[assignee.role] : null;

  return (
    <>
      <div className="glass-card rounded-2xl p-4 border border-white/5 hover:border-violet-500/30 transition-all flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.badgeClass}`}
            >
              {statusInfo.label}
            </span>

            {assignee && (
              <span className="text-[11px] text-slate-300 font-medium">
                {assignee.name}
              </span>
            )}
          </div>

          <h4 className="text-sm font-bold text-white mt-2 leading-snug">
            {task.title}
          </h4>

          {task.lastNudgeBy && (
            <p className="text-[11px] text-amber-300/80 mt-1 flex items-center gap-1 font-mono">
              <Coffee className="w-3 h-3 text-amber-400" />
              <span>{task.lastNudgeBy}</span>
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-white/5 gap-2">
          {/* Status quick select */}
          <select
            value={task.status}
            onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
            aria-label="Pilih status tugas"
            className="text-xs bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-slate-300 focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            <option value="TODO">Belum Dimulai</option>
            <option value="IN_PROGRESS">Sedang Dikerjakan</option>
            <option value="BLOCKED">Ada Kendala</option>
            <option value="DONE">Selesai</option>
          </select>

          {/* Nudge button */}
          {task.status !== "DONE" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNudgeOpen(true)}
              className="text-xs text-amber-300 border-amber-500/30 hover:bg-amber-500/10 min-h-[32px] px-2.5 py-1"
            >
              <Coffee className="w-3 h-3 text-amber-400" />
              <span>Ping Nudge</span>
            </Button>
          )}
        </div>
      </div>

      <NudgeModal
        task={task}
        isOpen={isNudgeOpen}
        onClose={() => setIsNudgeOpen(false)}
      />
    </>
  );
}
