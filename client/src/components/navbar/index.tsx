import React, { useEffect, useState } from 'react';
import { FiFileText, FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi';
import { profile } from '../../data/profile';
import type { Theme, ToggleOrigin } from '../../hooks/useTheme';
import './index.css';

export interface NavLink {
  id: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

interface NavbarProps {
  activeId: string;
  theme: Theme;
  /** Called with the toggle's centre so the theme wipe can grow out of it. */
  onToggleTheme: (origin?: ToggleOrigin) => void;
}

const Logo = () => (
  <svg viewBox='0 0 32 32' width='30' height='30' aria-hidden='true' focusable='false'>
    <path
      d='M16 2 L28 9 V23 L16 30 L4 23 V9 Z'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinejoin='round'
    />
    <text
      x='16'
      y='20.6'
      textAnchor='middle'
      fontSize='11'
      fontWeight='700'
      fontFamily='Inter, system-ui, sans-serif'
      fill='currentColor'>
      JE
    </text>
  </svg>
);

/**
 * Sticky top navigation with active-section highlighting, a theme toggle,
 * a résumé link, and a collapsible menu on small screens.
 */
const Navbar = ({ activeId, theme, onToggleTheme }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    const onResize = () => {
      if (window.innerWidth > 860) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const themeLabel = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <header
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${open ? 'navbar--open' : ''}`}>
      <div className='container navbar__inner'>
        <a href='#home' className='navbar__brand' onClick={() => setOpen(false)}>
          <span className='navbar__logo'>
            <Logo />
          </span>
          <span className='navbar__name'>{profile.name}</span>
        </a>

        <nav className='navbar__links' aria-label='Primary'>
          <ul>
            {NAV_LINKS.map(link => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={activeId === link.id ? 'is-active' : undefined}
                  aria-current={activeId === link.id ? 'true' : undefined}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className='navbar__actions'>
          <button
            type='button'
            className='icon-btn theme-toggle'
            onClick={event => {
              const rect = event.currentTarget.getBoundingClientRect();
              onToggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
            }}
            aria-label={themeLabel}
            title={themeLabel}>
            <span className='theme-toggle__icon theme-toggle__icon--sun' aria-hidden='true'>
              <FiSun />
            </span>
            <span className='theme-toggle__icon theme-toggle__icon--moon' aria-hidden='true'>
              <FiMoon />
            </span>
          </button>
          <a
            className='btn btn--secondary btn--sm navbar__resume'
            href={profile.resumeUrl}
            target='_blank'
            rel='noopener noreferrer'>
            <FiFileText aria-hidden='true' />
            Résumé
          </a>
          <button
            type='button'
            className='icon-btn navbar__toggle'
            onClick={() => setOpen(value => !value)}
            aria-expanded={open}
            aria-controls='mobile-menu'
            aria-label={open ? 'Close menu' : 'Open menu'}>
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      <nav id='mobile-menu' className='navbar__mobile' aria-label='Primary, mobile' hidden={!open}>
        <ul>
          {NAV_LINKS.map(link => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={activeId === link.id ? 'is-active' : undefined}
                onClick={() => setOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={profile.resumeUrl}
              target='_blank'
              rel='noopener noreferrer'
              onClick={() => setOpen(false)}>
              Résumé (PDF)
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
