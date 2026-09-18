/**
 * Fetches a URL and parses the JSON body. Rejects on a non-2xx status so
 * callers can treat HTTP errors and network errors the same way.
 */
const fetchJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`.trim());
  }
  return response.json() as Promise<T>;
};

export default fetchJson;
