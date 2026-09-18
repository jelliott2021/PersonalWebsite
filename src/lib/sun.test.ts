import { boston, sunTimes } from './sun';

const utcHour = (date: Date): number => date.getUTCHours() + date.getUTCMinutes() / 60;

describe('sunTimes', () => {
  it('matches the published times for Boston on the summer solstice', () => {
    // 2026-06-21: sunrise 5:07 EDT (09:07 UTC), sunset 20:25 EDT (00:25 UTC next day).
    const times = sunTimes(new Date(Date.UTC(2026, 5, 21)), boston.lat, boston.lon);
    expect(times).not.toBeNull();
    expect(utcHour(times!.sunrise)).toBeCloseTo(9.12, 1);
    expect(utcHour(times!.sunset)).toBeCloseTo(0.42, 1);
  });

  it('matches the published times for Boston on the winter solstice', () => {
    // 2026-12-21: sunrise 7:10 EST (12:10 UTC), sunset 16:15 EST (21:15 UTC).
    const times = sunTimes(new Date(Date.UTC(2026, 11, 21)), boston.lat, boston.lon);
    expect(times).not.toBeNull();
    expect(utcHour(times!.sunrise)).toBeCloseTo(12.17, 1);
    expect(utcHour(times!.sunset)).toBeCloseTo(21.25, 1);
  });

  it('always puts sunrise before sunset', () => {
    const times = sunTimes(new Date(Date.UTC(2026, 2, 15)), boston.lat, boston.lon);
    expect(times!.sunrise.getTime()).toBeLessThan(times!.sunset.getTime());
  });

  it('returns null during polar night', () => {
    // Svalbard in December: the sun never rises.
    expect(sunTimes(new Date(Date.UTC(2026, 11, 21)), 78.2, 15.6)).toBeNull();
  });

  it('returns null during polar day', () => {
    // Svalbard in June: the sun never sets.
    expect(sunTimes(new Date(Date.UTC(2026, 5, 21)), 78.2, 15.6)).toBeNull();
  });
});
