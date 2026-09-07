export interface EducationItem {
  id: string;
  school: string;
  schoolUrl?: string;
  college?: string;
  degree: string;
  location: string;
  start: string;
  end: string;
  gpa?: string;
  coursework: string[];
  highlights: string[];
}

export const EDUCATION: EducationItem[] = [
  {
    id: 'northeastern',
    school: 'Northeastern University',
    schoolUrl: 'https://www.khoury.northeastern.edu/',
    college: 'Khoury College of Computer Sciences',
    degree: 'Bachelor of Science in Computer Science',
    location: 'Boston, MA',
    start: 'Sep 2021',
    end: 'Dec 2024',
    gpa: '3.3 / 4.0',
    coursework: [
      'Fundamentals of Software Engineering',
      'Object-Oriented Design',
      'Web Development',
      'Database Design',
      'Algorithms and Data',
      'Computer Systems',
      'Network Fundamentals',
      'Programming in C++',
    ],
    highlights: [
      'Completed the degree in three and a half years, including a six-month co-op at MFS Investment Management.',
      'Teaching Assistant for CS3200 Database Design (Spring 2023).',
    ],
  },
];
