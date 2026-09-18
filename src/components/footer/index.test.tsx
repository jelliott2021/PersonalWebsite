import { render, screen } from '@testing-library/react';
import Footer from '.';
import { profile } from '../../data/profile';

describe('Footer', () => {
  it('credits the author, shows the year, and links out', () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()}`))).toBeInTheDocument();
    expect(screen.getByRole('link', { name: profile.name })).toHaveAttribute('href', '#home');
    expect(screen.getByRole('link', { name: 'View source' })).toHaveAttribute(
      'href',
      profile.sourceUrl,
    );
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', profile.github);
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      profile.linkedin,
    );
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      `mailto:${profile.email}`,
    );
    expect(screen.getByRole('link', { name: 'Back to top' })).toHaveAttribute('href', '#home');
  });
});
