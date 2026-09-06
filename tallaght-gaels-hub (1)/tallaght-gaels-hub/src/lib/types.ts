export type Match = {
  match_id: string;
  date: string;
  day_of_week: string;
  season: number;
  team: string;
  competition: string;
  opponent: string;
  venue: string;
  is_home: number;
  is_derby: number;
  is_weekend: number;
  is_championship: number;
  is_senior: number;
  throw_in_hour: number;
  temperature_c: number | "";
  rainfall_mm: number | "";
  promo_posts: number | "";
  home_form_points: number;
  score_for: string;
  score_against: string;
  result: "Win" | "Draw" | "Loss";
  attendance: number;
  split: "train" | "test";
};

export type Fixture = {
  id: string;
  date: string;
  throw_in: string;
  team: string;
  competition: string;
  opponent: string;
  venue: string;
  is_home: number;
  is_derby: number;
  is_weekend: number;
  is_championship: number;
  is_senior: number;
  throw_in_hour: number;
  forecast_temperature_c: number;
  forecast_rainfall_mm: number;
  promo_posts: number;
  home_form_points: number;
  notes: string;
};

export type Venue = {
  id: string;
  name: string;
  kind: "Pitch" | "Clubhouse" | "Indoor";
  address: string;
  eircodeArea: string;
  lat: number;
  lng: number;
  surfaces: string[];
  parking: string;
  accessible: boolean;
  accessNotes: string;
  publicTransport: string;
  facilities: string[];
};

export type Notice = {
  id: string;
  kind: string;
  title: string;
  body: string;
  postedOn: string;
  contactArea: string;
};

export type Article = {
  id: string;
  title: string;
  date: string;
  summary: string;
  tag: string;
};
