import React, { ReactNode } from 'react';
import useReveal from '../../hooks/useReveal';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Extra delay in milliseconds, handy for staggering siblings. */
  delay?: number;
  /** Element to render. */
  tag?: 'div' | 'li' | 'article' | 'section';
}

/**
 * Wraps content in an element that fades and slides in the first time it
 * scrolls into view.
 */
const Reveal = ({ children, className = '', delay = 0, tag = 'div' }: RevealProps) => {
  const { ref, visible } = useReveal<HTMLElement>();

  return React.createElement(
    tag,
    {
      ref,
      className: `reveal ${visible ? 'is-visible' : ''} ${className}`.trim(),
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    },
    children,
  );
};

export default Reveal;
