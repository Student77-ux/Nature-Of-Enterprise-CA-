import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h1>That page is not here</h1>
      <p className="lede">
        The link may be out of date, or the fixture may have been rescheduled. Everything on the
        site can be reached from the pages below.
      </p>
      <ul>
        <li><Link href="/fixtures">Fixtures</Link></li>
        <li><Link href="/venues">Pitches, parking and access</Link></li>
        <li><Link href="/noticeboard">Noticeboard</Link></li>
      </ul>
    </>
  );
}
