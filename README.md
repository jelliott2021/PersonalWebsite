# Personal Website

Live at https://johnelliott.net

A single-page portfolio and résumé for John Elliott, built with React and TypeScript. All of the
content (bio, experience, projects, skills, education) lives in plain data files under `src/data/`,
so updating the résumé is a data edit rather than a component change. The site is fully static:
there is no backend.

## Features

- **Single-page layout** with sticky navigation that highlights the section you are reading
- **Boston theme**: a living SVG skyline that follows the real Boston time, sunrise, sunset, and
  live weather; section headers styled as MBTA platform signs; the experience timeline drawn as a
  transit line
- **Light and dark themes** that follow the system preference, with a manual toggle that is
  remembered and a circular wipe where the browser supports view transitions
- **Featured project showcase** with hover previews and click-to-play demo videos (nothing large
  downloads until you press play)
- **Live GitHub data**: star counts and a contribution heatmap, cached per session
- **Scroll-reveal animations** and counting stats that respect `prefers-reduced-motion`
- **SEO and sharing metadata**: Open Graph, Twitter card, canonical URL, and JSON-LD person schema
- **Accessible markup**: skip link, semantic sections, labelled icon buttons, keyboard-friendly menu,
  checked by axe in the end-to-end suite
- **Legacy routes** (`/projects`, `/skills`, ...) still land on the right section
- **No UI framework**: hand-written CSS with design tokens, about 95 KB of JavaScript gzipped

## Tech stack

- **React 18** with **TypeScript**, built by **Create React App** (react-scripts)
- **react-icons** for social and technology icons
- Plain CSS with custom properties for theming
- **Jest** and **React Testing Library** for unit and component tests
- **Playwright** and **axe-core** for end-to-end and accessibility tests
- **Postman** collection run by **newman** for external API contract tests
- **Docker** image served by `serve`, deployed by **GitHub Actions**

## Project structure

```
PersonalWebsite/
├── public/                     # Static assets: index.html, résumé PDF, photo, demo videos
├── src/
│   ├── data/                   # All site content lives here (see "Updating content")
│   │   ├── profile.ts          # Name, headline, bio, links, stats, interests
│   │   ├── experience.ts       # Work history with bullets and tech
│   │   ├── projects.ts         # Projects, links, videos, test accounts
│   │   ├── skills.ts           # Skill groups with icons and brand colours
│   │   ├── education.ts        # Degree, coursework, highlights
│   │   └── navigation.ts       # Section order used by the navbar and hooks
│   ├── components/             # One folder per section: index.tsx, index.css, index.test.tsx
│   ├── hooks/                  # Theme, active section, reveal, count-up, Boston time and weather,
│   │                           # GitHub stars and contributions, legacy routes, timeline progress
│   ├── lib/                    # Pure helpers: sunrise equation, storage, fetch, calendar layout
│   ├── styles/                 # tokens.css (theme variables), global.css (primitives)
│   ├── test-utils/             # jsdom mocks shared by the unit tests
│   ├── setupTests.ts           # Jest setup: jest-dom matchers and the mocks above
│   └── App.tsx                 # Page composition
├── e2e/                        # Playwright specs and fixtures
├── postman/                    # Postman collection and environment for newman
├── .github/workflows/          # CI quality gate and deployment workflows
├── Dockerfile                  # Multi-stage build; serves the static site on port 3001
└── docker-compose.yml          # Runs the container on the home server
```

## Updating content

Everything visitors see comes from `src/data/`:

- **New job or promotion**: add an entry to `experience.ts`, then update `role`, `company`, and the
  `about` paragraphs in `profile.ts`.
- **New project**: add an entry to `projects.ts`. Set `featured: true` for the large showcase cards.
  Drop a demo video in `public/videos/` and reference it with `video` and `videoSize`, add a short
  muted clip under `public/videos/previews/` as `preview` for the hover effect, or use `gif` for a
  small animated GIF that shows immediately. Set `repo` (`owner/name`) and `stars` to show a GitHub
  star badge; the count is fetched live and falls back to the static `stars` value.
- **New skill**: add it to the right group in `skills.ts` (an icon and brand `color` are optional).
- **New section**: add it to `navigation.ts` and render it in `App.tsx`.
- **New résumé**: replace `public/John-Elliott-Resume.pdf`.
- **Show the phone number on the page**: set `showPhone: true` in `profile.ts`.

The data tests in `src/data/data.test.ts` check that ids are unique, media files exist, links use
https, and hues are valid, so a typo fails CI before it reaches the site.

## Getting started

Requires Node.js 18 or newer and npm.

```bash
npm install
npm start          # dev server on http://localhost:3000
npm run build      # production build in build/
npm run serve      # serve the production build on http://localhost:3000
```

## Quality checks

| Command               | What it does                                                                      |
| --------------------- | --------------------------------------------------------------------------------- |
| `npm run lint`        | ESLint (airbnb + typescript-eslint + react + prettier), zero warnings allowed     |
| `npm run format`      | Prettier, write mode; `format:check` verifies without writing                     |
| `npm run typecheck`   | `tsc --noEmit` for the app and for the e2e project                                |
| `npm test`            | Jest in watch mode                                                                |
| `npm run test:ci`     | Jest once, with coverage; fails below 100% statements, branches, functions, lines |
| `npm run test:e2e`    | Playwright against the production build (run `npm run build` first)               |
| `npm run test:e2e:ui` | Playwright's interactive UI mode                                                  |
| `npm run test:api`    | newman runs the Postman collection against the live APIs and production site      |
| `npm run check`       | lint, format check, typecheck, and unit tests in one go                           |

### Unit tests

Every hook, component, helper, and data file has a colocated `*.test.ts(x)`. Browser APIs that jsdom
lacks (`matchMedia`, `IntersectionObserver`, `fetch`, media playback, the clipboard) are mocked in
`src/test-utils/dom.ts` and reinstalled before each test, so tests can flip media queries or
trigger observers directly. External data hooks are exercised with scripted `fetch` responses.

### End-to-end tests

`e2e/site.spec.ts` drives the built site in desktop and mobile Chromium: navigation and active-link
highlighting, legacy route redirects, the theme toggle and its persistence, the mobile menu, video
play-on-demand, the copy-email button, and an axe accessibility scan in both themes. Third-party
APIs are stubbed in `e2e/fixtures.ts` so runs are deterministic. First run needs the browser:

```bash
npx playwright install chromium
```

### Postman API tests

`postman/external-apis.postman_collection.json` checks the contracts the site relies on: the
Open-Meteo forecast fields, the GitHub repository star count, the contribution-calendar mirror, and
smoke tests for the production site (home page, legacy route fallback, résumé PDF). Import it into
Postman or run it headlessly with `npm run test:api`. Pass `--env-var github_token=<token>` to
avoid GitHub's unauthenticated rate limit.

## CI/CD

- **`ci.yml`** runs on every pull request to `main` and every push to `main`: lint, format check,
  type check, unit tests with the coverage gate, production build, Playwright end-to-end tests,
  the Postman collection, and a Docker image build. Reports are uploaded as artifacts. Enable
  branch protection on `main` requiring these checks so nothing merges without them.
- **`deploy-dev.yml`** runs on the self-hosted runner after CI succeeds on `main`. It copies the
  checkout to the deploy directory and runs `docker compose up -d --build`, which serves the static
  build on port 3001 behind the reverse proxy.
- **`azure-static-web-apps-*.yml`** is a secondary deployment to Azure Static Web Apps with a
  preview environment per pull request.

## Dependencies and `npm audit`

The shipped site depends only on `react`, `react-dom`, and `react-icons`; everything else,
including `react-scripts`, is a dev dependency, so `npm audit --omit=dev` reports nothing.

The `overrides` block in `package.json` pins patched versions of transitive packages that
`react-scripts` 5 and `newman` 6 would otherwise install (nth-check, postcss,
serialize-javascript, the SVG loader, handlebars, lodash, node-forge, jose, qs, uuid, and a few
more). Those fixes are API-compatible; the unit, end-to-end, and newman suites and `npm start`
all pass with them. Three advisories remain and are accepted for now:

- **webpack-dev-server** (`npm start` only): CRA 5 is incompatible with the patched v5 line.
- **csv-parse** in newman: only used for `--iteration-data` CSV files, which this project does not
  pass; the patched major changes the import shape newman expects.
- **@faker-js/faker** in the Postman sandbox: bundled into the sandbox VM, so an override has no
  effect; only reachable through `{{$random*}}` dynamic variables, which the collection avoids.

Re-run `npm audit` after upgrading `react-scripts` or `newman` and drop overrides they no longer need.

## Demo videos

The MP4 files in `public/videos/` are large (16 to 96 MB) and were encoded with the index at the end
of the file, so they cannot start playing until most of the file has downloaded. The site avoids
loading them until a visitor presses play. If you re-encode them, use `-movflags +faststart` and a
720p, CRF ~28 H.264 profile to cut the size dramatically and allow instant playback:

```bash
ffmpeg -i BoozeBrawlDemo.mp4 -vf scale=-2:720 -c:v libx264 -crf 28 -preset slow -movflags +faststart -c:a aac -b:a 96k BoozeBrawlDemo-web.mp4
```

## License

See the [LICENSE](LICENSE) file for details.
