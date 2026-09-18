import { renderHook, waitFor } from '@testing-library/react';
import useGithubStars, { repoUrl } from './useGithubStars';
import { mockFetchFailure, mockFetchJson } from '../test-utils/dom';

describe('useGithubStars', () => {
  it('returns the fallback and fetches nothing without a repo', () => {
    const { result } = renderHook(() => useGithubStars(undefined, 12));
    expect(result.current).toBe(12);
    expect(window.fetch).not.toHaveBeenCalled();
  });

  it('returns the session cache without fetching', () => {
    sessionStorage.setItem('gh-stars:o/r', '99');
    const { result } = renderHook(() => useGithubStars('o/r', 1));
    expect(result.current).toBe(99);
    expect(window.fetch).not.toHaveBeenCalled();
  });

  it('shows the fallback first, then the live count, and caches it', async () => {
    const mock = mockFetchJson({ stargazers_count: 243 });
    const { result } = renderHook(() => useGithubStars('o/r', 200));
    expect(result.current).toBe(200);
    await waitFor(() => expect(result.current).toBe(243));
    expect(mock.mock.calls[0][0]).toBe(repoUrl('o/r'));
    expect(mock.mock.calls[0][1].headers).toEqual({ Accept: 'application/vnd.github+json' });
    expect(sessionStorage.getItem('gh-stars:o/r')).toBe('243');
  });

  it('keeps the fallback when the payload has no count', async () => {
    mockFetchJson({ message: 'rate limited' });
    const { result } = renderHook(() => useGithubStars('o/r', 200));
    await waitFor(() => expect(window.fetch).toHaveBeenCalled());
    await Promise.resolve();
    expect(result.current).toBe(200);
    expect(sessionStorage.getItem('gh-stars:o/r')).toBeNull();
  });

  it('keeps the fallback when the request fails', async () => {
    mockFetchFailure();
    const { result } = renderHook(() => useGithubStars('o/r', 200));
    await waitFor(() => expect(window.fetch).toHaveBeenCalled());
    await Promise.resolve();
    expect(result.current).toBe(200);
  });

  it('aborts an in-flight request on unmount', () => {
    let signal: AbortSignal | undefined;
    (window.fetch as jest.Mock).mockImplementation((_url: string, init: RequestInit) => {
      signal = init.signal as AbortSignal;
      return new Promise(() => {
        // Never settles; the component aborts it on unmount.
      });
    });
    const { unmount } = renderHook(() => useGithubStars('o/r'));
    unmount();
    expect(signal?.aborted).toBe(true);
  });
});
