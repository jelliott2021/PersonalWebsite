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
      'Design and build RESTful APIs, protocols, and new resources for production healthcare software used by 1,000+ healthcare organizations.',
      'Work on the multi-factor authentication (MFA) sign-in page and the authentication flow behind it.',
      'Develop the Angular administrative app that teams use to create, update, and manage the REST resources and configuration consumed by production systems.',
      'Contribute to the Cloud Platform as part of a small team building a new API gateway and the FHIR APIs and resources it serves.',
      'Ship full-stack features end to end, from backend APIs to the admin UI, so configuration changes flow cleanly into running services.',
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
      'Contract work for independent clients on iOS and web projects, building in Swift, Node.js, and React alongside my full-time role.',
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
      'Built the automated testing pipeline from the ground up, using results and data from manual QA runs to decide what Java and Selenium coverage to write first and to cut down on repetitive manual testing.',
      'Added automatic pull-request checks that run the test suite and report results before code is merged.',
      'Built Grafana dashboards tracking test speed, failure rates, and performance trends so the team could spot regressions at a glance.',
      'Led the overhaul of the QA sign-off process, moved project tracking into Jira, and added features to the company’s core test framework.',
      'Acted as the QA point of contact for several projects, working with scrum teams to fold automated testing into their process.',
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
      'Ran three two-hour office hours each week covering relational algebra, SQL, ER modeling, Flask, AppSmith, Ngrok, and Docker.',
      'Streamlined grading so 287 students received timely, specific feedback on their work.',
      'Answered student questions and concerns over email promptly and professionally.',
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
      'Ran the town’s seasonal tennis and pickleball programs for six summers, which taught me more about communication, scheduling, and keeping people happy than any class did.',
    bullets: [],
    tech: [],
  },
];
