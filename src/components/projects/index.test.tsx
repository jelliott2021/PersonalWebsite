import { render, screen, within } from '@testing-library/react';
import Projects from '.';
import { profile } from '../../data/profile';
import { mockFetchJson } from '../../test-utils/dom';

jest.mock('../../data/projects', () => {
  const actual = jest.requireActual('../../data/projects');
  const icons = jest.requireActual('react-icons/fi');
  return {
    ...actual,
    PROJECTS: [
      {
        id: 'starred',
        title: 'Starred',
        tagline: 'Has everything.',
        description: 'A featured project with every optional field.',
        highlights: ['Highlight one.'],
        tech: ['TypeScript'],
        period: '2026',
        status: 'open-source',
        featured: true,
        icon: icons.FiCode,
        hue: 10,
        github: 'https://github.com/o/starred',
        repo: 'o/starred',
        stars: 50,
        live: 'https://starred.example',
        note: 'A note.',
        credentials: { user: 'guest', password: 'pw' },
      },
      {
        id: 'bare',
        title: 'Bare',
        tagline: 'Has nothing optional.',
        description: 'A featured project with no links or notes.',
        tech: [],
        status: 'private',
        featured: true,
        icon: icons.FiCode,
        hue: 20,
      },
      {
        id: 'orphan-stars',
        title: 'Orphan',
        tagline: 'Stars without a repo link.',
        description: 'Small card with stars but no GitHub link.',
        tech: ['CSS'],
        status: 'archived',
        featured: false,
        icon: icons.FiCode,
        hue: 30,
        stars: 7,
        note: 'Only a note.',
      },
      {
        id: 'creds-only',
        title: 'Creds',
        tagline: 'Only credentials.',
        description: 'Small card with credentials and a live link.',
        tech: ['Java'],
        status: 'live',
        featured: false,
        icon: icons.FiCode,
        hue: 40,
        live: 'https://creds.example',
        credentials: { user: 'u', password: 'p' },
      },
    ],
  };
});

jest.mock('../../hooks/useGithubContributions', () => () => null);

describe('Projects', () => {
  it('splits featured projects from the grid and links to GitHub', () => {
    render(<Projects />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Things I’ve built' }),
    ).toBeInTheDocument();
    expect(document.querySelectorAll('.featured')).toHaveLength(2);
    expect(document.querySelectorAll('.project-card')).toHaveLength(2);
    expect(document.querySelectorAll('.featured--reverse')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Other noteworthy projects' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^GitHub/ })).toHaveAttribute('href', profile.github);
  });

  it('renders every optional field of a full project', () => {
    render(<Projects />);
    const card = screen.getByRole('heading', { name: 'Starred' }).closest('article') as HTMLElement;
    const scoped = within(card);
    expect(scoped.getByText('Featured project')).toHaveTextContent('2026');
    expect(scoped.getByText('Highlight one.')).toBeInTheDocument();
    expect(scoped.getByText('A note.')).toBeInTheDocument();
    expect(scoped.getByText('Open source')).toBeInTheDocument();
    const source = scoped.getByRole('link', { name: 'Starred on GitHub' });
    expect(source).toHaveAttribute('href', 'https://github.com/o/starred');
    expect(source).toHaveTextContent('Source');
    const visit = scoped.getByRole('link', { name: 'Open Starred' });
    expect(visit).toHaveAttribute('href', 'https://starred.example');
    expect(visit).toHaveTextContent('Visit site');
    expect(scoped.getByRole('link', { name: /50 stars on GitHub/ })).toHaveAttribute(
      'href',
      'https://github.com/o/starred/stargazers',
    );
    expect(scoped.getByText('Test account')).toBeInTheDocument();
    expect(scoped.getByText('guest')).toBeInTheDocument();
    expect(scoped.getByText('pw')).toBeInTheDocument();
  });

  it('omits links, notes, and badges that are not set', () => {
    render(<Projects />);
    const card = screen.getByRole('heading', { name: 'Bare' }).closest('article') as HTMLElement;
    expect(within(card).queryByRole('link')).toBeNull();
    expect(card.querySelector('.project-notes')).toBeNull();
    expect(card.querySelector('.stars')).toBeNull();
    expect(within(card).getByText('Private')).toBeInTheDocument();
  });

  it('hides a star badge when there is no GitHub link to point at', () => {
    render(<Projects />);
    const card = screen.getByRole('heading', { name: 'Orphan' }).closest('article') as HTMLElement;
    expect(card.querySelector('.stars')).toBeNull();
    expect(within(card).getByText('Only a note.')).toBeInTheDocument();
    expect(card.querySelector('details')).toBeNull();
  });

  it('shows credentials without a note and icon-only links on small cards', () => {
    render(<Projects />);
    const card = screen.getByRole('heading', { name: 'Creds' }).closest('article') as HTMLElement;
    expect(card.querySelector('.project-notes__note')).toBeNull();
    expect(card.querySelector('details')).not.toBeNull();
    expect(within(card).getByRole('link', { name: 'Open Creds' })).toHaveClass('icon-btn');
  });

  it('updates the star badge from the GitHub API', async () => {
    mockFetchJson({ stargazers_count: 99 });
    render(<Projects />);
    expect(await screen.findByRole('link', { name: /99 stars on GitHub/ })).toBeInTheDocument();
  });
});
