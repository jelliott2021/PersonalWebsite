/**
 * Pure helpers for laying out a GitHub-style contribution calendar. The
 * component draws the result; everything here is plain data in, data out.
 */

export interface ContributionDay {
  /** Calendar date as YYYY-MM-DD. */
  date: string;
  count: number;
  /** GitHub's own 0 to 4 intensity bucket for the day. */
  level: 0 | 1 | 2 | 3 | 4;
}

/** One column of the calendar: seven slots, Sunday first, null where padded. */
export type Week = (ContributionDay | null)[];

/** Cell geometry in SVG units; the drawing scales to the card width. */
export const CELL = 11;
export const GAP = 3;
export const STEP = CELL + GAP;
export const LEFT = 28;
export const TOP = 16;

export const WEEKDAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** Parses YYYY-MM-DD as local midnight so the weekday is right in every zone. */
export const parseDate = (iso: string): Date => new Date(`${iso}T00:00:00`);

/** Clamps a raw level from the API into GitHub's 0 to 4 buckets. */
export const toLevel = (value: number | undefined): ContributionDay['level'] => {
  const level = Math.round(value ?? 0);
  if (level <= 0) {
    return 0;
  }
  return (level >= 4 ? 4 : level) as ContributionDay['level'];
};

/** Groups days into Sunday-first columns, padding the first and last week with blanks. */
export const toWeeks = (days: ContributionDay[]): Week[] => {
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
export const monthLabels = (weeks: Week[]): { x: number; label: string }[] => {
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

/** Tooltip text for one day, such as "3 contributions on Jan 5, 2026". */
export const describeDay = (day: ContributionDay): string => {
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

/** Pluralised total, such as "1,204 contributions in the last year". */
export const describeTotal = (total: number): string =>
  `${total.toLocaleString('en-US')} contribution${total === 1 ? '' : 's'} in the last year`;
