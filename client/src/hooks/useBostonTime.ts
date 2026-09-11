import { useEffect, useState } from 'react';
import { boston, sunTimes } from '../lib/sun';

const TIME_ZONE = 'America/New_York';

export interface BostonTime {
  /** Clock reading such as "3:42 PM". */
  time: string;
  /** Time-of-day greeting based on the hour in Boston. */
  greeting: string;
  /** Hour of the day in Boston as a fraction, such as 15.5 for 3:30 PM. */
  hour: number;
  /** Today's sunrise in Boston as a fractional hour. */
  sunrise: number;
  /** Today's sunset in Boston as a fractional hour. */
  sunset: number;
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

/** Numeric date parts of an instant as seen on a Boston clock. */
const bostonParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone: TIME_ZONE,
  }).formatToParts(date);
  const part = (type: string) => Number.parseInt(parts.find(p => p.type === type)?.value ?? '', 10);
  return { year: part('year'), month: part('month'), day: part('day'), hour: part('hour') % 24, minute: part('minute') };
};

/** Fractional Boston hour of an instant, such as 15.5 for 3:30 PM. */
const bostonHour = (date: Date): number => {
  const { hour, minute } = bostonParts(date);
  if (Number.isNaN(hour)) {
    return 12;
  }
  return hour + (Number.isNaN(minute) ? 0 : minute / 60);
};

const defaultSun = { sunrise: 6, sunset: 20 };

const read = (): BostonTime => {
  try {
    const now = new Date();
    const time = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: TIME_ZONE,
    }).format(now);
    const hour = bostonHour(now);

    let sun = defaultSun;
    const { year, month, day } = bostonParts(now);
    const times = sunTimes(new Date(Date.UTC(year, month - 1, day)), boston.lat, boston.lon);
    if (times) {
      sun = { sunrise: bostonHour(times.sunrise), sunset: bostonHour(times.sunset) };
    }

    return { time, greeting: greetingFor(hour), hour, ...sun };
  } catch {
    // Very old browsers without time-zone support: fall back to the visitor's clock.
    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;
    return {
      time: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      greeting: greetingFor(hour),
      hour,
      ...defaultSun,
    };
  }
};

/**
 * The current time in Boston, refreshed every 30 seconds, plus a matching
 * greeting, the fractional hour, and today's real sunrise and sunset so the
 * skyline's sun and moon keep honest hours through the year.
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
