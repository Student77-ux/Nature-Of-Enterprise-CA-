export type Point = { predicted: number; actual: number };

/**
 * Predicted against actual attendance for the held-back test fixtures.
 * A perfect model would place every point on the diagonal.
 */
export default function ScatterChart({
  title,
  subtitle,
  points,
}: {
  title: string;
  subtitle?: string;
  points: Point[];
}) {
  const size = 460;
  const pad = 52;
  const values = points.flatMap((p) => [p.predicted, p.actual]);
  const lo = Math.floor(Math.min(...values, 0) / 100) * 100;
  const hi = Math.ceil(Math.max(...values) / 100) * 100;
  const scale = (v: number) => ((v - lo) / (hi - lo)) * (size - pad * 2);
  const x = (v: number) => pad + scale(v);
  const y = (v: number) => size - pad - scale(v);
  const ticks = [];
  for (let t = lo; t <= hi; t += 200) ticks.push(t);

  const errors = points.map((p) => Math.abs(p.actual - p.predicted));
  const within = errors.filter((e) => e <= 70).length;

  return (
    <figure className="chart">
      <figcaption>{title}</figcaption>
      {subtitle && <p className="sub">{subtitle}</p>}

      <svg viewBox={`0 0 ${size} ${size}`} role="presentation" aria-hidden="true">
        <line x1={pad} y1={size - pad} x2={size - pad} y2={size - pad} stroke="#4d5f55" />
        <line x1={pad} y1={pad} x2={pad} y2={size - pad} stroke="#4d5f55" />
        <line
          x1={x(lo)}
          y1={y(lo)}
          x2={x(hi)}
          y2={y(hi)}
          stroke="#d98b17"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        {ticks.map((t) => (
          <g key={t}>
            <text x={x(t)} y={size - pad + 18} fontSize="12" fill="#4d5f55" textAnchor="middle">
              {t}
            </text>
            <text x={pad - 8} y={y(t) + 4} fontSize="12" fill="#4d5f55" textAnchor="end">
              {t}
            </text>
          </g>
        ))}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={x(p.predicted)}
            cy={y(p.actual)}
            r="5"
            fill="#0b4a31"
            fillOpacity="0.62"
          />
        ))}
        <text x={size / 2} y={size - 8} fontSize="13" fill="#10201a" textAnchor="middle">
          Predicted attendance
        </text>
        <text
          x={14}
          y={size / 2}
          fontSize="13"
          fill="#10201a"
          textAnchor="middle"
          transform={`rotate(-90 14 ${size / 2})`}
        >
          Actual attendance
        </text>
      </svg>

      <p className="meta">
        Each dot is one of the {points.length} fixtures the model never saw during fitting. The
        dashed line is a perfect prediction. {within} of {points.length} fixtures land within 70
        people of the prediction, which is why the app shows a band rather than a single number.
      </p>

      <details className="data-table">
        <summary>Show the numbers behind this chart</summary>
        <div className="table-scroll">
          <table>
            <caption>Predicted and actual attendance for the {points.length} test fixtures</caption>
            <thead>
              <tr>
                <th scope="col">Fixture</th>
                <th scope="col" className="num">Predicted</th>
                <th scope="col" className="num">Actual</th>
                <th scope="col" className="num">Difference</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p, i) => (
                <tr key={i}>
                  <th scope="row">Test fixture {i + 1}</th>
                  <td className="num">{p.predicted}</td>
                  <td className="num">{p.actual}</td>
                  <td className="num">{p.actual - p.predicted > 0 ? "+" : ""}{p.actual - p.predicted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
