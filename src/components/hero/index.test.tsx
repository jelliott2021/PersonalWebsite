import { render, screen } from '@testing-library/react';
import Hero from '.';
import { profile } from '../../data/profile';
import useBostonTime from '../../hooks/useBostonTime';
import useBostonWeather from '../../hooks/useBostonWeather';

jest.mock('../../hooks/useBostonTime');
jest.mock('../../hooks/useBostonWeather');

const mockedTime = useBostonTime as jest.MockedFunction<typeof useBostonTime>;
const mockedWeather = useBostonWeather as jest.MockedFunction<typeof useBostonWeather>;

beforeEach(() => {
  mockedTime.mockReturnValue({
    time: '2:30 PM',
    greeting: 'Good afternoon',
    hour: 14.5,
    sunrise: 6,
    sunset: 20,
  });
  mockedWeather.mockReturnValue(undefined);
});

describe('Hero', () => {
  it('greets from Boston with the local time and no weather until it is known', () => {
    render(<Hero />);
    const eyebrow = screen.getByText(/Good afternoon from Boston/);
    expect(eyebrow).toHaveTextContent('2:30 PM ET');
    expect(eyebrow).not.toHaveTextContent('°F');
  });

  it('appends the weather once it arrives', () => {
    mockedWeather.mockReturnValue({ temperature: 71.6, condition: 'clear', label: 'clear' });
    render(<Hero />);
    expect(screen.getByText(/Good afternoon from Boston/)).toHaveTextContent('72°F and clear');
  });

  it('shows the name, pitch, links, and photo from the profile', () => {
    render(<Hero />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(profile.firstName);
    expect(heading).toHaveTextContent(profile.lastName);
    expect(screen.getByText(profile.headline)).toBeInTheDocument();
    expect(screen.getByText(profile.intro)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /See my work/ })).toHaveAttribute('href', '#projects');
    expect(screen.getByRole('link', { name: /View résumé/ })).toHaveAttribute(
      'href',
      profile.resumeUrl,
    );
    expect(screen.getByRole('link', { name: new RegExp(profile.githubHandle) })).toHaveAttribute(
      'href',
      profile.github,
    );
    expect(screen.getByRole('link', { name: profile.company })).toHaveAttribute(
      'href',
      profile.companyUrl,
    );
    expect(screen.getByRole('img')).toHaveAttribute('src', profile.photo);
    expect(screen.getByText(profile.coordinates)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Scroll to the About section' })).toHaveAttribute(
      'href',
      '#about',
    );
  });
});
