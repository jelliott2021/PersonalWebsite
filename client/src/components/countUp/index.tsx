import React from 'react';
import useCountUp, { parseStat } from '../../hooks/useCountUp';
import useReveal from '../../hooks/useReveal';

interface CountUpProps {
  /** Display value such as "1,000+" or "287". */
  value: string;
  className?: string;
}

/**
 * A stat that counts up from zero the first time it scrolls into view.
 * Screen readers get the final value straight away; the moving digits are
 * hidden from them. Values without a number render unchanged.
 */
const CountUp = ({ value, className }: CountUpProps) => {
  const parsed = parseStat(value);
  const { ref, visible } = useReveal<HTMLSpanElement>(0.4);
  const current = useCountUp(parsed?.target ?? 0, visible, parsed?.decimals ?? 0);

  if (!parsed) {
    return <span className={className}>{value}</span>;
  }

  const text = parsed.grouped
    ? current.toLocaleString('en-US', {
        minimumFractionDigits: parsed.decimals,
        maximumFractionDigits: parsed.decimals,
      })
    : current.toFixed(parsed.decimals);

  return (
    <span ref={ref} className={className}>
      <span className='sr-only'>{value}</span>
      <span aria-hidden='true'>
        {parsed.prefix}
        {text}
        {parsed.suffix}
      </span>
    </span>
  );
};

export default CountUp;
