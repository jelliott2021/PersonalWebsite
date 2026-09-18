import React from 'react';
import Sign from '../sign';
import './index.css';

interface SectionHeaderProps {
  index: string;
  title: string;
  /** Second line of the sign, the way a station sign names its neighborhood. */
  caption: string;
  subtitle?: string;
}

/**
 * Section heading styled as an MBTA platform sign, with an optional
 * one-line subtitle beneath it.
 */
const SectionHeader = ({ index, title, caption, subtitle }: SectionHeaderProps) => (
  <div className='section-header'>
    <Sign index={index} title={title} caption={caption} tag='h2' />
    {subtitle && <p className='section-header__subtitle'>{subtitle}</p>}
  </div>
);

export default SectionHeader;
