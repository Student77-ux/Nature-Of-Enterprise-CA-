import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessibility statement",
  description:
    "How the Tallaght Community Sports Hub was built and tested for accessibility, and what is not fixed yet.",
};

export default function AccessibilityPage() {
  return (
    <>
      <h1>Accessibility statement</h1>
      <p className="lede">
        The site aims to meet WCAG 2.2 level AA. This page says what has been done, what was found
        in testing, and what is still outstanding.
      </p>

      <section className="section" aria-labelledby="built">
        <h2 id="built">What is built in</h2>
        <ul>
          <li>Every page can be operated with a keyboard alone, and the focus outline is always visible.</li>
          <li>A skip link jumps past the navigation to the main content.</li>
          <li>Headings run in order, one h1 per page, and landmarks mark the header, navigation, main content and footer.</li>
          <li>Every form field has a visible label, and errors are listed at the top of the form with links to the field that needs fixing.</li>
          <li>Charts are drawn as SVG and hidden from screen readers, with the same numbers underneath in a real table.</li>
          <li>Colour never carries meaning on its own. Every crowd band is named in words as well as coloured.</li>
          <li>Text reflows to a single column on a narrow screen and stays readable when zoomed to 200 per cent.</li>
        </ul>
      </section>

      <section className="section" aria-labelledby="settings">
        <h2 id="settings">Display settings</h2>
        <p>
          The <strong>Display settings</strong> button at the top of every page offers larger text,
          a high contrast palette, and an option to reduce movement. Choices are remembered on this
          device. If your phone or computer is already set to reduce motion, the site follows that
          without you changing anything.
        </p>
      </section>

      <section className="section" aria-labelledby="known">
        <h2 id="known">Known problems</h2>
        <ul>
          <li>
            The locator map on <Link href="/venues">Where to go</Link> is a rough diagram rather
            than a street map. It is marked decorative and every address is given in text, but it
            is not a substitute for a proper map.
          </li>
          <li>
            The predicted attendance table on the planner is wide, and on a small phone it scrolls
            sideways.
          </li>
          <li>
            The site has not been tested with a braille display.
          </li>
        </ul>
      </section>

      <section className="section" aria-labelledby="report">
        <h2 id="report">Tell us about a problem</h2>
        <p>
          If something on this site stops you doing what you came to do, post it on the{" "}
          <Link href="/noticeboard">noticeboard</Link> as a club notice, or tell any committee
          member. Please say which page and what happened.
        </p>
      </section>
    </>
  );
}
