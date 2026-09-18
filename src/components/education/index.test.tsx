import { render, screen } from '@testing-library/react';
import Education from '.';

jest.mock('../../data/education', () => ({
  EDUCATION: [
    {
      id: 'full',
      school: 'Full University',
      schoolUrl: 'https://full.example',
      college: 'College of Everything',
      degree: 'B.S. Testing',
      location: 'Boston, MA',
      start: 'Sep 2021',
      end: 'Dec 2024',
      gpa: '3.9 / 4.0',
      coursework: ['Course A', 'Course B'],
      highlights: ['Did a thing.'],
    },
    {
      id: 'minimal',
      school: 'Minimal School',
      degree: 'Certificate',
      location: 'Milton, MA',
      start: '2015',
      end: '2017',
      coursework: ['Course C'],
      highlights: [],
    },
  ],
}));

describe('Education', () => {
  it('renders every field of a complete entry', () => {
    render(<Education />);
    expect(screen.getByRole('link', { name: 'Full University' })).toHaveAttribute(
      'href',
      'https://full.example',
    );
    expect(screen.getByText('College of Everything')).toBeInTheDocument();
    expect(screen.getByText('B.S. Testing')).toBeInTheDocument();
    expect(screen.getByText('GPA 3.9 / 4.0')).toBeInTheDocument();
    expect(screen.getByText('Did a thing.')).toBeInTheDocument();
    expect(screen.getByText('Course A')).toBeInTheDocument();
    expect(screen.getByText('Sep 2021')).toBeInTheDocument();
    expect(screen.getByText('Dec 2024')).toBeInTheDocument();
  });

  it('omits optional parts of a minimal entry', () => {
    render(<Education />);
    const heading = screen.getByRole('heading', { level: 3, name: 'Minimal School' });
    expect(heading.querySelector('a')).toBeNull();
    expect(screen.getByText('Certificate')).toBeInTheDocument();
    expect(screen.getAllByText(/GPA/)).toHaveLength(1);
    expect(screen.getAllByRole('list')).toHaveLength(3);
  });
});
