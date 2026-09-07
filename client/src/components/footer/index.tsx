import React from 'react';
import { FiArrowUp, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { profile } from '../../data/profile';
import './index.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className='footer'>
      <div className='container footer__inner'>
        <div className='footer__left'>
          <p className='footer__built'>
            Designed and built by <a href='#home'>{profile.name}</a>.
          </p>
          <p className='footer__meta'>
            React · TypeScript · Docker · GitHub Actions ·{' '}
            <a href={profile.sourceUrl} target='_blank' rel='noopener noreferrer'>
              View source
            </a>{' '}
            · © {year}
          </p>
        </div>

        <ul className='footer__social' aria-label='Social links'>
          <li>
            <a
              className='icon-btn'
              href={profile.github}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='GitHub'>
              <FiGithub />
            </a>
          </li>
          <li>
            <a
              className='icon-btn'
              href={profile.linkedin}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='LinkedIn'>
              <FiLinkedin />
            </a>
          </li>
          <li>
            <a className='icon-btn' href={`mailto:${profile.email}`} aria-label='Email'>
              <FiMail />
            </a>
          </li>
          <li>
            <a className='icon-btn footer__top' href='#home' aria-label='Back to top'>
              <FiArrowUp />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
