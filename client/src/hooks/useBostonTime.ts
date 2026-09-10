import { useEffect, useState } from 'react';

const TIME_ZONE = 'America/New_York';

export interface BostonTime {
  /** Clock reading such as "3:42 PM". */
  time: string;
  /** Time-of-day greeting based on the hour in Boston. */
  greeting: string;
  /** Hour of the day in Boston as a fraction, such as 15.5 for 3:30 PM. */
  hour: number;
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
    const parts = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      timeZone: TIME_ZONE,
    }).formatToParts(now);
    const part = (type: string) => Number.parseInt(parts.find(p => p.type === type)?.value ?? '', 10);
    const hours = part('hour') % 24;
    const minutes = part('minute');
    const hour = Number.isNaN(hours) ? 12 : hours + (Number.isNaN(minutes) ? 0 : minutes / 60);
    return { time, greeting: greetingFor(hour), hour };
  } catch {
    // Very old browsers without time-zone support: fall back to the visitor's clock.
    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;
    return {
      time: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      greeting: greetingFor(hour),
      hour,
    };
  }
};

/**
 * The current time in Boston, refreshed every 30 seconds, plus a matching
 * greeting and the fractional hour. A small sign of life for the hero and
 * the skyline.
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
