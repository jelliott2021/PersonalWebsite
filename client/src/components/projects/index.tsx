import React from 'react';
import { FiExternalLink, FiGithub, FiInfo, FiKey } from 'react-icons/fi';
import { PROJECTS, statusLabels } from '../../data/projects';
import type { Project } from '../../data/projects';
import { profile } from '../../data/profile';
import SectionHeader from '../sectionHeader';
import Reveal from '../reveal';
import ProjectMedia from '../projectMedia';
import './index.css';

interface ProjectLinksProps {
  project: Project;
  labelled?: boolean;
}

const ProjectLinks = ({ project, labelled = false }: ProjectLinksProps) => (
  <div className='project-links'>
    {project.github && (
      <a
        className={labelled ? 'btn btn--secondary btn--sm' : 'icon-btn'}
        href={project.github}
        target='_blank'
        rel='noopener noreferrer'
        aria-label={`${project.title} on GitHub`}>
        <FiGithub aria-hidden='true' />
        {labelled && 'Source'}
      </a>
    )}
    {project.live && (
      <a
        className={labelled ? 'btn btn--primary btn--sm' : 'icon-btn'}
        href={project.live}
        target='_blank'
        rel='noopener noreferrer'
        aria-label={`Open ${project.title}`}>
        <FiExternalLink aria-hidden='true' />
        {labelled && 'Visit site'}
      </a>
    )}
  </div>
);

const StatusBadge = ({ status }: { status: Project['status'] }) => (
  <span className={`status status--${status}`}>
    <span className='status__dot' aria-hidden='true' />
    {statusLabels[status]}
  </span>
);

const ProjectNotes = ({ project }: { project: Project }) => {
  if (!project.note && !project.credentials) {
    return null;
  }
  return (
    <div className='project-notes'>
      {project.note && (
        <p className='project-notes__note'>
          <FiInfo aria-hidden='true' />
          <span>{project.note}</span>
        </p>
      )}
      {project.credentials && (
        <details className='project-notes__creds'>
          <summary>
            <FiKey aria-hidden='true' /> Test account
          </summary>
          <dl>
            <div>
              <dt>Username</dt>
              <dd>
                <code>{project.credentials.user}</code>
              </dd>
            </div>
            <div>
              <dt>Password</dt>
              <dd>
                <code>{project.credentials.password}</code>
              </dd>
            </div>
          </dl>
        </details>
      )}
    </div>
  );
};

interface FeaturedProjectProps {
  project: Project;
  reverse: boolean;
}

const FeaturedProject = ({ project, reverse }: FeaturedProjectProps) => (
  <Reveal tag='article' className={`featured ${reverse ? 'featured--reverse' : ''}`}>
    <div className='featured__media'>
      <ProjectMedia project={project} />
    </div>
    <div className='featured__body card'>
      <div className='featured__top'>
        <span className='eyebrow'>
          Featured project
          {project.period && <span className='featured__period'> · {project.period}</span>}
        </span>
        <StatusBadge status={project.status} />
      </div>
      <h3 className='featured__title'>{project.title}</h3>
      <p className='featured__tagline'>{project.tagline}</p>
      <p className='featured__description'>{project.description}</p>
      {project.highlights && (
        <ul className='bullets featured__highlights'>
          {project.highlights.map(highlight => (
            <li key={highlight.slice(0, 32)}>{highlight}</li>
          ))}
        </ul>
      )}
      <ul className='chips' aria-label='Technologies'>
        {project.tech.map(tech => (
          <li key={tech} className='chip chip--tech'>
            {tech}
          </li>
        ))}
      </ul>
      <ProjectNotes project={project} />
      <ProjectLinks project={project} labelled />
    </div>
  </Reveal>
);

interface ProjectCardProps {
  project: Project;
  delay: number;
}

const ProjectCard = ({ project, delay }: ProjectCardProps) => (
  <Reveal tag='article' className='project-card card card--hover' delay={delay}>
    <ProjectMedia project={project} compact />
    <div className='project-card__body'>
      <div className='project-card__top'>
        <StatusBadge status={project.status} />
        <ProjectLinks project={project} />
      </div>
      <h3 className='project-card__title'>{project.title}</h3>
      <p className='project-card__description'>{project.description}</p>
      <ProjectNotes project={project} />
      <ul className='chips project-card__tech' aria-label='Technologies'>
        {project.tech.map(tech => (
          <li key={tech} className='chip chip--tech'>
            {tech}
          </li>
        ))}
      </ul>
    </div>
  </Reveal>
);

const Projects = () => {
  const featured = PROJECTS.filter(project => project.featured);
  const others = PROJECTS.filter(project => !project.featured);

  return (
    <section id='projects' className='section'>
      <div className='container'>
        <Reveal>
          <SectionHeader
            index='03'
            title='Things I’ve built'
            subtitle='A mix of deployed products, open-source tooling, and coursework I’m proud of. Demo videos only download when you press play.'
          />
        </Reveal>

        <div className='featured-list'>
          {featured.map((project, index) => (
            <FeaturedProject key={project.id} project={project} reverse={index % 2 === 1} />
          ))}
        </div>

        {others.length > 0 && (
          <>
            <Reveal>
              <h3 className='projects__more'>Other noteworthy projects</h3>
            </Reveal>
            <div className='project-grid'>
              {others.map((project, index) => (
                <ProjectCard key={project.id} project={project} delay={index * 80} />
              ))}
            </div>
          </>
        )}

        <Reveal className='projects__cta'>
          <p>
            More experiments and coursework live on{' '}
            <a href={profile.github} target='_blank' rel='noopener noreferrer'>
              GitHub <FiExternalLink aria-hidden='true' />
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default Projects;
