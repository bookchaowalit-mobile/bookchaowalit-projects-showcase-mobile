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
- Favourites (AsyncStorage) and a project detail screen.

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
