import fixturesData from "@/data/fixtures.json";
import matchesData from "@/data/matches.json";
import venuesData from "@/data/venues.json";
import noticesData from "@/data/notices.json";
import newsData from "@/data/news.json";
import type { Article, Fixture, Match, Notice, Venue } from "./types";
import { predictAttendance, type Prediction } from "./model";

export const fixtures = fixturesData as Fixture[];
export const matches = matchesData as Match[];
export const venues = venuesData as Venue[];
export const notices = noticesData as Notice[];
export const news = newsData as Article[];

export type FixtureWithPrediction = Fixture & { prediction: Prediction };

export function withPrediction(fixture: Fixture): FixtureWithPrediction {
  return {
    ...fixture,
    prediction: predictAttendance({
      is_home: fixture.is_home,
      is_derby: fixture.is_derby,
      is_weekend: fixture.is_weekend,
      is_championship: fixture.is_championship,
      is_senior: fixture.is_senior,
      promo_posts: fixture.promo_posts,
      rainfall_mm: fixture.forecast_rainfall_mm,
      temperature_c: fixture.forecast_temperature_c,
      home_form_points: fixture.home_form_points,
      throw_in_hour: fixture.throw_in_hour,
    }),
  };
}

export const allFixtures: FixtureWithPrediction[] = fixtures
  .map(withPrediction)
  .sort((a, b) => a.date.localeCompare(b.date));

export function getFixture(id: string): FixtureWithPrediction | undefined {
  return allFixtures.find((f) => f.id === id);
}

export function getVenueForFixture(fixture: Fixture): Venue | undefined {
  return venues.find((v) => v.name === fixture.venue);
}

/**
 * Fixtures still to be played. The season in the seed data runs from September
 * to November 2026; if that date has passed the whole list is returned rather
 * than an empty page, with the caller free to say so.
 */
export function upcomingFixtures(now = new Date()): {
  list: FixtureWithPrediction[];
  isArchive: boolean;
} {
  const today = now.toISOString().slice(0, 10);
  const list = allFixtures.filter((f) => f.date >= today);
  return list.length > 0
    ? { list, isArchive: false }
    : { list: allFixtures, isArchive: true };
}

export const TEAMS = Array.from(new Set(fixtures.map((f) => f.team))).sort();
export const COMPETITIONS = ["Championship", "League", "Cup", "Challenge"];

const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Formats a yyyy-mm-dd string without depending on the reader's locale. */
export function formatDate(iso: string, style: "long" | "short" = "long"): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const day = DAY[date.getUTCDay()];
  const month = MONTH[m - 1];
  return style === "long"
    ? `${day} ${d} ${month} ${y}`
    : `${day.slice(0, 3)} ${d} ${month.slice(0, 3)}`;
}

export function dayAndDate(iso: string): { day: string; num: number; month: string } {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return { day: DAY[date.getUTCDay()].slice(0, 3), num: d, month: MONTH[m - 1].slice(0, 3) };
}
