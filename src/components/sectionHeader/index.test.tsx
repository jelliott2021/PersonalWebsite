import { render, screen } from '@testing-library/react';
import SectionHeader from '.';

describe('SectionHeader', () => {
  it('renders the sign as an h2 with an optional subtitle', () => {
    render(<SectionHeader index='02' title='Title' caption='Caption' subtitle='More detail' />);
    expect(screen.getByRole('heading', { level: 2, name: 'Title' })).toBeInTheDocument();
    expect(screen.getByText('Caption')).toBeInTheDocument();
    expect(screen.getByText('More detail')).toHaveClass('section-header__subtitle');
  });

  it('omits the subtitle when none is given', () => {
    const { container } = render(<SectionHeader index='02' title='Title' caption='Caption' />);
    expect(container.querySelector('.section-header__subtitle')).toBeNull();
  });
});
