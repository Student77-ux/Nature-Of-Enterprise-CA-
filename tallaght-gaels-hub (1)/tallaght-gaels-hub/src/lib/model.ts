/**
 * The attendance model.
 *
 * These are the exact coefficients produced by LINEST on the 192 training rows
 * in Tallaght_Gaels_Attendance_Analysis.xlsx (sheet 'Regression', row 14). The
 * spreadsheet is the source of truth; this file is a copy so the app can run
 * the same arithmetic in the browser without shipping a 240-row fit.
 *
 * If the workbook is re-fitted, copy the new numbers in here.
 */

export const FEATURE_ORDER = [
  "is_home",
  "is_derby",
  "is_weekend",
  "is_championship",
  "is_senior",
  "promo_posts",
  "rainfall_mm",
  "temperature_c",
  "home_form_points",
  "hours_from_peak",
] as const;

export type FeatureName = (typeof FEATURE_ORDER)[number];

export const COEFFICIENTS: Record<FeatureName, number> = {
  is_home: 41.5,
  is_derby: 135.0,
  is_weekend: 17.4,
  is_championship: 122.1,
  is_senior: 276.5,
  promo_posts: 15.2,
  rainfall_mm: -14.3,
  temperature_c: 2.7,
  home_form_points: 7.3,
  hours_from_peak: -12.6,
};

export const INTERCEPT = 114.9;

/** Peak throw-in time. hours_from_peak counts hours either side of it. */
export const PEAK_HOUR = 15;

/** Root mean squared error on the 48 held-back test fixtures, in people. */
export const TEST_RMSE = 70;

export const MODEL_FIT = {
  trainRows: 192,
  testRows: 48,
  trainR2: 0.82,
  testR2: 0.831,
  testRmse: 69.9,
  testMae: 54.7,
  testMape: 0.114,
  baselineRmse: 170.2,
  improvementOverBaseline: 0.589,
};

export type ModelInput = {
  is_home: number;
  is_derby: number;
  is_weekend: number;
  is_championship: number;
  is_senior: number;
  promo_posts: number;
  rainfall_mm: number;
  temperature_c: number;
  home_form_points: number;
  throw_in_hour: number;
};

export type Band = "Light" | "Steady" | "Busy" | "Very busy";

export type Prediction = {
  predicted: number;
  low: number;
  high: number;
  band: Band;
  contributions: { feature: FeatureName; label: string; people: number }[];
};

export const FEATURE_LABELS: Record<FeatureName, string> = {
  is_home: "Playing at home",
  is_derby: "Local derby",
  is_weekend: "Weekend throw-in",
  is_championship: "Championship tie",
  is_senior: "Adult team",
  promo_posts: "Club social posts",
  rainfall_mm: "Rain forecast",
  temperature_c: "Temperature",
  home_form_points: "Recent form",
  hours_from_peak: "Throw-in time",
};

export function bandFor(predicted: number): Band {
  if (predicted < 300) return "Light";
  if (predicted < 500) return "Steady";
  if (predicted < 700) return "Busy";
  return "Very busy";
}

/** What each band means for the people who have to plan around it. */
export const BAND_ADVICE: Record<Band, string> = {
  Light: "A handful of stewards is plenty. One turnstile and the small urn.",
  Steady: "Normal match-day setup. Two stewards on the gate, both car parks open.",
  Busy: "Add a steward to the car park and open the second serving hatch.",
  "Very busy": "Full steward rota, overflow parking marshalled, and order in extra stock.",
};

export function predictAttendance(input: ModelInput): Prediction {
  const values: Record<FeatureName, number> = {
    is_home: input.is_home,
    is_derby: input.is_derby,
    is_weekend: input.is_weekend,
    is_championship: input.is_championship,
    is_senior: input.is_senior,
    promo_posts: input.promo_posts,
    rainfall_mm: input.rainfall_mm,
    temperature_c: input.temperature_c,
    home_form_points: input.home_form_points,
    hours_from_peak: Math.abs(input.throw_in_hour - PEAK_HOUR),
  };

  let total = INTERCEPT;
  const contributions = FEATURE_ORDER.map((feature) => {
    const people = COEFFICIENTS[feature] * values[feature];
    total += people;
    return { feature, label: FEATURE_LABELS[feature], people };
  });

  const predicted = Math.max(0, Math.round(total));
  return {
    predicted,
    low: Math.max(0, Math.round(predicted - TEST_RMSE)),
    high: Math.round(predicted + TEST_RMSE),
    band: bandFor(predicted),
    contributions,
  };
}
