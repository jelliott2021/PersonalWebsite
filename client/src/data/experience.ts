export interface ExperienceItem {
  id: string;
  company: string;
  companyUrl?: string;
  role: string;
  type: 'Full-time' | 'Co-op' | 'Part-time' | 'Seasonal';
  location: string;
  start: string;
  end: string;
  summary?: string;
  bullets: string[];
  tech: string[];
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: 'meditech',
    company: 'MEDITECH',
    companyUrl: 'https://ehr.meditech.com/',
    role: 'Software Developer',
    type: 'Full-time',
    location: 'Canton, MA',
    start: 'May 2025',
    end: 'Present',
    bullets: [
      'Design and implement RESTful backend services used by production healthcare software deployed across 1,000+ healthcare organizations.',
      'Develop an Angular-based administrative web application used to create, update, and manage REST resources and configuration elements consumed by production systems.',
      'Build full-stack features spanning backend APIs and frontend administrative tooling, keeping configuration workflows and runtime services tightly integrated.',
    ],
    tech: ['TypeScript', 'Angular', 'Node.js', 'Google Cloud', 'Jest', 'Jenkins'],
  },
  {
    id: 'mfs',
    company: 'MFS Investment Management',
    companyUrl: 'https://www.mfs.com/',
    role: 'Software Engineer Co-op',
    type: 'Co-op',
    location: 'Boston, MA',
    start: 'Jul 2023',
    end: 'Dec 2023',
    bullets: [
      'Developed, troubleshot, and enhanced Java automation scripts to provide QA coverage across cross-functional teams, using Jenkins, Jira, Confluence, Selenium, and Grafana to streamline the automation pipeline.',
      'Spearheaded the overhaul of the QA sign-off process, performance-trend reporting, and the “Jirafication” of projects, and added multiple features to the company’s core test framework.',
      'Served as the primary contact for several projects, collaborating with scrum teams to integrate QA processes end to end.',
    ],
    tech: ['Java', 'JUnit 4', 'Selenium', 'Jenkins', 'Grafana', 'Jira'],
  },
  {
    id: 'neu-ta',
    company: 'Northeastern University',
    companyUrl: 'https://www.khoury.northeastern.edu/',
    role: 'Teaching Assistant, CS3200 Database Design',
    type: 'Part-time',
    location: 'Boston, MA',
    start: 'Jan 2023',
    end: 'Apr 2023',
    bullets: [
      'Led three weekly two-hour office hours covering relational algebra, SQL (DML and DDL), ER modeling, Flask, AppSmith, Ngrok, and Docker.',
      'Streamlined grading to deliver timely, actionable feedback to 287 students.',
      'Fielded student questions and concerns over email with a professional, supportive tone.',
    ],
    tech: ['Python', 'MySQL', 'SQLite', 'Flask', 'Ngrok', 'Docker'],
  },
  {
    id: 'wellfleet',
    company: 'Town of Wellfleet',
    role: 'Tennis & Pickleball Director',
    type: 'Seasonal',
    location: 'Wellfleet, MA',
    start: 'Summer 2016',
    end: 'Summer 2022',
    summary:
      'Six summers directing the town’s tennis and pickleball programs, a job that taught me more about communication, scheduling, and keeping people happy than any class did.',
    bullets: [],
    tech: [],
  },
];
