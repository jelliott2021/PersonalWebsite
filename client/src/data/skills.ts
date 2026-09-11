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
  /**
   * Brand colour the chip takes on hover. Left out for logos whose brand
   * colour is black or near-black, which fall back to the site accent.
   */
  color?: string;
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
      { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
      { name: 'JavaScript', icon: SiJavascript, color: '#E5C700' },
      { name: 'Java', icon: FaJava, color: '#E76F00' },
      { name: 'Python', icon: SiPython, color: '#3776AB' },
      { name: 'Swift', icon: SiSwift, color: '#F05138' },
      { name: 'C / C++', icon: SiCplusplus, color: '#00599C' },
      { name: 'SQL', icon: SiMysql, color: '#4479A1' },
      { name: 'HTML', icon: SiHtml5, color: '#E34F26' },
      { name: 'CSS', icon: SiCss, color: '#663399' },
      { name: 'Shell', icon: SiGnubash, color: '#4EAA25' },
    ],
  },
  {
    id: 'frameworks',
    title: 'Frameworks & libraries',
    blurb: 'Frontend frameworks plus the Node and Python backends behind them.',
    skills: [
      { name: 'React', icon: SiReact, color: '#149ECA' },
      { name: 'Angular', icon: SiAngular, color: '#DD0031' },
      { name: 'Node.js', icon: SiNodedotjs, color: '#5FA04E' },
      { name: 'Express', icon: SiExpress },
      { name: 'Flask', icon: SiFlask },
      { name: 'Socket.io', icon: SiSocketdotio },
      { name: 'RESTful APIs' },
      { name: 'FHIR APIs', color: '#E8492B' },
    ],
  },
  {
    id: 'testing',
    title: 'Testing & quality',
    blurb: 'Unit, end-to-end, and browser automation. Mutation testing when it counts.',
    skills: [
      { name: 'Jest', icon: SiJest, color: '#C21325' },
      { name: 'JUnit 4', icon: SiJunit5, color: '#25A162' },
      { name: 'Selenium', icon: SiSelenium, color: '#43B02A' },
      { name: 'Cypress', icon: SiCypress, color: '#04C38E' },
      { name: 'Stryker', color: '#E74C3C' },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud, DevOps & infrastructure',
    blurb: 'Comfortable owning the deploy: containers, proxies, pipelines, and a Linux server I run like production.',
    skills: [
      { name: 'Docker', icon: SiDocker, color: '#2496ED' },
      { name: 'Docker Compose', color: '#2496ED' },
      { name: 'NGINX', icon: SiNginx, color: '#009639' },
      { name: 'Caddy', icon: SiCaddy, color: '#1F88C0' },
      { name: 'Azure', icon: VscAzure, color: '#0078D4' },
      { name: 'Google Cloud', icon: SiGooglecloud, color: '#4285F4' },
      { name: 'Jenkins', icon: SiJenkins, color: '#D24939' },
      { name: 'Git & GitHub Actions', icon: SiGit, color: '#F05032' },
      { name: 'Linux', icon: SiLinux, color: '#E0B000' },
      { name: 'Ubuntu Server', icon: SiUbuntu, color: '#E95420' },
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
      { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
      { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
      { name: 'SQLite', icon: SiSqlite, color: '#0F80CC' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools & workflow',
    blurb: 'The day-to-day kit.',
    skills: [
      { name: 'Jira', icon: SiJira, color: '#0052CC' },
      { name: 'Confluence', icon: SiConfluence, color: '#2684FF' },
      { name: 'Postman', icon: SiPostman, color: '#FF6C37' },
      { name: 'Grafana', icon: SiGrafana, color: '#F46800' },
      { name: 'IntelliJ IDEA', icon: SiIntellijidea, color: '#FE315D' },
      { name: 'VS Code', icon: VscVscode, color: '#007ACC' },
      { name: 'DataGrip', icon: SiDatagrip, color: '#21D789' },
      { name: 'AppSmith', icon: SiAppsmith, color: '#F4511E' },
      { name: 'Linux / Ubuntu', icon: SiUbuntu, color: '#E95420' },
      { name: 'Windows / macOS', icon: FaWindows, color: '#0078D4' },
    ],
  },
];
