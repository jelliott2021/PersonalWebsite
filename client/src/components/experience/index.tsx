import React from 'react';
import { EXPERIENCE } from '../../data/experience';
import SectionHeader from '../sectionHeader';
import Reveal from '../reveal';
import './index.css';

const Experience = () => (
  <section id='experience' className='section section--band'>
    <div className='container'>
      <Reveal>
        <SectionHeader
          index='02'
          title='Where I’ve worked'
          subtitle='Production healthcare software, financial-services QA automation, and teaching databases to a few hundred students.'
        />
      </Reveal>

      <ol className='timeline'>
        {EXPERIENCE.map((item, index) => (
          <Reveal tag='li' key={item.id} className='timeline__item' delay={index * 60}>
            <div className='timeline__period'>
              <span>{item.start}</span>
              <span className='timeline__period-sep' aria-hidden='true' />
              <span>{item.end}</span>
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
          </Reveal>
        ))}
      </ol>
    </div>
  </section>
);

export default Experience;
