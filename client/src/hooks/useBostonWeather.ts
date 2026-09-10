import { useEffect, useState } from 'react';

export type WeatherCondition = 'clear' | 'cloudy' | 'overcast' | 'fog' | 'rain' | 'snow' | 'storm';

export interface BostonWeather {
  /** Air temperature in Fahrenheit. */
  temperature: number;
  condition: WeatherCondition;
  /** Short phrase for the greeting, such as "snowing" or "partly cloudy". */
  label: string;
}

const ENDPOINT =
  'https://api.open-meteo.com/v1/forecast?latitude=42.36&longitude=-71.06' +
  '&current=temperature_2m,weather_code,cloud_cover&temperature_unit=fahrenheit&timezone=America%2FNew_York';
const CACHE_KEY = 'boston-weather';
const CACHE_TTL = 15 * 60 * 1000;

interface ApiResponse {
  current?: { temperature_2m?: number; weather_code?: number; cloud_cover?: number };
}

/** Maps a WMO weather code (plus cloud cover) to the conditions the skyline can draw. */
export const describeWeather = (code: number, cloudCover: number): Pick<BostonWeather, 'condition' | 'label'> => {
  if (code >= 95) {
    return { condition: 'storm', label: 'stormy' };
  }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return { condition: 'snow', label: 'snowing' };
  }
  if (code >= 51 && code <= 57) {
    return { condition: 'rain', label: 'drizzling' };
  }
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return { condition: 'rain', label: 'raining' };
  }
  if (code === 45 || code === 48) {
    return { condition: 'fog', label: 'foggy' };
  }
  if (code === 3 || cloudCover >= 85) {
    return { condition: 'overcast', label: 'overcast' };
  }
  if (code === 1 || code === 2 || cloudCover >= 40) {
    return { condition: 'cloudy', label: 'partly cloudy' };
  }
  return { condition: 'clear', label: 'clear' };
};

const readCache = (): BostonWeather | null => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) {
      return null;
    }
    const cached = JSON.parse(raw) as { at: number; value: BostonWeather };
    return Date.now() - cached.at < CACHE_TTL ? cached.value : null;
  } catch {
    return null;
  }
};

const writeCache = (value: BostonWeather) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), value }));
  } catch {
    // Ignore: caching is a nicety.
  }
};

/** One request shared by every component that asks during the same page view. */
let inFlight: Promise<BostonWeather | null> | null = null;

const fetchWeather = (): Promise<BostonWeather | null> => {
  if (!inFlight) {
    inFlight = fetch(ENDPOINT)
      .then(response => (response.ok ? response.json() : Promise.reject(new Error(response.statusText))))
      .then((data: ApiResponse) => {
        const current = data.current ?? {};
        if (typeof current.temperature_2m !== 'number' || typeof current.weather_code !== 'number') {
          throw new Error('Unexpected weather payload');
        }
        const value: BostonWeather = {
          temperature: current.temperature_2m,
          ...describeWeather(current.weather_code, current.cloud_cover ?? 0),
        };
        writeCache(value);
        return value;
      })
      .catch(() => null);
  }
  return inFlight;
};

/**
 * Current conditions in Boston from Open-Meteo, which needs no API key.
 * Undefined until known, and stays undefined if the request fails so the
 * page simply shows no weather. Cached for fifteen minutes.
 */
const useBostonWeather = (): BostonWeather | undefined => {
  const [weather, setWeather] = useState<BostonWeather | undefined>(() => readCache() ?? undefined);

  useEffect(() => {
    if (weather) {
      return undefined;
    }
    let active = true;
    fetchWeather().then(value => {
      if (active && value) {
        setWeather(value);
      }
    });
    return () => {
      active = false;
    };
  }, [weather]);

  return weather;
};

export default useBostonWeather;
