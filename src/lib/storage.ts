/**
 * Thin wrappers around web storage. Storage can be missing or throw (private
 * browsing, blocked cookies, quota), and nothing on this site depends on it,
 * so every helper swallows errors and treats the store as empty.
 */

/** Reads a JSON value from session storage, or null when absent or unreadable. */
export const readSession = <T>(key: string): T | null => {
  try {
    const raw = sessionStorage.getItem(key);
    return raw === null ? null : (JSON.parse(raw) as T);
  } catch {
    return null;
  }
};

/** Stores a JSON value in session storage. Failures are ignored. */
export const writeSession = (key: string, value: unknown): void => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Caching is a nicety; the page works without it.
  }
};

/** Reads a string from local storage, or null when absent or unreadable. */
export const readLocal = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

/** Stores a string in local storage. Failures are ignored. */
export const writeLocal = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Persistence is a nicety; the choice still applies to this page view.
  }
};
