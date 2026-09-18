import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FiCode } from 'react-icons/fi';
import ProjectMedia, { canPreview } from '.';
import type { Project } from '../../data/projects';
import { setMediaQuery } from '../../test-utils/dom';

const base: Project = {
  id: 'demo',
  title: 'Demo',
  tagline: 'A demo',
  description: 'Demo project',
  tech: [],
  status: 'live',
  featured: false,
  icon: FiCode,
  hue: 120,
};

const HOVER = '(hover: hover) and (pointer: fine)';

describe('canPreview', () => {
  it('needs a fine hover pointer, no reduced motion, and no data saver', () => {
    expect(canPreview()).toBe(false);
    setMediaQuery(HOVER, true);
    expect(canPreview()).toBe(true);

    setMediaQuery('(prefers-reduced-motion: reduce)', true);
    expect(canPreview()).toBe(false);
    setMediaQuery('(prefers-reduced-motion: reduce)', false);

    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: true },
    });
    expect(canPreview()).toBe(false);
    Object.defineProperty(navigator, 'connection', { configurable: true, value: undefined });
  });

  it('is false without matchMedia', () => {
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: undefined });
    expect(canPreview()).toBe(false);
  });
});

describe('ProjectMedia', () => {
  it('shows a GIF straight away', () => {
    render(<ProjectMedia project={{ ...base, gif: '/demo.gif' }} />);
    expect(screen.getByRole('img', { name: 'Animated demo of Demo' })).toHaveAttribute(
      'src',
      '/demo.gif',
    );
  });

  it('shows a plain tile when there is no media', () => {
    const { container } = render(<ProjectMedia project={base} compact />);
    const tile = container.firstChild as HTMLElement;
    expect(tile).toHaveClass('media--tile', 'media--compact');
    expect(tile).toHaveAttribute('aria-hidden', 'true');
    expect(tile.style.getPropertyValue('--tile-hue')).toBe('120');
  });

  it('swaps the play button for a video only after a click', async () => {
    const user = userEvent.setup();
    render(<ProjectMedia project={{ ...base, video: '/demo.mp4', videoSize: '10 MB' }} />);
    const button = screen.getByRole('button', { name: 'Play the Demo demo video' });
    expect(button).toHaveTextContent('Watch demo');
    expect(button).toHaveTextContent('10 MB');
    expect(screen.queryByTestId('media-video')).not.toBeInTheDocument();

    await user.click(button);
    const video = screen.getByTestId('media-video');
    expect(video).toHaveAttribute('src', '/demo.mp4');
    expect(video.querySelector('a')).toHaveAttribute('href', '/demo.mp4');
  });

  it('omits the size note when none is given', () => {
    render(<ProjectMedia project={{ ...base, video: '/demo.mp4' }} />);
    expect(screen.getByRole('button')).not.toHaveTextContent('MB');
  });

  it('does not mount a preview where hover previews are unsuitable', () => {
    render(<ProjectMedia project={{ ...base, video: '/demo.mp4', preview: '/p.mp4' }} />);
    expect(screen.queryByTestId('media-preview')).not.toBeInTheDocument();
  });

  it('plays the preview on hover or focus and pauses on leave or blur', () => {
    setMediaQuery(HOVER, true);
    render(<ProjectMedia project={{ ...base, video: '/demo.mp4', preview: '/p.mp4' }} />);
    const button = screen.getByRole('button');
    const preview = screen.getByTestId('media-preview') as HTMLVideoElement;
    expect(preview).toHaveAttribute('src', '/p.mp4');
    expect(preview.pause).toHaveBeenCalledTimes(1);

    fireEvent.mouseEnter(button);
    expect(preview.play).toHaveBeenCalledTimes(1);
    fireEvent.playing(preview);
    expect(preview).toHaveClass('is-showing');

    fireEvent.mouseLeave(button);
    expect(preview.pause).toHaveBeenCalledTimes(2);
    expect(preview).not.toHaveClass('is-showing');

    fireEvent.focus(button);
    expect(preview.play).toHaveBeenCalledTimes(2);
    fireEvent.blur(button);
    expect(preview.pause).toHaveBeenCalledTimes(3);
  });

  it('letterboxes portrait previews and survives a refused autoplay', async () => {
    setMediaQuery(HOVER, true);
    (HTMLMediaElement.prototype.play as jest.Mock).mockImplementation(() =>
      Promise.reject(new Error('NotAllowedError')),
    );
    render(<ProjectMedia project={{ ...base, video: '/demo.mp4', preview: '/p.mp4' }} />);
    const preview = screen.getByTestId('media-preview') as HTMLVideoElement;
    Object.defineProperty(preview, 'videoWidth', { value: 360 });
    Object.defineProperty(preview, 'videoHeight', { value: 640 });
    fireEvent.loadedMetadata(preview);
    expect(preview).toHaveClass('media__preview--portrait');

    fireEvent.mouseEnter(screen.getByRole('button'));
    await act(async () => {
      await Promise.resolve();
    });
    expect(preview).not.toHaveClass('is-showing');
  });

  it('copes with browsers whose play() returns nothing', () => {
    setMediaQuery(HOVER, true);
    (HTMLMediaElement.prototype.play as jest.Mock).mockImplementation(() => undefined);
    render(<ProjectMedia project={{ ...base, video: '/demo.mp4', preview: '/p.mp4' }} />);
    expect(() => fireEvent.mouseEnter(screen.getByRole('button'))).not.toThrow();
  });
});
