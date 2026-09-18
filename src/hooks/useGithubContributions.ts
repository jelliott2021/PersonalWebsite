import { useEffect, useState } from 'react';
import fetchJson from '../lib/fetchJson';
import { readSession, writeSession } from '../lib/storage';
import { ContributionDay, toLevel } from '../lib/contributions';

export type { ContributionDay } from '../lib/contributions';

const CACHE_PREFIX = 'gh-contrib:';

/** GitHub only exposes the calendar through its authenticated GraphQL API; this mirror serves the same data. */
export const contributionsUrl = (user: string): string =>
  `https://github-contributions-api.jogruber.de/v4/${user}?y=last`;

export interface Contributions {
  /** Contributions over the whole window. */
  total: number;
  /** One entry per day, oldest first, covering the last year. */
  days: ContributionDay[];
}

interface ApiResponse {
  contributions?: { date?: string; count?: number; level?: number }[];
}

/** Normalises the mirror's payload into sorted days with clamped levels. */
export const parseContributions = (data: ApiResponse): Contributions => {
  const days: ContributionDay[] = (data.contributions ?? [])
    .filter(day => typeof day.date === 'string')
    .map(day => ({ date: day.date as string, count: day.count ?? 0, level: toLevel(day.level) }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
  if (days.length === 0) {
    throw new Error('No contribution data');
  }
  return { total: days.reduce((sum, day) => sum + day.count, 0), days };
};

/**
 * A GitHub user's contribution calendar for the last year. Undefined while
 * loading, null when the request fails. Cached for the browser session.
 */
const useGithubContributions = (user: string): Contributions | null | undefined => {
  const [value, setValue] = useState<Contributions | null | undefined>(undefined);

  useEffect(() => {
    const key = `${CACHE_PREFIX}${user}`;
    const cached = readSession<Contributions>(key);
    if (cached) {
      setValue(cached);
      return undefined;
    }

    const controller = new AbortController();

    fetchJson<ApiResponse>(contributionsUrl(user), { signal: controller.signal })
      .then(data => {
        const result = parseContributions(data);
        setValue(result);
        writeSession(key, result);
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
