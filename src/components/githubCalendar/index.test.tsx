import { render, screen } from '@testing-library/react';
import GithubCalendar from '.';
import useGithubContributions from '../../hooks/useGithubContributions';
import { profile } from '../../data/profile';

jest.mock('../../hooks/useGithubContributions');

const mockedHook = useGithubContributions as jest.MockedFunction<typeof useGithubContributions>;

describe('GithubCalendar', () => {
  it('renders nothing while loading or after a failure', () => {
    mockedHook.mockReturnValue(undefined);
    const { container, rerender } = render(<GithubCalendar />);
    expect(container).toBeEmptyDOMElement();

    mockedHook.mockReturnValue(null);
    rerender(<GithubCalendar />);
    expect(container).toBeEmptyDOMElement();
    expect(mockedHook).toHaveBeenCalledWith(profile.githubHandle);
  });

  it('draws one cell per day with a tooltip and a summary', () => {
    mockedHook.mockReturnValue({
      total: 3,
      days: [
        { date: '2026-01-04', count: 0, level: 0 },
        { date: '2026-01-05', count: 1, level: 1 },
        { date: '2026-01-06', count: 2, level: 3 },
      ],
    });
    const { container } = render(<GithubCalendar />);
    expect(screen.getByText('3 contributions in the last year')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'Contribution calendar: 3 contributions in the last year',
    );
    expect(screen.getByRole('link', { name: new RegExp(profile.githubHandle) })).toHaveAttribute(
      'href',
      profile.github,
    );

    const cells = container.querySelectorAll('rect.gh-cal__cell');
    expect(cells).toHaveLength(3);
    expect(cells[2]).toHaveClass('gh-cal__cell--3');
    expect(cells[1].querySelector('title')).toHaveTextContent('1 contribution on Jan 5, 2026');
    expect(container.querySelectorAll('.gh-cal__month')).toHaveLength(1);
    expect(container.querySelectorAll('.gh-cal__weekday')).toHaveLength(3);
    expect(container.querySelectorAll('.gh-cal__swatch')).toHaveLength(5);
  });
});
