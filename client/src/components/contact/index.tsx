import React, { useEffect, useState } from 'react';
import {
  FiCheck,
  FiCopy,
  FiFileText,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiPhone,
} from 'react-icons/fi';
import { profile } from '../../data/profile';
import Reveal from '../reveal';
import Sign from '../sign';
import Skyline from '../skyline';
import './index.css';

const Contact = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      // Clipboard access can be blocked; fall back to opening the mail client.
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id='contact' className='section section--band contact'>
      <div className='container'>
        <Reveal className='contact__inner'>
          <Sign
            index='06'
            title='What’s next?'
            caption='Contact'
            size='sm'
            className='contact__sign'
          />
          <h2 className='contact__title'>Let’s talk.</h2>
          <p className='contact__text'>
            I’m always happy to chat about software, new opportunities, or the best pickleball
            courts in Boston. Email is the fastest way to reach me, and I try to reply within a day
            or two.
          </p>

          <div className='contact__actions'>
            <a className='btn btn--primary btn--lg' href={`mailto:${profile.email}`}>
              <FiMail aria-hidden='true' />
              Say hello
            </a>
            <button type='button' className='btn btn--secondary btn--lg' onClick={copyEmail}>
              {copied ? <FiCheck aria-hidden='true' /> : <FiCopy aria-hidden='true' />}
              {copied ? 'Copied!' : 'Copy email'}
            </button>
          </div>

          <ul className='contact__links'>
            <li>
              <a href={profile.linkedin} target='_blank' rel='noopener noreferrer'>
                <FiLinkedin aria-hidden='true' /> LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.github} target='_blank' rel='noopener noreferrer'>
                <FiGithub aria-hidden='true' /> GitHub
              </a>
            </li>
            <li>
              <a href={profile.resumeUrl} target='_blank' rel='noopener noreferrer'>
                <FiFileText aria-hidden='true' /> Résumé (PDF)
              </a>
            </li>
            {profile.showPhone && (
              <li>
                <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}>
                  <FiPhone aria-hidden='true' /> {profile.phone}
                </a>
              </li>
            )}
          </ul>
        </Reveal>
      </div>
      <Skyline className='contact__skyline' />
    </section>
  );
};

export default Contact;
