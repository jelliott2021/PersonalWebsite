import { render } from '@testing-library/react';
import Skyline from '.';
import { CLOUDS, DROPS, FLAKES, GLINTS, WINDOWS, noise, round, skyPosition } from './scenery';
import useBostonTime from '../../hooks/useBostonTime';
import useBostonWeather, { WeatherCondition } from '../../hooks/useBostonWeather';

jest.mock('../../hooks/useBostonTime');
jest.mock('../../hooks/useBostonWeather');

const mockedTime = useBostonTime as jest.MockedFunction<typeof useBostonTime>;
const mockedWeather = useBostonWeather as jest.MockedFunction<typeof useBostonWeather>;

const atHour = (hour: number) =>
  mockedTime.mockReturnValue({ time: '', greeting: '', hour, sunrise: 6, sunset: 20 });

const withWeather = (condition?: WeatherCondition) =>
  mockedWeather.mockReturnValue(
    condition ? { temperature: 50, condition, label: condition } : undefined,
  );

beforeEach(() => {
  atHour(12);
  withWeather(undefined);
});

describe('scenery helpers', () => {
  it('produces stable noise in [0, 1) and rounds to a decimal', () => {
    expect(noise(1)).toBe(noise(1));
    expect(noise(1)).not.toBe(noise(2));
    for (let i = 0; i < 50; i += 1) {
      expect(noise(i)).toBeGreaterThanOrEqual(0);
      expect(noise(i)).toBeLessThan(1);
    }
    expect(round(1.26)).toBe(1.3);
  });

  it('generates every kind of window and the weather particles', () => {
    const kinds = new Set(WINDOWS.map(window => window.kind));
    expect(kinds).toEqual(new Set(['lit', 'twinkle', 'dark']));
    expect(FLAKES).toHaveLength(48);
    expect(DROPS).toHaveLength(40);
    expect(GLINTS).toHaveLength(9);
    expect(CLOUDS).toHaveLength(3);
  });
});

describe('skyPosition', () => {
  it('puts the sun on the left horizon at sunrise and overhead at midday', () => {
    expect(skyPosition(6, 6, 20)).toEqual({ isNight: false, x: 120, y: 150 });
    expect(skyPosition(13, 6, 20)).toEqual({ isNight: false, x: 720, y: 40 });
    expect(skyPosition(19.9, 6, 20).x).toBeGreaterThan(1300);
  });

  it('moves the moon across the night, wrapping past midnight', () => {
    expect(skyPosition(20, 6, 20)).toEqual({ isNight: true, x: 120, y: 150 });
    // Midnight is four hours into a ten-hour night.
    expect(skyPosition(0, 6, 20)).toEqual({ isNight: true, x: 600, y: 45 });
    expect(skyPosition(5.99, 6, 20).x).toBeGreaterThan(1300);
  });

  it('never divides by a day or night shorter than an hour', () => {
    expect(skyPosition(12, 12, 12.5).x).toBeGreaterThanOrEqual(120);
    expect(skyPosition(12.6, 12.5, 12.6).isNight).toBe(true);
  });
});

describe('Skyline', () => {
  it('draws a sun with glints by day', () => {
    const { container } = render(<Skyline className='hero__skyline' />);
    const svg = container.querySelector('svg') as SVGElement;
    expect(svg).toHaveClass('skyline', 'hero__skyline');
    expect(svg.querySelector('.skyline__sun')).not.toBeNull();
    expect(svg.querySelector('.skyline__moon')).toBeNull();
    expect(svg.querySelectorAll('.skyline__glint')).toHaveLength(GLINTS.length);
    expect(svg.querySelectorAll('.skyline__window')).toHaveLength(WINDOWS.length);
    expect(svg.querySelector('.skyline__clouds')).toBeNull();
  });

  it('draws a moon without glints by night', () => {
    atHour(23);
    const { container } = render(<Skyline />);
    expect(container.querySelector('.skyline__moon')).not.toBeNull();
    expect(container.querySelector('.skyline__sun')).toBeNull();
    expect(container.querySelector('.skyline__glints')).toBeNull();
  });

  it('gives each drawing unique gradient ids', () => {
    const { container } = render(
      <>
        <Skyline />
        <Skyline />
      </>,
    );
    const ids = Array.from(container.querySelectorAll('[id]')).map(el => el.id);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach(id => expect(id).not.toContain(':'));
  });

  it.each<[WeatherCondition, string, number]>([
    ['clear', '.skyline__clouds', 0],
    ['cloudy', '.skyline__clouds', 1],
    ['overcast', '.skyline__clouds', 1],
    ['fog', '.skyline__fog', 1],
    ['snow', '.skyline__flake', FLAKES.length],
    ['rain', '.skyline__drop', DROPS.length],
    ['storm', '.skyline__lightning', 1],
  ])('dresses the scene for %s weather', (condition, selector, count) => {
    withWeather(condition);
    const { container } = render(<Skyline />);
    expect(container.querySelector('svg')).toHaveClass(`skyline--${condition}`);
    expect(container.querySelectorAll(selector)).toHaveLength(count);
  });

  it('shows rain during a storm', () => {
    withWeather('storm');
    const { container } = render(<Skyline />);
    expect(container.querySelectorAll('.skyline__drop')).toHaveLength(DROPS.length);
    expect(container.querySelectorAll('.skyline__flake')).toHaveLength(0);
  });
});
