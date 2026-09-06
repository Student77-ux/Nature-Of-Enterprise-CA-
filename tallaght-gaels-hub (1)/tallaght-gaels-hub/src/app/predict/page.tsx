import type { Metadata } from "next";
import Link from "next/link";
import PredictForm from "@/components/PredictForm";
import { COEFFICIENTS, FEATURE_LABELS, FEATURE_ORDER, INTERCEPT, MODEL_FIT } from "@/lib/model";

export const metadata: Metadata = {
  title: "Attendance planner",
  description:
    "Estimate how many people will attend a Tallaght Gaels fixture, using a linear regression fitted to 240 recorded match days.",
};

export default function PredictPage() {
  return (
    <>
      <h1>Attendance planner</h1>
      <p className="lede">
        Stewards, parking and the clubhouse kitchen all have to be planned before anyone turns up.
        This is the club&rsquo;s best estimate of a crowd, and an honest account of how wrong it is
        likely to be.
      </p>

      <PredictForm />

      <section className="section" aria-labelledby="how">
        <h2 id="how">How the prediction is made</h2>
        <p>
          It is a multiple linear regression: ten features, each with a fixed weight, added to a
          starting figure of {Math.round(INTERCEPT)} people. Linear regression was chosen over
          anything more elaborate for one reason. The club committee has to be able to read the
          answer and argue with it, and a model whose entire logic fits in the table below can be
          argued with.
        </p>

        <div className="table-scroll">
          <table>
            <caption>
              The fitted model. Coefficients come from LINEST on the {MODEL_FIT.trainRows} training
              rows in the analysis workbook.
            </caption>
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col">What it measures</th>
                <th scope="col" className="num">Coefficient (people)</th>
              </tr>
            </thead>
            <tbody>
              {FEATURE_ORDER.map((f) => (
                <tr key={f}>
                  <th scope="row">{FEATURE_LABELS[f]}</th>
                  <td>
                    <code>{f}</code>
                  </td>
                  <td className="num">
                    {COEFFICIENTS[f] > 0 ? "+" : "−"}
                    {Math.abs(COEFFICIENTS[f]).toFixed(1)}
                  </td>
                </tr>
              ))}
              <tr>
                <th scope="row">Starting figure</th>
                <td>
                  <code>intercept</code>
                </td>
                <td className="num">+{INTERCEPT.toFixed(1)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="section" aria-labelledby="honest">
        <h2 id="honest">What it gets wrong</h2>
        <ul>
          <li>
            The data is fictional. It was generated for a college assessment, so the model is a
            demonstration of a method, not a forecast anybody should order food against.
          </li>
          <li>
            Weekend throw-in comes out at only +{Math.round(COEFFICIENTS.is_weekend)} people, which
            looks too small. Weekend matches almost always throw in near three o&rsquo;clock, so
            the throw-in time feature has already taken most of that credit. Two features carrying
            one effect between them is normal, and it is why a single coefficient should not be
            read on its own.
          </li>
          <li>
            Nothing in the model knows about a county final, a funeral, a clash with a Dublin
            match, or a burst water main on the Greenhills Road. Those are exactly the days the
            club most needs a warning about.
          </li>
          <li>
            It predicts a number for a crowd it has never counted precisely. The club records
            attendance by counting the gate, and the gate is not exact.
          </li>
        </ul>
        <p>
          The full analysis, including the training and test evaluation, is in the Excel workbook
          submitted with this project. <Link href="/stats">Club numbers</Link> shows the same
          figures on the site.
        </p>
      </section>
    </>
  );
}
