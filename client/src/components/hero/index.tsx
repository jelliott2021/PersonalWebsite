import React from 'react';
import {
  FiArrowRight,
  FiChevronDown,
  FiFileText,
  FiGithub,
  FiLinkedin,
  FiMail,
} from 'react-icons/fi';
import { profile } from '../../data/profile';
import './index.css';

/**
 * Full-height introduction: name, headline, short pitch, calls to action,
 * and a photo.
 */
const Hero = () => (
  <section id='home' className='hero' aria-label='Introduction'>
    <div className='hero__bg' aria-hidden='true' />
    <div className='container hero__inner'>
      <div className='hero__content'>
        <p className='hero__eyebrow'>Hi, my name is</p>
        <h1 className='hero__title'>{profile.name}.</h1>
        <p className='hero__headline'>{profile.headline}</p>
        <p className='hero__intro'>{profile.intro}</p>

        <div className='hero__actions'>
          <a className='btn btn--primary btn--lg' href='#projects'>
            See my work
            <FiArrowRight aria-hidden='true' />
          </a>
          <a
            className='btn btn--secondary btn--lg'
            href={profile.resumeUrl}
            target='_blank'
            rel='noopener noreferrer'>
            <FiFileText aria-hidden='true' />
            View résumé
          </a>
        </div>

        <ul className='hero__social' aria-label='Profiles'>
          <li>
            <a href={profile.github} target='_blank' rel='noopener noreferrer'>
              <FiGithub aria-hidden='true' />
              <span>github.com/{profile.githubHandle}</span>
            </a>
          </li>
          <li>
            <a href={profile.linkedin} target='_blank' rel='noopener noreferrer'>
              <FiLinkedin aria-hidden='true' />
              <span>linkedin.com/in/{profile.linkedinHandle}</span>
            </a>
          </li>
          <li>
            <a href={`mailto:${profile.email}`}>
              <FiMail aria-hidden='true' />
              <span>{profile.email}</span>
            </a>
          </li>
        </ul>
      </div>

      <div className='hero__visual'>
        <div className='hero__photo'>
          <img
            src={profile.photo}
            alt={`${profile.fullName} standing in downtown Boston`}
            width='320'
            height='320'
          />
        </div>
        <div className='hero__badge'>
          <span className='hero__badge-dot' aria-hidden='true' />
          <span>
            {profile.role} @{' '}
            <a href={profile.companyUrl} target='_blank' rel='noopener noreferrer'>
              {profile.company}
            </a>
          </span>
        </div>
      </div>
    </div>

    <a href='#about' className='hero__scroll' aria-label='Scroll to the About section'>
      <FiChevronDown />
    </a>
  </section>
);

export default Hero;
