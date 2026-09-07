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
  email: 'j.elliott2021@gmail.com',
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
    'I’m a software developer at MEDITECH, building REST and FHIR APIs, authentication flows, ' +
    'and the Angular admin tools behind healthcare software used by more than 1,000 ' +
    'organizations. I work mostly in TypeScript across Angular, React, and Node.js, and I care ' +
    'about clear APIs, thorough tests, and code that holds up in production.',

  about: [
    'At MEDITECH in Canton, MA, I work across the stack on production healthcare software: ' +
      'designing REST APIs, protocols, and new resources, building the Angular administrative ' +
      'app that manages their configuration, and working on the MFA sign-in and authentication ' +
      'flow. I’m also part of a small team on the Cloud Platform building a new API gateway and ' +
      'the FHIR APIs it serves. Because that software runs in more than 1,000 healthcare ' +
      'organizations, I put a premium on reliability, clean interfaces, and tests that catch ' +
      'problems before release.',
    'I earned my B.S. in Computer Science from Northeastern University’s Khoury College in ' +
      'December 2024. During my degree I spent a six-month co-op at MFS Investment Management ' +
      'writing Java and Selenium test automation, and I was a teaching assistant for CS3200 ' +
      'Database Design, supporting 287 students through office hours and grading.',
    'Away from the keyboard I’m usually on a course or a court: golf, tennis, pickleball, ' +
      'spikeball, skiing, and soccer. I also tinker with 3D printing and run my side projects ' +
      'on a home Ubuntu server I manage myself, which is how Docker Wake Up started.',
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
    { value: '240+', label: 'GitHub stars on Docker Wake Up, my open-source reverse proxy' },
  ] as Stat[],
};

export type Profile = typeof profile;
