/**
 * Everything about the person behind the site lives here so a résumé update
 * is a data change, not a component change.
 */

export interface Stat {
  value: string;
  label: string;
}

export const profile = {
  firstName: 'John',
  lastName: 'Elliott',
  name: 'John Elliott',
  fullName: 'John Edward Elliott',
  role: 'Software Developer',
  company: 'MEDITECH',
  companyUrl: 'https://ehr.meditech.com/',
  location: 'Boston, MA',
  email: 'elliott.joh@northeastern.edu',
  phone: '(617) 615-7955',
  /** The phone number is in the résumé PDF; flip this to show it on the page too. */
  showPhone: false,
  github: 'https://github.com/jelliott2021',
  githubHandle: 'jelliott2021',
  linkedin: 'https://www.linkedin.com/in/jelliott2002',
  linkedinHandle: 'jelliott2002',
  resumeUrl: '/John-Elliott-Resume.pdf',
  siteUrl: 'https://www.johnedwardelliott.com',
  sourceUrl: 'https://github.com/jelliott2021/PersonalWebsite',
  photo: '/linkedin.jpg',

  headline: 'I build full-stack software for systems people depend on.',
  intro:
    'Software developer at MEDITECH, where I design RESTful backend services and the Angular ' +
    'tooling that configures them for production healthcare software. I work mostly in ' +
    'TypeScript across Angular, React, and Node.js, and I care about clear APIs, solid tests, ' +
    'and shipping things that hold up in the real world.',

  about: [
    'I’m a software developer at MEDITECH in Canton, MA, where I work across the stack: ' +
      'designing RESTful backend services and building the Angular-based administrative ' +
      'application used to create, update, and manage the configuration those services run on. ' +
      'The software I contribute to is deployed across more than 1,000 healthcare organizations, ' +
      'so reliability, clean interfaces, and tests that catch problems early matter a lot to me.',
    'I graduated from Northeastern University’s Khoury College of Computer Sciences in ' +
      'December 2024 with a B.S. in Computer Science. Along the way I spent a six-month co-op at ' +
      'MFS Investment Management building Java and Selenium test automation, and I was a ' +
      'teaching assistant for CS3200 Database Design, supporting 287 students through office ' +
      'hours and grading.',
    'Away from the keyboard I’m usually on a course or a court: golf, tennis, pickleball, ' +
      'spikeball, skiing, and soccer. I also tinker with 3D printing and enjoy self-hosting my ' +
      'side projects with Docker, which is where Docker Wake Up came from.',
  ],

  interests: [
    'Golf',
    'Tennis',
    'Pickleball',
    'Spikeball',
    'Skiing',
    'Soccer',
    'Track',
    '3D printing',
    'Self-hosting',
  ],

  stats: [
    { value: '1,000+', label: 'healthcare organizations run software I help build' },
    { value: '287', label: 'students supported as a Database Design TA' },
    { value: '6', label: 'full-stack projects shipped, from party games to reverse proxies' },
  ] as Stat[],
};

export type Profile = typeof profile;
