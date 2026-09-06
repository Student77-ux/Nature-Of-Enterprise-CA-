import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { DisplaySettingsProvider } from "@/components/DisplaySettings";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tallaght Community Sports Hub",
    template: "%s | Tallaght Community Sports Hub",
  },
  description:
    "Fixtures, pitches, parking and noticeboard for Tallaght Gaels CLG, a fictional GAA club in Dublin 24. Built for TU Dublin DATAH1010.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IE" data-text="normal" data-contrast="normal" data-motion="full">
      <body>
        <DisplaySettingsProvider>
          <a className="skip-link" href="#main">
            Skip to main content
          </a>
          <SiteHeader />
          <main id="main" tabIndex={-1}>
            <div className="shell">{children}</div>
          </main>
          <SiteFooter />
        </DisplaySettingsProvider>
      </body>
    </html>
  );
}
