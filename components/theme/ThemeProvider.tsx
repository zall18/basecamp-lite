"use client";

import React, { useEffect } from "react";
import { useEventStore } from "@/lib/store/use-event-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useEventStore();

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    if (theme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
  }, [theme]);

  return <>{children}</>;
}
