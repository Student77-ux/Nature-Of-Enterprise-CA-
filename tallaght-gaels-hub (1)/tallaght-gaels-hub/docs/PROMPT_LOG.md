# Prompt log — Components 2, 3 and 4

**Module:** DATAH1010 The Nature of Enterprise Computing
**Assessment:** Repeat Assessment
**Scenario:** Tallaght Community Sports Hub — a club companion app for Tallaght Gaels CLG (fictional)
**Student name:** _____________________
**Student number:** _____________________

Generative AI was **not** used for Component 1 (the written report). A signed
declaration to that effect is in Appendix A.

---

> ### Read this before you submit
>
> This log records a working session with Claude (claude.ai) on **6 September
> 2026** in which the dataset, the Excel analysis, the regression model, the
> Next.js application and the Netlify configuration were produced.
>
> **You must check every entry against what actually happened and correct
> anything that does not match**, including the dates and times, which are
> approximate. If you ran further prompts of your own — and you should, the
> project is not finished until you have changed things yourself — add them at
> the end using the same format. An inaccurate log is worse than a short one:
> the brief treats a fabricated prompt log as academic misconduct.
>
> The Q&A is worth 20% and asks you to defend every part of this submission.
> Work through `docs/QA_PREP.md` before the presentation. If you cannot explain
> a file, change it until you can, and log that change here.

---

## Entry 1 — Understanding the brief and choosing the approach

| | |
|---|---|
| **Date / time** | 6 September 2026, approx. 14:05 |
| **Tool used** | Claude (claude.ai) |
| **Goal** | Establish what Components 2, 3 and 4 require, and settle on a scenario, a dataset design and a model type before writing anything. |

**Prompt**

> My project is a local GAA style club companion app (Tallaght community sports hub) please complete component 2, 3 and 4 whilst following all guidelines, rules and requirements
>
> [the assessment brief was attached as a .docx]

**Output summary**

Read the brief and set out a plan: a fictional club ("Tallaght Gaels CLG") with
240 match-day records across five seasons; linear regression predicting
attendance rather than logistic regression, because attendance is a number and
because a linear model's coefficients can be read and argued with; the model
output surfaced in the app as a crowd band on every fixture.

**What I changed next**

Accepted the scenario and the choice of linear regression. Asked for the
underlying data-generating process to include deliberate missing values so that
the missing-value handling required by the brief would have something real to
handle, rather than reporting zero gaps.

---

## Entry 2 — Generating the fictional dataset (Component 2)

| | |
|---|---|
| **Date / time** | 6 September 2026, approx. 14:20 |
| **Tool used** | Claude (claude.ai) |
| **Goal** | Produce a reproducible 200+ row dataset with at least 3 numeric variables, directly relevant to the scenario and entirely fictional. |

**Prompt**

> ROLE: You are a data engineer preparing a teaching dataset.
>
> CONTEXT: Fictional GAA club "Tallaght Gaels CLG" in Tallaght, Dublin 24. The dataset will be analysed in Excel and used to fit a linear regression predicting match-day attendance.
>
> CONSTRAINTS:
> - 240 rows, seasons 2022 to 2026, all dates in the past
> - At least 3 numeric variables; fictional data only, no real clubs or people
> - Reproducible from a fixed random seed
> - Include a realistic amount of missing data in the weather and promotion columns
> - Attendance must depend on the features in a way a linear model can recover, but with enough noise that it cannot be recovered perfectly
>
> TASK: Write a Python script that generates the dataset and writes CSV and JSON.
>
> OUTPUT FORMAT: (1) the script, (2) a short note on what drives attendance in the generator.

**Output summary**

`scripts/generate_dataset.py`, seeded at 42. 240 rows, 23 columns, 12 of them
numeric. Attendance is built from team, competition, home advantage, derby
status, weekend, promotional posts, rainfall, temperature, recent form and
throw-in time, plus Gaussian noise. It also writes 14 upcoming fixtures for the
app and blanks a small number of readings.

**What I changed next**

The first run produced attendance figures that were too flat — a U16 challenge
match drew almost as many people as a senior championship tie, which is not how
a club works. Retuned the coefficients so adult championship fixtures pull
roughly twice what underage fixtures do, and checked the resulting spread
(mean 521, range 133 to 953, no values hitting the floor). The first run also
produced match dates running into 2027, which is in the future; shortened the
gaps between fixtures so the history ends in June 2026.

---

## Entry 3 — Building the Excel analysis workbook (Component 2)

| | |
|---|---|
| **Date / time** | 6 September 2026, approx. 14:45 |
| **Tool used** | Claude (claude.ai) |
| **Goal** | Build the Excel file the brief asks for: raw data, descriptive statistics, missing-value counts, category breakdowns, and at least three labelled charts. |

**Prompt**

> ROLE: You are a data analyst building a workbook that will be marked by a lecturer.
>
> CONTEXT: The 240-row Tallaght Gaels dataset from the previous step.
>
> CONSTRAINTS:
> - Everything must be a live Excel formula, not a value pasted in by Python
> - Descriptive statistics: mean, median, mode, min, max, standard deviation, quartiles, skew
> - Missing value counts for every column
> - Category breakdowns for team, competition, venue, day of week, result, season
> - At least three properly labelled charts
> - Use openpyxl; avoid functions LibreOffice cannot evaluate
>
> TASK: Write the script that builds the workbook.
>
> OUTPUT FORMAT: (1) the script, (2) how to verify there are no formula errors.

**Output summary**

`scripts/build_workbook.py`, producing eight sheets: Read Me, Raw Data, Data
Quality, Descriptive Stats, Category Breakdown, Model Data, Regression and
Charts. Five charts rather than three. Everything is a formula — editing a cell
on Raw Data updates the statistics, the model and the charts.

**What I changed next**

Ran a recalculation check, which reported 5,209 formulas and zero errors.
Checked a handful of formulas by hand against values computed separately in
Python, because a formula that evaluates cleanly can still point at the wrong
range.

---

## Entry 4 — Fitting and evaluating the regression (Component 2)

| | |
|---|---|
| **Date / time** | 6 September 2026, approx. 15:15 |
| **Tool used** | Claude (claude.ai) |
| **Goal** | Fit the model inside Excel, on training rows only, and evaluate it honestly on a held-back test set. |

**Prompt**

> ROLE: You are a statistician explaining a model to a first-year class.
>
> CONTEXT: Predicting match-day attendance from the Tallaght Gaels dataset.
>
> CONSTRAINTS:
> - Multiple linear regression fitted with LINEST, on the 192 training rows only
> - The 80/20 split must be fixed in advance and stored in the dataset, so it cannot be reshuffled
> - Impute missing values with the training-set median, never the full-dataset median
> - Report R squared, RMSE, MAE and MAPE for both training and test sets
> - Compare against a naive baseline that always predicts the training mean
>
> TASK: Add a Regression sheet that does all of the above, plus a calculator for a new fixture.
>
> OUTPUT FORMAT: (1) the sheet layout, (2) the LINEST formulas, (3) the evaluation figures.

**Output summary**

Ten features, including one engineered feature (`hours_from_peak`, the distance
in hours between throw-in and 3pm, treating an early and a late throw-in as
equally awkward). Coefficients from `INDEX(LINEST(...),1,n)`, with standard
errors, t statistics and p values. Test set: R² 0.831, RMSE 70, MAE 55, MAPE
11.4%, and 59% better than the naive baseline.

**What I changed next**

Fitted the same model independently in Python with `numpy.linalg.lstsq` and
compared the coefficients. They agreed to three decimal places, which confirms
the LINEST column ordering is right — LINEST returns coefficients in reverse
order, and getting that backwards is a silent error that still produces a
plausible-looking sheet. Also moved the coefficient table one column right so
the intercept has a column to itself; in the first version its standard error
sat under the `is_derby` heading and looked like that feature's value.

---

## Entry 5 — Scaffolding the Next.js application (Component 3)

| | |
|---|---|
| **Date / time** | 6 September 2026, approx. 15:50 |
| **Tool used** | Claude (claude.ai) |
| **Goal** | Set up the app with the stack the brief specifies, and decide what the four-plus features are. |

**Prompt**

> ROLE: You are a senior Next.js engineer and accessibility reviewer.
>
> CONTEXT: We are building the Tallaght Community Sports Hub, a club companion app for a fictional GAA club.
>
> CONSTRAINTS:
> - Next.js (App Router), TypeScript
> - Serverless backend: Netlify Functions (chosen over Supabase — nothing needs storing)
> - Accessibility: WCAG AA principles, keyboard-first
> - Data: fictional only (no real personal data)
> - As few dependencies as possible
>
> TASK: Set up the project structure and the shared layout, header, navigation and footer.
>
> OUTPUT FORMAT: (1) files to create, (2) code only, (3) brief test steps.
>
> SELF-CHECK: After the code, list likely accessibility issues and fixes.

**Output summary**

Project scaffold with three runtime dependencies. Root layout with a skip link,
landmarks and `lang="en-IE"`. Header with the club crest, main navigation using
`aria-current="page"`, and a display settings panel. Self-check flagged that a
settings panel toggled with a button needs `aria-expanded` and `aria-controls`,
and that `main` needs `tabIndex={-1}` for the skip link to move focus properly.
Both were applied.

**What I changed next**

Rejected Tailwind in favour of a single stylesheet using CSS custom properties,
because the three accessibility settings are attributes on `<html>` and plain
CSS reacts to them in about fifteen lines. Rejected `next/font` because it
fetches from Google at build time, which is an avoidable build-time network
dependency and a third-party request on every page load.

---

## Entry 6 — Fixtures, filtering and the ML output (Component 3)

| | |
|---|---|
| **Date / time** | 6 September 2026, approx. 16:20 |
| **Tool used** | Claude (claude.ai) |
| **Goal** | Build the fixtures listing with search and filters, and surface the regression output on every fixture. |

**Prompt**

> ROLE: You are a senior Next.js engineer and accessibility reviewer.
>
> CONTEXT: Tallaght Community Sports Hub. The attendance model coefficients are in src/lib/model.ts.
>
> CONSTRAINTS:
> - Next.js (App Router), TypeScript
> - Accessibility: WCAG AA, keyboard-first, result count announced to screen readers
> - The prediction must be shown as a band and a range, never as a single precise number
>
> TASK: Create the fixtures listing page with free-text search and filters for team, competition and home/away, plus a fixture detail page showing the predicted crowd and what is driving it.
>
> OUTPUT FORMAT: (1) files to create/edit, (2) code only, (3) brief test steps.
>
> SELF-CHECK: After the code, list likely accessibility issues and fixes.

**Output summary**

`FixtureBrowser.tsx` (a client component holding the filter state),
`/fixtures/page.tsx` and `/fixtures/[id]/page.tsx`. Each fixture card carries a
crowd band; the detail page breaks the prediction down into the four features
contributing most. Self-check flagged that a filtered list changing without
announcement is invisible to a screen reader, so the result count carries
`role="status"` and `aria-live="polite"`.

**What I changed next**

Added an empty state with a working "Clear all filters" button, because a
filtered list that returns nothing and offers no way out is a dead end. Added
a fallback so that if every seeded fixture is in the past, the page shows the
full list with an explanation rather than an empty page.

---

## Entry 7 — Noticeboard form and the serverless handler (Component 3)

| | |
|---|---|
| **Date / time** | 6 September 2026, approx. 16:45 |
| **Tool used** | Claude (claude.ai) |
| **Goal** | Build the submission form the brief asks for, with accessible error handling and server-side validation. |

**Prompt**

> ROLE: You are a senior Next.js engineer and accessibility reviewer.
>
> CONTEXT: Tallaght Community Sports Hub noticeboard — lost and found, lift shares, volunteering.
>
> CONSTRAINTS:
> - Next.js Route Handler, deployed by Netlify as a serverless function
> - Validate in the browser and again on the server; anything can POST to the URL
> - Collect no personal data at all — no name, no email, no phone number
> - Errors listed at the top of the form, each linking to the field, and focus moved there
>
> TASK: Build the form component and the POST handler.
>
> OUTPUT FORMAT: (1) files to create, (2) code only, (3) brief test steps.
>
> SELF-CHECK: After the code, list likely accessibility issues and fixes.

**Output summary**

`NoticeForm.tsx` and `src/app/api/notices/route.ts`. The form has four fields,
none of them identifying. The handler re-validates against the same rules and
returns 422 with a list of problems, or 201 on success. Nothing is written to
disk unless `NOTICE_FORWARD_URL` is set.

**What I changed next**

Tested the handler from the command line with a payload missing the `area`
field, and confirmed it returned 422 rather than accepting it — browser
validation is a convenience, not a control. Added the `GET` handler returning
405 so the endpoint says what it wants instead of erroring.

---

## Entry 8 — Charts without a charting library (Component 3)

| | |
|---|---|
| **Date / time** | 6 September 2026, approx. 17:05 |
| **Tool used** | Claude (claude.ai) |
| **Goal** | Build the data-driven statistics page, with charts a screen reader user can actually read. |

**Prompt**

> ROLE: You are a senior Next.js engineer and accessibility reviewer.
>
> CONTEXT: A statistics page built from the 240-row dataset, aggregated at build time.
>
> CONSTRAINTS:
> - No charting library
> - Every chart must have the same numbers available as a real HTML table
> - Include a predicted-against-actual scatter for the 48 held-back test fixtures
>
> TASK: Build the chart components and the statistics page.
>
> OUTPUT FORMAT: (1) files to create, (2) code only, (3) brief test steps.
>
> SELF-CHECK: After the code, list likely accessibility issues and fixes.

**Output summary**

`BarChart.tsx` and `ScatterChart.tsx`, both plain SVG. The SVG carries
`aria-hidden="true"` and the data is repeated in a `<table>` inside a
`<details>` element. `/stats` shows five charts plus the model evaluation.

**What I changed next**

Nothing structural. Confirmed the aggregates on the page match the workbook —
average attendance 521, range 133 to 953, 26 records with at least one missing
reading — which they should, since both read the same 240 rows.

---

## Entry 9 — Netlify configuration (Component 4)

| | |
|---|---|
| **Date / time** | 6 September 2026, approx. 17:25 |
| **Tool used** | Claude (claude.ai) |
| **Goal** | Configure the repository so that pushing to `main` deploys, and document the steps. |

**Prompt**

> ROLE: You are a DevOps engineer.
>
> CONTEXT: A Next.js 15 App Router app with one route handler, to be deployed on the Netlify free tier from a GitHub repository.
>
> CONSTRAINTS:
> - Build command and publish directory pinned in netlify.toml
> - The route handler must work as a serverless function on the deployed site
> - Document the environment variable setup in the README
>
> TASK: Write netlify.toml, .gitignore and .env.example, and a deployment guide covering the commit history evidence the assessment requires.
>
> OUTPUT FORMAT: (1) the files, (2) the guide, (3) what to do when the build fails.

**Output summary**

`netlify.toml` with the build command, `.next` as the publish directory, the
`@netlify/plugin-nextjs` plugin, `NODE_VERSION` pinned to 20, and four security
headers. `docs/DEPLOYMENT.md` covers the commit strategy, the Netlify import,
environment variables, proving the pipeline works, and the dashboard screenshot.

**What I changed next**

Ran `npm run build` locally and confirmed it succeeded, producing 26 static
pages and one dynamic function. **Noted that `npm install` warned about a
security advisory in the version of Next.js first pinned (CVE-2025-66478), and
upgraded to a patched 15.5.x release before going any further.** Rebuilt and
re-tested afterwards.

---

## Entry 10 — Verification pass

| | |
|---|---|
| **Date / time** | 6 September 2026, approx. 17:45 |
| **Tool used** | Claude (claude.ai) |
| **Goal** | Confirm the whole thing actually runs, rather than merely compiling. |

**Prompt**

> Start the production server and check every route returns 200, then POST to the notices endpoint twice — once with a missing field and once with a valid payload — and confirm the responses.

**Output summary**

All eight routes returned 200. The invalid POST returned `{"ok":false,...}` with
the missing field named; the valid POST returned `{"ok":true}`. Excel
recalculation reported zero formula errors across 5,209 formulas.

**What I changed next**

This is where **your** work starts. The deployment itself, the user testing in
Component 5, and any changes those tests produce are yours to do and to log
below.

---

## Entries 11 onwards — your own work

Copy the format above. At minimum you will have entries for the Netlify deploy
itself, and for anything you change after user testing.

| | |
|---|---|
| **Date / time** | |
| **Tool used** | |
| **Goal** | |
| **Prompt** | |
| **Output summary** | |
| **What you changed next** | |
