import fetchJson from './fetchJson';
import { mockFetchFailure, mockFetchJson } from '../test-utils/dom';

describe('fetchJson', () => {
  it('resolves with the parsed body and forwards the request options', async () => {
    const mock = mockFetchJson({ ok: true });
    const init = { headers: { Accept: 'application/json' } };
    await expect(fetchJson('https://example.test/data', init)).resolves.toEqual({ ok: true });
    expect(mock).toHaveBeenCalledWith('https://example.test/data', init);
  });

  it('rejects with the status on a non-2xx response', async () => {
    mockFetchJson({ error: 'nope' }, false);
    await expect(fetchJson('https://example.test/data')).rejects.toThrow(
      '500 Internal Server Error',
    );
  });

  it('rejects when the network fails', async () => {
    mockFetchFailure();
    await expect(fetchJson('https://example.test/data')).rejects.toThrow('offline');
  });
});
