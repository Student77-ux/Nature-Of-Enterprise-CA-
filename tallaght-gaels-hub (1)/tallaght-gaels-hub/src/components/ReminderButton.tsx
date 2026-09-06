"use client";

import { useEffect, useState } from "react";

const KEY = "tgh-reminders";

export function readReminders(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeReminders(ids: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event("tgh-reminders-changed"));
  } catch {
    /* ignore */
  }
}

export default function ReminderButton({
  fixtureId,
  label,
}: {
  fixtureId: string;
  label: string;
}) {
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSaved(readReminders().includes(fixtureId));
    setReady(true);
  }, [fixtureId]);

  const toggle = () => {
    const ids = readReminders();
    const next = ids.includes(fixtureId)
      ? ids.filter((id) => id !== fixtureId)
      : [...ids, fixtureId];
    writeReminders(next);
    setSaved(next.includes(fixtureId));
  };

  if (!ready) {
    return (
      <button type="button" className="btn secondary small" disabled>
        Remind me
      </button>
    );
  }

  return (
    <button type="button" className="btn secondary small" onClick={toggle} aria-pressed={saved}>
      {saved ? "Saved to my reminders" : "Remind me"}
      <span className="visually-hidden">: {label}</span>
    </button>
  );
}
