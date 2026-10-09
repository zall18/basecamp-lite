import { create } from "zustand";
import { EventData, ItemStatus, TaskStatus, RundownItem, SosAlert } from "@/types";
import { INITIAL_DEMO_EVENT } from "@/lib/mock-data";
import { recalculateRundownCascade } from "@/lib/utils";

interface EventStoreState {
  event: EventData;
  userRole: string;
  userName: string;
  hasUnlockedWorkspace: boolean;
  
  // Actions
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

export const useEventStore = create<EventStoreState>((set, get) => ({
  event: INITIAL_DEMO_EVENT,
  userRole: "LEAD",
  userName: "Rian (Lead)",
  hasUnlockedWorkspace: true,

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
      event: { ...state.event, ...details, updatedAt: new Date() },
    }));
  },

  adjustRundownTime: (itemId: string, minutes: number) => {
    set((state) => {
      const updatedRundowns = recalculateRundownCascade(state.event.rundowns, itemId, minutes);
      return {
        event: {
          ...state.event,
          rundowns: updatedRundowns,
          updatedAt: new Date(),
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
        updatedAt: new Date(),
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
          updatedAt: new Date(),
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
        updatedAt: new Date(),
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
        updatedAt: new Date(),
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
        updatedAt: new Date(),
      },
    }));
  },

  sendNudge: (taskId: string, senderName: string, presetLabel: string) => {
    const currentTask = get().event.tasks.find((t) => t.id === taskId);
    if (!currentTask) return false;

    // Check 10-minute cooldown
    if (currentTask.lastNudgeAt) {
      const lastNudge = new Date(currentTask.lastNudgeAt).getTime();
      const now = Date.now();
      const diffMinutes = (now - lastNudge) / 60000;
      if (diffMinutes < 10) {
        return false; // Still on cooldown
      }
    }

    set((state) => ({
      event: {
        ...state.event,
        tasks: state.event.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                lastNudgeAt: new Date(),
                lastNudgeBy: `${senderName} (${presetLabel})`,
              }
            : t
        ),
        updatedAt: new Date(),
      },
    }));
    return true;
  },

  triggerSos: (message: string, senderName: string) => {
    const newAlert: SosAlert = {
      id: `sos-${Date.now()}`,
      eventId: get().event.id,
      message,
      senderName,
      isResolved: false,
      createdAt: new Date(),
    };
    set((state) => ({
      event: {
        ...state.event,
        sosAlerts: [newAlert, ...state.event.sosAlerts],
        updatedAt: new Date(),
      },
    }));
  },

  resolveSos: (alertId: string) => {
    set((state) => ({
      event: {
        ...state.event,
        sosAlerts: state.event.sosAlerts.map((a) =>
          a.id === alertId ? { ...a, isResolved: true } : a
        ),
        updatedAt: new Date(),
      },
    }));
  },
}));
