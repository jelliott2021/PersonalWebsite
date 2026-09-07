import type { IconType } from 'react-icons';
import { FaJava, FaWindows } from 'react-icons/fa';
import { VscAzure, VscVscode } from 'react-icons/vsc';
import {
  SiAngular,
  SiAppsmith,
  SiCaddy,
  SiConfluence,
  SiCplusplus,
  SiCss,
  SiCypress,
  SiDatagrip,
  SiDocker,
  SiExpress,
  SiFlask,
  SiGit,
  SiGnubash,
  SiGooglecloud,
  SiGrafana,
  SiHtml5,
  SiIntellijidea,
  SiJavascript,
  SiJenkins,
  SiJest,
  SiJira,
  SiJunit5,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNginx,
  SiNgrok,
  SiNodedotjs,
  SiPostman,
  SiPython,
  SiReact,
  SiSelenium,
  SiSocketdotio,
  SiSqlite,
  SiSwift,
  SiTypescript,
  SiUbuntu,
} from 'react-icons/si';

export interface Skill {
  name: string;
  icon?: IconType;
}

export interface SkillGroup {
  id: string;
  title: string;
  blurb: string;
  skills: Skill[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'languages',
    title: 'Languages',
    blurb: 'TypeScript is home base; Java and Python are close behind.',
    skills: [
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'Java', icon: FaJava },
      { name: 'Python', icon: SiPython },
      { name: 'Swift', icon: SiSwift },
      { name: 'C / C++', icon: SiCplusplus },
      { name: 'SQL', icon: SiMysql },
      { name: 'HTML', icon: SiHtml5 },
      { name: 'CSS', icon: SiCss },
      { name: 'Shell', icon: SiGnubash },
    ],
  },
  {
    id: 'frameworks',
    title: 'Frameworks & libraries',
    blurb: 'Frontend frameworks plus the Node and Python backends behind them.',
    skills: [
      { name: 'React', icon: SiReact },
      { name: 'Angular', icon: SiAngular },
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'Express', icon: SiExpress },
      { name: 'Flask', icon: SiFlask },
      { name: 'Socket.io', icon: SiSocketdotio },
      { name: 'RESTful APIs' },
      { name: 'FHIR APIs' },
    ],
  },
  {
    id: 'testing',
    title: 'Testing & quality',
    blurb: 'Unit, end-to-end, and browser automation. Mutation testing when it counts.',
    skills: [
      { name: 'Jest', icon: SiJest },
      { name: 'JUnit 4', icon: SiJunit5 },
      { name: 'Selenium', icon: SiSelenium },
      { name: 'Cypress', icon: SiCypress },
      { name: 'Stryker' },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud, DevOps & infrastructure',
    blurb: 'Comfortable owning the deploy: containers, proxies, pipelines, and a Linux server I run like production.',
    skills: [
      { name: 'Docker', icon: SiDocker },
      { name: 'Docker Compose' },
      { name: 'NGINX', icon: SiNginx },
      { name: 'Caddy', icon: SiCaddy },
      { name: 'Azure', icon: VscAzure },
      { name: 'Google Cloud', icon: SiGooglecloud },
      { name: 'Jenkins', icon: SiJenkins },
      { name: 'Git & GitHub Actions', icon: SiGit },
      { name: 'Linux', icon: SiLinux },
      { name: 'Ubuntu Server', icon: SiUbuntu },
      { name: 'Ngrok', icon: SiNgrok },
      { name: 'SSH & server hardening' },
      { name: 'Networking & DNS' },
    ],
  },
  {
    id: 'data',
    title: 'Databases',
    blurb: 'Document and relational stores. I also taught the fundamentals as a TA.',
    skills: [
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'MySQL', icon: SiMysql },
      { name: 'SQLite', icon: SiSqlite },
    ],
  },
  {
    id: 'tools',
    title: 'Tools & workflow',
    blurb: 'The day-to-day kit.',
    skills: [
      { name: 'Jira', icon: SiJira },
      { name: 'Confluence', icon: SiConfluence },
      { name: 'Postman', icon: SiPostman },
      { name: 'Grafana', icon: SiGrafana },
      { name: 'IntelliJ IDEA', icon: SiIntellijidea },
      { name: 'VS Code', icon: VscVscode },
      { name: 'DataGrip', icon: SiDatagrip },
      { name: 'AppSmith', icon: SiAppsmith },
      { name: 'Linux / Ubuntu', icon: SiUbuntu },
      { name: 'Windows / macOS', icon: FaWindows },
    ],
  },
];
