import { CSSProperties } from 'react';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import { profile } from '../../data/profile';
import useGithubContributions from '../../hooks/useGithubContributions';
import {
  CELL,
  GAP,
  LEFT,
  STEP,
  TOP,
  WEEKDAY_LABELS,
  describeDay,
  describeTotal,
  monthLabels,
  toWeeks,
} from '../../lib/contributions';
import Reveal from '../reveal';
import './index.css';

/**
 * The GitHub contribution graph for the last year, drawn as an SVG heatmap
 * that scales with the card. Cells pop in column by column when the card
 * scrolls into view. Renders nothing until the data arrives and nothing at
 * all if it can't be fetched, so the page never shows an empty box.
 */
const GithubCalendar = () => {
  const data = useGithubContributions(profile.githubHandle);

  if (!data) {
    return null;
  }

  const weeks = toWeeks(data.days);
  // A little room on the right so the last month label isn't clipped.
  const width = LEFT + weeks.length * STEP - GAP + 14;
  const height = TOP + 7 * STEP - GAP;
  const summary = describeTotal(data.total);

  return (
    <Reveal className='card gh-cal'>
      <div className='gh-cal__head'>
        <span className='label gh-cal__label'>
          <FiGithub aria-hidden='true' /> A year on GitHub
        </span>
        <span className='gh-cal__total'>{summary}</span>
        <a
          className='gh-cal__profile'
          href={profile.github}
          target='_blank'
          rel='noopener noreferrer'>
          @{profile.githubHandle} <FiExternalLink aria-hidden='true' />
        </a>
      </div>

      {/* Scrolls sideways on narrow screens, so keyboard users need to be able to focus it. */}
      <div className='gh-cal__scroll' role='region' aria-label='Contribution calendar' tabIndex={0}>
        <svg
          className='gh-cal__grid'
          viewBox={`0 0 ${width} ${height}`}
          role='img'
          aria-label={`Contribution calendar: ${summary}`}>
          {monthLabels(weeks).map(month => (
            <text key={month.x} className='gh-cal__month' x={month.x} y={10}>
              {month.label}
            </text>
          ))}
          {WEEKDAY_LABELS.map((label, row) =>
            label ? (
              <text key={label} className='gh-cal__weekday' x={0} y={TOP + row * STEP + CELL - 2}>
                {label}
              </text>
            ) : null,
          )}
          {weeks.map((week, column) =>
            week.map((day, row) =>
              day ? (
                <rect
                  key={day.date}
                  className={`gh-cal__cell gh-cal__cell--${day.level}`}
                  x={LEFT + column * STEP}
                  y={TOP + row * STEP}
                  width={CELL}
                  height={CELL}
                  rx='2'
                  style={{ '--col': column } as CSSProperties}>
                  <title>{describeDay(day)}</title>
                </rect>
              ) : null,
            ),
          )}
        </svg>
      </div>

      <div className='gh-cal__legend' aria-hidden='true'>
        <span>Less</span>
        {[0, 1, 2, 3, 4].map(level => (
          <span key={level} className={`gh-cal__swatch gh-cal__cell--${level}`} />
        ))}
        <span>More</span>
      </div>
    </Reveal>
  );
};

export default GithubCalendar;
