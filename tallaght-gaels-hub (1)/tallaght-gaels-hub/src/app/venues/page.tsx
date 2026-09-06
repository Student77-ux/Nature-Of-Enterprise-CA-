import type { Metadata } from "next";
import { venues } from "@/lib/fixtures";

export const metadata: Metadata = {
  title: "Where to go",
  description:
    "Every Tallaght Gaels pitch, hall and clubhouse, with parking, public transport and step-free access notes.",
};

/**
 * A small locator map drawn as SVG. The six venues are placed by converting
 * latitude and longitude to positions inside a bounding box. It is not a street
 * map, and it is marked decorative: the address, the transport note and the
 * link to a real map underneath each venue carry the information.
 */
function LocatorMap() {
  const pad = 26;
  const w = 640;
  const h = 340;
  const lats = venues.map((v) => v.lat);
  const lngs = venues.map((v) => v.lng);
  const minLat = Math.min(...lats) - 0.004;
  const maxLat = Math.max(...lats) + 0.004;
  const minLng = Math.min(...lngs) - 0.006;
  const maxLng = Math.max(...lngs) + 0.006;

  const x = (lng: number) => pad + ((lng - minLng) / (maxLng - minLng)) * (w - pad * 2);
  const y = (lat: number) => h - pad - ((lat - minLat) / (maxLat - minLat)) * (h - pad * 2);

  return (
    <figure className="chart">
      <figcaption>Where the club plays</figcaption>
      <p className="sub">
        Six locations across Tallaght and Templeogue. Full addresses are listed underneath.
      </p>
      <svg viewBox={`0 0 ${w} ${h}`} role="presentation" aria-hidden="true" className="map-frame">
        <rect x="0" y="0" width={w} height={h} fill="#eaefe9" />
        {venues.map((v) => (
          <g key={v.id}>
            <circle cx={x(v.lng)} cy={y(v.lat)} r="9" fill="#0b4a31" />
            <circle cx={x(v.lng)} cy={y(v.lat)} r="3.5" fill="#d98b17" />
            <text
              x={x(v.lng)}
              y={y(v.lat) - 15}
              fontSize="13"
              fontWeight="700"
              fill="#10201a"
              textAnchor="middle"
            >
              {v.name.replace(" pitches", "")}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}

export default function VenuesPage() {
  return (
    <>
      <h1>Where to go</h1>
      <p className="lede">
        Six places the club uses, with the practical details: where to park, which bus stops
        nearby, and whether you can get to the pitch without crossing grass.
      </p>

      <LocatorMap />

      <p className="result-count">{venues.length} locations</p>

      {venues.map((v) => (
        <section className="card" id={v.id} key={v.id} style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.25rem" }}>{v.name}</h2>
          <ul className="chip-row" style={{ marginBottom: "0.8rem" }}>
            <li className="chip">{v.kind}</li>
            <li className="chip">
              {v.accessible ? "Step-free access" : "Not step-free"}
            </li>
            {v.surfaces.map((s) => (
              <li className="chip" key={s}>
                {s}
              </li>
            ))}
          </ul>
          <p>{v.address}</p>
          <p>
            <strong>Parking.</strong> {v.parking}
          </p>
          <p>
            <strong>Public transport.</strong> {v.publicTransport}
          </p>
          <p>
            <strong>Access.</strong> {v.accessNotes}
          </p>
          <p>
            <strong>Facilities.</strong> {v.facilities.join(", ")}.
          </p>
          <p style={{ marginBottom: 0 }}>
            <a
              className="btn secondary small"
              href={`https://www.openstreetmap.org/?mlat=${v.lat}&mlon=${v.lng}#map=17/${v.lat}/${v.lng}`}
              rel="noreferrer noopener"
              target="_blank"
            >
              Open {v.name} on OpenStreetMap
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </p>
        </section>
      ))}
    </>
  );
}
