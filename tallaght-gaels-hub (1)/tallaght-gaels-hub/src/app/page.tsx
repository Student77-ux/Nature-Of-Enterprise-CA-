import Link from "next/link";
import { allFixtures, formatDate, news, notices, upcomingFixtures } from "@/lib/fixtures";
import { BAND_ADVICE } from "@/lib/model";
import { headline } from "@/lib/stats";
import CrowdBand from "@/components/CrowdBand";
import ReminderButton from "@/components/ReminderButton";

export default function HomePage() {
  const { list, isArchive } = upcomingFixtures();
  const next = list[0];
  const following = list.slice(1, 4);
  const latestNotices = [...notices]
    .sort((a, b) => b.postedOn.localeCompare(a.postedOn))
    .slice(0, 3);

  return (
    <>
      <h1>What is on at the club</h1>
      <p className="lede">
        Fixtures, pitches, parking and the noticeboard for Tallaght Gaels, in one place. Every
        fixture carries an expected crowd, so you know whether to come early for parking.
      </p>

      {isArchive && (
        <p className="panel" style={{ marginBottom: "1.4rem" }}>
          The published season has finished. The fixtures below are the most recent ones on record.
        </p>
      )}

      <section aria-labelledby="next-up" className="section" style={{ marginTop: "1.8rem" }}>
        <h2 id="next-up" className="visually-hidden">
          Next fixture
        </h2>
        <div className="scoreboard">
          <p className="kicker">Next up · {next.competition}</p>
          <div className="teams">
            <p className="club">{next.is_home ? "Tallaght Gaels" : next.opponent}</p>
            <span className="versus">v</span>
            <p className="club" style={{ textAlign: "right" }}>
              {next.is_home ? next.opponent : "Tallaght Gaels"}
            </p>
          </div>
          <dl>
            <div>
              <dt>Team</dt>
              <dd>{next.team}</dd>
            </div>
            <div>
              <dt>Throw-in</dt>
              <dd>{next.throw_in}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{formatDate(next.date, "short")}</dd>
            </div>
            <div>
              <dt>Venue</dt>
              <dd>{next.venue}</dd>
            </div>
            <div>
              <dt>Expected crowd</dt>
              <dd>
                {next.prediction.band} · {next.prediction.low}–{next.prediction.high}
              </dd>
            </div>
          </dl>
          <p style={{ color: "rgba(255,255,255,0.85)", maxWidth: "52ch" }}>
            {BAND_ADVICE[next.prediction.band]}
          </p>
          <p style={{ margin: 0, display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <Link className="btn" href={`/fixtures/${next.id}`} style={{ background: "#d98b17", borderColor: "#d98b17", color: "#10201a" }}>
              Match day details
            </Link>
            <ReminderButton fixtureId={next.id} label={`${next.team} v ${next.opponent}`} />
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="then">
        <h2 id="then">Then</h2>
        <ul style={{ listStyle: "none", margin: "1rem 0 0", padding: 0 }}>
          {following.map((f) => (
            <li key={f.id} className="fixture">
              <p className="when">
                <span className="dow">{formatDate(f.date, "short").split(" ")[0]}</span>
                <span className="num">{Number(f.date.slice(8, 10))}</span>
                <span className="mon">{formatDate(f.date, "short").split(" ")[2]}</span>
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
              </div>
              <div className="right">
                <CrowdBand band={f.prediction.band} low={f.prediction.low} high={f.prediction.high} />
              </div>
            </li>
          ))}
        </ul>
        <p style={{ marginTop: "1.1rem" }}>
          <Link className="btn secondary" href="/fixtures">
            See all {allFixtures.length} fixtures
          </Link>
        </p>
      </section>

      <section className="section" aria-labelledby="board">
        <h2 id="board">From the noticeboard</h2>
        <div className="grid grid-3" style={{ marginTop: "1rem" }}>
          {latestNotices.map((n) => (
            <article className="notice" key={n.id}>
              <p className="meta" style={{ marginBottom: "0.2rem" }}>
                {n.kind} · {formatDate(n.postedOn, "short")}
              </p>
              <h3 style={{ fontSize: "1.02rem" }}>{n.title}</h3>
              <p className="meta" style={{ marginBottom: 0 }}>
                {n.body}
              </p>
            </article>
          ))}
        </div>
        <p style={{ marginTop: "1.1rem" }}>
          <Link className="btn secondary" href="/noticeboard">
            Read the board or post a notice
          </Link>
        </p>
      </section>

      <section className="section" aria-labelledby="club-news">
        <h2 id="club-news">Club news</h2>
        <div className="grid grid-3" style={{ marginTop: "1rem" }}>
          {news.map((a) => (
            <article className="card" key={a.id}>
              <p className="meta" style={{ marginBottom: "0.2rem" }}>
                {a.tag} · {formatDate(a.date, "short")}
              </p>
              <h3 style={{ fontSize: "1.02rem" }}>{a.title}</h3>
              <p className="meta" style={{ marginBottom: 0 }}>
                {a.summary}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="numbers">
        <h2 id="numbers">The club by the numbers</h2>
        <p>
          The expected crowd on every fixture comes from a model fitted to{" "}
          {headline.rows} recorded match days across {headline.seasons} seasons.
        </p>
        <dl className="stat-row">
          <div className="stat">
            <dt>Match days on record</dt>
            <dd>{headline.rows}</dd>
          </div>
          <div className="stat">
            <dt>Average crowd</dt>
            <dd>{headline.mean}</dd>
          </div>
          <div className="stat">
            <dt>Biggest crowd</dt>
            <dd>{headline.max}</dd>
          </div>
          <div className="stat">
            <dt>Smallest crowd</dt>
            <dd>{headline.min}</dd>
          </div>
        </dl>
        <p style={{ marginTop: "1.2rem" }}>
          <Link className="btn secondary" href="/stats">
            Look at the numbers
          </Link>
        </p>
      </section>
    </>
  );
}
