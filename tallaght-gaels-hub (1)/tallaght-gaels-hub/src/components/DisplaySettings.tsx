"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Display settings.
 *
 * Three preferences, stored in localStorage and applied as attributes on the
 * <html> element so plain CSS can react to them. Nothing personal is stored:
 * the three values below are the entire contents.
 */

export type TextSize = "normal" | "large";
export type Contrast = "normal" | "high";
export type Motion = "full" | "reduced";

type Settings = { text: TextSize; contrast: Contrast; motion: Motion };

const DEFAULTS: Settings = { text: "normal", contrast: "normal", motion: "full" };
const STORAGE_KEY = "tgh-display-settings";

type Ctx = Settings & { update: (patch: Partial<Settings>) => void; reset: () => void };

const SettingsContext = createContext<Ctx | null>(null);

export function useDisplaySettings(): Ctx {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useDisplaySettings must be used inside DisplaySettingsProvider");
  return ctx;
}

export function DisplaySettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) });
    } catch {
      /* A blocked or full localStorage is not worth breaking the page over. */
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-text", settings.text);
    root.setAttribute("data-contrast", settings.contrast);
    root.setAttribute("data-motion", settings.motion);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  const update = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));
  const reset = () => setSettings(DEFAULTS);

  return (
    <SettingsContext.Provider value={{ ...settings, update, reset }}>
      {children}
    </SettingsContext.Provider>
  );
}
