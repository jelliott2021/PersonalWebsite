import React from 'react';
import { FiAward, FiMapPin } from 'react-icons/fi';
import { EDUCATION } from '../../data/education';
import SectionHeader from '../sectionHeader';
import Reveal from '../reveal';
import './index.css';

const Education = () => (
  <section id='education' className='section'>
    <div className='container'>
      <Reveal>
        <SectionHeader index='05' title='Education' />
      </Reveal>

      <div className='edu-list'>
        {EDUCATION.map(item => (
          <Reveal tag='article' key={item.id} className='card edu'>
            <div className='edu__head'>
              <div className='edu__badge' aria-hidden='true'>
                <FiAward />
              </div>
              <div className='edu__titles'>
                <h3 className='edu__school'>
                  {item.schoolUrl ? (
                    <a href={item.schoolUrl} target='_blank' rel='noopener noreferrer'>
                      {item.school}
                    </a>
                  ) : (
                    item.school
                  )}
                </h3>
                {item.college && <p className='edu__college'>{item.college}</p>}
                <p className='meta edu__meta'>
                  <FiMapPin aria-hidden='true' /> {item.location}
                </p>
              </div>
              <div className='edu__period'>
                <span>{item.start}</span>
                <span aria-hidden='true'>—</span>
                <span>{item.end}</span>
              </div>
            </div>

            <div className='edu__degree-row'>
              <p className='edu__degree'>{item.degree}</p>
              {item.gpa && <span className='edu__gpa'>GPA {item.gpa}</span>}
            </div>

            {item.highlights.length > 0 && (
              <ul className='bullets edu__highlights'>
                {item.highlights.map(highlight => (
                  <li key={highlight.slice(0, 32)}>{highlight}</li>
                ))}
              </ul>
            )}

            <div className='edu__courses'>
              <span className='label'>Relevant coursework</span>
              <ul className='chips'>
                {item.coursework.map(course => (
                  <li key={course} className='chip chip--neutral'>
                    {course}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Education;
