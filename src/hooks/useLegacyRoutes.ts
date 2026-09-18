import { useEffect } from 'react';

/**
 * The previous version of this site had separate pages. Old links such as
 * /projects should still land on the right section of the single page.
 */
const legacyPaths: Record<string, string> = {
  '/projects': 'projects',
  '/skills': 'skills',
  '/experience': 'experience',
  '/about': 'about',
  '/contact': 'contact',
};

const scrollToId = (id: string) => {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ block: 'start' });
  }
};

const useLegacyRoutes = () => {
  useEffect(() => {
    const path = window.location.pathname.replace(/\/+$/, '').toLowerCase();
    const legacyTarget = legacyPaths[path];

    if (legacyTarget) {
      window.history.replaceState(null, '', `/#${legacyTarget}`);
      window.requestAnimationFrame(() => scrollToId(legacyTarget));
      return;
    }

    const hash = window.location.hash.slice(1);
    if (hash) {
      // Content renders after the browser's native hash jump, so repeat it.
      window.requestAnimationFrame(() => scrollToId(hash));
    }
  }, []);
};

export default useLegacyRoutes;
