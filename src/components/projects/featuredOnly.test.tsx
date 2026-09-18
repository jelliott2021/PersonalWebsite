import { render, screen } from '@testing-library/react';
import Projects from '.';

jest.mock('../../data/projects', () => {
  const actual = jest.requireActual('../../data/projects');
  const icons = jest.requireActual('react-icons/fi');
  return {
    ...actual,
    PROJECTS: [
      {
        id: 'only',
        title: 'Only',
        tagline: 'The one project.',
        description: 'Nothing else to show.',
        tech: [],
        status: 'live',
        featured: true,
        icon: icons.FiCode,
        hue: 0,
      },
    ],
  };
});

jest.mock('../../hooks/useGithubContributions', () => () => null);

describe('Projects with only featured entries', () => {
  it('skips the "other projects" grid', () => {
    render(<Projects />);
    expect(screen.getByRole('heading', { name: 'Only' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Other noteworthy projects' })).toBeNull();
    expect(document.querySelector('.project-grid')).toBeNull();
  });
});
