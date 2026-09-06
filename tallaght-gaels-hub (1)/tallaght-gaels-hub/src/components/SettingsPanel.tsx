"use client";

import { useId, useState } from "react";
import { useDisplaySettings } from "./DisplaySettings";

export default function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const { text, contrast, motion, update, reset } = useDisplaySettings();

  return (
    <>
      <button
        type="button"
        className="settings-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true">Aa</span>
        Display settings
      </button>

      {open && (
        <div className="settings-panel" id={panelId}>
          <div className="shell">
            <h2 style={{ color: "#fff", fontSize: "1.05rem" }}>Display settings</h2>
            <div className="settings-grid">
              <fieldset>
                <legend>Text size</legend>
                <label>
                  <input
                    type="radio"
                    name="text-size"
                    checked={text === "normal"}
                    onChange={() => update({ text: "normal" })}
                  />
                  Normal
                </label>
                <label>
                  <input
                    type="radio"
                    name="text-size"
                    checked={text === "large"}
                    onChange={() => update({ text: "large" })}
                  />
                  Larger text
                </label>
              </fieldset>

              <fieldset>
                <legend>Contrast</legend>
                <label>
                  <input
                    type="radio"
                    name="contrast"
                    checked={contrast === "normal"}
                    onChange={() => update({ contrast: "normal" })}
                  />
                  Club colours
                </label>
                <label>
                  <input
                    type="radio"
                    name="contrast"
                    checked={contrast === "high"}
                    onChange={() => update({ contrast: "high" })}
                  />
                  High contrast
                </label>
              </fieldset>

              <fieldset>
                <legend>Motion</legend>
                <label>
                  <input
                    type="radio"
                    name="motion"
                    checked={motion === "full"}
                    onChange={() => update({ motion: "full" })}
                  />
                  Allow movement
                </label>
                <label>
                  <input
                    type="radio"
                    name="motion"
                    checked={motion === "reduced"}
                    onChange={() => update({ motion: "reduced" })}
                  />
                  Reduce movement
                </label>
              </fieldset>
            </div>
            <p className="settings-note">
              Your choices stay on this device. If your phone or computer is already set to reduce
              motion, the site follows that without you changing anything here.
            </p>
            <p style={{ margin: "0.8rem 0 0" }}>
              <button type="button" className="btn secondary small" onClick={reset}
                style={{ color: "#fff", borderColor: "rgba(255,255,255,0.6)" }}>
                Reset to defaults
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
