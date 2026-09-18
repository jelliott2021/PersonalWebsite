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
  hometown: 'Milton, MA',
  coordinates: '42.36° N, 71.06° W',
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

  headline: 'I build full-stack software that people can depend on.',
  intro:
    'I’m a full-stack developer at MEDITECH, just outside Boston, building healthcare software ' +
    'that more than 1,000 organizations rely on every day. I finished my Computer Science degree ' +
    'at Northeastern in three and a half years, and on the side I maintain an open-source project ' +
    'with 240+ GitHub stars and run the server that hosts my own apps.',

  about: [
    'At MEDITECH I get to work across the whole stack: Angular on the frontend, REST and FHIR ' +
      'APIs and databases on the backend, and the pipelines that carry it all to production on ' +
      'Google Cloud. ' +
      'When your code runs in more than 1,000 healthcare organizations, reliability and good ' +
      'tests stop being nice-to-haves, and I like that.',
    'Outside of work I build things end to end and keep them running. I made a real-time ' +
      'multiplayer party game with roughly 100 monthly active players. Docker Wake Up is an open-source reverse proxy ' +
      'that has picked up 240+ stars on GitHub. Both live on a hardened Ubuntu server I manage ' +
      'myself, with automated deployments on every push.',
    'I earned my B.S. in Computer Science from Northeastern in three and a half years, including a ' +
      'six-month co-op at MFS Investment Management and a semester as a teaching assistant for ' +
      'Database Design along the way. I grew up in Milton, just south of Boston, and I’ve lived ' +
      'and worked around the city my whole life.',
    'When I’m not at the keyboard, I’m usually on a course or a court playing golf, tennis, pickleball, ' +
      'skiing, or soccer.',
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
    { value: '1,000+', label: 'healthcare organizations use software I help build' },
    { value: '287', label: 'students supported as a Database Design teaching assistant' },
    { value: '240+', label: 'GitHub stars on Docker Wake Up, my open-source reverse proxy' },
  ] as Stat[],
};

export type Profile = typeof profile;
