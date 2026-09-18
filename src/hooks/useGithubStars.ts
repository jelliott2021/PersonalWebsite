import { useEffect, useState } from 'react';
import fetchJson from '../lib/fetchJson';
import { readSession, writeSession } from '../lib/storage';

const CACHE_PREFIX = 'gh-stars:';

/** Public GitHub REST endpoint for a repository. */
export const repoUrl = (repo: string): string => `https://api.github.com/repos/${repo}`;

/**
 * Returns the GitHub star count for a repository. Starts with the static
 * fallback from the data file, then updates from the GitHub API when the
 * request succeeds. Results are cached for the browser session so repeat
 * visits don't hit the unauthenticated rate limit.
 *
 * @param repo GitHub "owner/name" slug. Nothing is fetched when undefined.
 * @param fallback Count to show until (or if) the fetch completes.
 */
const useGithubStars = (repo?: string, fallback?: number): number | undefined => {
  const [stars, setStars] = useState<number | undefined>(fallback);

  useEffect(() => {
    if (!repo) {
      return undefined;
    }

    const key = `${CACHE_PREFIX}${repo}`;
    const cached = readSession<number>(key);
    if (typeof cached === 'number') {
      setStars(cached);
      return undefined;
    }

    const controller = new AbortController();

    fetchJson<{ stargazers_count?: unknown }>(repoUrl(repo), {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then(data => {
        if (typeof data.stargazers_count === 'number') {
          setStars(data.stargazers_count);
          writeSession(key, data.stargazers_count);
        }
      })
      .catch(() => {
        // Rate limited or offline: keep the fallback from the data file.
      });

    return () => controller.abort();
  }, [repo]);

  return stars;
};

export default useGithubStars;
