import { useEffect, useState } from 'react';

const CACHE_PREFIX = 'gh-activity:';

export type ActivityKind =
  | 'push'
  | 'pr'
  | 'merge'
  | 'branch'
  | 'repo'
  | 'tag'
  | 'star'
  | 'fork'
  | 'release'
  | 'issue'
  | 'comment';

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  /** Verb phrase ending where the repository name goes, e.g. "Pushed 3 commits to". */
  title: string;
  /** Repository slug "owner/name". */
  repo: string;
  /** One-line detail such as the head commit message or PR title. */
  detail?: string;
  /** ISO timestamp of the event. */
  at: string;
  /** Link for the detail line when GitHub provides one. */
  url?: string;
  /** Commit count for pushes, so back-to-back pushes can be merged. */
  commits?: number;
  ref?: string;
}

/** The parts of a GitHub public event this site reads. */
interface GithubEvent {
  id: string;
  type: string;
  created_at: string;
  repo?: { name?: string };
  payload?: {
    ref?: string | null;
    ref_type?: string;
    action?: string;
    size?: number;
    commits?: { message?: string }[];
    pull_request?: { number?: number; title?: string; merged?: boolean; html_url?: string };
    issue?: { number?: number; title?: string; html_url?: string };
    comment?: { body?: string; html_url?: string };
    release?: { tag_name?: string; name?: string; html_url?: string };
  };
}

const firstLine = (text: string | undefined, max = 90): string | undefined => {
  if (!text) {
    return undefined;
  }
  const line = text.split('\n')[0].trim();
  return line.length > max ? `${line.slice(0, max - 1)}…` : line;
};

const plural = (count: number, word: string): string => `${count} ${word}${count === 1 ? '' : 's'}`;

/** Turns one raw event into a feed item, or null for event types not shown. */
export const toActivity = (event: GithubEvent): ActivityItem | null => {
  const repo = event.repo?.name;
  const payload = event.payload ?? {};
  if (!repo) {
    return null;
  }
  const base = { id: event.id, repo, at: event.created_at };

  switch (event.type) {
    case 'PushEvent': {
      // The public timeline often omits the commit list but still reports its size.
      const commits = payload.size || payload.commits?.length || 0;
      const ref = payload.ref?.replace('refs/heads/', '') ?? undefined;
      const head = payload.commits?.[payload.commits.length - 1];
      return {
        ...base,
        kind: 'push',
        title: commits > 0 ? `Pushed ${plural(commits, 'commit')} to` : 'Pushed to',
        detail: firstLine(head?.message) ?? (ref ? `on ${ref}` : undefined),
        commits,
        ref,
      };
    }
    case 'PullRequestEvent': {
      const pr = payload.pull_request ?? {};
      const merged = payload.action === 'closed' && pr.merged;
      if (!['opened', 'closed', 'reopened'].includes(payload.action ?? '')) {
        return null;
      }
      let verb = 'Closed';
      if (merged) {
        verb = 'Merged';
      } else if (payload.action !== 'closed') {
        verb = payload.action === 'opened' ? 'Opened' : 'Reopened';
      }
      return {
        ...base,
        kind: merged ? 'merge' : 'pr',
        title: `${verb} pull request #${pr.number ?? ''} in`,
        detail: firstLine(pr.title),
        url: pr.html_url,
      };
    }
    case 'CreateEvent': {
      if (payload.ref_type === 'repository') {
        return { ...base, kind: 'repo', title: 'Created repository' };
      }
      if (payload.ref_type === 'branch') {
        return { ...base, kind: 'branch', title: `Created branch ${payload.ref ?? ''} in` };
      }
      if (payload.ref_type === 'tag') {
        return { ...base, kind: 'tag', title: `Tagged ${payload.ref ?? ''} in` };
      }
      return null;
    }
    case 'WatchEvent':
      return { ...base, kind: 'star', title: 'Starred' };
    case 'ForkEvent':
      return { ...base, kind: 'fork', title: 'Forked' };
    case 'PublicEvent':
      return { ...base, kind: 'repo', title: 'Open-sourced' };
    case 'ReleaseEvent': {
      const release = payload.release ?? {};
      return {
        ...base,
        kind: 'release',
        title: `Published ${release.tag_name ?? 'a release'} in`,
        detail: firstLine(release.name),
        url: release.html_url,
      };
    }
    case 'IssuesEvent': {
      const issue = payload.issue ?? {};
      if (!['opened', 'closed', 'reopened'].includes(payload.action ?? '')) {
        return null;
      }
      let verb = 'Reopened';
      if (payload.action === 'opened') {
        verb = 'Opened';
      } else if (payload.action === 'closed') {
        verb = 'Closed';
      }
      return {
        ...base,
        kind: 'issue',
        title: `${verb} issue #${issue.number ?? ''} in`,
        detail: firstLine(issue.title),
        url: issue.html_url,
      };
    }
    case 'IssueCommentEvent': {
      const issue = payload.issue ?? {};
      return {
        ...base,
        kind: 'comment',
        title: `Commented on #${issue.number ?? ''} in`,
        detail: firstLine(payload.comment?.body),
        url: payload.comment?.html_url,
      };
    }
    default:
      return null;
  }
};

/**
 * Maps raw events to feed items, folding back-to-back pushes to the same
 * branch into one entry so a busy afternoon doesn't fill the whole list.
 */
export const summarise = (events: GithubEvent[], limit: number): ActivityItem[] => {
  const items: ActivityItem[] = [];
  for (const event of events) {
    const item = toActivity(event);
    const previous = items[items.length - 1];
    const foldable =
      item !== null &&
      previous !== undefined &&
      previous.kind === 'push' &&
      item.kind === 'push' &&
      previous.repo === item.repo &&
      previous.ref === item.ref;

    if (item && foldable) {
      const commits = (previous.commits ?? 0) + (item.commits ?? 0);
      previous.commits = commits;
      previous.title = commits > 0 ? `Pushed ${plural(commits, 'commit')} to` : 'Pushed to';
    } else if (item) {
      items.push(item);
      if (items.length >= limit) {
        break;
      }
    }
  }
  return items;
};

/**
 * Recent public activity for a GitHub user: pushes, pull requests, releases,
 * stars, and new repositories. Undefined while loading, an empty list when
 * the API is unavailable (offline or rate limited). Cached for the session.
 */
const useGithubActivity = (user: string, limit = 5): ActivityItem[] | undefined => {
  const [items, setItems] = useState<ActivityItem[] | undefined>(undefined);

  useEffect(() => {
    const key = `${CACHE_PREFIX}${user}:${limit}`;
    try {
      const cached = sessionStorage.getItem(key);
      if (cached) {
        setItems(JSON.parse(cached) as ActivityItem[]);
        return undefined;
      }
    } catch {
      // Session storage can be unavailable; fall through to the fetch.
    }

    const controller = new AbortController();

    fetch(`https://api.github.com/users/${user}/events/public?per_page=40`, {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then(response => (response.ok ? response.json() : Promise.reject(new Error(response.statusText))))
      .then((events: GithubEvent[]) => {
        const summary = Array.isArray(events) ? summarise(events, limit) : [];
        setItems(summary);
        try {
          sessionStorage.setItem(key, JSON.stringify(summary));
        } catch {
          // Ignore: caching is a nicety.
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setItems([]);
        }
      });

    return () => controller.abort();
  }, [user, limit]);

  return items;
};

export default useGithubActivity;
