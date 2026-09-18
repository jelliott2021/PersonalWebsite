import { useEffect, useState } from 'react';

export interface ParsedStat {
  /** Text before the number, such as "$". */
  prefix: string;
  /** Numeric target to count to. */
  target: number;
  /** Text after the number, such as "+" or "%". */
  suffix: string;
  /** Whether the source used thousands separators. */
  grouped: boolean;
  /** Decimal places in the source number. */
  decimals: number;
}

/**
 * Splits a display value such as "1,000+" into its number and the text
 * around it. Returns null when there is no number to animate.
 */
export const parseStat = (value: string): ParsedStat | null => {
  const match = value.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!match) {
    return null;
  }
  const [, prefix, digits, suffix] = match;
  const target = Number(digits.replace(/,/g, ''));
  if (Number.isNaN(target)) {
    return null;
  }
  const fraction = digits.split('.')[1] ?? '';
  return { prefix, target, suffix, grouped: digits.includes(','), decimals: fraction.length };
};

const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

/**
 * Counts from zero to `target` once `active` turns true, easing out so the
 * last digits settle slowly. Jumps straight to the target when the visitor
 * prefers reduced motion.
 */
const useCountUp = (target: number, active: boolean, decimals = 0, duration = 1400): number => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || target === 0) {
      setValue(target);
      return undefined;
    }

    const factor = 10 ** decimals;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * easeOutCubic(progress) * factor) / factor);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, decimals, duration]);

  return value;
};

export default useCountUp;
