import React, { CSSProperties, useEffect, useState } from 'react';
import './index.css';

interface Stop {
  id: string;
  label: string;
}

/** Sections in page order, each a medallion on the trail. */
const STOPS: Stop[] = [
  { id: 'home', label: 'Start' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

const clamp = (value: number): number => Math.min(1, Math.max(0, value));

/** How far the page can scroll, in pixels. */
const scrollRange = (): number => document.documentElement.scrollHeight - window.innerHeight;

/**
 * A Freedom Trail down the left edge of the page: a brick line that fills as
 * the visitor scrolls, with a bronze medallion at each section that lights
 * up once the trail reaches it. Medallions are links, so it doubles as a
 * quiet table of contents. Hidden on narrow screens where there is no margin.
 */
const FreedomTrail = () => {
  const [progress, setProgress] = useState(0);
  const [positions, setPositions] = useState<number[]>(() => STOPS.map(() => 0));

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      const range = scrollRange();
      const navHeight =
        Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
      setPositions(
        STOPS.map(stop => {
          const element = document.getElementById(stop.id);
          if (!element || range <= 0) {
            return 0;
          }
          const top = element.getBoundingClientRect().top + window.scrollY - navHeight;
          return clamp(top / range);
        }),
      );
    };

    const update = () => {
      frame = 0;
      const range = scrollRange();
      setProgress(range > 0 ? clamp(window.scrollY / range) : 0);
    };

    const schedule = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    measure();
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    // Sections move when late content (fonts, the GitHub graph) changes the page height.
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    observer?.observe(document.body);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      observer?.disconnect();
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  // The current stop is the last one the trail has reached.
  let current = 0;
  positions.forEach((position, index) => {
    if (progress + 0.002 >= position) {
      current = index;
    }
  });

  return (
    <nav
      className='trail'
      aria-label='Freedom Trail: page progress'
      style={{ '--trail-progress': progress } as CSSProperties}>
      <div className='trail__line' aria-hidden='true'>
        <div className='trail__fill' />
      </div>
      {STOPS.map((stop, index) => (
        <a
          key={stop.id}
          href={`#${stop.id}`}
          className={`trail__stop ${progress + 0.002 >= positions[index] ? 'is-lit' : ''} ${
            current === index ? 'is-current' : ''
          }`
            .replace(/\s+/g, ' ')
            .trim()}
          style={{ top: `${positions[index] * 100}%` }}
          data-label={stop.label}
          aria-label={stop.label}
          aria-current={current === index ? 'location' : undefined}
        />
      ))}
    </nav>
  );
};

export default FreedomTrail;
