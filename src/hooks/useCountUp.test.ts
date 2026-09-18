import { act, renderHook } from '@testing-library/react';
import useCountUp, { easeOutCubic, parseStat } from './useCountUp';
import { setMediaQuery } from '../test-utils/dom';

describe('parseStat', () => {
  it('splits prefix, number, and suffix', () => {
    expect(parseStat('1,000+')).toEqual({
      prefix: '',
      target: 1000,
      suffix: '+',
      grouped: true,
      decimals: 0,
    });
    expect(parseStat('$4.50/mo')).toEqual({
      prefix: '$',
      target: 4.5,
      suffix: '/mo',
      grouped: false,
      decimals: 2,
    });
    expect(parseStat('287')).toMatchObject({ target: 287, grouped: false, decimals: 0 });
  });

  it('returns null when there is no number', () => {
    expect(parseStat('Lots')).toBeNull();
    expect(parseStat('')).toBeNull();
  });
});

describe('easeOutCubic', () => {
  it('starts at zero, ends at one, and eases out', () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });
});

describe('useCountUp', () => {
  let frames: FrameRequestCallback[];
  let now: number;

  beforeEach(() => {
    frames = [];
    now = 1000;
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      frames.push(callback);
      return frames.length;
    });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);
    jest.spyOn(performance, 'now').mockImplementation(() => now);
  });

  /** Runs every queued frame at the given time offset. */
  const step = (elapsed: number) => {
    now = 1000 + elapsed;
    const pending = frames.splice(0);
    act(() => pending.forEach(frame => frame(now)));
  };

  it('stays at zero until activated', () => {
    const { result } = renderHook(() => useCountUp(100, false));
    expect(result.current).toBe(0);
    expect(frames).toHaveLength(0);
  });

  it('animates towards the target and stops at the end', () => {
    const { result } = renderHook(() => useCountUp(100, true, 0, 1000));
    expect(frames).toHaveLength(1);

    step(500);
    expect(result.current).toBeGreaterThan(0);
    expect(result.current).toBeLessThan(100);
    expect(frames).toHaveLength(1);

    step(1000);
    expect(result.current).toBe(100);
    expect(frames).toHaveLength(0);
  });

  it('keeps the requested decimals while counting', () => {
    const { result } = renderHook(() => useCountUp(9.75, true, 2, 1000));
    step(1000);
    expect(result.current).toBe(9.75);
  });

  it('jumps straight to the target under reduced motion', () => {
    setMediaQuery('(prefers-reduced-motion: reduce)', true);
    const { result } = renderHook(() => useCountUp(42, true));
    expect(result.current).toBe(42);
    expect(frames).toHaveLength(0);
  });

  it('does not animate a zero target', () => {
    const { result } = renderHook(() => useCountUp(0, true));
    expect(result.current).toBe(0);
    expect(frames).toHaveLength(0);
  });

  it('cancels a pending frame on unmount', () => {
    const { unmount } = renderHook(() => useCountUp(100, true));
    unmount();
    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);
  });
});
