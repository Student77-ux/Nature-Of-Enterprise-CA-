# Deployment — Git to Netlify

Component 4 of the DATAH1010 repeat assessment. This is the part nobody can do
for you: it needs your GitHub account and your Netlify account.

The marks are for **a live URL, a Git-connected deploy, and a commit history
that shows sustained work**. The last one is the easiest to lose, so read the
commit section first.

---

## Before anything else: the commit history

The brief asks for **at least five meaningful commits spread over time, not one
massive commit**. A single "initial commit" containing the finished project is
the most common way to lose these marks, and it cannot be fixed after the fact
without lying about dates.

So commit as you go, in the order you actually work. A reasonable shape:

| # | What is in it | Message |
|---|---|---|
| 1 | Next.js skeleton, `package.json`, `tsconfig.json`, empty layout | `Set up Next.js app router project with TypeScript` |
| 2 | `src/data/*.json`, `scripts/generate_dataset.py` | `Add fictional Tallaght Gaels dataset and generator script` |
| 3 | `src/lib/model.ts`, `/predict` | `Add attendance regression model and planner page` |
| 4 | `/fixtures`, `/fixtures/[id]`, filtering | `Add fixtures listing with search and filters` |
| 5 | `/venues`, `/noticeboard`, `/api/notices` | `Add venue directory and noticeboard submission form` |
| 6 | `globals.css`, settings panel, skip link | `Add accessibility settings and keyboard navigation` |
| 7 | `netlify.toml`, `README.md` | `Add Netlify build config and README` |
| 8 | Anything you change after user testing | `Fix contrast and focus issues found in user testing` |

Commit 8 matters more than it looks: it is evidence that the accessibility and
user testing in Component 5 actually changed something.

```bash
git add src/lib/model.ts src/app/predict
git commit -m "Add attendance regression model and planner page"
git push
```

Do not use `git commit --amend` or force-push once things are on GitHub. The
history is the evidence.

---

## 1. Push to GitHub

```bash
cd tallaght-gaels-hub
git init
git branch -M main
# make your commits here, in stages, as above
git remote add origin https://github.com/<your-username>/tallaght-gaels-hub.git
git push -u origin main
```

`.gitignore` already excludes `node_modules/`, `.next/` and `.env.local`. Check
that `git status` is clean and that `node_modules` is **not** listed before you
push — a repository with `node_modules` committed is slow to clone and looks
careless.

The Markdown report for Component 1 lives in this same repository, so its commit
history is your Appendix B evidence too.

## 2. Connect Netlify

1. Sign in at [netlify.com](https://www.netlify.com) with your GitHub account.
2. **Add new site → Import an existing project → GitHub**.
3. Authorise Netlify and pick `tallaght-gaels-hub`.
4. Check the build settings. Netlify reads `netlify.toml`, so these should
   already be filled in:
   - **Branch to deploy:** `main`
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
5. **Deploy site.**

The first build takes two or three minutes. Netlify detects Next.js and installs
its Next.js runtime automatically, which is what turns `/api/notices` into a
serverless function.

## 3. Environment variables

None are required, so the site will build without this step. To set them anyway:

**Site configuration → Environment variables → Add a variable**

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | your Netlify URL, e.g. `https://tallaght-gaels-hub.netlify.app` |
| `NEXT_PUBLIC_CLUB_EMAIL` | `hello@tallaghtgaels.example` |
| `NOTICE_FORWARD_URL` | leave unset |

Environment variables are read at build time, so **redeploy after adding them**:
**Deploys → Trigger deploy → Deploy site**.

## 4. Rename the site

**Site configuration → Site details → Change site name.** Pick something
readable like `tallaght-gaels-hub`. The default is a random string, which looks
unfinished in a submission.

## 5. Prove the pipeline works

This is the bit to demonstrate live in your presentation.

1. Change something small and visible — a heading, a line of copy.
2. `git add . && git commit -m "Update home page introduction" && git push`
3. Watch **Deploys** in Netlify. A new deploy appears within seconds, marked
   with your commit message.
4. Refresh the live URL and show the change.

Do this once before the presentation so you know how long it takes.

## 6. The screenshot

The brief asks for a Netlify dashboard screenshot **showing your site and the
connected Git repo**. One image needs to contain:

- the site name and the live URL
- the linked repository (`github.com/<you>/tallaght-gaels-hub`)
- the production branch (`main`)
- at least one successful deploy with a real commit message

**Site overview** usually captures all of it. If not, take **Site configuration →
Build & deploy → Continuous deployment**, which names the repository explicitly.
Save it as `netlify-dashboard.png` and put it in the submission package.

---

## When the build fails

**"Module not found" or a TypeScript error** — the build failed for a real
reason. Run `npm run build` locally; you will get the same error with better
context.

**Build succeeds, pages 404** — check the publish directory is `.next` and not
`out`. `out` is for static exports, which this project is not.

**`/api/notices` returns 404 on the live site but works locally** — the Next.js
runtime did not install. Confirm `netlify.toml` contains the
`@netlify/plugin-nextjs` plugin block and redeploy.

**Node version errors** — `netlify.toml` pins `NODE_VERSION = "20"`. Raise it if
you are using newer syntax locally.

Netlify keeps a full log for every deploy. Open the failed one and read from the
bottom: the actual error is usually a few lines above the end.

---

## Checklist before you submit

- [ ] Repository is on GitHub, public or shared with the module coordinator
- [ ] At least 5 commits, made at different times, with meaningful messages
- [ ] `node_modules/` and `.env.local` are not committed
- [ ] Netlify site builds and the live URL loads
- [ ] Every page works on the live URL, not just locally
- [ ] The noticeboard form submits successfully on the live site
- [ ] A push to `main` triggers a new deploy — tested, not assumed
- [ ] Dashboard screenshot saved, showing the connected repo
- [ ] Site renamed to something readable
- [ ] README build command and environment variable steps match what Netlify does
