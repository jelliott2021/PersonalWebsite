import { renderHook, waitFor } from '@testing-library/react';
import useGithubContributions, {
  contributionsUrl,
  parseContributions,
} from './useGithubContributions';
import { mockFetchFailure, mockFetchJson } from '../test-utils/dom';

const PAYLOAD = {
  contributions: [
    { date: '2026-01-06', count: 2, level: 1 },
    { date: '2026-01-05', count: 0, level: 0 },
    { count: 9, level: 4 },
    { date: '2026-01-07' },
  ],
};

describe('parseContributions', () => {
  it('drops entries without a date, sorts by date, and totals the counts', () => {
    expect(parseContributions(PAYLOAD)).toEqual({
      total: 2,
      days: [
        { date: '2026-01-05', count: 0, level: 0 },
        { date: '2026-01-06', count: 2, level: 1 },
        { date: '2026-01-07', count: 0, level: 0 },
      ],
    });
  });

  it('throws when no usable days remain', () => {
    expect(() => parseContributions({})).toThrow('No contribution data');
    expect(() => parseContributions({ contributions: [{ count: 1 }] })).toThrow();
  });
});

describe('useGithubContributions', () => {
  it('returns the session cache without fetching', () => {
    const cached = { total: 5, days: [{ date: '2026-01-05', count: 5, level: 3 }] };
    sessionStorage.setItem('gh-contrib:octocat', JSON.stringify(cached));
    const { result } = renderHook(() => useGithubContributions('octocat'));
    expect(result.current).toEqual(cached);
    expect(window.fetch).not.toHaveBeenCalled();
  });

  it('fetches, parses, and caches the calendar', async () => {
    const mock = mockFetchJson(PAYLOAD);
    const { result } = renderHook(() => useGithubContributions('octocat'));
    expect(result.current).toBeUndefined();
    await waitFor(() => expect(result.current?.total).toBe(2));
    expect(mock.mock.calls[0][0]).toBe(contributionsUrl('octocat'));
    expect(JSON.parse(sessionStorage.getItem('gh-contrib:octocat') as string).total).toBe(2);
  });

  it('resolves to null when the request fails', async () => {
    mockFetchFailure();
    const { result } = renderHook(() => useGithubContributions('octocat'));
    await waitFor(() => expect(result.current).toBeNull());
  });

  it('resolves to null when the payload is empty', async () => {
    mockFetchJson({ contributions: [] });
    const { result } = renderHook(() => useGithubContributions('octocat'));
    await waitFor(() => expect(result.current).toBeNull());
  });

  it('aborts the request on unmount and leaves the state alone', async () => {
    let signal: AbortSignal | undefined;
    (window.fetch as jest.Mock).mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          signal = init.signal as AbortSignal;
          signal.addEventListener('abort', () => reject(new Error('aborted')));
        }),
    );
    const { result, unmount } = renderHook(() => useGithubContributions('octocat'));
    unmount();
    expect(signal?.aborted).toBe(true);
    await Promise.resolve();
    expect(result.current).toBeUndefined();
  });
});
