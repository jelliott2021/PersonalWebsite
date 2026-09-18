/**
 * The page's sections in reading order. The navbar, the active-section
 * tracker, and the legacy-route redirects all derive from this one list so
 * adding a section is a single edit.
 */

export interface NavLink {
  /** Element id of the section, also used as the URL hash. */
  id: string;
  label: string;
}

/** Sections that appear in the navigation menu, in page order. */
export const NAV_LINKS: readonly NavLink[] = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

/** Every section id in page order, including the hero. Stable reference for hooks. */
export const SECTION_IDS: readonly string[] = ['home', ...NAV_LINKS.map(link => link.id)];
