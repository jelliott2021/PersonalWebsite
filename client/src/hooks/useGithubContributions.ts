import { useEffect, useState } from 'react';

const CACHE_PREFIX = 'gh-contrib:';

export interface ContributionDay {
  /** Calendar date as YYYY-MM-DD. */
  date: string;
  count: number;
  /** GitHub's own 0 to 4 intensity bucket for the day. */
  level: 0 | 1 | 2 | 3 | 4;
}

export interface Contributions {
  /** Contributions over the whole window. */
  total: number;
  /** One entry per day, oldest first, covering the last year. */
  days: ContributionDay[];
}

interface ApiResponse {
  contributions?: { date?: string; count?: number; level?: number }[];
}

const toLevel = (value: number | undefined): ContributionDay['level'] => {
  const level = Math.round(value ?? 0);
  if (level <= 0) {
    return 0;
  }
  return (level >= 4 ? 4 : level) as ContributionDay['level'];
};

/**
 * A GitHub user's contribution calendar for the last year. GitHub only
 * exposes the calendar through its authenticated GraphQL API, so this reads
 * the public mirror at github-contributions-api.jogruber.de, which serves
 * the same data GitHub draws on the profile page. Undefined while loading,
 * null when the request fails. Cached for the browser session.
 */
const useGithubContributions = (user: string): Contributions | null | undefined => {
  const [value, setValue] = useState<Contributions | null | undefined>(undefined);

  useEffect(() => {
    const key = `${CACHE_PREFIX}${user}`;
    try {
      const cached = sessionStorage.getItem(key);
      if (cached) {
        setValue(JSON.parse(cached) as Contributions);
        return undefined;
      }
    } catch {
      // Session storage can be unavailable; fall through to the fetch.
    }

    const controller = new AbortController();

    fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`, {
      signal: controller.signal,
    })
      .then(response => (response.ok ? response.json() : Promise.reject(new Error(response.statusText))))
      .then((data: ApiResponse) => {
        const days: ContributionDay[] = (data.contributions ?? [])
          .filter(day => typeof day.date === 'string')
          .map(day => ({ date: day.date as string, count: day.count ?? 0, level: toLevel(day.level) }))
          .sort((a, b) => (a.date < b.date ? -1 : 1));
        if (days.length === 0) {
          throw new Error('No contribution data');
        }
        const result: Contributions = {
          total: days.reduce((sum, day) => sum + day.count, 0),
          days,
        };
        setValue(result);
        try {
          sessionStorage.setItem(key, JSON.stringify(result));
        } catch {
          // Ignore: caching is a nicety.
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setValue(null);
        }
      });

    return () => controller.abort();
  }, [user]);

  return value;
};

export default useGithubContributions;
