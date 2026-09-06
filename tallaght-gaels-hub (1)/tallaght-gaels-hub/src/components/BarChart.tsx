import type { ReactNode } from "react";

export type Bar = { label: string; value: number };

/**
 * A bar chart drawn as inline SVG, with no charting library.
 *
 * The SVG is marked aria-hidden and the same numbers are repeated underneath in
 * a real table, so a screen reader gets the data rather than a description of a
 * picture. Colour is never the only thing carrying meaning: every bar is
 * labelled and every value is printed.
 */
export default function BarChart({
  title,
  subtitle,
  unit,
  bars,
  categoryHeading = "Category",
  valueHeading = "Value",
  children,
}: {
  title: string;
  subtitle?: string;
  unit?: string;
  bars: Bar[];
  categoryHeading?: string;
  valueHeading?: string;
  children?: ReactNode;
}) {
  const rowHeight = 34;
  const gap = 8;
  const labelWidth = 152;
  const chartWidth = 640;
  const barArea = chartWidth - labelWidth - 60;
  const height = bars.length * (rowHeight + gap);
  const max = Math.max(...bars.map((b) => b.value), 1);

  return (
    <figure className="chart">
      <figcaption>{title}</figcaption>
      {subtitle && <p className="sub">{subtitle}</p>}

      <svg viewBox={`0 0 ${chartWidth} ${height}`} role="presentation" aria-hidden="true">
        {bars.map((bar, i) => {
          const y = i * (rowHeight + gap);
          const w = Math.max(2, (bar.value / max) * barArea);
          return (
            <g key={bar.label}>
              <text x={0} y={y + rowHeight / 2 + 5} fontSize="14" fill="#4d5f55">
                {bar.label.length > 22 ? `${bar.label.slice(0, 21)}…` : bar.label}
              </text>
              <rect
                x={labelWidth}
                y={y + 4}
                width={w}
                height={rowHeight - 8}
                fill="#0b4a31"
                rx="2"
              />
              <text
                x={labelWidth + w + 8}
                y={y + rowHeight / 2 + 5}
                fontSize="14"
                fontWeight="700"
                fill="#10201a"
              >
                {bar.value.toLocaleString("en-IE")}
              </text>
            </g>
          );
        })}
      </svg>

      <details className="data-table">
        <summary>Show the numbers behind this chart</summary>
        <div className="table-scroll">
          <table>
            <caption>{title}</caption>
            <thead>
              <tr>
                <th scope="col">{categoryHeading}</th>
                <th scope="col" className="num">
                  {valueHeading}
                  {unit ? ` (${unit})` : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {bars.map((bar) => (
                <tr key={bar.label}>
                  <th scope="row">{bar.label}</th>
                  <td className="num">{bar.value.toLocaleString("en-IE")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      {children}
    </figure>
  );
}
