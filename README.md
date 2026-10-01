# Projects Showcase — Mobile

React Native CLI (bare workflow) mobile app for **Projects Showcase**.

Part of [Chaowalit Greepoke](https://bookchaowalit.com)'s 101 Portfolio Projects.

## Tech Stack

- **Framework:** React Native 0.76 (bare CLI)
- **Language:** TypeScript
- **Navigation:** React Navigation v6
- **UI:** React Native Vector Icons

## Features

- **Projects** tab: every live Bookchaowalit project, searchable (all words
  must match name, slug or category) and filterable by category chips with
  counts; tap to open, or "Surprise me" for a random pick from the results.
- **Overview** tab: total projects and a bar per category.
- Static catalog shipped with the app (`src/lib/catalog.ts`); no network
  calls except opening a project in the browser.

## Getting Started

```bash
npm ci
npm start
```

The native `android/` and `ios/` projects have not been generated yet, so
`npm run android` / `npm run ios` need that step first (see
`docs/UPGRADE-PLAN.md`).

## Validation

```bash
npm run validate      # eslint + tsc --noEmit + jest
mkdir -p dist && npm run bundle:android   # Metro bundle smoke check
```

Pure logic lives in `src/lib/` and is unit-tested with Jest (`__tests__/`).
CI (`.github/workflows/build.yml`) runs all of the above and fails on errors.

## Related

- **Frontend:** [bookchaowalit-website/projects-showcase-frontend](https://github.com/bookchaowalit-website/projects-showcase-frontend)
- **Portfolio:** [bookchaowalit.com](https://bookchaowalit.com)

## License

MIT
