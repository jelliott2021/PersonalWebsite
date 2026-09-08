import { useEffect, useState } from 'react';

const TIME_ZONE = 'America/New_York';

export interface BostonTime {
  /** Clock reading such as "3:42 PM". */
  time: string;
  /** Time-of-day greeting based on the hour in Boston. */
  greeting: string;
}

const greetingFor = (hour: number): string => {
  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  }
  if (hour >= 12 && hour < 17) {
    return 'Good afternoon';
  }
  if (hour >= 17 && hour < 22) {
    return 'Good evening';
  }
  return 'Burning the midnight oil';
};

const read = (): BostonTime => {
  try {
    const now = new Date();
    const time = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: TIME_ZONE,
    }).format(now);
    const hourText = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      timeZone: TIME_ZONE,
    }).format(now);
    const hour = Number.parseInt(hourText, 10) % 24;
    return { time, greeting: greetingFor(Number.isNaN(hour) ? 12 : hour) };
  } catch {
    // Very old browsers without time-zone support: fall back to the visitor's clock.
    const now = new Date();
    return {
      time: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      greeting: greetingFor(now.getHours()),
    };
  }
};

/**
 * The current time in Boston, refreshed every 30 seconds, plus a matching
 * greeting. A small sign of life for the hero.
 */
const useBostonTime = (): BostonTime => {
  const [value, setValue] = useState<BostonTime>(read);

  useEffect(() => {
    const timer = window.setInterval(() => setValue(read()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return value;
};

export default useBostonTime;
