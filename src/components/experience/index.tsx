import { useRef } from 'react';
import { EXPERIENCE } from '../../data/experience';
import useTimelineProgress from '../../hooks/useTimelineProgress';
import SectionHeader from '../sectionHeader';
import Reveal from '../reveal';
import './index.css';

/**
 * Work history drawn as a transit line: each role is a stop that lights up
 * and reveals its card as the visitor scrolls past it.
 */
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
