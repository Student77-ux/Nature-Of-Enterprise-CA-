import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="grid grid-3">
          <div>
            <h2>Around the club</h2>
            <ul>
              <li><Link href="/fixtures">Fixtures and results</Link></li>
              <li><Link href="/venues">Pitches, parking and access</Link></li>
              <li><Link href="/noticeboard">Noticeboard</Link></li>
            </ul>
          </div>
          <div>
            <h2>Planning a match day</h2>
            <ul>
              <li><Link href="/predict">Attendance planner</Link></li>
              <li><Link href="/stats">Club numbers</Link></li>
              <li><Link href="/reminders">My reminders</Link></li>
            </ul>
          </div>
          <div>
            <h2>About this site</h2>
            <ul>
              <li><Link href="/accessibility">Accessibility statement</Link></li>
            </ul>
          </div>
        </div>

        <p className="fine">
          Tallaght Gaels CLG is a fictional club. Every fixture, result, attendance figure and
          noticeboard post on this site was generated for a college assessment (TU Dublin,
          DATAH1010). Nothing here describes a real person, a real club or a real match, and the
          site collects no personal data.
        </p>
      </div>
    </footer>
  );
}
