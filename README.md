# Personal Website - Portfolio & Resume

Live at https://www.johnedwardelliott.com

A single-page portfolio and resume for John Elliott, built with React and TypeScript. All of the
content (bio, experience, projects, skills, education) lives in plain data files, so updating the
resume is a data edit rather than a component change.

(The Node/Express backend under `server/` is out of date and no longer deployed. It is kept as a
code example only; the site itself is fully static.)

## Features

- **Single-page layout** with sticky navigation that highlights the section you are reading
- **Hero, About, Experience, Projects, Skills, Education, and Contact** sections driven by data files
- **Light and dark themes**, light by default, with a manual toggle that is remembered
- **Featured project showcase** with click-to-play demo videos (nothing downloads until you press play)
- **Test-account and hosting notes** for live demos, tucked behind a disclosure
- **Scroll-reveal animations** that respect `prefers-reduced-motion`
- **SEO and sharing metadata**: Open Graph, Twitter card, canonical URL, and JSON-LD person schema
- **Accessible markup**: skip link, semantic sections, labelled icon buttons, keyboard-friendly menu
- **Legacy routes** (`/projects`, `/skills`, `/experience`) still land on the right section
- **No UI framework**: hand-written CSS with design tokens, ~85 KB of JavaScript gzipped

## Tech Stack

### Frontend
- **React 18** with **TypeScript**
- **Create React App** (react-scripts) for the build
- **react-icons** for social and technology icons
- Plain CSS with custom properties for theming (no component library)

### Backend (archived)
- **Node.js**, **Express**, **TypeScript**, **MongoDB** (see `server/`)

### Testing (archived)
- **Cypress** end-to-end specs in `testing/` from an earlier course project
- **Jest** and **Stryker** configuration in `server/`

## Project Structure

```
PersonalWebsite/
├── client/                         # React frontend (the deployed site)
│   ├── public/
│   │   ├── index.html              # Meta tags, fonts, theme bootstrap script
│   │   ├── John-Elliott-Resume.pdf # Downloadable resume
│   │   ├── linkedin.jpg            # Hero photo
│   │   └── videos/                 # Project demo videos
│   └── src/
│       ├── data/                   # All site content lives here
│       │   ├── profile.ts          # Name, headline, bio, links, stats, interests
│       │   ├── experience.ts       # Work history with bullets and tech
│       │   ├── projects.ts         # Projects, links, videos, test accounts
│       │   ├── skills.ts           # Skill groups with icons
│       │   └── education.ts        # Degree, coursework, highlights
│       ├── components/             # One folder per section (index.tsx + index.css)
│       ├── hooks/                  # useTheme, useActiveSection, useReveal, useLegacyRoutes
│       ├── styles/                 # tokens.css (theme variables), global.css (primitives)
│       └── App.tsx                 # Page composition
├── server/                         # Archived Node.js backend
├── testing/                        # Archived Cypress tests
├── Dockerfile.frontend             # Builds the client and serves it on port 3001
└── docker-compose.yml              # Runs the frontend container
```

## Updating Content

Everything visitors see comes from `client/src/data/`:

- **New job or promotion**: add an entry to `experience.ts`, then update `role`, `company`, and the
  `about` paragraphs in `profile.ts`.
- **New project**: add an entry to `projects.ts`. Set `featured: true` for the large showcase cards.
  Drop a demo video in `client/public/videos/` and reference it with `video` and `videoSize`, or use
  `gif` for a small animated GIF that shows immediately. Set `repo` (`owner/name`) and `stars` to
  show a GitHub star badge; the count is fetched live and falls back to the static `stars` value.
- **New skill**: add it to the right group in `skills.ts` (an icon is optional).
- **New resume**: replace `client/public/John-Elliott-Resume.pdf`.
- **Show the phone number on the page**: set `showPhone: true` in `profile.ts`.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Run locally

```bash
cd client
npm install
npm start
```

The site runs on `http://localhost:3000`.

### Build for production

```bash
cd client
npm run build
```

This creates an optimized build in `client/build/`.

### Lint

```bash
cd client
npm run lint
```

## Deployment

Pushes to `main` trigger the GitHub Actions workflows in `.github/workflows/`. The
`deploy-dev.yml` workflow rebuilds and restarts the Docker container on a self-hosted runner using
`docker-compose.yml`, which serves the static build on port 3001. The Azure Static Web Apps workflow
can also deploy the `client/` folder with `build` as the output location.

### Demo videos

The MP4 files in `client/public/videos/` are large (16 to 96 MB) and were encoded with the index at
the end of the file, so they cannot start playing until most of the file has downloaded. The site
avoids loading them until a visitor presses play. If you re-encode them, use `-movflags +faststart`
and a 720p, CRF ~28 H.264 profile to cut the size dramatically and allow instant playback:

```bash
ffmpeg -i BoozeBrawlDemo.mp4 -vf scale=-2:720 -c:v libx264 -crf 28 -preset slow -movflags +faststart -c:a aac -b:a 96k BoozeBrawlDemo-web.mp4
```

## License

See the [LICENSE](LICENSE) file for details.

## Contact

Feel free to reach out for any questions or opportunities!
