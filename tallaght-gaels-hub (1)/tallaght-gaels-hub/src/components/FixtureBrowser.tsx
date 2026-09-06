"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ReminderButton from "./ReminderButton";
import type { Band } from "@/lib/model";

export type BrowserFixture = {
  id: string;
  date: string;
  dateLong: string;
  day: string;
  num: number;
  month: string;
  throw_in: string;
  team: string;
  opponent: string;
  competition: string;
  venue: string;
  isHome: boolean;
  isDerby: boolean;
  band: Band;
  low: number;
  high: number;
};

const BAND_CLASS: Record<Band, string> = {
  Light: "band-light",
  Steady: "band-steady",
  Busy: "band-busy",
  "Very busy": "band-verybusy",
};

export default function FixtureBrowser({
  fixtures,
  teams,
  competitions,
}: {
  fixtures: BrowserFixture[];
  teams: string[];
  competitions: string[];
}) {
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("all");
  const [competition, setCompetition] = useState("all");
  const [venue, setVenue] = useState("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return fixtures.filter((f) => {
      if (team !== "all" && f.team !== team) return false;
      if (competition !== "all" && f.competition !== competition) return false;
      if (venue === "home" && !f.isHome) return false;
      if (venue === "away" && f.isHome) return false;
      if (!q) return true;
      return (
        f.opponent.toLowerCase().includes(q) ||
        f.team.toLowerCase().includes(q) ||
        f.venue.toLowerCase().includes(q) ||
        f.competition.toLowerCase().includes(q) ||
        f.dateLong.toLowerCase().includes(q)
      );
    });
  }, [fixtures, query, team, competition, venue]);

  const clear = () => {
    setQuery("");
    setTeam("all");
    setCompetition("all");
    setVenue("all");
  };

  const filtered = results.length !== fixtures.length;

  return (
    <>
      <div className="panel">
        <div className="filters">
          <div className="field">
            <label htmlFor="fixture-search">Search fixtures</label>
            <span className="hint" id="fixture-search-hint">
              Opponent, team, venue or month
            </span>
            <input
              id="fixture-search"
              type="search"
              value={query}
              aria-describedby="fixture-search-hint"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Killinarden"
            />
          </div>

          <div className="field">
            <label htmlFor="filter-team">Team</label>
            <select id="filter-team" value={team} onChange={(e) => setTeam(e.target.value)}>
              <option value="all">All teams</option>
              {teams.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="filter-comp">Competition</label>
            <select
              id="filter-comp"
              value={competition}
              onChange={(e) => setCompetition(e.target.value)}
            >
              <option value="all">All competitions</option>
              {competitions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="filter-venue">Home or away</label>
            <select id="filter-venue" value={venue} onChange={(e) => setVenue(e.target.value)}>
              <option value="all">Either</option>
              <option value="home">Home only</option>
              <option value="away">Away only</option>
            </select>
          </div>
        </div>

        {filtered && (
          <p style={{ margin: "0.9rem 0 0" }}>
            <button type="button" className="btn secondary small" onClick={clear}>
              Clear all filters
            </button>
          </p>
        )}
      </div>

      <p className="result-count" role="status" aria-live="polite">
        {results.length === fixtures.length
          ? `Showing all ${fixtures.length} fixtures.`
          : `${results.length} of ${fixtures.length} fixtures match.`}
      </p>

      {results.length === 0 ? (
        <div className="card">
          <h2>No fixtures match those filters</h2>
          <p>
            Try a wider search, or clear the filters to see the full list again. Fixtures are added
            as soon as the county board confirms them.
          </p>
          <button type="button" className="btn" onClick={clear}>
            Clear all filters
          </button>
        </div>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {results.map((f) => (
            <li key={f.id} className="fixture">
              <p className="when">
                <span className="dow">{f.day}</span>
                <span className="num">{f.num}</span>
                <span className="mon">{f.month}</span>
              </p>
              <div>
                <h3>
                  <Link href={`/fixtures/${f.id}`}>
                    {f.team} v {f.opponent}
                  </Link>
                </h3>
                <p className="meta">
                  {f.competition} · throw-in {f.throw_in} · {f.venue}
                </p>
                <ul className="chip-row">
                  <li className="chip">{f.isHome ? "Home" : "Away"}</li>
                  {f.isDerby && <li className="chip">Local derby</li>}
                </ul>
              </div>
              <div className="right">
                <span className={`chip solid ${BAND_CLASS[f.band]}`}>
                  Expected crowd: {f.band}
                </span>
                <ReminderButton fixtureId={f.id} label={`${f.team} v ${f.opponent}`} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
