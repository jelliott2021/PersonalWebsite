import { render, screen } from '@testing-library/react';
import About from '.';
import { profile } from '../../data/profile';
import { EDUCATION } from '../../data/education';

describe('About', () => {
  it('renders the bio, facts, interests, and stats from the profile', () => {
    render(<About />);

    expect(screen.getByRole('heading', { level: 2, name: 'About me' })).toBeInTheDocument();
    profile.about.forEach(paragraph => {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    });
    profile.interests.forEach(interest => {
      expect(screen.getByText(interest)).toBeInTheDocument();
    });

    // The location also appears on the section sign, so look inside the facts list.
    const facts = screen.getByText('At a glance').closest('.about__facts') as HTMLElement;
    expect(facts).toHaveTextContent(profile.location);
    expect(facts).toHaveTextContent(profile.hometown);
    expect(screen.getByRole('link', { name: profile.company })).toHaveAttribute(
      'href',
      profile.companyUrl,
    );
    expect(screen.getByRole('link', { name: profile.email })).toHaveAttribute(
      'href',
      `mailto:${profile.email}`,
    );
    expect(screen.getByText(new RegExp(EDUCATION[0].school))).toBeInTheDocument();

    profile.stats.forEach(stat => {
      expect(screen.getByText(stat.label)).toBeInTheDocument();
    });
  });
});
