"use client";

import { useState } from "react";
import {
  BAND_ADVICE,
  MODEL_FIT,
  predictAttendance,
  type ModelInput,
} from "@/lib/model";

const DEFAULTS: ModelInput = {
  is_home: 1,
  is_derby: 0,
  is_weekend: 1,
  is_championship: 1,
  is_senior: 1,
  promo_posts: 6,
  rainfall_mm: 0.8,
  temperature_c: 13,
  home_form_points: 10,
  throw_in_hour: 15,
};

const BAND_CLASS: Record<string, string> = {
  Light: "band-light",
  Steady: "band-steady",
  Busy: "band-busy",
  "Very busy": "band-verybusy",
};

export default function PredictForm() {
  const [input, setInput] = useState<ModelInput>(DEFAULTS);
  const set = (patch: Partial<ModelInput>) => setInput((v) => ({ ...v, ...patch }));

  const result = predictAttendance(input);
  const ranked = [...result.contributions].sort(
    (a, b) => Math.abs(b.people) - Math.abs(a.people)
  );

  return (
    <div className="grid grid-2" style={{ alignItems: "start" }}>
      <div>
        <h2>Describe the fixture</h2>

        <fieldset
          style={{
            border: "1px solid var(--line)",
            borderRadius: "8px",
            padding: "0.8rem 1rem 1rem",
            marginBottom: "1.2rem",
          }}
        >
          <legend style={{ fontWeight: 700 }}>About the match</legend>

          <div className="check">
            <input
              id="p-home"
              type="checkbox"
              checked={input.is_home === 1}
              onChange={(e) => set({ is_home: e.target.checked ? 1 : 0 })}
            />
            <label htmlFor="p-home">Played at home</label>
          </div>
          <div className="check">
            <input
              id="p-derby"
              type="checkbox"
              checked={input.is_derby === 1}
              onChange={(e) => set({ is_derby: e.target.checked ? 1 : 0 })}
            />
            <label htmlFor="p-derby">Local derby (Killinarden, Jobstown, Firhouse, Fettercairn)</label>
          </div>
          <div className="check">
            <input
              id="p-champ"
              type="checkbox"
              checked={input.is_championship === 1}
              onChange={(e) => set({ is_championship: e.target.checked ? 1 : 0 })}
            />
            <label htmlFor="p-champ">Championship tie</label>
          </div>
          <div className="check">
            <input
              id="p-senior"
              type="checkbox"
              checked={input.is_senior === 1}
              onChange={(e) => set({ is_senior: e.target.checked ? 1 : 0 })}
            />
            <label htmlFor="p-senior">Adult team (rather than underage)</label>
          </div>
          <div className="check">
            <input
              id="p-weekend"
              type="checkbox"
              checked={input.is_weekend === 1}
              onChange={(e) => set({ is_weekend: e.target.checked ? 1 : 0 })}
            />
            <label htmlFor="p-weekend">Saturday or Sunday</label>
          </div>
        </fieldset>

        <div className="field">
          <label htmlFor="p-hour">Throw-in time</label>
          <span className="hint" id="p-hour-hint">
            On the hour, using the 24-hour clock. Currently {input.throw_in_hour}:00.
          </span>
          <input
            id="p-hour"
            type="range"
            min={10}
            max={21}
            step={1}
            value={input.throw_in_hour}
            aria-describedby="p-hour-hint"
            onChange={(e) => set({ throw_in_hour: Number(e.target.value) })}
          />
        </div>

        <div className="field">
          <label htmlFor="p-promo">Club social posts planned</label>
          <span className="hint" id="p-promo-hint">
            How many times the club will post about this fixture beforehand.
          </span>
          <input
            id="p-promo"
            type="number"
            min={0}
            max={20}
            value={input.promo_posts}
            aria-describedby="p-promo-hint"
            onChange={(e) => set({ promo_posts: Number(e.target.value) })}
          />
        </div>

        <div className="field">
          <label htmlFor="p-form">Points from the last five games</label>
          <span className="hint" id="p-form-hint">Between 0 and 15.</span>
          <input
            id="p-form"
            type="number"
            min={0}
            max={15}
            value={input.home_form_points}
            aria-describedby="p-form-hint"
            onChange={(e) => set({ home_form_points: Number(e.target.value) })}
          />
        </div>

        <div className="field">
          <label htmlFor="p-temp">Forecast temperature, in degrees Celsius</label>
          <input
            id="p-temp"
            type="number"
            min={-5}
            max={30}
            step={0.5}
            value={input.temperature_c}
            onChange={(e) => set({ temperature_c: Number(e.target.value) })}
          />
        </div>

        <div className="field">
          <label htmlFor="p-rain">Forecast rainfall, in millimetres</label>
          <input
            id="p-rain"
            type="number"
            min={0}
            max={25}
            step={0.1}
            value={input.rainfall_mm}
            onChange={(e) => set({ rainfall_mm: Number(e.target.value) })}
          />
        </div>

        <p>
          <button type="button" className="btn secondary" onClick={() => setInput(DEFAULTS)}>
            Reset the form
          </button>
        </p>
      </div>

      <div>
        <h2>What the model expects</h2>

        <div className="card" aria-live="polite">
          <p className="meta" style={{ marginBottom: "0.2rem" }}>
            Predicted attendance
          </p>
          <p
            style={{
              fontSize: "2.8rem",
              fontWeight: 800,
              margin: "0 0 0.2rem",
              color: "var(--pitch-deep)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {result.predicted.toLocaleString("en-IE")}
          </p>
          <p style={{ margin: "0 0 0.8rem" }}>
            Plan for somewhere between <strong>{result.low.toLocaleString("en-IE")}</strong> and{" "}
            <strong>{result.high.toLocaleString("en-IE")}</strong> people.
          </p>
          <p style={{ margin: "0 0 0.7rem" }}>
            <span className={`chip solid ${BAND_CLASS[result.band]}`}>
              Expected crowd: {result.band}
            </span>
          </p>
          <p style={{ marginBottom: 0 }}>{BAND_ADVICE[result.band]}</p>
        </div>

        <h3 style={{ marginTop: "1.6rem" }}>What is driving that number</h3>
        <p className="meta">
          Each row is the coefficient for that feature multiplied by the value you entered. They add
          up, along with a starting figure of 115 people, to the prediction above.
        </p>
        <div className="table-scroll">
          <table>
            <caption className="visually-hidden">
              Contribution of each feature to the predicted attendance
            </caption>
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col" className="num">Effect on the crowd</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((c) => (
                <tr key={c.feature}>
                  <th scope="row">{c.label}</th>
                  <td className="num">
                    {c.people >= 0 ? "+" : "−"}
                    {Math.abs(Math.round(c.people)).toLocaleString("en-IE")} people
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel" style={{ marginTop: "1.4rem" }}>
          <h3>How much to trust it</h3>
          <p style={{ marginBottom: 0 }}>
            On {MODEL_FIT.testRows} fixtures the model never saw while it was being fitted, it
            explained {Math.round(MODEL_FIT.testR2 * 100)} per cent of the variation in attendance
            and missed by an average of {Math.round(MODEL_FIT.testMae)} people. That is{" "}
            {Math.round(MODEL_FIT.improvementOverBaseline * 100)} per cent better than simply
            guessing the long-run average every time, but it is still a guess. Use the band, not the
            exact figure.
          </p>
        </div>
      </div>
    </div>
  );
}
