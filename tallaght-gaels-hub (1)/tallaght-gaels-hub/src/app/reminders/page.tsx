import type { Metadata } from "next";
import ReminderList, { type ReminderFixture } from "@/components/ReminderList";
import { allFixtures, formatDate } from "@/lib/fixtures";

export const metadata: Metadata = {
  title: "My reminders",
  description: "Fixtures you have saved on this device, with a countdown to throw-in.",
};

export default function RemindersPage() {
  const fixtures: ReminderFixture[] = allFixtures.map((f) => ({
    id: f.id,
    date: f.date,
    dateLabel: formatDate(f.date),
    throw_in: f.throw_in,
    team: f.team,
    opponent: f.opponent,
    competition: f.competition,
    venue: f.venue,
    band: f.prediction.band,
  }));

  return (
    <>
      <h1>My reminders</h1>
      <p className="lede">
        Fixtures you have saved, with how long you have left. These live in this browser only.
        Clearing your browser data clears them, and nothing is sent to the club.
      </p>
      <ReminderList fixtures={fixtures} />
    </>
  );
}
