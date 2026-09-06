"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readReminders } from "./ReminderButton";
import type { Band } from "@/lib/model";

export type ReminderFixture = {
  id: string;
  date: string;
  dateLabel: string;
  throw_in: string;
  team: string;
  opponent: string;
  competition: string;
  venue: string;
  band: Band;
};

export default function ReminderList({ fixtures }: { fixtures: ReminderFixture[] }) {
  const [ids, setIds] = useState<string[] | null>(null);

  useEffect(() => {
    const sync = () => setIds(readReminders());
    sync();
    window.addEventListener("tgh-reminders-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("tgh-reminders-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const clearAll = () => {
    try {
      window.localStorage.removeItem("tgh-reminders");
    } catch {
      /* ignore */
    }
    setIds([]);
  };

  if (ids === null) {
    return <p>Checking this device for saved fixtures…</p>;
  }

  const saved = fixtures.filter((f) => ids.includes(f.id));

  if (saved.length === 0) {
    return (
      <div className="panel">
        <h2>Nothing saved yet</h2>
        <p>
          Open any fixture and choose <strong>Remind me</strong>. It will appear here, and this
          page will tell you how many days you have left.
        </p>
        <p style={{ marginBottom: 0 }}>
          <Link className="btn" href="/fixtures">
            Browse fixtures
          </Link>
        </p>
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <>
      <p className="result-count" aria-live="polite">
        {saved.length} fixture{saved.length === 1 ? "" : "s"} saved on this device.
      </p>

      {saved.map((f) => {
        const [y, m, d] = f.date.split("-").map(Number);
        const when = new Date(y, m - 1, d);
        const days = Math.round((when.getTime() - today.getTime()) / 86_400_000);
        const countdown =
          days > 1 ? `In ${days} days` : days === 1 ? "Tomorrow" : days === 0 ? "Today" : "Played";
        return (
          <article className="fixture" key={f.id}>
            <p className="when">
              <span className="dow">{countdown}</span>
              <span className="num">{d}</span>
              <span className="mon">{f.dateLabel.split(" ").slice(-2, -1)}</span>
            </p>
            <div>
              <h3>
                <Link href={`/fixtures/${f.id}`}>
                  {f.team} v {f.opponent}
                </Link>
              </h3>
              <p className="meta">
                {f.competition} · {f.dateLabel}, throw-in {f.throw_in} · {f.venue}
              </p>
            </div>
            <div className="right">
              <span className="chip">Expected crowd: {f.band}</span>
            </div>
          </article>
        );
      })}

      <p style={{ marginTop: "1.2rem" }}>
        <button type="button" className="btn secondary small" onClick={clearAll}>
          Remove all reminders
        </button>
      </p>
    </>
  );
}
