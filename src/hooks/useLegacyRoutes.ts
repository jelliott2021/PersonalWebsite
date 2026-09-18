import { useEffect } from 'react';
import { NAV_LINKS } from '../data/navigation';

/**
 * The previous version of this site had separate pages. Old links such as
 * /projects should still land on the right section of the single page.
 * Maps a lower-case path like "/projects" to the section id "projects".
 */
export const LEGACY_PATHS: Readonly<Record<string, string>> = Object.fromEntries(
  NAV_LINKS.map(link => [`/${link.id}`, link.id]),
);

/** Section id an old-style path points at, or undefined for any other path. */
export const legacyTargetFor = (pathname: string): string | undefined =>
  LEGACY_PATHS[pathname.replace(/\/+$/, '').toLowerCase()];

const scrollToId = (id: string) => {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
};

/**
 * On load, rewrites a legacy path to the matching hash and scrolls there.
 * Also repeats the native hash jump, because the content renders after the
 * browser has already tried it.
 */
const useLegacyRoutes = (): void => {
  useEffect(() => {
    const legacyTarget = legacyTargetFor(window.location.pathname);

    if (legacyTarget) {
      window.history.replaceState(null, '', `/#${legacyTarget}`);
      window.requestAnimationFrame(() => scrollToId(legacyTarget));
      return;
    }

    const hash = window.location.hash.slice(1);
    if (hash) {
      window.requestAnimationFrame(() => scrollToId(hash));
    }
  }, []);
};

export default useLegacyRoutes;
