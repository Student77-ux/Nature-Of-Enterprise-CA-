# Defending this submission — Q&A preparation

The Q&A is 15 minutes and carries the majority of a component worth 20%. The
brief is blunt about it: *"Inability to explain your own submission will
significantly affect this component and may raise academic integrity concerns
about the wider submission."*

That last clause matters. A weak Q&A does not only cost you the presentation
marks — it puts the rest of the submission in question. Work through this
document, and where an answer does not yet feel like yours, go and change the
thing until it is.

---

## The five questions most likely to come up

### 1. "Why linear regression and not logistic regression?"

Attendance is a count, not a category. Logistic regression predicts which class
something belongs to; there is no natural class here unless you invent one, and
inventing bands and then classifying into them throws away information the
number already carries.

The follow-up is the interesting one: *the app displays a band, so why not
classify directly into bands?* Because the bands are a presentation choice, not
a modelling one. Predicting the number and then bucketing it means the
thresholds can be changed without refitting, and it keeps the error visible —
the app can say "570, give or take 70" and let the reader see that 570 is close
to the Steady/Busy boundary. A classifier would have said "Busy" and hidden that
entirely.

### 2. "Walk me through the train/test split."

240 rows, split 80/20 into 192 training and 48 test. The split was decided in
advance by `generate_dataset.py` using random seed 42 and written into the
dataset as a `split` column, so it is fixed and cannot be reshuffled by
reopening the workbook.

`LINEST` on the Regression sheet reads only rows 2–193 of Model Data, which are
the training rows. Rows 194–241 are the test rows: predictions are calculated
for them using coefficients fitted without them, and every test metric comes
from that block alone.

Missing values are imputed with the **training-set median**, not the full-dataset
median. If the full dataset were used, information from the test rows would leak
into the fitted model and the test scores would flatter it.

### 3. "How good is the model, and how do you know?"

On the 48 fixtures it never saw: R² 0.831, RMSE 70 people, MAE 55, MAPE 11.4%.

Do not stop there. The number that matters is the comparison: predicting the
long-run average every time gives an RMSE of about 170. The model is at 70,
which is 59% better. A model that cannot beat the average is not worth running,
so that comparison is the one that justifies its existence.

Test R² (0.831) is very slightly *above* training R² (0.820). That is normal
with a test set of 48 — it means the test rows happened to be marginally easier,
not that something is wrong. It is worth saying out loud before you are asked,
because it looks odd to anyone who expects test performance to be worse.

### 4. "The weekend coefficient is only +17 people. Isn't that wrong?"

No, but it is a good question and the answer shows you understand the model.

The generator built weekend fixtures with a much larger weekend effect than +17.
The reason the fitted coefficient is small is **collinearity**: weekend matches
almost always throw in near three o'clock, and `hours_from_peak` measures
exactly that. The two features overlap heavily, so the regression splits the
credit between them. Neither coefficient can be read on its own.

If asked what you would do about it: drop one of the two features and refit, or
combine them, and check whether the test RMSE moves. If it does not move, they
were carrying one effect between them and one of them is redundant.

### 5. "Show me where in your prompt log this page was generated, and what you changed afterwards."

This is a direct quote from the brief, so expect it. Have `docs/PROMPT_LOG.md`
open and be able to point at the entry for whichever page they name, then say
what changed after the AI produced it. Entries 2, 4, 5, 6 and 9 all record a
specific correction — the flat attendance figures, the LINEST column ordering,
rejecting Tailwind and `next/font`, the empty-state fix, the Next.js security
advisory. Those are the ones worth knowing well.

---

## Things you should be able to open and explain

| File | What to be able to say |
|---|---|
| `scripts/generate_dataset.py` | Which features drive attendance in the generator, and why missing values were introduced deliberately. |
| Workbook, `Regression` sheet | What `INDEX(LINEST(...),1,n)` does and why `n` counts backwards. |
| Workbook, `Model Data` sheet | Why the rows are sorted train-first, and what columns U–W are for. |
| `src/lib/model.ts` | Why the coefficients are copied here rather than fitted in the browser. |
| `src/components/BarChart.tsx` | Why the SVG is `aria-hidden` and the table is not. |
| `src/app/api/notices/route.ts` | Why the same validation runs twice. |
| `netlify.toml` | What the plugin block does and why the publish directory is `.next`. |

### The LINEST ordering, since it is the most likely technical trap

`LINEST(y, X, TRUE, TRUE)` returns coefficients in **reverse column order**. For
ten feature columns, `INDEX(...,1,1)` is the coefficient of the *last* column and
`INDEX(...,1,10)` the *first*; `INDEX(...,1,11)` is the intercept. Get this
backwards and every number in the sheet is still a plausible-looking number,
which is why the coefficients were cross-checked against an independent fit in
Python. They matched to three decimal places.

---

## Weaknesses to raise before you are asked

Volunteering a limitation reads as understanding. Being caught out by one reads
as the opposite.

- **The data is fictional and was generated by a script whose rules I chose.** The
  model recovers a relationship that was put there deliberately. Real club data
  would be messier and the R² would almost certainly be lower.
- **The model knows nothing about context** — a county final, a clash with a Dublin
  match, a funeral, a burst water main. Those are exactly the days a club most
  needs a warning about.
- **Attendance is measured by counting the gate**, which is not exact, so the model
  is predicting a number that was never precisely known.
- **The locator map is a diagram, not a street map.** It is marked decorative and
  every address is given in text, but it is not a real map.
- **Nothing is stored.** The noticeboard form validates and forgets. That is a
  deliberate privacy decision, not a missing feature — but it does mean the app
  has no admin side.

---

## Before the presentation

- [ ] Run the site locally and click every page, including on a phone-width window
- [ ] Tab through the fixtures page without touching the mouse
- [ ] Turn on high contrast and larger text, and leave them on for a minute
- [ ] Open the workbook, change one attendance figure on Raw Data, and watch the model coefficients move — this is a good live demo
- [ ] Push a small change and watch Netlify deploy it
- [ ] Read your own prompt log end to end
- [ ] Be able to say, in one sentence, what problem this app solves for the club
