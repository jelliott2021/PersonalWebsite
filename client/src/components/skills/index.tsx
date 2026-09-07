import React from 'react';
import { SKILL_GROUPS } from '../../data/skills';
import SectionHeader from '../sectionHeader';
import Reveal from '../reveal';
import './index.css';

const Skills = () => (
  <section id='skills' className='section section--band'>
    <div className='container'>
      <Reveal>
        <SectionHeader
          index='04'
          title='Skills & tools'
          subtitle='What I reach for day to day, grouped by where it fits in the stack.'
        />
      </Reveal>

      <div className='skills__grid'>
        {SKILL_GROUPS.map((group, index) => (
          <Reveal key={group.id} className='card skills__group' delay={index * 60}>
            <h3 className='skills__title'>{group.title}</h3>
            <p className='skills__blurb'>{group.blurb}</p>
            <ul className='skills__list'>
              {group.skills.map(skill => (
                <li key={skill.name} className='skill'>
                  <span className='skill__icon' aria-hidden='true'>
                    {skill.icon ? React.createElement(skill.icon) : <span className='skill__dot' />}
                  </span>
                  <span>{skill.name}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Skills;
