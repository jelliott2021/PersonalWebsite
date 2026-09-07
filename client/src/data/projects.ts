import type { IconType } from 'react-icons';
import { SiDocker } from 'react-icons/si';
import { FiCode, FiImage, FiLayers, FiMessageSquare, FiServer, FiUsers } from 'react-icons/fi';

export type ProjectStatus = 'live' | 'open-source' | 'self-hosted' | 'private' | 'archived';

export interface ProjectCredentials {
  user: string;
  password: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  highlights?: string[];
  tech: string[];
  period?: string;
  status: ProjectStatus;
  featured: boolean;
  /** Icon used for the media tile when there is no demo video or GIF. */
  icon: IconType;
  /** Hue (0-360) that tints the media tile so each project reads distinctly. */
  hue: number;
  github?: string;
  /** GitHub "owner/name" slug. When set, the star count is fetched live. */
  repo?: string;
  /** Star count shown if the live fetch fails (or before it completes). */
  stars?: number;
  live?: string;
  /** MP4 demo; downloaded only when the visitor presses play. */
  video?: string;
  videoSize?: string;
  /** Animated GIF demo; small enough to show immediately. */
  gif?: string;
  note?: string;
  credentials?: ProjectCredentials;
}

export const PROJECTS: Project[] = [
  {
    id: 'boozebrawl',
    title: 'BoozeBrawl',
    tagline: 'A browser-based party game you play with friends in real time.',
    description:
      'Players create or join a room, then play a rotation of mini-games together. The React frontend and Node.js backend keep game state, player actions, and sessions in sync over Socket.io.',
    highlights: [
      'Designed and deployed the full stack: real-time lobbies, session management, and gameplay.',
      'The backend owns the game state, so every player sees the same thing at the same moment.',
      'Runs in Docker on its own isolated network alongside this site.',
    ],
    tech: ['TypeScript', 'React', 'Node.js', 'Express', 'Socket.io', 'Docker', 'Azure'],
    period: 'Nov 2024 – Present',
    status: 'live',
    featured: true,
    icon: FiUsers,
    hue: 275,
    live: 'https://boozebrawl.com',
    video: '/videos/BoozeBrawlDemo.mp4',
    videoSize: '96 MB',
    note: 'Source code available on request.',
  },
  {
    id: 'docker-wake-up',
    title: 'Docker Wake Up',
    tagline: 'A reverse proxy that starts Docker containers on demand.',
    description:
      'An open-source wake-on-request proxy. When a request arrives for a stopped service, it starts the container, shows a loading page while it boots, then proxies the traffic through. Services that sit idle are stopped after a configurable timeout, so containers only run when someone is actually using them.',
    highlights: [
      'Live startup page with streaming docker compose logs and a progress estimate that auto-reloads when the service is ready, or bring your own HTML.',
      'Wake-on-connect for TCP services too, so Minecraft and other game servers start on the first connection.',
      'Generates the reverse-proxy config for you: NGINX site configs, or a Caddyfile and caddy-docker-proxy labels.',
      'Start and stop hooks run your own commands around each service, which also lets it manage non-Docker services.',
      'Every service lives in one JSON file, and a setup script installs the whole thing with a single command.',
    ],
    tech: ['TypeScript', 'Node.js', 'Docker', 'NGINX', 'Caddy', 'Linux'],
    period: 'Jan 2024 – Mar 2024',
    status: 'open-source',
    featured: true,
    icon: SiDocker,
    hue: 200,
    github: 'https://github.com/jelliott2021/DockerWakeUp',
    repo: 'jelliott2021/DockerWakeUp',
    stars: 243,
    gif: '/videos/dockerwakeup.gif',
  },
  {
    id: 'home-server',
    title: 'Ubuntu Home Server',
    tagline: 'The self-managed Ubuntu Server that hosts this site, BoozeBrawl, and my other projects.',
    description:
      'A production-style server I administer entirely from the command line. Every service runs in Docker Compose on its own isolated network, sits behind a reverse proxy with automatic TLS, and redeploys on its own when I push to GitHub. I treat it the way I would treat production: locked-down access, only the ports that need to be open, and logs and metrics I actually look at.',
    highlights: [
      'Each project gets its own Compose file and bridge network, so BoozeBrawl and this site cannot see each other’s containers.',
      'A self-hosted GitHub Actions runner rebuilds and restarts the affected containers on every push to main, with no manual steps.',
      'Docker Wake Up fronts the services: reverse proxy with TLS, containers started on demand and stopped when idle.',
      'Hardened like production: SSH keys only, a non-root deploy user, a firewall that exposes only what is needed, and unattended security updates.',
      'Day-to-day work over SSH: systemd services, Docker networking, DNS, logs, and disk and network troubleshooting.',
    ],
    tech: ['Ubuntu Server', 'Docker Compose', 'NGINX', 'Linux', 'GitHub Actions', 'Networking', 'SSH'],
    period: '2021 – Present',
    status: 'self-hosted',
    featured: true,
    icon: FiServer,
    hue: 160,
  },
  {
    id: 'husky-connection',
    title: 'Husky Connection',
    tagline: 'A Q&A community platform for Northeastern students.',
    description:
      'A question-and-answer community with personalized profiles, real-time chat, and notifications for questions, comments, and updates. Accounts, group chats, and email and on-site notifications are built as independent modules so each can evolve on its own.',
    highlights: [
      'Real-time messaging and follow updates over Socket.io.',
      'Email and on-site notifications built as independent services.',
      'Jest test suite with mutation testing through Stryker.',
    ],
    tech: ['TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Jest'],
    period: 'Fall 2024',
    status: 'live',
    featured: true,
    icon: FiMessageSquare,
    hue: 350,
    github: 'https://github.com/jelliott2021/Fake-StackOverflow',
    live: 'https://cs4530-f24-110.onrender.com',
    video: '/videos/HuskyConnect.mp4',
    videoSize: '16 MB',
    note: 'Hosted on Render’s free tier, so the first load can take a few seconds.',
    credentials: { user: 'jelliott', password: '1234' },
  },
  {
    id: 'canvas-quiz',
    title: 'Canvas Quiz',
    tagline: 'A Canvas-style learning platform with role-based quizzes.',
    description:
      'A Canvas-style learning platform with separate roles for students, faculty, and administrators. Admins manage courses, modules, and assignments; faculty build quizzes with configurable settings; students take them. I built the quiz feature end to end.',
    tech: ['TypeScript', 'React', 'Node.js', 'MongoDB'],
    status: 'live',
    featured: false,
    icon: FiLayers,
    hue: 30,
    github: 'https://github.com/jelliott2021/Canvas-Quiz-React',
    live: 'https://fake-canvas-react.onrender.com/#/Kanbas/Account/Signin',
    video: '/videos/CanvasQuiz.mp4',
    videoSize: '24 MB',
    note: 'Hosted on Render’s free tier, so the first load can take a few seconds.',
    credentials: { user: 'Jack', password: '1234' },
  },
  {
    id: 'photo-editor',
    title: 'Photo Editor',
    tagline: 'A Java Swing image editor built on the MVC pattern.',
    description:
      'Opens, edits, and saves PNG, JPG, BMP, and PPM images. Includes brightness adjustment, greyscale and sepia filters, blur, sharpen, horizontal and vertical flips, and a configurable mosaic effect.',
    tech: ['Java', 'Swing', 'JUnit', 'MVC'],
    status: 'open-source',
    featured: false,
    icon: FiImage,
    hue: 150,
    github: 'https://github.com/jelliott2021/PhotoEditor',
    video: '/videos/PhotoEditor.mp4',
    videoSize: '52 MB',
  },
  {
    id: 'portfolio',
    title: 'This website',
    tagline: 'The portfolio you are reading right now.',
    description:
      'A data-driven React and TypeScript single page with light and dark themes, scroll-aware navigation, and demo videos that load only on request. Built with Docker and deployed automatically from GitHub Actions.',
    tech: ['TypeScript', 'React', 'CSS', 'Docker', 'GitHub Actions'],
    period: 'Nov 2024 – Present',
    status: 'open-source',
    featured: false,
    icon: FiCode,
    hue: 215,
    github: 'https://github.com/jelliott2021/PersonalWebsite',
    live: 'https://www.johnedwardelliott.com',
  },
];

export const statusLabels: Record<ProjectStatus, string> = {
  'live': 'Live',
  'open-source': 'Open source',
  'self-hosted': 'Self-hosted',
  'private': 'Private',
  'archived': 'Archived',
};
