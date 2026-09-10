export interface ExperienceItem {
  id: string;
  company: string;
  companyUrl?: string;
  role: string;
  type: 'Full-time' | 'Contract' | 'Co-op' | 'Part-time' | 'Seasonal';
  location: string;
  start: string;
  /** Leave undefined to show only the start (for example, a bare year). */
  end?: string;
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
      'Design and build REST APIs, protocols, and new resources for production healthcare software used by 1,000+ organizations.',
      'Build the multi-factor authentication sign-in page and the authentication flow behind it.',
      'Develop the Angular administrative app teams use to create and manage the REST resources and configuration that production systems consume.',
      'Help build a new API gateway and the FHIR APIs it serves as part of a small Cloud Platform team.',
      'Ship features end to end, from backend APIs to the admin UI, with Jest tests and Jenkins pipelines deploying to Google Cloud.',
    ],
    tech: ['TypeScript', 'Angular', 'Node.js', 'FHIR', 'Google Cloud', 'Jest', 'Jenkins'],
  },
  {
    id: 'contract',
    company: 'Independent projects',
    role: 'Software Contractor',
    type: 'Contract',
    location: 'Boston, MA',
    start: '2026',
    summary:
      'Build iOS and web apps for independent clients in Swift, Node.js, and React, alongside my full-time role.',
    bullets: [],
    tech: ['Swift', 'Node.js', 'React'],
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
      'Built the team’s automated testing pipeline in Java and Selenium, using manual QA data to prioritize coverage and cut repetitive work for teams.',
      'Added pull-request checks that run the test suite, efficiency tests, organization standards, and report results before code merges.',
      'Built Grafana dashboards for speed tests, failure rates, and performance trends so regressions show up at a glance.',
      'Led the overhaul of the QA sign-off process, moved project tracking into Jira, and extended the company’s core test framework.',
      'Served as QA point of contact for several scrum teams, embedding automated testing and reports in their process.',
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
      'Led three two-hour office hours a week on relational algebra, SQL, ER modeling, Python, Flask, and Docker.',
      'Streamlined grading so 287 students got timely, specific feedback on their work.',
      'Helped students debug their Flask, MySQL, and Docker course projects in person and over email.',
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
      'Ran the town’s tennis and pickleball programs for six summers. Scheduling, coaching, and keeping the public happy taught me more about communication and leadership than any class did.',
    bullets: [],
    tech: [],
  },
];
