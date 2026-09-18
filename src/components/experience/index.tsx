import React, { RefObject, useEffect, useRef } from 'react';
import { EXPERIENCE } from '../../data/experience';
import SectionHeader from '../sectionHeader';
import Reveal from '../reveal';
import './index.css';

/** Fraction of the viewport height where a stop lights up as it scrolls past. */
const ANCHOR = 0.66;

/**
 * Drives the transit-line effect: as the visitor scrolls, the red line draws
 * itself from the first stop towards the last, and each stop lights up and
 * reveals its card the moment the line reaches it. Positions are measured
 * from the markers so the line follows the layout at any breakpoint.
 * Reduced motion shows the finished line and every card.
 */
const useTimelineProgress = (ref: RefObject<HTMLDivElement>) => {
  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return undefined;
    }

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

const Experience = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  useTimelineProgress(timelineRef);

  return (
    <section id='experience' className='section section--band'>
      <div className='container'>
        <Reveal>
          <SectionHeader
            index='02'
            title='Where I’ve worked'
            caption='Experience'
            subtitle='Production healthcare software, financial-services QA automation, and teaching databases to a few hundred students.'
          />
        </Reveal>

        <div className='timeline' ref={timelineRef}>
          <div className='timeline__track' aria-hidden='true' />
          <ol className='timeline__list'>
            {EXPERIENCE.map(item => (
              <li key={item.id} className='timeline__item'>
                <div className='timeline__period'>
                  <span>{item.start}</span>
                  {item.end && (
                    <>
                      <span className='timeline__period-sep' aria-hidden='true' />
                      <span>{item.end}</span>
                    </>
                  )}
                </div>

                <div className='timeline__marker' aria-hidden='true' />

                <article className='card timeline__card'>
                  <header className='timeline__head'>
                    <h3 className='timeline__role'>
                      {item.role}
                      <span className='timeline__company'>
                        <span aria-hidden='true'> @ </span>
                        <span className='sr-only'> at </span>
                        {item.companyUrl ? (
                          <a href={item.companyUrl} target='_blank' rel='noopener noreferrer'>
                            {item.company}
                          </a>
                        ) : (
                          item.company
                        )}
                      </span>
                    </h3>
                    <p className='meta timeline__meta'>
                      <span>{item.location}</span>
                      <span aria-hidden='true'>·</span>
                      <span>{item.type}</span>
                    </p>
                  </header>

                  {item.summary && <p className='timeline__summary'>{item.summary}</p>}

                  {item.bullets.length > 0 && (
                    <ul className='bullets'>
                      {item.bullets.map(bullet => (
                        <li key={bullet.slice(0, 32)}>{bullet}</li>
                      ))}
                    </ul>
                  )}

                  {item.tech.length > 0 && (
                    <ul className='chips timeline__tech' aria-label='Technologies'>
                      {item.tech.map(tech => (
                        <li key={tech} className='chip chip--tech'>
                          {tech}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Experience;
