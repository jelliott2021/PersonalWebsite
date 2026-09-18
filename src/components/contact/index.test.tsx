import { act, fireEvent, render, screen } from '@testing-library/react';
import Contact from '.';
import { profile } from '../../data/profile';

const originalLocation = window.location;

beforeAll(() => {
  // jsdom cannot navigate; give the fallback somewhere harmless to write to.
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...originalLocation, href: originalLocation.href },
  });
});

afterAll(() => {
  Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
});

/** Clicks the copy button and lets the clipboard promise settle. */
const clickCopy = async () => {
  fireEvent.click(screen.getByRole('button', { name: 'Copy email' }));
  await act(async () => {
    await Promise.resolve();
  });
};

describe('Contact', () => {
  it('links to email, LinkedIn, GitHub, and the résumé, and hides the phone', () => {
    render(<Contact />);
    expect(screen.getByRole('link', { name: /Say hello/ })).toHaveAttribute(
      'href',
      `mailto:${profile.email}`,
    );
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute(
      'href',
      profile.linkedin,
    );
    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', profile.github);
    expect(screen.getByRole('link', { name: /Résumé/ })).toHaveAttribute('href', profile.resumeUrl);
    expect(screen.queryByRole('link', { name: /\(\d{3}\)/ })).not.toBeInTheDocument();
  });

  it('copies the email and reverts the label after a moment', async () => {
    jest.useFakeTimers();
    render(<Contact />);

    await clickCopy();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(profile.email);
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2200);
    });
    expect(screen.getByRole('button', { name: 'Copy email' })).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('opens the mail client when the clipboard is blocked', async () => {
    (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(new Error('denied'));
    render(<Contact />);
    await clickCopy();
    expect(window.location.href).toBe(`mailto:${profile.email}`);
    expect(screen.getByRole('button', { name: 'Copy email' })).toBeInTheDocument();
  });
});
