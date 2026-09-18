import { RefObject, useEffect } from 'react';
import { prefersReducedMotion } from '../lib/motion';

/** Fraction of the viewport height where a stop lights up as it scrolls past. */
export const ANCHOR = 0.66;

/**
 * Drives the experience section's transit-line effect: as the visitor
 * scrolls, the red line draws itself from the first stop towards the last,
 * and each stop lights up and reveals its card the moment the line reaches
 * it. Positions are measured from the markers so the line follows the layout
 * at any breakpoint. Reduced motion shows the finished line and every card.
 *
 * Expects `ref` to point at a container holding `.timeline__item` elements
 * that each contain a `.timeline__marker`. Writes `--track-top`,
 * `--track-height`, and `--timeline-progress` custom properties on the
 * container and toggles `is-reached` on each item.
 */
const useTimelineProgress = (ref: RefObject<HTMLElement>): void => {
  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return undefined;
    }

    const reduceMotion = prefersReducedMotion();
    const items = Array.from(root.querySelectorAll<HTMLElement>('.timeline__item'));
    const markers = items.map(item => item.querySelector<HTMLElement>('.timeline__marker'));
    if (items.length === 0 || markers.some(marker => !marker)) {
      return undefined;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rootTop = root.getBoundingClientRect().top;
      const anchor = window.innerHeight * ANCHOR;

      // Centre of each stop's dot, relative to the viewport.
      const centers = markers.map(marker => {
        const dot = window.getComputedStyle(marker as HTMLElement, '::after');
        const offset = Number.parseFloat(dot.top) || 0;
        const size = Number.parseFloat(dot.height) || 16;
        return (marker as HTMLElement).getBoundingClientRect().top + offset + size / 2;
      });

      const first = centers[0];
      const last = centers[centers.length - 1];
      const span = Math.max(1, last - first);
      const progress = reduceMotion ? 1 : Math.min(1, Math.max(0, (anchor - first) / span));

      root.style.setProperty('--track-top', `${first - rootTop}px`);
      root.style.setProperty('--track-height', `${span}px`);
      root.style.setProperty('--timeline-progress', progress.toFixed(4));

      items.forEach((item, index) => {
        item.classList.toggle('is-reached', reduceMotion || centers[index] <= anchor);
      });
    };

    const schedule = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [ref]);
};

export default useTimelineProgress;
