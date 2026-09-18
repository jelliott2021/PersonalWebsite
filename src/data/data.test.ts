/**
 * Guards the content files. The site is data-driven, so a typo in a data
 * file is the most likely way to break it. These checks catch duplicate
 * ids, broken asset paths, and values that the components assume.
 */
import fs from 'fs';
import path from 'path';
import { EDUCATION } from './education';
import { EXPERIENCE } from './experience';
import { NAV_LINKS, SECTION_IDS } from './navigation';
import { profile } from './profile';
import { PROJECTS, statusLabels } from './projects';
import { SKILL_GROUPS } from './skills';

const PUBLIC_DIR = path.resolve(__dirname, '../../public');

/** True when a site-relative URL such as "/videos/demo.mp4" exists in public/. */
const publicFileExists = (url: string): boolean => fs.existsSync(path.join(PUBLIC_DIR, url));

const uniqueIds = (items: readonly { id: string }[]) => {
  const ids = items.map(item => item.id);
  expect(new Set(ids).size).toBe(ids.length);
};

describe('profile', () => {
  it('has consistent name fields', () => {
    expect(profile.name).toBe(`${profile.firstName} ${profile.lastName}`);
    expect(profile.fullName).toContain(profile.firstName);
    expect(profile.fullName).toContain(profile.lastName);
  });

  it('links to the same handles it displays', () => {
    expect(profile.github).toBe(`https://github.com/${profile.githubHandle}`);
    expect(profile.linkedin).toContain(profile.linkedinHandle);
    expect(profile.sourceUrl.startsWith(profile.github)).toBe(true);
  });

  it('has a valid email and phone', () => {
    expect(profile.email).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]+$/i);
    expect(profile.phone.replace(/[^\d+]/g, '')).toMatch(/^\+?\d{10,}$/);
  });

  it('points at assets that exist', () => {
    expect(publicFileExists(profile.resumeUrl)).toBe(true);
    expect(publicFileExists(profile.photo)).toBe(true);
  });

  it('has at least one paragraph, interest, and stat', () => {
    expect(profile.about.length).toBeGreaterThan(0);
    expect(profile.interests.length).toBeGreaterThan(0);
    expect(profile.stats.length).toBeGreaterThan(0);
  });

  it('gives every stat a number the counter can animate', () => {
    profile.stats.forEach(stat => {
      expect(stat.value).toMatch(/\d/);
      expect(stat.label.length).toBeGreaterThan(0);
    });
  });
});

describe('navigation', () => {
  it('has unique ids and starts with the hero', () => {
    uniqueIds(NAV_LINKS);
    expect(SECTION_IDS[0]).toBe('home');
    expect(SECTION_IDS.slice(1)).toEqual(NAV_LINKS.map(link => link.id));
  });
});

describe('experience', () => {
  it('has unique ids', () => {
    uniqueIds(EXPERIENCE);
  });

  it('gives every entry either bullets or a summary', () => {
    EXPERIENCE.forEach(item => {
      expect(item.bullets.length > 0 || Boolean(item.summary)).toBe(true);
    });
  });

  it('uses https for every company link', () => {
    EXPERIENCE.filter(item => item.companyUrl).forEach(item => {
      expect(item.companyUrl).toMatch(/^https:\/\//);
    });
  });

  it('lists the current role first and it is marked present', () => {
    expect(EXPERIENCE[0].end).toBe('Present');
    expect(EXPERIENCE[0].company).toBe(profile.company);
    expect(EXPERIENCE[0].role).toBe(profile.role);
  });
});

describe('projects', () => {
  it('has unique ids and at least one featured project', () => {
    uniqueIds(PROJECTS);
    expect(PROJECTS.some(project => project.featured)).toBe(true);
  });

  it('has a label for every status in use', () => {
    PROJECTS.forEach(project => {
      expect(statusLabels[project.status]).toBeTruthy();
    });
  });

  it('keeps every hue on the colour wheel', () => {
    PROJECTS.forEach(project => {
      expect(project.hue).toBeGreaterThanOrEqual(0);
      expect(project.hue).toBeLessThan(360);
    });
  });

  it('references media files that exist in public/', () => {
    PROJECTS.forEach(project => {
      [project.video, project.preview, project.gif].filter(Boolean).forEach(url => {
        expect(publicFileExists(url as string)).toBe(true);
      });
    });
  });

  it('pairs a repo slug with a matching GitHub link', () => {
    PROJECTS.filter(project => project.repo).forEach(project => {
      expect(project.github).toBe(`https://github.com/${project.repo}`);
    });
  });

  it('uses https for every external link', () => {
    PROJECTS.forEach(project => {
      [project.github, project.live].filter(Boolean).forEach(url => {
        expect(url).toMatch(/^https:\/\//);
      });
    });
  });

  it('states a size for every video so visitors know what they download', () => {
    PROJECTS.filter(project => project.video).forEach(project => {
      expect(project.videoSize).toMatch(/^\d+ MB$/);
    });
  });
});

describe('skills', () => {
  it('has unique group ids and unique skill names within each group', () => {
    uniqueIds(SKILL_GROUPS);
    SKILL_GROUPS.forEach(group => {
      const names = group.skills.map(skill => skill.name);
      expect(new Set(names).size).toBe(names.length);
      expect(names.length).toBeGreaterThan(0);
    });
  });

  it('uses six-digit hex colours', () => {
    SKILL_GROUPS.flatMap(group => group.skills)
      .filter(skill => skill.color)
      .forEach(skill => {
        expect(skill.color).toMatch(/^#[0-9A-F]{6}$/i);
      });
  });
});

describe('education', () => {
  it('has unique ids and coursework for each entry', () => {
    uniqueIds(EDUCATION);
    EDUCATION.forEach(item => {
      expect(item.coursework.length).toBeGreaterThan(0);
      expect(item.end).toMatch(/\d{4}$/);
    });
  });
});
