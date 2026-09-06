import type { Metadata } from "next";
import FixtureBrowser, { type BrowserFixture } from "@/components/FixtureBrowser";
import { COMPETITIONS, TEAMS, dayAndDate, formatDate, upcomingFixtures } from "@/lib/fixtures";

export const metadata: Metadata = {
  title: "Fixtures",
  description:
    "Every upcoming Tallaght Gaels fixture, with search, filters and an expected crowd for each one.",
};

export default function FixturesPage() {
  const { list, isArchive } = upcomingFixtures();

  const fixtures: BrowserFixture[] = list.map((f) => {
    const { day, num, month } = dayAndDate(f.date);
    return {
      id: f.id,
      date: f.date,
      dateLong: formatDate(f.date),
      day,
      num,
      month,
      throw_in: f.throw_in,
      team: f.team,
      opponent: f.opponent,
      competition: f.competition,
      venue: f.venue,
      isHome: f.is_home === 1,
      isDerby: f.is_derby === 1,
      band: f.prediction.band,
      low: f.prediction.low,
      high: f.prediction.high,
    };
  });

  return (
    <>
      <h1>Fixtures</h1>
      <p className="lede">
        Search by opponent, filter by team or competition, and save anything you want a reminder
        about. The expected crowd on each fixture is a prediction, not a ticket count.
      </p>

      {isArchive && (
        <p className="panel">
          The published season has finished, so this is the full list on record rather than what is
          still to come.
        </p>
      )}

      <FixtureBrowser fixtures={fixtures} teams={TEAMS} competitions={COMPETITIONS} />
    </>
  );
}
