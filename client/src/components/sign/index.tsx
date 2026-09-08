import React from 'react';
import './index.css';

/** Signs cycle through the MBTA line colors, in section order. */
const LINE_COLORS = ['red', 'orange', 'green', 'blue', 'silver', 'purple'];

export const lineFor = (index: string): string => {
  const position = Number.parseInt(index, 10);
  if (Number.isNaN(position)) {
    return LINE_COLORS[0];
  }
  return LINE_COLORS[(position - 1) % LINE_COLORS.length];
};

interface SignProps {
  index: string;
  title: string;
  /** Second line on the white strip, like the neighborhood under a station name. */
  caption: string;
  /** Element used for the title text. Sections use an h2. */
  tag?: 'h2' | 'h3' | 'span';
  size?: 'md' | 'sm';
  className?: string;
}

/**
 * An MBTA platform sign: the title in white capitals on a band of the line
 * color, with a white strip below carrying a caption in black capitals.
 */
const Sign = ({ index, title, caption, tag = 'span', size = 'md', className = '' }: SignProps) => (
  <div className={`sign sign--${lineFor(index)} sign--${size} ${className}`.trim()}>
    <div className='sign__band'>
      {React.createElement(tag, { className: 'sign__title' }, title)}
    </div>
    <div className='sign__foot'>
      <span className='sign__num' aria-hidden='true'>
        {index}
      </span>
      <span className='sign__caption'>{caption}</span>
    </div>
  </div>
);

export default Sign;
