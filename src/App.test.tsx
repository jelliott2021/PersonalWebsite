import { render, screen } from '@testing-library/react';
import App from './App';
import { SECTION_IDS } from './data/navigation';

jest.mock('./hooks/useBostonWeather', () => () => undefined);
jest.mock('./hooks/useGithubContributions', () => () => null);

describe('App', () => {
  it('renders every section in order with a skip link and theme applied', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#about');
    expect(document.querySelector('header.navbar')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();

    const sections = SECTION_IDS.map(id => document.getElementById(id));
    sections.forEach(section => expect(section).not.toBeNull());
    for (let i = 1; i < sections.length; i += 1) {
      const before = sections[i - 1]!.compareDocumentPosition(sections[i]!);
      // eslint-disable-next-line no-bitwise
      expect(before & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }

    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });
});
