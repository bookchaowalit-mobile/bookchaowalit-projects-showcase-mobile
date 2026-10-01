# Upgrade Plan

## Current state

- Before this pass: **1/10** — React Native CLI scaffold with placeholder
  screens and no entry point (`index.js`), `app.json`, Babel/Metro/Jest/ESLint
  config or lockfile; CI masked every failure with `|| true`.
- After this pass: **6/10** — searchable, category-filtered showcase of the
  Bookchaowalit project catalog with an overview tab; honest CI (lint,
  typecheck, Jest, Metro Android bundle). No native `android/`/`ios/` yet.

## Backlog

### P0
- Generate native projects (`npx @react-native-community/cli init` with the
  RN 0.76 template, copy `android/` + `ios/`, app name
  `ProjectsShowcaseMobile`) and add an Android debug build job to CI.
- Richer project data (one-line description, tech stack, screenshot, repo
  link) — the catalog currently has name/url/slug only.

### P1
- Share one catalog source with the web frontends instead of the mirrored
  `src/lib/catalog.ts` (copied from recommendation-engine-frontend).
- Project detail screen (description, stack, links) once the catalog has the data.

### P2
- Upgrade RN 0.76 -> current and ESLint 9 flat config.

## Done in this pass

- `src/lib/showcase.ts`: flatten, multi-term search (name/slug/category,
  punctuation-insensitive, name-prefix first), category counts, injectable
  random pick; Jest tests incl. catalog integrity (unique slugs, https).
- Projects tab: search, category chips with counts, "Surprise me", open in
  browser. Overview tab: totals and per-category bars. Render tests.
- Added `index.js`, `app.json`, Babel/Metro/Jest/ESLint/Prettier config,
  RN 0.76 template dev dependencies and a committed `package-lock.json`.
- CI runs `npm ci`, lint (0 warnings), typecheck, Jest and a Metro Android
  bundle with no failure masking.

## Done in this pass (pass 2)

Score: 6/10 (was 5/10) — favourites persist and can be filtered; native projects and richer catalog data still open.

- Favourites: ☆/★ per project and a "★ n" filter chip; slugs persist with `@react-native-async-storage/async-storage` 2.2.0 via `src/usePersistentState.ts` + versioned codecs in `src/lib/persist.ts` (a failed read never overwrites stored data). Project detail screen still open (P1).
- Tests: toggle/filter helpers, codec cases, and a remount test proving favourites survive a new session (19 jest tests). Jest gets the official storage mock and a 20 s timeout (a cold `--no-cache` run timed out at 5 s).
- Robustness: `Linking.openURL` failures are caught.
- Advisories: no same-major fixes available; needs the RN upgrade (P2).
- Verified: lint, typecheck, jest (also `--no-cache`), `npm run bundle:android`.

## Done in this pass (pass 3)

Score: 7.5/10 (was 7/10) — edge-case hunt in `src/lib/showcase.ts`.

- Bug: search normalised by deleting everything outside `a-z0-9`, so a Thai/CJK query became "" and matched **every** project, and "Cálendar" became "c lendar". Normalisation now folds Latin diacritics and full-width letters but keeps any Unicode letter, digit or mark (Thai vowel marks included).
- Verified: lint, typecheck, 22 Jest tests, `react-native bundle` for Android.
