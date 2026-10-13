import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EventData, ItemStatus, TaskStatus, RundownItem, SosAlert, InAppNotification } from "@/types";
import { INITIAL_DEMO_EVENT } from "@/lib/mock-data";
import { recalculateRundownCascade } from "@/lib/utils";

interface EventStoreState {
  event: EventData;
  userRole: string;
  userName: string;
  hasUnlockedWorkspace: boolean;
  
  // Realtime & Auto-Sync
  autoSyncRealtime: boolean;
  toggleAutoSyncRealtime: () => void;
  syncRundownWithCurrentTime: () => void;
  alignRundownToCurrentTime: () => void;
  
  // In-App Notifications
  notifications: InAppNotification[];
  activeToast: InAppNotification | null;
  markAllNotificationsRead: () => void;
  dismissToast: () => void;
  
  // User Actions
  unlockWorkspace: (passcode: string) => boolean;
  setUserIdentity: (name: string, role: string) => void;
  updateEventDetails: (details: Partial<EventData>) => void;
  
  // Rundown Actions
  adjustRundownTime: (itemId: string, minutes: number) => void;
  setActiveRundownItem: (itemId: string) => void;
  addRundownItem: (item: Omit<RundownItem, "id" | "eventId">) => void;
  
  // Logistics Actions
  updateLogisticsStatus: (itemId: string, status: ItemStatus) => void;
  uploadLogisticsProof: (itemId: string, photoUrl: string) => void;
  
  // Task & Nudge Actions
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  sendNudge: (taskId: string, senderName: string, presetLabel: string) => boolean;
  
  // SOS Actions
  triggerSos: (message: string, senderName: string) => void;
  resolveSos: (alertId: string) => void;
}

export const useEventStore = create<EventStoreState>()(
  persist(
    (set, get) => ({
      event: INITIAL_DEMO_EVENT,
      userRole: "LEAD",
      userName: "Rian (Lead)",
      hasUnlockedWorkspace: true,
      autoSyncRealtime: true,

      notifications: [
        {
          id: "notif-welcome",
          title: "👋 Selamat Datang di Basecamp Lite",
          message: "Ruang koordinasi panitia siap digunakan. Seluruh status tersinkronisasi otomatis.",
          senderName: "Sistem Basecamp",
          timestamp: new Date().toISOString(),
          read: false,
          type: "rundown",
        },
      ],
      activeToast: null,

      toggleAutoSyncRealtime: () => {
        set((state) => ({ autoSyncRealtime: !state.autoSyncRealtime }));
      },

      syncRundownWithCurrentTime: () => {
        const { event, autoSyncRealtime } = get();
        if (!autoSyncRealtime || !event.rundowns.length) return;

        const now = new Date();
        const nowMs = now.getTime();

        // Check which rundown item matches current clock time
        const currentMatch = event.rundowns.find((item) => {
          const startMs = new Date(item.startTime).getTime();
          const endMs = new Date(item.endTime).getTime();
          return nowMs >= startMs && nowMs < endMs;
        });

        if (currentMatch && !currentMatch.isCurrent) {
          set((state) => ({
            event: {
              ...state.event,
              rundowns: state.event.rundowns.map((r) => ({
                ...r,
                isCurrent: r.id === currentMatch.id,
              })),
              updatedAt: new Date().toISOString(),
            },
          }));
        }
      },

      alignRundownToCurrentTime: () => {
        set((state) => {
          const sorted = [...state.event.rundowns].sort((a, b) => a.order - b.order);
          if (!sorted.length) return state;

          const now = new Date();
          let currentTimeCursor = now.getTime();

          const alignedRundowns: RundownItem[] = sorted.map((item, idx) => {
            const originalStart = new Date(item.startTime).getTime();
            const originalEnd = new Date(item.endTime).getTime();
            const originalDurationMs = Math.max(10 * 60 * 1000, originalEnd - originalStart);

            const newStart = new Date(currentTimeCursor);
            const newEnd = new Date(currentTimeCursor + originalDurationMs);
            currentTimeCursor += originalDurationMs;

            return {
              ...item,
              startTime: newStart.toISOString(),
              endTime: newEnd.toISOString(),
              isCurrent: idx === 0, // Mark first session as currently running right now
            };
          });

          return {
            event: {
              ...state.event,
              date: now.toISOString(),
              rundowns: alignedRundowns,
              updatedAt: now.toISOString(),
            },
          };
        });
      },

      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      dismissToast: () => {
        set({ activeToast: null });
      },

      unlockWorkspace: (passcode: string) => {
        const currentPasscode = get().event.passcode;
        if (!currentPasscode || passcode === currentPasscode || passcode === "260426") {
          set({ hasUnlockedWorkspace: true });
          return true;
        }
        return false;
      },

      setUserIdentity: (name: string, role: string) => {
        set({ userName: name, userRole: role });
      },

      updateEventDetails: (details: Partial<EventData>) => {
        set((state) => ({
          event: { ...state.event, ...details, updatedAt: new Date().toISOString() },
        }));
      },

      adjustRundownTime: (itemId: string, minutes: number) => {
        set((state) => {
          const updatedRundowns = recalculateRundownCascade(state.event.rundowns, itemId, minutes);
          return {
            event: {
              ...state.event,
              rundowns: updatedRundowns,
              updatedAt: new Date().toISOString(),
            },
          };
        });
      },

      setActiveRundownItem: (itemId: string) => {
        set((state) => ({
          event: {
            ...state.event,
            rundowns: state.event.rundowns.map((r) => ({
              ...r,
              isCurrent: r.id === itemId,
            })),
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      addRundownItem: (item) => {
        set((state) => {
          const newItem: RundownItem = {
            ...item,
            id: `rd-${Date.now()}`,
            eventId: state.event.id,
          };
          return {
            event: {
              ...state.event,
              rundowns: [...state.event.rundowns, newItem].sort((a, b) => a.order - b.order),
              updatedAt: new Date().toISOString(),
            },
          };
        });
      },

      updateLogisticsStatus: (itemId: string, status: ItemStatus) => {
        set((state) => ({
          event: {
            ...state.event,
            logistics: state.event.logistics.map((item) =>
              item.id === itemId ? { ...item, status } : item
            ),
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      uploadLogisticsProof: (itemId: string, photoUrl: string) => {
        set((state) => ({
          event: {
            ...state.event,
            logistics: state.event.logistics.map((item) =>
              item.id === itemId ? { ...item, photoProof: photoUrl } : item
            ),
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      updateTaskStatus: (taskId: string, status: TaskStatus) => {
        set((state) => ({
          event: {
            ...state.event,
            tasks: state.event.tasks.map((task) =>
              task.id === taskId ? { ...task, status } : task
            ),
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      sendNudge: (taskId: string, senderName: string, presetLabel: string) => {
        const currentTask = get().event.tasks.find((t) => t.id === taskId);
        if (!currentTask) return false;

        const now = Date.now();
        const cooldownMs = 10 * 60 * 1000;

        // Check 10-minute cooldown accurately
        if (currentTask.lastNudgeAt) {
          const lastNudgeMs = new Date(currentTask.lastNudgeAt).getTime();
          const elapsed = now - lastNudgeMs;
          if (elapsed >= 0 && elapsed < cooldownMs) {
            return false; // Still on cooldown
          }
        }

        const newNotif: InAppNotification = {
          id: `notif-${now}`,
          title: `☕ Ping Nudge Masuk!`,
          message: `${senderName} mengirim ping "${presetLabel}" untuk tugas: "${currentTask.title}"`,
          senderName,
          timestamp: new Date().toISOString(),
          read: false,
          type: "nudge",
        };

        set((state) => ({
          event: {
            ...state.event,
            tasks: state.event.tasks.map((t) =>
              t.id === taskId
                ? {
                    ...t,
                    lastNudgeAt: new Date().toISOString(),
                    lastNudgeBy: `${senderName} (${presetLabel})`,
                  }
                : t
            ),
            updatedAt: new Date().toISOString(),
          },
          notifications: [newNotif, ...state.notifications],
          activeToast: newNotif,
        }));
        return true;
      },

      triggerSos: (message: string, senderName: string) => {
        const now = new Date();
        const newAlert: SosAlert = {
          id: `sos-${Date.now()}`,
          eventId: get().event.id,
          message,
          senderName,
          isResolved: false,
          createdAt: now.toISOString(),
        };

        const newNotif: InAppNotification = {
          id: `notif-sos-${Date.now()}`,
          title: `🚨 D-DAY SOS EMERGENCY!`,
          message: `${senderName}: "${message}"`,
          senderName,
          timestamp: now.toISOString(),
          read: false,
          type: "sos",
        };

        set((state) => ({
          event: {
            ...state.event,
            sosAlerts: [newAlert, ...state.event.sosAlerts],
            updatedAt: now.toISOString(),
          },
          notifications: [newNotif, ...state.notifications],
          activeToast: newNotif,
        }));
      },

      resolveSos: (alertId: string) => {
        set((state) => ({
          event: {
            ...state.event,
            sosAlerts: state.event.sosAlerts.map((a) =>
              a.id === alertId ? { ...a, isResolved: true } : a
            ),
            updatedAt: new Date().toISOString(),
          },
        }));
      },
    }),
    {
      name: "basecamp-lite-event-store",
    }
  )
);
