"""
generate_dataset.py
-------------------
Creates the fictional match-day dataset for the Tallaght Gaels CLG club companion app.

ALL DATA IS FICTIONAL. Tallaght Gaels CLG is an invented club, the opponents are
invented clubs, and no row describes a real person or a real match.

The generator writes:
    data/matches.csv      240 historical match-day records (the analysis dataset)
    data/matches.json     the same records, used as seed data by the Next.js app
    data/fixtures.json    14 upcoming fixtures for the app (no attendance yet)

Run:  python generate_dataset.py
"""

import csv
import json
import random
from datetime import date, timedelta
from pathlib import Path

SEED = 42
random.seed(SEED)

OUT = Path(__file__).resolve().parent / "data"
OUT.mkdir(exist_ok=True)

# ---------------------------------------------------------------- reference data

TEAMS = {
    # team name              : (is_senior, pull factor)
    "Senior Hurling":        (1, 1.00),
    "Senior Football":       (1, 1.05),
    "Ladies Senior Football":(1, 0.78),
    "Senior Camogie":        (1, 0.72),
    "Minor Football":        (0, 0.46),
    "U16 Hurling":           (0, 0.34),
}

COMPETITIONS = {
    "Championship": 1.00,
    "League":       0.62,
    "Cup":          0.74,
    "Challenge":    0.38,
}
COMPETITION_WEIGHTS = [0.30, 0.42, 0.16, 0.12]

# Invented South Dublin club names - none of these are real clubs.
OPPONENTS = [
    "Killinarden Rovers", "Firhouse Emmets", "Jobstown Gaels", "Kilnamanagh Óg",
    "Springfield Harps", "Oldbawn St Brigid's", "Bohernabreena Rangers",
    "Templeogue Wanderers", "Greenhills Sarsfields", "Brookfield Éire Óg",
    "Fettercairn Celtic", "Rathcoole Shamrocks", "Saggart St Finian's",
    "Ballycragh Gaels", "Whitestown Éire Óg", "Knocklyon Pearses",
]
# Local rivals - these fixtures draw a bigger crowd.
DERBY_CLUBS = {"Killinarden Rovers", "Jobstown Gaels", "Firhouse Emmets", "Fettercairn Celtic"}

VENUES = ["Sean Walsh Park", "Killinarden Park", "Away Ground", "Tymon Park North"]

DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

# ---------------------------------------------------------------- generation

def month_weather(month: int):
    """Rough Dublin seasonality: mean temp (C) and mean daily rainfall (mm)."""
    temps = {1: 5.5, 2: 5.7, 3: 7.2, 4: 9.4, 5: 12.2, 6: 15.0,
             7: 16.6, 8: 16.3, 9: 14.2, 10: 11.2, 11: 7.9, 12: 6.1}
    rain = {1: 2.4, 2: 2.0, 3: 1.9, 4: 1.7, 5: 1.8, 6: 1.9,
            7: 2.1, 8: 2.4, 9: 2.2, 10: 2.6, 11: 2.7, 12: 2.6}
    return temps[month], rain[month]


def make_row(match_id: int, d: date) -> dict:
    team = random.choice(list(TEAMS))
    is_senior, pull = TEAMS[team]
    competition = random.choices(list(COMPETITIONS), weights=COMPETITION_WEIGHTS)[0]
    comp_factor = COMPETITIONS[competition]

    opponent = random.choice(OPPONENTS)
    is_derby = 1 if opponent in DERBY_CLUBS else 0

    is_home = random.choices([1, 0], weights=[0.55, 0.45])[0]
    venue = random.choice(["Sean Walsh Park", "Killinarden Park", "Tymon Park North"]) if is_home else "Away Ground"

    weekday = d.weekday()  # 0 = Monday
    is_weekend = 1 if weekday >= 5 else 0

    # Throw-in times: evenings midweek, afternoons at the weekend.
    throw_in_hour = random.choice([18, 19, 19, 20]) if not is_weekend else random.choice([11, 12, 14, 15, 15, 16])

    mean_t, mean_r = month_weather(d.month)
    temperature_c = round(random.gauss(mean_t, 2.6), 1)
    rainfall_mm = round(max(0.0, random.gauss(mean_r, 1.8) - 1.1), 1)

    # Club form over the previous five games, in league points (0-15).
    home_form_points = random.choices(range(0, 16), weights=[2,2,3,4,5,6,7,8,8,8,7,6,5,4,3,2])[0]

    # Promotional posts published by the club social media team for this fixture.
    promo_posts = max(0, int(random.gauss(4.2 + 3.0 * comp_factor + 1.4 * is_derby, 1.8)))

    # ---- the underlying "truth" the model has to recover -------------------
    attendance = (
        30
        + 470 * pull * comp_factor        # who is playing, and what is at stake
        + 85 * is_senior                  # adult teams draw more than underage
        + 55 * is_home                    # home advantage on the gate
        + 110 * is_derby                  # local derby
        + 60 * is_weekend                 # weekend throw-in
        + 8.5 * promo_posts               # promotion works
        - 19 * rainfall_mm                # rain keeps people at home
        + 3.6 * temperature_c             # mild evenings help
        + 6.5 * home_form_points          # winning teams draw crowds
        - 5.5 * abs(throw_in_hour - 15)   # mid-afternoon is the sweet spot
    )
    attendance = int(max(35, random.gauss(attendance, 52)))

    # Result, recorded in GAA scoring (goals-points).
    tg, tp = random.randint(0, 4), random.randint(4, 22)
    og, op = random.randint(0, 4), random.randint(4, 22)
    total_for, total_against = tg * 3 + tp, og * 3 + op
    result = "Win" if total_for > total_against else ("Loss" if total_for < total_against else "Draw")

    return {
        "match_id": f"M{match_id:04d}",
        "date": d.isoformat(),
        "day_of_week": DAY_NAMES[weekday],
        "season": d.year,
        "team": team,
        "competition": competition,
        "opponent": opponent,
        "venue": venue,
        "is_home": is_home,
        "is_derby": is_derby,
        "is_weekend": is_weekend,
        "is_championship": 1 if competition == "Championship" else 0,
        "is_senior": is_senior,
        "throw_in_hour": throw_in_hour,
        "temperature_c": temperature_c,
        "rainfall_mm": rainfall_mm,
        "promo_posts": promo_posts,
        "home_form_points": home_form_points,
        "score_for": f"{tg}-{tp:02d}",
        "score_against": f"{og}-{op:02d}",
        "result": result,
        "attendance": attendance,
    }


def build_rows(n: int = 240):
    rows = []
    d = date(2022, 2, 12)         # start of the 2022 club season
    for i in range(1, n + 1):
        rows.append(make_row(i, d))
        d += timedelta(days=random.choice([3, 4, 5, 5, 6, 7, 7, 8]))
        # Skip the closed season (December and January).
        if d.month in (12, 1):
            d = date(d.year + 1 if d.month == 12 else d.year, 2, random.randint(8, 20))
    return rows


def inject_missing(rows):
    """
    Real club records have gaps. Blank a small number of readings so the
    missing-value handling in the workbook has something to handle.
    """
    idx = list(range(len(rows)))
    for i in random.sample(idx, 14):
        rows[i]["temperature_c"] = ""
    for i in random.sample(idx, 8):
        rows[i]["rainfall_mm"] = ""
    for i in random.sample(idx, 5):
        rows[i]["promo_posts"] = ""
    return rows


def assign_split(rows, test_fraction: float = 0.2):
    """Fixed 80/20 train/test split, seeded so the result is reproducible."""
    order = list(range(len(rows)))
    random.Random(SEED).shuffle(order)
    n_test = int(round(len(rows) * test_fraction))
    test_ids = set(order[:n_test])
    for i, r in enumerate(rows):
        r["split"] = "test" if i in test_ids else "train"
    return rows


# ---------------------------------------------------------------- fixtures

def build_fixtures():
    """Upcoming fixtures for the app. Attendance is unknown - the model predicts it."""
    fixtures = []
    d = date(2026, 9, 12)
    for i in range(1, 15):
        team = random.choice(list(TEAMS))
        is_senior, _ = TEAMS[team]
        competition = random.choices(list(COMPETITIONS), weights=COMPETITION_WEIGHTS)[0]
        opponent = random.choice(OPPONENTS)
        is_home = random.choices([1, 0], weights=[0.6, 0.4])[0]
        venue = random.choice(["Sean Walsh Park", "Killinarden Park", "Tymon Park North"]) if is_home \
            else f"{opponent} Grounds"
        weekday = d.weekday()
        is_weekend = 1 if weekday >= 5 else 0
        throw_in_hour = random.choice([18, 19, 20]) if not is_weekend else random.choice([11, 12, 14, 15, 16])
        mean_t, mean_r = month_weather(d.month)
        fixtures.append({
            "id": f"F{i:03d}",
            "date": d.isoformat(),
            "throw_in": f"{throw_in_hour:02d}:{random.choice(['00', '15', '30'])}",
            "team": team,
            "competition": competition,
            "opponent": opponent,
            "venue": venue,
            "is_home": is_home,
            "is_derby": 1 if opponent in DERBY_CLUBS else 0,
            "is_weekend": is_weekend,
            "is_championship": 1 if competition == "Championship" else 0,
            "is_senior": is_senior,
            "throw_in_hour": throw_in_hour,
            "forecast_temperature_c": round(random.gauss(mean_t, 2.0), 1),
            "forecast_rainfall_mm": round(max(0.0, random.gauss(mean_r, 1.4) - 1.0), 1),
            "promo_posts": max(0, int(random.gauss(6, 2))),
            "home_form_points": random.randint(3, 15),
            "notes": random.choice([
                "Club shop open from an hour before throw-in.",
                "Car park fills early - the Greenhills Road entrance is usually quieter.",
                "Under-12s go free with a paying adult.",
                "Tea and sandwiches in the clubhouse afterwards.",
                "Wheelchair spaces are reserved along the stand side.",
            ]),
        })
        d += timedelta(days=random.choice([3, 4, 5, 6, 7]))
    return fixtures


# ---------------------------------------------------------------- write

def main():
    rows = build_rows(240)
    rows = assign_split(rows)
    rows = inject_missing(rows)

    fieldnames = list(rows[0].keys())
    with open(OUT / "matches.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)

    with open(OUT / "matches.json", "w", encoding="utf-8") as f:
        json.dump(rows, f, indent=1)

    with open(OUT / "fixtures.json", "w", encoding="utf-8") as f:
        json.dump(build_fixtures(), f, indent=1)

    print(f"matches.csv / matches.json : {len(rows)} rows, {len(fieldnames)} columns")
    print(f"train rows                 : {sum(1 for r in rows if r['split'] == 'train')}")
    print(f"test rows                  : {sum(1 for r in rows if r['split'] == 'test')}")
    print(f"blank temperature_c        : {sum(1 for r in rows if r['temperature_c'] == '')}")
    print(f"blank rainfall_mm          : {sum(1 for r in rows if r['rainfall_mm'] == '')}")
    print(f"blank promo_posts          : {sum(1 for r in rows if r['promo_posts'] == '')}")


if __name__ == "__main__":
    main()
