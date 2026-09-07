import { useEffect, useState } from 'react';

/**
 * Tracks which page section currently sits under the reading line
 * (roughly 40% down the viewport) so the navbar can highlight it.
 *
 * @param ids Section element ids in document order. Pass a stable array.
 */
const useActiveSection = (ids: readonly string[]): string => {
  const [active, setActive] = useState<string>(ids[0] ?? '');

  useEffect(() => {
    const sections = ids
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0 || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const intersecting = new Map<string, boolean>();

    const pickActive = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActive(ids[ids.length - 1]);
        return;
      }
      const current = ids.filter(id => intersecting.get(id));
      if (current.length > 0) {
        setActive(current[current.length - 1]);
      }
    };

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => intersecting.set(entry.target.id, entry.isIntersecting));
        pickActive();
      },
      // A thin horizontal band 40–46% down the viewport acts as the reading line.
      { rootMargin: '-40% 0px -54% 0px', threshold: 0 },
    );

    sections.forEach(section => observer.observe(section));
    window.addEventListener('scroll', pickActive, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', pickActive);
    };
  }, [ids]);

  return active;
};

export default useActiveSection;
