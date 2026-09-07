import React, { CSSProperties, useState } from 'react';
import { FiPlay } from 'react-icons/fi';
import type { Project } from '../../data/projects';
import './index.css';

interface ProjectMediaProps {
  project: Project;
  compact?: boolean;
}

/**
 * Media tile for a project. Demo videos are large, so nothing is downloaded
 * until the visitor presses play; until then a tinted tile with the project
 * icon stands in.
 */
const ProjectMedia = ({ project, compact = false }: ProjectMediaProps) => {
  const [playing, setPlaying] = useState(false);
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

  if (project.video) {
    return (
      <button
        type='button'
        className={`media media--tile media--playable ${sizeClass}`}
        style={style}
        onClick={() => setPlaying(true)}
        aria-label={`Play the ${project.title} demo video`}>
        <span className='media__icon' aria-hidden='true'>
          <Icon />
        </span>
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
