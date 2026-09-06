import type { Metadata } from "next";
import Link from "next/link";
import BarChart from "@/components/BarChart";
import ScatterChart from "@/components/ScatterChart";
import { MODEL_FIT } from "@/lib/model";
import {
  byCompetition,
  byOccasion,
  bySeason,
  byTeam,
  distribution,
  headline,
  testScatter,
} from "@/lib/stats";

export const metadata: Metadata = {
  title: "Club numbers",
  description:
    "What 240 recorded Tallaght Gaels match days say about who turns up, when, and why.",
};

export default function StatsPage() {
  return (
    <>
      <h1>Club numbers</h1>
      <p className="lede">
        Five seasons of match days, {headline.rows} in total. These are the figures the attendance
        model was fitted to, and they are worth reading on their own.
      </p>

      <dl className="stat-row" style={{ marginTop: "1.4rem" }}>
        <div className="stat">
          <dt>Match days recorded</dt>
          <dd>{headline.rows}</dd>
        </div>
        <div className="stat">
          <dt>Average crowd</dt>
          <dd>{headline.mean}</dd>
        </div>
        <div className="stat">
          <dt>Median crowd</dt>
          <dd>{headline.median}</dd>
        </div>
        <div className="stat">
          <dt>Range</dt>
          <dd style={{ fontSize: "1.25rem" }}>
            {headline.min}–{headline.max}
          </dd>
        </div>
      </dl>

      <p style={{ marginTop: "1.2rem" }}>
        {headline.missingReadings} of the {headline.rows} records are missing at least one weather
        or promotion reading. Rather than throw those match days away, each gap is filled with the
        median of the training rows, and the workbook shows exactly how many were affected.
      </p>

      <section className="section" aria-labelledby="who">
        <h2 id="who">Who draws a crowd</h2>
        <BarChart
          title="Average attendance by team"
          subtitle="Adult championship teams draw roughly twice what the underage sides do."
          bars={byTeam.map((r) => ({ label: r.label, value: r.average }))}
          categoryHeading="Team"
          valueHeading="Average attendance"
          unit="people"
        />
        <BarChart
          title="Average attendance by competition"
          subtitle="What is at stake matters more than who is playing."
          bars={byCompetition.map((r) => ({ label: r.label, value: r.average }))}
          categoryHeading="Competition"
          valueHeading="Average attendance"
          unit="people"
        />
      </section>

      <section className="section" aria-labelledby="when">
        <h2 id="when">When they turn up</h2>
        <BarChart
          title="Average attendance by occasion"
          subtitle="A local derby is the single biggest lift in the whole dataset."
          bars={byOccasion.map((r) => ({ label: r.label, value: r.average }))}
          categoryHeading="Occasion"
          valueHeading="Average attendance"
          unit="people"
        />
        <BarChart
          title="How attendance is spread"
          subtitle="Number of match days falling into each 100-person band."
          bars={distribution.map((r) => ({ label: r.label, value: r.matches }))}
          categoryHeading="Attendance band"
          valueHeading="Match days"
        />
        <BarChart
          title="Average attendance by season"
          subtitle="Steady across five seasons, which is why season is not used as a predictor."
          bars={bySeason.map((r) => ({ label: r.label, value: r.average }))}
          categoryHeading="Season"
          valueHeading="Average attendance"
          unit="people"
        />
      </section>

      <section className="section" aria-labelledby="model">
        <h2 id="model">How well the model does</h2>
        <p>
          The {headline.rows} records were split once, in advance, into {MODEL_FIT.trainRows}{" "}
          training rows and {MODEL_FIT.testRows} test rows. The model was fitted on the training
          rows only. Everything in the chart below is a fixture it had never seen.
        </p>
        <ScatterChart
          title="Predicted against actual attendance"
          subtitle={`R squared ${MODEL_FIT.testR2.toFixed(3)} on the test set, average miss ${Math.round(MODEL_FIT.testMae)} people.`}
          points={testScatter}
        />
        <div className="panel">
          <h3>The comparison that matters</h3>
          <p style={{ marginBottom: 0 }}>
            Guessing the long-run average for every fixture would be wrong by about{" "}
            {Math.round(MODEL_FIT.baselineRmse)} people. The model is wrong by about{" "}
            {Math.round(MODEL_FIT.testRmse)}. That is an improvement of{" "}
            {Math.round(MODEL_FIT.improvementOverBaseline * 100)} per cent, and it is the number
            worth quoting, because a model that cannot beat the average is not worth running.{" "}
            <Link href="/predict">Try it on a fixture of your own</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
