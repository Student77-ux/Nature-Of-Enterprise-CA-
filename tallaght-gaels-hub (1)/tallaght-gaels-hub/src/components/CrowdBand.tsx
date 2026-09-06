import type { Band } from "@/lib/model";

const CLASS: Record<Band, string> = {
  Light: "band-light",
  Steady: "band-steady",
  Busy: "band-busy",
  "Very busy": "band-verybusy",
};

export default function CrowdBand({
  band,
  low,
  high,
  showRange = true,
}: {
  band: Band;
  low?: number;
  high?: number;
  showRange?: boolean;
}) {
  return (
    <span className={`chip solid ${CLASS[band]}`}>
      Expected crowd: {band}
      {showRange && low !== undefined && high !== undefined && (
        <span className="visually-hidden">
          , roughly {low} to {high} people
        </span>
      )}
    </span>
  );
}
