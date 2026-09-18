import {
  ContributionDay,
  LEFT,
  STEP,
  describeDay,
  describeTotal,
  monthLabels,
  parseDate,
  toLevel,
  toWeeks,
} from './contributions';

/** Consecutive days starting on a date, with predictable counts. */
const days = (from: string, count: number): ContributionDay[] =>
  Array.from({ length: count }, (_, i) => {
    const date = new Date(`${from}T00:00:00`);
    date.setDate(date.getDate() + i);
    const iso = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');
    return { date: iso, count: i % 5, level: toLevel(i % 5) };
  });

describe('parseDate', () => {
  it('reads an ISO date as local midnight', () => {
    const date = parseDate('2026-01-04');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(4);
    expect(date.getHours()).toBe(0);
  });
});

describe('toLevel', () => {
  it('clamps into the 0 to 4 range and rounds', () => {
    expect(toLevel(undefined)).toBe(0);
    expect(toLevel(-3)).toBe(0);
    expect(toLevel(0)).toBe(0);
    expect(toLevel(1.4)).toBe(1);
    expect(toLevel(2.6)).toBe(3);
    expect(toLevel(4)).toBe(4);
    expect(toLevel(9)).toBe(4);
  });
});

describe('toWeeks', () => {
  it('returns no weeks for no days', () => {
    expect(toWeeks([])).toEqual([]);
  });

  it('pads the first week so the first day sits on its weekday', () => {
    // 2026-01-07 is a Wednesday: three blanks before it.
    const weeks = toWeeks(days('2026-01-07', 4));
    expect(weeks).toHaveLength(1);
    expect(weeks[0].slice(0, 3)).toEqual([null, null, null]);
    expect(weeks[0][3]?.date).toBe('2026-01-07');
  });

  it('pads the last week to seven slots', () => {
    // 2026-01-04 is a Sunday; ten days fill one week and three days of the next.
    const weeks = toWeeks(days('2026-01-04', 10));
    expect(weeks).toHaveLength(2);
    expect(weeks[0].every(day => day !== null)).toBe(true);
    expect(weeks[1].filter(day => day !== null)).toHaveLength(3);
    expect(weeks[1]).toHaveLength(7);
  });

  it('does not add a padded week when the data ends on a Saturday', () => {
    const weeks = toWeeks(days('2026-01-04', 14));
    expect(weeks).toHaveLength(2);
    expect(weeks[1][6]?.date).toBe('2026-01-17');
  });
});

describe('monthLabels', () => {
  it('places one label at the first column of each month', () => {
    // 2026-01-04 (Sunday) through mid February: four January columns, then February.
    const labels = monthLabels(toWeeks(days('2026-01-04', 42)));
    expect(labels.map(label => label.label)).toEqual(['Jan', 'Feb']);
    expect(labels[0].x).toBe(LEFT);
    expect(labels[1].x).toBe(LEFT + 4 * STEP);
  });

  it('drops a first label that would collide with the second', () => {
    // Starting on 2026-01-29 (Thursday): January occupies one column, February starts next.
    const labels = monthLabels(toWeeks(days('2026-01-29', 30)));
    expect(labels.map(label => label.label)).toEqual(['Feb']);
  });

  it('skips fully padded weeks', () => {
    const weeks = toWeeks(days('2026-03-01', 7));
    weeks.unshift([null, null, null, null, null, null, null]);
    expect(monthLabels(weeks)).toEqual([{ x: LEFT + STEP, label: 'Mar' }]);
  });
});

describe('describeDay', () => {
  it('describes an empty day', () => {
    expect(describeDay({ date: '2026-01-05', count: 0, level: 0 })).toBe(
      'No contributions on Jan 5, 2026',
    );
  });

  it('pluralises correctly', () => {
    expect(describeDay({ date: '2026-01-05', count: 1, level: 1 })).toBe(
      '1 contribution on Jan 5, 2026',
    );
    expect(describeDay({ date: '2026-01-05', count: 7, level: 3 })).toBe(
      '7 contributions on Jan 5, 2026',
    );
  });
});

describe('describeTotal', () => {
  it('formats and pluralises the total', () => {
    expect(describeTotal(1)).toBe('1 contribution in the last year');
    expect(describeTotal(1204)).toBe('1,204 contributions in the last year');
  });
});
