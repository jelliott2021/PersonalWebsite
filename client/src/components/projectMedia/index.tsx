import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { FiPlay } from 'react-icons/fi';
import type { Project } from '../../data/projects';
import './index.css';

interface ProjectMediaProps {
  project: Project;
  compact?: boolean;
}

/**
 * Whether hover previews make sense here: a hover-capable, precise pointer,
 * no reduced-motion preference, and no data-saver request.
 */
const canPreview = (): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return (
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !nav.connection?.saveData
  );
};

interface PreviewProps {
  src: string;
  active: boolean;
}

/**
 * Muted looping clip that is only fetched and played while the tile is
 * hovered or focused, and fades in once frames are actually rendering.
 */
const Preview = ({ src, active }: PreviewProps) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [showing, setShowing] = useState(false);
  // Phone recordings are letterboxed over the tile rather than cropped to a sliver.
  const [portrait, setPortrait] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) {
      return;
    }
    if (active) {
      const attempt = video.play();
      if (attempt) {
        attempt.catch(() => {
          // Autoplay refused or the clip is missing: the tile stays as it was.
        });
      }
    } else {
      video.pause();
      setShowing(false);
    }
  }, [active]);

  return (
    <video
      ref={ref}
      className={`media__preview ${portrait ? 'media__preview--portrait' : ''} ${showing ? 'is-showing' : ''}`
        .replace(/\s+/g, ' ')
        .trim()}
      src={src}
      muted
      loop
      playsInline
      preload='none'
      aria-hidden='true'
      tabIndex={-1}
      onLoadedMetadata={event =>
        setPortrait(event.currentTarget.videoHeight > event.currentTarget.videoWidth)
      }
      onPlaying={() => setShowing(true)}
    />
  );
};

/**
 * Media tile for a project. Animated GIFs are small and show immediately.
 * Demo videos are large, so nothing is downloaded until the visitor presses
 * play; until then a tinted tile with the project icon stands in, and on
 * hover a short muted preview clip plays over it where one exists.
 */
const ProjectMedia = ({ project, compact = false }: ProjectMediaProps) => {
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [previewable] = useState(() => Boolean(project.preview) && canPreview());
  const Icon = project.icon;
  const style = { '--tile-hue': project.hue } as CSSProperties;
  const sizeClass = compact ? 'media--compact' : '';

  if (project.video && playing) {
    return (
      <div className={`media media--video ${sizeClass}`}>
        <video src={project.video} controls autoPlay playsInline preload='metadata'>
          Your browser does not support embedded video.{' '}
          <a href={project.video}>Download the demo instead.</a>
        </video>
      </div>
    );
  }

  if (project.gif) {
    return (
      <div className={`media media--gif ${sizeClass}`} style={style}>
        <img src={project.gif} alt={`Animated demo of ${project.title}`} />
      </div>
    );
  }

  if (project.video) {
    return (
      <button
        type='button'
        className={`media media--tile media--playable ${sizeClass}`}
        style={style}
        onClick={() => setPlaying(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label={`Play the ${project.title} demo video`}>
        <span className='media__icon' aria-hidden='true'>
          <Icon />
        </span>
        {previewable && project.preview && <Preview src={project.preview} active={hovered} />}
        <span className='media__play' aria-hidden='true'>
          <FiPlay />
        </span>
        <span className='media__caption'>
          Watch demo
          {project.videoSize && <span className='media__size'> · {project.videoSize}</span>}
        </span>
      </button>
    );
  }

  return (
    <div className={`media media--tile ${sizeClass}`} style={style} aria-hidden='true'>
      <span className='media__icon'>
        <Icon />
      </span>
    </div>
  );
};

export default ProjectMedia;
