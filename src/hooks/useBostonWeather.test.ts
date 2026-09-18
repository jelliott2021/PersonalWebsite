import { renderHook, waitFor } from '@testing-library/react';
import useBostonWeather, {
  CACHE_KEY,
  CACHE_TTL,
  WEATHER_ENDPOINT,
  describeWeather,
  fetchWeather,
  resetWeatherRequest,
} from './useBostonWeather';
import { mockFetchFailure, mockFetchJson } from '../test-utils/dom';

const CLEAR = { current: { temperature_2m: 72.4, weather_code: 0, cloud_cover: 5 } };

beforeEach(() => {
  resetWeatherRequest();
});

describe('describeWeather', () => {
  it('maps WMO codes and cloud cover to conditions', () => {
    expect(describeWeather(95, 0)).toEqual({ condition: 'storm', label: 'stormy' });
    expect(describeWeather(99, 0).condition).toBe('storm');
    expect(describeWeather(71, 0)).toEqual({ condition: 'snow', label: 'snowing' });
    expect(describeWeather(77, 0).condition).toBe('snow');
    expect(describeWeather(85, 0).condition).toBe('snow');
    expect(describeWeather(86, 0).condition).toBe('snow');
    expect(describeWeather(51, 0)).toEqual({ condition: 'rain', label: 'drizzling' });
    expect(describeWeather(57, 0).label).toBe('drizzling');
    expect(describeWeather(61, 0)).toEqual({ condition: 'rain', label: 'raining' });
    expect(describeWeather(67, 0).label).toBe('raining');
    expect(describeWeather(80, 0).label).toBe('raining');
    expect(describeWeather(82, 0).label).toBe('raining');
    expect(describeWeather(45, 0)).toEqual({ condition: 'fog', label: 'foggy' });
    expect(describeWeather(48, 0).condition).toBe('fog');
    expect(describeWeather(3, 0)).toEqual({ condition: 'overcast', label: 'overcast' });
    expect(describeWeather(0, 90).condition).toBe('overcast');
    expect(describeWeather(1, 0)).toEqual({ condition: 'cloudy', label: 'partly cloudy' });
    expect(describeWeather(2, 0).condition).toBe('cloudy');
    expect(describeWeather(0, 50).condition).toBe('cloudy');
    expect(describeWeather(0, 0)).toEqual({ condition: 'clear', label: 'clear' });
  });
});

describe('fetchWeather', () => {
  it('parses the payload, caches it, and shares one request', async () => {
    const mock = mockFetchJson(CLEAR);
    const [first, second] = await Promise.all([fetchWeather(), fetchWeather()]);
    expect(first).toEqual({ temperature: 72.4, condition: 'clear', label: 'clear' });
    expect(second).toBe(first);
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(WEATHER_ENDPOINT, undefined);
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) as string);
    expect(cached.value).toEqual(first);
  });

  it('treats a missing cloud cover as clear skies', async () => {
    mockFetchJson({ current: { temperature_2m: 60, weather_code: 0 } });
    await expect(fetchWeather()).resolves.toMatchObject({ condition: 'clear' });
  });

  it('resolves null for an unexpected payload', async () => {
    mockFetchJson({ current: { temperature_2m: 'warm' } });
    await expect(fetchWeather()).resolves.toBeNull();
  });

  it('resolves null when the body has no current block', async () => {
    mockFetchJson({});
    await expect(fetchWeather()).resolves.toBeNull();
  });

  it('resolves null when the request fails', async () => {
    mockFetchFailure();
    await expect(fetchWeather()).resolves.toBeNull();
  });
});

describe('useBostonWeather', () => {
  it('uses a fresh cache without fetching', () => {
    const value = { temperature: 40, condition: 'snow', label: 'snowing' };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), value }));
    const { result } = renderHook(() => useBostonWeather());
    expect(result.current).toEqual(value);
    expect(window.fetch).not.toHaveBeenCalled();
  });

  it('ignores a stale cache and fetches', async () => {
    const value = { temperature: 40, condition: 'snow', label: 'snowing' };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now() - CACHE_TTL - 1, value }));
    mockFetchJson(CLEAR);
    const { result } = renderHook(() => useBostonWeather());
    expect(result.current).toBeUndefined();
    await waitFor(() => expect(result.current?.condition).toBe('clear'));
  });

  it('stays undefined when the request fails', async () => {
    mockFetchFailure();
    const { result } = renderHook(() => useBostonWeather());
    await waitFor(() => expect(window.fetch).toHaveBeenCalled());
    await Promise.resolve();
    expect(result.current).toBeUndefined();
  });

  it('does not update after unmounting', async () => {
    let resolve: (value: unknown) => void = () => undefined;
    (window.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise(r => {
          resolve = r;
        }),
    );
    const { result, unmount } = renderHook(() => useBostonWeather());
    unmount();
    resolve({ ok: true, status: 200, json: () => Promise.resolve(CLEAR) });
    await fetchWeather();
    expect(result.current).toBeUndefined();
  });
});
