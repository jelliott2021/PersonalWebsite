import { act, renderHook } from '@testing-library/react';
import useBostonTime, {
  DEFAULT_SUN,
  REFRESH_INTERVAL,
  bostonHour,
  bostonParts,
  greetingFor,
  readBostonTime,
} from './useBostonTime';
import * as sun from '../lib/sun';

/** 2026-07-04 14:30 in Boston (EDT, UTC-4). */
const SUMMER_AFTERNOON = new Date(Date.UTC(2026, 6, 4, 18, 30));
/** 2026-01-15 00:10 in Boston (EST, UTC-5). */
const WINTER_MIDNIGHT = new Date(Date.UTC(2026, 0, 15, 5, 10));

describe('greetingFor', () => {
  it('picks the greeting by hour', () => {
    expect(greetingFor(5)).toBe('Good morning');
    expect(greetingFor(11.99)).toBe('Good morning');
    expect(greetingFor(12)).toBe('Good afternoon');
    expect(greetingFor(16.5)).toBe('Good afternoon');
    expect(greetingFor(17)).toBe('Good evening');
    expect(greetingFor(21.9)).toBe('Good evening');
    expect(greetingFor(22)).toBe('Burning the midnight oil');
    expect(greetingFor(3)).toBe('Burning the midnight oil');
  });
});

describe('bostonParts and bostonHour', () => {
  it('converts an instant to Boston wall-clock parts', () => {
    expect(bostonParts(SUMMER_AFTERNOON)).toEqual({
      year: 2026,
      month: 7,
      day: 4,
      hour: 14,
      minute: 30,
    });
    expect(bostonHour(SUMMER_AFTERNOON)).toBe(14.5);
  });

  it('handles midnight, which some engines print as hour 24', () => {
    expect(bostonParts(WINTER_MIDNIGHT).hour).toBe(0);
    expect(bostonHour(WINTER_MIDNIGHT)).toBeCloseTo(10 / 60);
  });

  it('falls back to noon when the formatter gives no parts', () => {
    jest
      .spyOn(Intl, 'DateTimeFormat')
      .mockImplementation(() => ({ formatToParts: () => [] }) as unknown as Intl.DateTimeFormat);
    expect(bostonHour(SUMMER_AFTERNOON)).toBe(12);
  });

  it('ignores a missing minute part', () => {
    jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(
      () =>
        ({
          formatToParts: () => [{ type: 'hour', value: '9' }],
        }) as unknown as Intl.DateTimeFormat,
    );
    expect(bostonHour(SUMMER_AFTERNOON)).toBe(9);
  });
});

describe('readBostonTime', () => {
  it('reports the time, greeting, hour, and real sun times', () => {
    const value = readBostonTime(SUMMER_AFTERNOON);
    expect(value.time).toBe('2:30 PM');
    expect(value.greeting).toBe('Good afternoon');
    expect(value.hour).toBe(14.5);
    // Boston on 4 July: sunrise about 5:12, sunset about 20:24.
    expect(value.sunrise).toBeCloseTo(5.2, 0);
    expect(value.sunset).toBeCloseTo(20.4, 0);
  });

  it('uses default sun times when the equation has no answer', () => {
    jest.spyOn(sun, 'sunTimes').mockReturnValue(null);
    const value = readBostonTime(SUMMER_AFTERNOON);
    expect(value.sunrise).toBe(DEFAULT_SUN.sunrise);
    expect(value.sunset).toBe(DEFAULT_SUN.sunset);
  });

  it('falls back to the local clock when time zones are unsupported', () => {
    jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => {
      throw new RangeError('unsupported time zone');
    });
    const local = new Date(2026, 0, 1, 23, 45);
    const value = readBostonTime(local);
    expect(value.hour).toBe(23.75);
    expect(value.greeting).toBe('Burning the midnight oil');
    expect(value.time).toBe(local.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    expect(value.sunrise).toBe(DEFAULT_SUN.sunrise);
  });
});

describe('useBostonTime', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(SUMMER_AFTERNOON);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns the current reading and refreshes on an interval', () => {
    const { result, unmount } = renderHook(() => useBostonTime());
    expect(result.current.time).toBe('2:30 PM');

    act(() => {
      jest.setSystemTime(new Date(SUMMER_AFTERNOON.getTime() + 60 * 60 * 1000));
      jest.advanceTimersByTime(REFRESH_INTERVAL);
    });
    expect(result.current.time).toBe('3:30 PM');

    const clearSpy = jest.spyOn(window, 'clearInterval');
    unmount();
    expect(clearSpy).toHaveBeenCalled();
  });
});
