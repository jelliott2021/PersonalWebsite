import { useEffect, useState } from 'react';

const CACHE_PREFIX = 'gh-stars:';

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

    try {
      const cached = sessionStorage.getItem(`${CACHE_PREFIX}${repo}`);
      if (cached) {
        setStars(Number(cached));
        return undefined;
      }
    } catch {
      // Session storage can be unavailable; fall through to the fetch.
    }

    const controller = new AbortController();

    fetch(`https://api.github.com/repos/${repo}`, {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then(response => (response.ok ? response.json() : Promise.reject(new Error(response.statusText))))
      .then((data: { stargazers_count?: unknown }) => {
        if (typeof data.stargazers_count === 'number') {
          setStars(data.stargazers_count);
          try {
            sessionStorage.setItem(`${CACHE_PREFIX}${repo}`, String(data.stargazers_count));
          } catch {
            // Ignore: caching is a nicety.
          }
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
