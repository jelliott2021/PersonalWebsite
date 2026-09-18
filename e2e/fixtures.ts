import { test as base, expect, Page } from '@playwright/test';

/** Canned Open-Meteo payload: 72°F, code 0 (clear), no cloud. */
export const WEATHER = {
  current: { temperature_2m: 72.4, weather_code: 0, cloud_cover: 10 },
};

/** Canned GitHub repository payload. */
export const REPO = { stargazers_count: 512 };

/** Canned contribution mirror payload: a full year, like the real service returns. */
export const CONTRIBUTIONS = {
  contributions: Array.from({ length: 365 }, (_, i) => {
    const date = new Date(Date.UTC(2025, 8, 18 + i)).toISOString().slice(0, 10);
    return { date, count: (i * 7) % 5, level: (i * 7) % 5 };
  }),
};

/**
 * Answers every third-party request the page makes with fixed data so the
 * suite is deterministic and never depends on the network or rate limits.
 */
export const stubExternalApis = async (page: Page): Promise<void> => {
  await page.route('**/api.open-meteo.com/**', route =>
    route.fulfill({ json: WEATHER, headers: { 'access-control-allow-origin': '*' } }),
  );
  await page.route('**/api.github.com/repos/**', route =>
    route.fulfill({ json: REPO, headers: { 'access-control-allow-origin': '*' } }),
  );
  await page.route('**/github-contributions-api.jogruber.de/**', route =>
    route.fulfill({ json: CONTRIBUTIONS, headers: { 'access-control-allow-origin': '*' } }),
  );
  // Fonts are decorative and slow; skip them.
  await page.route('**/fonts.googleapis.com/**', route => route.fulfill({ body: '' }));
  await page.route('**/fonts.gstatic.com/**', route => route.fulfill({ body: '' }));
};

/** Test with external APIs stubbed before navigation. */
export const test = base.extend({
  page: async ({ page }, use) => {
    await stubExternalApis(page);
    await use(page);
  },
});

export { expect };
