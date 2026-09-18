import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/motion';

/**
 * Returns a ref and a `visible` flag that flips to true the first time the
 * element scrolls into view. Reveals immediately when the visitor prefers
 * reduced motion or the browser lacks IntersectionObserver.
 *
 * @param threshold Fraction of the element that must be on screen.
 */
const useReveal = <T extends HTMLElement>(threshold = 0.12) => {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return undefined;
    }

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -6% 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
};

export default useReveal;
