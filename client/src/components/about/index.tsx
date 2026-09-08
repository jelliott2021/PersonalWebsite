import React from 'react';
import { FiBookOpen, FiBriefcase, FiHome, FiMail, FiMapPin } from 'react-icons/fi';
import { profile } from '../../data/profile';
import { EDUCATION } from '../../data/education';
import SectionHeader from '../sectionHeader';
import Reveal from '../reveal';
import './index.css';

const About = () => {
  const degree = EDUCATION[0];

  return (
    <section id='about' className='section'>
      <div className='container'>
        <Reveal>
          <SectionHeader index='01' title='About me' caption='Boston, MA' />
        </Reveal>

        <div className='about__grid'>
          <Reveal className='about__text'>
            {profile.about.map(paragraph => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}

            <div className='about__interests'>
              <span className='label'>Off the keyboard</span>
              <ul className='chips'>
                {profile.interests.map(interest => (
                  <li key={interest} className='chip chip--neutral'>
                    {interest}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal className='about__aside' delay={120}>
            <div className='card about__facts'>
              <span className='label'>At a glance</span>
              <dl>
                <div className='about__fact'>
                  <dt>
                    <FiMapPin aria-hidden='true' /> Based in
                  </dt>
                  <dd>{profile.location}</dd>
                </div>
                <div className='about__fact'>
                  <dt>
                    <FiHome aria-hidden='true' /> From
                  </dt>
                  <dd>{profile.hometown}</dd>
                </div>
                <div className='about__fact'>
                  <dt>
                    <FiBriefcase aria-hidden='true' /> Currently
                  </dt>
                  <dd>
                    {profile.role} at{' '}
                    <a href={profile.companyUrl} target='_blank' rel='noopener noreferrer'>
                      {profile.company}
                    </a>
                  </dd>
                </div>
                <div className='about__fact'>
                  <dt>
                    <FiBookOpen aria-hidden='true' /> Education
                  </dt>
                  <dd>
                    B.S. Computer Science, {degree.school} ’{degree.end.slice(-2)}
                  </dd>
                </div>
                <div className='about__fact'>
                  <dt>
                    <FiMail aria-hidden='true' /> Email
                  </dt>
                  <dd>
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>

        <ul className='about__stats'>
          {profile.stats.map((stat, index) => (
            <Reveal tag='li' key={stat.label} className='about__stat' delay={index * 90}>
              <span className='about__stat-value'>{stat.value}</span>
              <span className='about__stat-label'>{stat.label}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default About;
