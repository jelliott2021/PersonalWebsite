import { render, screen } from '@testing-library/react';
import Contact from '.';
import { profile } from '../../data/profile';

jest.mock('../../data/profile', () => {
  const actual = jest.requireActual('../../data/profile');
  return { ...actual, profile: { ...actual.profile, showPhone: true } };
});

describe('Contact with the phone number enabled', () => {
  it('renders a tel: link with the digits only', () => {
    render(<Contact />);
    const link = screen.getByText(profile.phone).closest('a');
    expect(link).toHaveAttribute('href', `tel:${profile.phone.replace(/[^\d+]/g, '')}`);
  });
});
