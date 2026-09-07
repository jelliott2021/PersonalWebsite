import React from 'react';
import './index.css';

interface SectionHeaderProps {
  index: string;
  title: string;
  subtitle?: string;
}

/**
 * Numbered heading used at the top of every section.
 */
const SectionHeader = ({ index, title, subtitle }: SectionHeaderProps) => (
  <div className='section-header'>
    <div className='section-header__row'>
      <span className='section-header__index' aria-hidden='true'>
        {index}.
      </span>
      <h2 className='section-header__title'>{title}</h2>
      <span className='section-header__line' aria-hidden='true' />
    </div>
    {subtitle && <p className='section-header__subtitle'>{subtitle}</p>}
  </div>
);

export default SectionHeader;
