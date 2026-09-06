"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SettingsPanel from "./SettingsPanel";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/venues", label: "Where to go" },
  { href: "/noticeboard", label: "Noticeboard" },
  { href: "/reminders", label: "My reminders" },
  { href: "/stats", label: "Club numbers" },
  { href: "/predict", label: "Attendance planner" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="masthead">
      <div className="shell masthead-top">
        <Link href="/" className="wordmark">
          <svg className="crest" viewBox="0 0 40 40" role="img" aria-label="Tallaght Gaels crest">
            <path d="M20 2 36 8v14c0 8-7 14-16 16C11 36 4 30 4 22V8z" fill="#d98b17" />
            <path d="M20 6 32 10.6V22c0 6.2-5.4 11-12 12.7C13.4 33 8 28.2 8 22V10.6z" fill="#0b4a31" />
            <path d="M20 12v14M13 19h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          <span>
            Tallaght Community Sports Hub
            <span className="sub">Tallaght Gaels CLG</span>
          </span>
        </Link>
        <SettingsPanel />
      </div>

      <nav className="nav" aria-label="Main">
        <div className="shell">
          <ul>
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} aria-current={isCurrent(link.href) ? "page" : undefined}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
