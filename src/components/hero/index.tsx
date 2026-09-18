import React from 'react';
import {
  FiArrowRight,
  FiChevronDown,
  FiFileText,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMapPin,
} from 'react-icons/fi';
import { profile } from '../../data/profile';
import useBostonTime from '../../hooks/useBostonTime';
import useBostonWeather from '../../hooks/useBostonWeather';
import Skyline from '../skyline';
import './index.css';

/**
 * Full-height introduction. Opens with a live greeting from Boston, the name
 * set with an outlined surname, then the pitch, calls to action, and a photo,
 * with the skyline faintly along the bottom edge.
 */
const Hero = () => {
  const { time, greeting } = useBostonTime();
  const weather = useBostonWeather();

  return (
    <section id='home' className='hero' aria-label='Introduction'>
      <div className='hero__bg' aria-hidden='true' />
      <Skyline className='hero__skyline' />
      <div className='container hero__inner'>
        <div className='hero__content'>
          <p className='hero__eyebrow'>
            <span className='hero__eyebrow-dot' aria-hidden='true' />
            <span>
              {greeting} from Boston
              <span className='hero__time'>
                <span aria-hidden='true'> · </span>
                <time>{time}</time> ET
              </span>
              {weather && (
                <span className='hero__weather'>
                  <span aria-hidden='true'> · </span>
                  {Math.round(weather.temperature)}°F and {weather.label}
                </span>
              )}
            </span>
          </p>
          <h1 className='hero__title'>
            <span className='hero__first'>{profile.firstName}</span>{' '}
            <span className='hero__last'>{profile.lastName}</span>
            <span className='hero__period' aria-hidden='true'>
              .
            </span>
          </h1>
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
          <div className='hero__badges'>
            <div className='hero__badge'>
              <span className='hero__badge-dot' aria-hidden='true' />
              <span>
                {profile.role} @{' '}
                <a href={profile.companyUrl} target='_blank' rel='noopener noreferrer'>
                  {profile.company}
                </a>
              </span>
            </div>
            <div className='hero__badge hero__badge--place'>
              <FiMapPin aria-hidden='true' />
              <span>{profile.location}</span>
              <span className='hero__coords'>{profile.coordinates}</span>
            </div>
          </div>
        </div>
      </div>

      <a href='#about' className='hero__scroll' aria-label='Scroll to the About section'>
        <FiChevronDown />
      </a>
    </section>
  );
};

export default Hero;
