import { NextResponse } from "next/server";

/**
 * Noticeboard submissions.
 *
 * On Netlify this route handler is deployed as a serverless function by the
 * Next.js runtime, which is the "serverless backend" half of the stack. Netlify
 * Functions were chosen over Supabase because this form does not need to store
 * anything: a submission is validated, optionally forwarded to the club's own
 * inbox, and then dropped. Storing nothing is the strongest possible answer to
 * "how long do you keep it and who can see it".
 *
 * Validation is repeated here even though the form validates in the browser,
 * because anything can POST to this URL.
 */

const KINDS = ["Lost and found", "Lift share", "Volunteering", "Club notice"];
const AREAS = [
  "Clubhouse",
  "Sean Walsh Park",
  "Killinarden Park",
  "Tymon Park North",
  "Brookfield community hall",
  "Jobstown handball alley",
];

type Body = { kind?: unknown; title?: unknown; body?: unknown; area?: unknown };

export async function POST(request: Request) {
  let payload: Body;
  try {
    payload = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Send JSON." }, { status: 400 });
  }

  const errors: string[] = [];
  const kind = typeof payload.kind === "string" ? payload.kind : "";
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const body = typeof payload.body === "string" ? payload.body.trim() : "";
  const area = typeof payload.area === "string" ? payload.area : "";

  if (!KINDS.includes(kind)) errors.push("kind must be one of the listed notice types");
  if (title.length < 5 || title.length > 90) errors.push("title must be 5 to 90 characters");
  if (body.length < 15 || body.length > 600) errors.push("body must be 15 to 600 characters");
  if (!AREAS.includes(area)) errors.push("area must be one of the listed club locations");

  if (errors.length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // Optional forwarding. Unset by default, in which case nothing leaves this
  // function and nothing is written to disk.
  const forwardUrl = process.env.NOTICE_FORWARD_URL;
  if (forwardUrl) {
    try {
      await fetch(forwardUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, title, body, area, receivedAt: new Date().toISOString() }),
      });
    } catch {
      // A failed forward is still a valid submission from the member's point of
      // view. It is logged for the club, not surfaced as an error to them.
      console.error("Noticeboard forward failed");
    }
  }

  return NextResponse.json({ ok: true, message: "Notice received." }, { status: 201 });
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Use POST to submit a notice." },
    { status: 405, headers: { Allow: "POST" } }
  );
}
