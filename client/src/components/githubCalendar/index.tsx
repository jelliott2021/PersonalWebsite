import React, { CSSProperties } from 'react';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import { profile } from '../../data/profile';
import useGithubContributions from '../../hooks/useGithubContributions';
import type { ContributionDay } from '../../hooks/useGithubContributions';
import Reveal from '../reveal';
import './index.css';

const GITHUB_USER = profile.githubHandle;

/** Cell geometry in SVG units; the drawing scales to the card width. */
const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;
const LEFT = 28;
const TOP = 16;

const WEEKDAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type Week = (ContributionDay | null)[];

const parseDate = (iso: string): Date => new Date(`${iso}T00:00:00`);

/** Groups days into Sunday-first columns, padding the first week with blanks. */
const toWeeks = (days: ContributionDay[]): Week[] => {
  const weeks: Week[] = [];
  if (days.length === 0) {
    return weeks;
  }
  let week: Week = new Array<null>(parseDate(days[0].date).getDay()).fill(null);
  days.forEach(day => {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    weeks.push(week);
  }
  return weeks;
};

/** One label per month, placed at the first column that starts the month. */
const monthLabels = (weeks: Week[]): { x: number; label: string }[] => {
  const labels: { x: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, index) => {
    const firstDay = week.find(day => day !== null);
    if (!firstDay) {
      return;
    }
    const month = parseDate(firstDay.date).getMonth();
    if (month !== lastMonth) {
      labels.push({ x: LEFT + index * STEP, label: MONTH_LABELS[month] });
      lastMonth = month;
    }
  });
  // Drop a first label that would collide with the next one.
  if (labels.length > 1 && labels[1].x - labels[0].x < STEP * 3) {
    labels.shift();
  }
  return labels;
};

const describe = (day: ContributionDay): string => {
  const date = parseDate(day.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  if (day.count === 0) {
    return `No contributions on ${date}`;
  }
  return `${day.count} contribution${day.count === 1 ? '' : 's'} on ${date}`;
};

/**
 * The GitHub contribution graph for the last year, drawn as an SVG heatmap
 * that scales with the card. Cells pop in column by column when the card
 * scrolls into view. Renders nothing until the data arrives and nothing at
 * all if it can't be fetched, so the page never shows an empty box.
 */
const GithubCalendar = () => {
  const data = useGithubContributions(GITHUB_USER);

  if (!data) {
    return null;
  }

  const weeks = toWeeks(data.days);
  // A little room on the right so the last month label isn't clipped.
  const width = LEFT + weeks.length * STEP - GAP + 14;
  const height = TOP + 7 * STEP - GAP;
  const summary = `${data.total.toLocaleString()} contribution${data.total === 1 ? '' : 's'} in the last year`;

  return (
    <Reveal className='card gh-cal'>
      <div className='gh-cal__head'>
        <span className='label gh-cal__label'>
          <FiGithub aria-hidden='true' /> A year on GitHub
        </span>
        <span className='gh-cal__total'>{summary}</span>
        <a className='gh-cal__profile' href={profile.github} target='_blank' rel='noopener noreferrer'>
          @{GITHUB_USER} <FiExternalLink aria-hidden='true' />
        </a>
      </div>

      <div className='gh-cal__scroll'>
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
                  <title>{describe(day)}</title>
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
