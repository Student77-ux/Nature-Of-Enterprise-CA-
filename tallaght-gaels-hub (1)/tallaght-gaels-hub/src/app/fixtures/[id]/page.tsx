import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CrowdBand from "@/components/CrowdBand";
import ReminderButton from "@/components/ReminderButton";
import {
  allFixtures,
  formatDate,
  getFixture,
  getVenueForFixture,
} from "@/lib/fixtures";
import { BAND_ADVICE, MODEL_FIT } from "@/lib/model";

export function generateStaticParams() {
  return allFixtures.map((f) => ({ id: f.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const fixture = getFixture(id);
  if (!fixture) return { title: "Fixture not found" };
  return {
    title: `${fixture.team} v ${fixture.opponent}`,
    description: `${fixture.competition} at ${fixture.venue} on ${formatDate(fixture.date)}, throw-in ${fixture.throw_in}.`,
  };
}

export default async function FixturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fixture = getFixture(id);
  if (!fixture) notFound();

  const venue = getVenueForFixture(fixture);
  const p = fixture.prediction;
  const drivers = [...p.contributions]
    .filter((c) => Math.abs(c.people) >= 10)
    .sort((a, b) => Math.abs(b.people) - Math.abs(a.people))
    .slice(0, 4);

  return (
    <>
      <p className="breadcrumb">
        <Link href="/fixtures">Fixtures</Link> <span aria-hidden="true">›</span>{" "}
        {fixture.team} v {fixture.opponent}
      </p>

      <h1>
        {fixture.team} v {fixture.opponent}
      </h1>
      <p className="lede">
        {fixture.competition} · {formatDate(fixture.date)} · throw-in {fixture.throw_in} ·{" "}
        {fixture.is_home ? "at home" : "away"}
      </p>

      <div className="grid grid-2" style={{ alignItems: "start", marginTop: "1.4rem" }}>
        <div>
          <div className="card">
            <h2>Match day</h2>
            <dl className="stat-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="stat">
                <dt>Venue</dt>
                <dd style={{ fontSize: "1.05rem" }}>{fixture.venue}</dd>
              </div>
              <div className="stat">
                <dt>Throw-in</dt>
                <dd style={{ fontSize: "1.05rem" }}>{fixture.throw_in}</dd>
              </div>
            </dl>
            <p style={{ marginTop: "1rem" }}>{fixture.notes}</p>
            <p style={{ marginBottom: 0, display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <ReminderButton
                fixtureId={fixture.id}
                label={`${fixture.team} v ${fixture.opponent}`}
              />
              {venue && (
                <Link className="btn secondary small" href={`/venues#${venue.id}`}>
                  Parking and access at {venue.name}
                </Link>
              )}
            </p>
          </div>

          {venue && (
            <div className="card" style={{ marginTop: "1rem" }}>
              <h2>Getting there</h2>
              <p>
                <strong>{venue.name}</strong>
                <br />
                {venue.address}
              </p>
              <p>
                <strong>Parking.</strong> {venue.parking}
              </p>
              <p>
                <strong>Public transport.</strong> {venue.publicTransport}
              </p>
              <p style={{ marginBottom: 0 }}>
                <strong>Access.</strong> {venue.accessNotes}
              </p>
            </div>
          )}
        </div>

        <div>
          <div className="card">
            <h2>Expected crowd</h2>
            <p style={{ margin: "0 0 0.6rem" }}>
              <CrowdBand band={p.band} low={p.low} high={p.high} showRange={false} />
            </p>
            <p
              style={{
                fontSize: "2.4rem",
                fontWeight: 800,
                margin: "0 0 0.1rem",
                color: "var(--pitch-deep)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {p.low}–{p.high}
            </p>
            <p className="meta">people, based on the model&rsquo;s typical margin of error</p>
            <p>{BAND_ADVICE[p.band]}</p>

            <h3>Why this fixture</h3>
            <ul>
              {drivers.map((d) => (
                <li key={d.feature}>
                  {d.label}: {d.people >= 0 ? "adds" : "takes off"}{" "}
                  {Math.abs(Math.round(d.people))} people
                </li>
              ))}
            </ul>

            <p className="meta" style={{ marginBottom: 0 }}>
              Predicted by a linear regression fitted to {MODEL_FIT.trainRows} past match days. On
              fixtures it had never seen it missed by {Math.round(MODEL_FIT.testMae)} people on
              average.{" "}
              <Link href="/predict">Try the planner with your own numbers</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
