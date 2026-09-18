import { render, screen } from '@testing-library/react';
import Skills from '.';

jest.mock('../../data/skills', () => {
  const icons = jest.requireActual('react-icons/si');
  return {
    SKILL_GROUPS: [
      {
        id: 'languages',
        title: 'Languages',
        blurb: 'Words for computers.',
        skills: [
          { name: 'TypeScript', icon: icons.SiTypescript, color: '#3178C6' },
          { name: 'Plain skill' },
        ],
      },
    ],
  };
});

describe('Skills', () => {
  it('renders each group with its blurb and skills', () => {
    render(<Skills />);
    expect(screen.getByRole('heading', { level: 2, name: 'Skills & tools' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Languages' })).toBeInTheDocument();
    expect(screen.getByText('Words for computers.')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Plain skill')).toBeInTheDocument();
  });

  it('uses the brand icon and colour when given, and a dot otherwise', () => {
    render(<Skills />);
    const typescript = screen.getByText('TypeScript').closest('li') as HTMLElement;
    expect(typescript.style.getPropertyValue('--skill-color')).toBe('#3178C6');
    expect(typescript.querySelector('svg')).not.toBeNull();

    const plain = screen.getByText('Plain skill').closest('li') as HTMLElement;
    expect(plain.style.getPropertyValue('--skill-color')).toBe('');
    expect(plain.querySelector('.skill__dot')).not.toBeNull();
  });
});
