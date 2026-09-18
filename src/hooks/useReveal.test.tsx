import { act, render, screen } from '@testing-library/react';
import useReveal from './useReveal';
import { intersectionObservers, latestObserver, setMediaQuery } from '../test-utils/dom';

const Probe = ({ attach = true }: { attach?: boolean }) => {
  const { ref, visible } = useReveal<HTMLDivElement>(0.5);
  return (
    <div ref={attach ? ref : undefined} data-testid='probe'>
      {visible ? 'visible' : 'hidden'}
    </div>
  );
};

describe('useReveal', () => {
  it('reveals once the element intersects, then stops observing', () => {
    render(<Probe />);
    expect(screen.getByTestId('probe')).toHaveTextContent('hidden');
    const observer = latestObserver();
    expect(observer.options).toEqual({ threshold: 0.5, rootMargin: '0px 0px -6% 0px' });

    act(() => observer.trigger(false));
    expect(screen.getByTestId('probe')).toHaveTextContent('hidden');

    act(() => observer.trigger(true));
    expect(screen.getByTestId('probe')).toHaveTextContent('visible');
    expect(observer.disconnected).toBe(true);
  });

  it('reveals immediately under reduced motion', () => {
    setMediaQuery('(prefers-reduced-motion: reduce)', true);
    render(<Probe />);
    expect(screen.getByTestId('probe')).toHaveTextContent('visible');
    expect(intersectionObservers).toHaveLength(0);
  });

  it('reveals immediately without IntersectionObserver support', () => {
    Object.defineProperty(window, 'IntersectionObserver', { configurable: true, value: undefined });
    render(<Probe />);
    expect(screen.getByTestId('probe')).toHaveTextContent('visible');
  });

  it('does nothing when the ref is never attached', () => {
    render(<Probe attach={false} />);
    expect(screen.getByTestId('probe')).toHaveTextContent('hidden');
    expect(intersectionObservers).toHaveLength(0);
  });

  it('disconnects on unmount', () => {
    const { unmount } = render(<Probe />);
    const observer = latestObserver();
    unmount();
    expect(observer.disconnected).toBe(true);
  });
});
