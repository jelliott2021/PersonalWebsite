import { render, screen } from '@testing-library/react';
import Experience from '.';

jest.mock('../../data/experience', () => ({
  EXPERIENCE: [
    {
      id: 'full',
      company: 'Acme',
      companyUrl: 'https://acme.example',
      role: 'Engineer',
      type: 'Full-time',
      location: 'Boston, MA',
      start: 'May 2025',
      end: 'Present',
      bullets: ['Built things.', 'Fixed things.'],
      tech: ['TypeScript'],
    },
    {
      id: 'minimal',
      company: 'Solo',
      role: 'Contractor',
      type: 'Contract',
      location: 'Remote',
      start: '2026',
      summary: 'Independent work.',
      bullets: [],
      tech: [],
    },
  ],
}));

describe('Experience', () => {
  it('renders a full entry with period, company link, bullets, and tech', () => {
    render(<Experience />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Where I’ve worked' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Acme' })).toHaveAttribute(
      'href',
      'https://acme.example',
    );
    expect(screen.getByText('May 2025')).toBeInTheDocument();
    expect(screen.getByText('Present')).toBeInTheDocument();
    expect(screen.getByText('Built things.')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Full-time')).toBeInTheDocument();
  });

  it('renders a minimal entry with a summary and no link, bullets, or tech', () => {
    render(<Experience />);
    const heading = screen.getByRole('heading', { level: 3, name: /Contractor/ });
    expect(heading).toHaveTextContent('Solo');
    expect(heading.querySelector('a')).toBeNull();
    expect(screen.getByText('Independent work.')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
    expect(screen.getAllByRole('list', { name: 'Technologies' })).toHaveLength(1);
  });

  it('wires the timeline container up to the progress hook', () => {
    const { container } = render(<Experience />);
    const timeline = container.querySelector('.timeline') as HTMLElement;
    expect(timeline.style.getPropertyValue('--timeline-progress')).not.toBe('');
    expect(container.querySelectorAll('.timeline__item')).toHaveLength(2);
  });
});
