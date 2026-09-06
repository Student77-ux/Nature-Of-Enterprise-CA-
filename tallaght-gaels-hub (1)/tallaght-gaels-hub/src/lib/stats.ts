import { matches } from "./fixtures";
import type { Match } from "./types";
import { predictAttendance } from "./model";

/**
 * Aggregations for the Club numbers page. These run at build time on the
 * server, over the same 240 rows the Excel workbook analyses, so the figures
 * on the site and the figures in the spreadsheet always agree.
 */

export type GroupRow = { label: string; matches: number; average: number; max: number };

function groupBy(key: (m: Match) => string): GroupRow[] {
  const buckets = new Map<string, number[]>();
  for (const m of matches) {
    const k = key(m);
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k)!.push(m.attendance);
  }
  return Array.from(buckets.entries())
    .map(([label, values]) => ({
      label,
      matches: values.length,
      average: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      max: Math.max(...values),
    }))
    .sort((a, b) => b.average - a.average);
}

export const byTeam = groupBy((m) => m.team);
export const byCompetition = groupBy((m) => m.competition);
export const bySeason = groupBy((m) => String(m.season)).sort((a, b) =>
  a.label.localeCompare(b.label)
);

const OCCASIONS: { label: string; test: (m: Match) => boolean }[] = [
  { label: "Local derby", test: (m) => m.is_derby === 1 },
  { label: "Not a derby", test: (m) => m.is_derby === 0 },
  { label: "At home", test: (m) => m.is_home === 1 },
  { label: "Away", test: (m) => m.is_home === 0 },
  { label: "Weekend", test: (m) => m.is_weekend === 1 },
  { label: "Midweek", test: (m) => m.is_weekend === 0 },
];

export const byOccasion: GroupRow[] = OCCASIONS.map(({ label, test }) => {
  const values = matches.filter(test).map((m) => m.attendance);
  return {
    label,
    matches: values.length,
    average: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
    max: Math.max(...values),
  };
});

/** Attendance grouped into 100-person bands, for the distribution chart. */
export const distribution = (() => {
  const size = 100;
  const counts = new Map<number, number>();
  for (const m of matches) {
    const bucket = Math.floor(m.attendance / size) * size;
    counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([start, count]) => ({
      label: `${start}-${start + size - 1}`,
      matches: count,
      average: count,
      max: count,
    }));
})();

const attendances = matches.map((m) => m.attendance).sort((a, b) => a - b);

export const headline = {
  rows: matches.length,
  seasons: new Set(matches.map((m) => m.season)).size,
  mean: Math.round(attendances.reduce((a, b) => a + b, 0) / attendances.length),
  median: attendances[Math.floor(attendances.length / 2)],
  min: attendances[0],
  max: attendances[attendances.length - 1],
  missingReadings: matches.filter(
    (m) => m.temperature_c === "" || m.rainfall_mm === "" || m.promo_posts === ""
  ).length,
};

/** Actual against predicted for the 48 held-back test fixtures. */
export const testScatter = (() => {
  return matches
    .filter((m) => m.split === "test")
    .map((m) => ({
      actual: m.attendance,
      predicted: predictAttendance({
        is_home: m.is_home,
        is_derby: m.is_derby,
        is_weekend: m.is_weekend,
        is_championship: m.is_championship,
        is_senior: m.is_senior,
        promo_posts: m.promo_posts === "" ? 6 : m.promo_posts,
        rainfall_mm: m.rainfall_mm === "" ? 0.8 : m.rainfall_mm,
        temperature_c: m.temperature_c === "" ? 11.6 : m.temperature_c,
        home_form_points: m.home_form_points,
        throw_in_hour: m.throw_in_hour,
      }).predicted,
    }));
})();
