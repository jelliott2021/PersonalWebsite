import type { IconType } from 'react-icons';
import { SiDocker } from 'react-icons/si';
import { FiCode, FiImage, FiLayers, FiMessageSquare, FiUsers } from 'react-icons/fi';

export type ProjectStatus = 'live' | 'open-source' | 'private' | 'archived';

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
  /** Icon used for the media tile when there is no demo video. */
  icon: IconType;
  /** Hue (0-360) that tints the media tile so each project reads distinctly. */
  hue: number;
  github?: string;
  live?: string;
  video?: string;
  videoSize?: string;
  note?: string;
  credentials?: ProjectCredentials;
}

export const PROJECTS: Project[] = [
  {
    id: 'boozebrawl',
    title: 'BoozeBrawl',
    tagline: 'Lobby-based multiplayer party game website.',
    description:
      'Players create or join game rooms and play a rotation of mini-games with friends in real time. The React frontend and Node.js backend coordinate game state, player actions, and session lifecycles over Socket.io.',
    highlights: [
      'Architected and deployed the full stack: real-time lobby creation, session management, and gameplay.',
      'Backend manages authoritative game state and player actions so every client stays in sync.',
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
      'Open-source wake-on-request proxy: when a request arrives for a stopped service, it starts the container, shows a loading page while it boots, then proxies traffic through. Idle services are stopped after a configurable timeout to free CPU and memory.',
    highlights: [
      'Zero-downtime proxying with a startup page while services come online.',
      'Health checks and idle shutdown policies keep the host lean.',
      'Generates SSL-enabled NGINX reverse-proxy configs from a single JSON service definition, with a one-command installer.',
    ],
    tech: ['TypeScript', 'Node.js', 'Docker', 'NGINX', 'Linux'],
    period: 'Jan 2024 – Mar 2024',
    status: 'open-source',
    featured: true,
    icon: SiDocker,
    hue: 200,
    github: 'https://github.com/jelliott2021/DockerWakeUp',
  },
  {
    id: 'husky-connection',
    title: 'Husky Connection',
    tagline: 'A Q&A community platform for Northeastern students.',
    description:
      'Connects students through personalized profiles, real-time chat, and notifications for questions, comments, and updates. Built with a modular, service-oriented design so accounts, group chats, and email/on-site notifications each ship as independent modules.',
    highlights: [
      'Real-time messaging and follow updates over Socket.io.',
      'Email and on-site notification services built as independent modules.',
      'Backed by a Jest test suite with mutation testing via Stryker.',
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
    tagline: 'A Canvas-style LMS with role-based quizzes.',
    description:
      'Replicates the core of Canvas with role-based access for students, faculty, and administrators. Admins manage courses, modules, and assignments; faculty build quizzes with configurable settings; students take them. I owned the quiz functionality end to end.',
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
      'Open, edit, and save PNG, JPG, BMP, and PPM images. Supports brightness adjustment, greyscale filters (red, green, blue, luma, intensity, value), blur, sharpen, sepia, flips, and a configurable mosaic effect.',
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
      'A data-driven React + TypeScript single-page site with light and dark themes, scroll-aware navigation, and lazy-loaded demo videos. Built with Docker and deployed automatically from GitHub Actions.',
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
  'private': 'Private',
  'archived': 'Archived',
};
