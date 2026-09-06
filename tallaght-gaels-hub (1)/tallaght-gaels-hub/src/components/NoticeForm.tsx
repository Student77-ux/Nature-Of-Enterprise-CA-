"use client";

import { useRef, useState } from "react";

type Errors = Partial<Record<"kind" | "title" | "body" | "area", string>>;

const KINDS = ["Lost and found", "Lift share", "Volunteering", "Club notice"];
const AREAS = [
  "Clubhouse",
  "Sean Walsh Park",
  "Killinarden Park",
  "Tymon Park North",
  "Brookfield community hall",
  "Jobstown handball alley",
];

export default function NoticeForm() {
  const [kind, setKind] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [area, setArea] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const summaryRef = useRef<HTMLDivElement>(null);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!kind) e.kind = "Choose what kind of notice this is.";
    if (title.trim().length < 5) e.title = "Give the notice a title of at least 5 characters.";
    if (title.length > 90) e.title = "Keep the title to 90 characters or fewer.";
    if (body.trim().length < 15) e.body = "Add a few more details, at least 15 characters.";
    if (body.length > 600) e.body = "Keep the details to 600 characters or fewer.";
    if (!area) e.area = "Choose which part of the club this relates to.";
    return e;
  };

  const submit = async () => {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Move focus to the error summary so a keyboard or screen reader user is
      // told what went wrong rather than left at the bottom of the form.
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, title, body, area }),
      });
      setStatus(res.ok ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  };

  if (status === "sent") {
    return (
      <div className="success">
        <h2>Notice sent to the club</h2>
        <p>
          Thanks. A club volunteer reads the queue every evening and puts approved notices on the
          board. Nothing you typed is stored on this device.
        </p>
        <p style={{ marginBottom: 0 }}>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setKind("");
              setTitle("");
              setBody("");
              setArea("");
              setErrors({});
              setStatus("idle");
            }}
          >
            Post another notice
          </button>
        </p>
      </div>
    );
  }

  const errorList = Object.entries(errors) as [keyof Errors, string][];

  return (
    <div>
      {errorList.length > 0 && (
        <div
          className="error-summary"
          role="alert"
          tabIndex={-1}
          ref={summaryRef}
          aria-labelledby="error-summary-title"
        >
          <h2 id="error-summary-title">There is a problem</h2>
          <ul>
            {errorList.map(([field, message]) => (
              <li key={field}>
                <a href={`#notice-${field}`}>{message}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {status === "failed" && (
        <div className="error-summary" role="alert">
          <h2>The notice did not send</h2>
          <p style={{ marginBottom: 0 }}>
            The club server did not accept it. Check your connection and press Send again. Nothing
            was lost, your text is still in the form.
          </p>
        </div>
      )}

      <div className="field">
        <label htmlFor="notice-kind">What kind of notice is this?</label>
        <select
          id="notice-kind"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          aria-invalid={errors.kind ? true : undefined}
          aria-describedby={errors.kind ? "notice-kind-error" : undefined}
        >
          <option value="">Choose one</option>
          {KINDS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        {errors.kind && (
          <span className="field-error" id="notice-kind-error">
            {errors.kind}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="notice-title">Title</label>
        <span className="hint" id="notice-title-hint">
          One line, as someone scanning the board would read it.
        </span>
        <input
          id="notice-title"
          type="text"
          value={title}
          maxLength={120}
          onChange={(e) => setTitle(e.target.value)}
          aria-describedby={
            errors.title ? "notice-title-hint notice-title-error" : "notice-title-hint"
          }
          aria-invalid={errors.title ? true : undefined}
        />
        {errors.title && (
          <span className="field-error" id="notice-title-error">
            {errors.title}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="notice-body">Details</label>
        <span className="hint" id="notice-body-hint">
          Up to 600 characters. Please do not include anyone else&rsquo;s phone number or address.
        </span>
        <textarea
          id="notice-body"
          value={body}
          maxLength={700}
          onChange={(e) => setBody(e.target.value)}
          aria-describedby={
            errors.body ? "notice-body-hint notice-body-error" : "notice-body-hint"
          }
          aria-invalid={errors.body ? true : undefined}
        />
        {errors.body && (
          <span className="field-error" id="notice-body-error">
            {errors.body}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="notice-area">Which part of the club?</label>
        <select
          id="notice-area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          aria-invalid={errors.area ? true : undefined}
          aria-describedby={errors.area ? "notice-area-error" : undefined}
        >
          <option value="">Choose one</option>
          {AREAS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        {errors.area && (
          <span className="field-error" id="notice-area-error">
            {errors.area}
          </span>
        )}
      </div>

      <button type="button" className="btn" onClick={submit} disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send to the club"}
      </button>

      <p className="meta" style={{ marginTop: "1rem" }}>
        The form asks for no name, no email address and no phone number, so there is nothing on this
        page that could identify you.
      </p>
    </div>
  );
}
