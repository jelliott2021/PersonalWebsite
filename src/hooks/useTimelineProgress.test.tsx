import { act, render } from '@testing-library/react';
import { useRef } from 'react';
import useTimelineProgress, { ANCHOR } from './useTimelineProgress';
import { setMediaQuery } from '../test-utils/dom';

interface TimelineProps {
  stops?: number;
  markers?: boolean;
  attach?: boolean;
}

const Timeline = ({ stops = 3, markers = true, attach = true }: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useTimelineProgress(ref);
  return (
    <div ref={attach ? ref : undefined} data-testid='timeline'>
      {Array.from({ length: stops }, (_, i) => (
        <div key={i} className='timeline__item' data-testid={`item-${i}`}>
          {markers && <div className='timeline__marker' data-top={100 + i * 400} />}
        </div>
      ))}
    </div>
  );
};

let frames: FrameRequestCallback[];

beforeEach(() => {
  frames = [];
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    frames.push(callback);
    return frames.length;
  });
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);
  // Markers report the top they were given; everything else sits at the origin.
  jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function rect(
    this: Element,
  ) {
    const top = Number(this.getAttribute('data-top') ?? 0);
    return { top, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: top } as DOMRect;
  });
  jest
    .spyOn(window, 'getComputedStyle')
    .mockImplementation(() => ({ top: '4px', height: '16px' }) as CSSStyleDeclaration);
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 });
});

const flushFrames = () => {
  const pending = frames.splice(0);
  act(() => pending.forEach(frame => frame(0)));
};

describe('useTimelineProgress', () => {
  it('draws the line up to the anchor and marks reached stops', () => {
    const { getByTestId } = render(<Timeline />);
    const root = getByTestId('timeline');
    // Dot centres: 112, 512, 912. Anchor: 660. Progress: (660-112)/800.
    expect(root.style.getPropertyValue('--track-top')).toBe('112px');
    expect(root.style.getPropertyValue('--track-height')).toBe('800px');
    expect(root.style.getPropertyValue('--timeline-progress')).toBe(
      ((1000 * ANCHOR - 112) / 800).toFixed(4),
    );
    expect(getByTestId('item-0')).toHaveClass('is-reached');
    expect(getByTestId('item-1')).toHaveClass('is-reached');
    expect(getByTestId('item-2')).not.toHaveClass('is-reached');
  });

  it('clamps progress between zero and one', () => {
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 100 });
    const { getByTestId } = render(<Timeline />);
    expect(getByTestId('timeline').style.getPropertyValue('--timeline-progress')).toBe('0.0000');

    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 5000 });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    flushFrames();
    expect(getByTestId('timeline').style.getPropertyValue('--timeline-progress')).toBe('1.0000');
  });

  it('falls back to a default dot size when styles are unavailable', () => {
    (window.getComputedStyle as jest.Mock).mockImplementation(
      () => ({ top: '', height: '' }) as CSSStyleDeclaration,
    );
    const { getByTestId } = render(<Timeline />);
    // Offset 0, size 16: centre at 108.
    expect(getByTestId('timeline').style.getPropertyValue('--track-top')).toBe('108px');
  });

  it('coalesces scroll events into one frame', () => {
    render(<Timeline />);
    act(() => {
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
    });
    expect(frames).toHaveLength(1);
    flushFrames();
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(frames).toHaveLength(1);
  });

  it('shows everything under reduced motion', () => {
    setMediaQuery('(prefers-reduced-motion: reduce)', true);
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 100 });
    const { getByTestId } = render(<Timeline />);
    expect(getByTestId('timeline').style.getPropertyValue('--timeline-progress')).toBe('1.0000');
    expect(getByTestId('item-2')).toHaveClass('is-reached');
  });

  it('handles a single stop without dividing by zero', () => {
    const { getByTestId } = render(<Timeline stops={1} />);
    expect(getByTestId('timeline').style.getPropertyValue('--track-height')).toBe('1px');
  });

  it('does nothing without a container, items, or markers', () => {
    const { getByTestId, unmount } = render(<Timeline attach={false} />);
    expect(getByTestId('timeline').style.getPropertyValue('--track-top')).toBe('');
    unmount();

    const empty = render(<Timeline stops={0} />);
    expect(empty.getByTestId('timeline').style.getPropertyValue('--track-top')).toBe('');
    empty.unmount();

    const noMarkers = render(<Timeline markers={false} />);
    expect(noMarkers.getByTestId('timeline').style.getPropertyValue('--track-top')).toBe('');
  });

  it('removes listeners and cancels a pending frame on unmount', () => {
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(<Timeline />);
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    unmount();
    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
