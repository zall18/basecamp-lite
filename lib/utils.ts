import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatRelativeMinutes(targetDate: Date | string): string {
  const d = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  const now = new Date();
  const diffMinutes = Math.round((d.getTime() - now.getTime()) / 60000);

  if (diffMinutes > 0) {
    return `${diffMinutes} menit lagi`;
  } else if (diffMinutes === 0) {
    return "Sekarang";
  } else {
    return `${Math.abs(diffMinutes)} menit yang lalu`;
  }
}

/**
 * Dynamic Overtime Recalculator
 * Cascades added minutes from a specific item downstream to subsequent rundown items.
 */
export function recalculateRundownCascade<
  T extends { id: string; startTime: Date | string; endTime: Date | string; order: number }
>(items: T[], activeItemId: string, addedMinutes: number): T[] {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const activeIndex = sorted.findIndex((item) => item.id === activeItemId);

  if (activeIndex === -1) return items;

  const msToAdd = addedMinutes * 60 * 1000;

  return sorted.map((item, index) => {
    if (index < activeIndex) {
      return item;
    }

    const currentStart = new Date(item.startTime).getTime();
    const currentEnd = new Date(item.endTime).getTime();

    if (index === activeIndex) {
      // Extend end time of the active item
      return {
        ...item,
        endTime: new Date(currentEnd + msToAdd),
      };
    } else {
      // Shift both start and end time of subsequent items
      return {
        ...item,
        startTime: new Date(currentStart + msToAdd),
        endTime: new Date(currentEnd + msToAdd),
      };
    }
  });
}
