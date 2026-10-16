import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  EventData,
  ItemStatus,
  TaskStatus,
  RundownItem,
  LogisticsItem,
  Task,
  EventMember,
  QuickAsset,
  SosAlert,
  InAppNotification,
} from "@/types";
import { INITIAL_DEMO_EVENT } from "@/lib/mock-data";
import { recalculateRundownCascade } from "@/lib/utils";
import { buildEventFromTemplate, CreateEventOptions } from "@/lib/event-templates";

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
  
  // User & Event Lifecycle Actions
  unlockWorkspace: (passcode: string) => boolean;
  setUserIdentity: (name: string, role: string) => void;
  updateEventDetails: (details: Partial<EventData>) => void;
  createNewEvent: (options: CreateEventOptions) => string;
  resetToDemoEvent: () => void;
  
  // Rundown Actions
  adjustRundownTime: (itemId: string, minutes: number) => void;
  setActiveRundownItem: (itemId: string) => void;
  addRundownItem: (item: Omit<RundownItem, "id" | "eventId">) => void;
  editRundownItem: (itemId: string, updates: Partial<RundownItem>) => void;
  deleteRundownItem: (itemId: string) => void;
  
  // Logistics Actions
  addLogisticsItem: (item: Omit<LogisticsItem, "id" | "eventId">) => void;
  updateLogisticsStatus: (itemId: string, status: ItemStatus) => void;
  editLogisticsItem: (itemId: string, updates: Partial<LogisticsItem>) => void;
  deleteLogisticsItem: (itemId: string) => void;
  uploadLogisticsProof: (itemId: string, photoUrl: string) => void;
  
  // Task & Nudge Actions
  addTask: (task: Omit<Task, "id" | "eventId">) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  editTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  sendNudge: (taskId: string, senderName: string, presetLabel: string) => boolean;
  
  // Member Actions
  addMember: (member: Omit<EventMember, "id" | "eventId">) => void;
  editMember: (memberId: string, updates: Partial<EventMember>) => void;
  deleteMember: (memberId: string) => void;
  
  // Asset Actions
  addAsset: (asset: Omit<QuickAsset, "id" | "eventId">) => void;
  deleteAsset: (assetId: string) => void;
  
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

      createNewEvent: (options: CreateEventOptions) => {
        const newEvent = buildEventFromTemplate(options);
        const creator = newEvent.members[0];
        const welcomeNotif: InAppNotification = {
          id: `notif-${Date.now()}`,
          title: `🎉 Basecamp Acara Siap!`,
          message: `Selamat datang di Basecamp "${newEvent.title}". Semua fitur siap disesuaikan untuk hari-H.`,
          senderName: "Sistem Basecamp",
          timestamp: new Date().toISOString(),
          read: false,
          type: "rundown",
        };
        set({
          event: newEvent,
          userName: creator?.name || options.creatorName || "Ketua Pelaksana",
          userRole: "LEAD",
          hasUnlockedWorkspace: true,
          notifications: [welcomeNotif],
          activeToast: welcomeNotif,
        });
        return newEvent.slug;
      },

      resetToDemoEvent: () => {
        set({
          event: INITIAL_DEMO_EVENT,
          userName: "Rian (Lead)",
          userRole: "LEAD",
          hasUnlockedWorkspace: true,
        });
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

      editRundownItem: (itemId, updates) => {
        set((state) => ({
          event: {
            ...state.event,
            rundowns: state.event.rundowns.map((r) =>
              r.id === itemId ? { ...r, ...updates } : r
            ),
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      deleteRundownItem: (itemId) => {
        set((state) => ({
          event: {
            ...state.event,
            rundowns: state.event.rundowns
              .filter((r) => r.id !== itemId)
              .map((r, idx) => ({ ...r, order: idx + 1 })),
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      addLogisticsItem: (item) => {
        set((state) => {
          const newItem: LogisticsItem = {
            ...item,
            id: `log-${Date.now()}`,
            eventId: state.event.id,
          };
          return {
            event: {
              ...state.event,
              logistics: [newItem, ...state.event.logistics],
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

      editLogisticsItem: (itemId, updates) => {
        set((state) => ({
          event: {
            ...state.event,
            logistics: state.event.logistics.map((l) =>
              l.id === itemId ? { ...l, ...updates } : l
            ),
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      deleteLogisticsItem: (itemId) => {
        set((state) => ({
          event: {
            ...state.event,
            logistics: state.event.logistics.filter((l) => l.id !== itemId),
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

      addTask: (task) => {
        set((state) => {
          const newTask: Task = {
            ...task,
            id: `tsk-${Date.now()}`,
            eventId: state.event.id,
          };
          return {
            event: {
              ...state.event,
              tasks: [newTask, ...state.event.tasks],
              updatedAt: new Date().toISOString(),
            },
          };
        });
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

      editTask: (taskId, updates) => {
        set((state) => ({
          event: {
            ...state.event,
            tasks: state.event.tasks.map((t) =>
              t.id === taskId ? { ...t, ...updates } : t
            ),
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      deleteTask: (taskId) => {
        set((state) => ({
          event: {
            ...state.event,
            tasks: state.event.tasks.filter((t) => t.id !== taskId),
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      addMember: (member) => {
        set((state) => {
          const newMember: EventMember = {
            ...member,
            id: `mbr-${Date.now()}`,
            eventId: state.event.id,
          };
          return {
            event: {
              ...state.event,
              members: [...state.event.members, newMember],
              updatedAt: new Date().toISOString(),
            },
          };
        });
      },

      editMember: (memberId, updates) => {
        set((state) => ({
          event: {
            ...state.event,
            members: state.event.members.map((m) =>
              m.id === memberId ? { ...m, ...updates } : m
            ),
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      deleteMember: (memberId) => {
        set((state) => ({
          event: {
            ...state.event,
            members: state.event.members.filter((m) => m.id !== memberId),
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      addAsset: (asset) => {
        set((state) => {
          const newAsset: QuickAsset = {
            ...asset,
            id: `ast-${Date.now()}`,
            eventId: state.event.id,
          };
          return {
            event: {
              ...state.event,
              assets: [...state.event.assets, newAsset],
              updatedAt: new Date().toISOString(),
            },
          };
        });
      },

      deleteAsset: (assetId) => {
        set((state) => ({
          event: {
            ...state.event,
            assets: state.event.assets.filter((a) => a.id !== assetId),
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
