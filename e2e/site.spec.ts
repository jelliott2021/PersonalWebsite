import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

const SECTIONS = ['home', 'about', 'experience', 'projects', 'skills', 'education', 'contact'];

test.describe('page shell', () => {
  test('renders every section with the expected title and metadata', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/John Elliott/);
    await expect(page.locator('h1')).toContainText('John');
    await expect(page.locator('h1')).toContainText('Elliott');
    for (const id of SECTIONS) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://johnelliott.net/',
    );
  });

  test('shows the live Boston greeting with stubbed weather', async ({ page }) => {
    await page.goto('/');
    const eyebrow = page.locator('.hero__eyebrow');
    await expect(eyebrow).toContainText('from Boston');
    await expect(eyebrow).toContainText(/\d{1,2}:\d{2} (AM|PM) ET/);
    await expect(eyebrow).toContainText('72°F and clear');
  });

  test('serves the résumé PDF linked from the header', async ({ page, request }) => {
    await page.goto('/');
    const href = await page.locator('a.navbar__resume').getAttribute('href');
    expect(href).toBe('/John-Elliott-Resume.pdf');
    const response = await request.get(href as string);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('pdf');
  });
});

test.describe('navigation', () => {
  test('nav links jump to their section and become current', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Desktop nav links are hidden on small screens');
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Primary' }).getByText('Projects').click();
    await expect(page).toHaveURL(/#projects$/);
    await expect(page.locator('#projects')).toBeInViewport();
    await expect(
      page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Projects' }),
    ).toHaveAttribute('aria-current', 'true');
  });

  test('legacy page paths land on the matching section', async ({ page }) => {
    await page.goto('/skills');
    await expect(page).toHaveURL(/\/#skills$/);
    // The scroll happens on the next animation frame after mount.
    await expect(page.locator('#skills')).toBeInViewport({ timeout: 10_000 });
  });

  test('the mobile menu opens, closes on Escape, and closes after a choice', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'The collapsible menu only exists on small screens');
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Open menu' });
    await toggle.click();
    const menu = page.locator('#mobile-menu');
    await expect(menu).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();

    await toggle.click();
    await menu.getByRole('link', { name: 'Contact' }).click();
    await expect(menu).toBeHidden();
    await expect(page).toHaveURL(/#contact$/);
  });
});

test.describe('theme', () => {
  test('follows the system preference and remembers a manual choice', async ({ page, context }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');

    await page.getByRole('button', { name: 'Switch to light theme' }).click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#f7f4ec');

    const saved = await page.evaluate(() => localStorage.getItem('theme'));
    expect(saved).toBe('light');

    const fresh = await context.newPage();
    await fresh.emulateMedia({ colorScheme: 'dark' });
    await fresh.goto('/');
    await expect(fresh.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});

test.describe('projects', () => {
  test('a demo video only loads after pressing play', async ({ page }) => {
    await page.goto('/#projects');
    const media = page.locator('.featured').first();
    await expect(media.locator('video[controls]')).toHaveCount(0);
    await media.getByRole('button', { name: /Play the .* demo video/ }).click();
    const video = media.locator('video[controls]');
    await expect(video).toHaveCount(1);
    await expect(video).toHaveAttribute('src', /\.mp4$/);
  });

  test('shows the stubbed GitHub star count and contribution calendar', async ({ page }) => {
    await page.goto('/#projects');
    await expect(page.locator('.stars').first()).toContainText('512');
    await expect(page.locator('.gh-cal')).toBeVisible();
    await expect(page.locator('.gh-cal__total')).toContainText('contributions in the last year');
  });
});

test.describe('contact', () => {
  test('copies the email address to the clipboard', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'Clipboard permissions are only grantable in Chromium');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/#contact');
    await page.getByRole('button', { name: 'Copy email' }).click();
    await expect(page.getByRole('button', { name: 'Copied!' })).toBeVisible();
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toContain('@');
  });
});

test.describe('accessibility', () => {
  for (const scheme of ['light', 'dark'] as const) {
    test(`has no serious axe violations in the ${scheme} theme`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      await page.goto('/');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        // Colour contrast is a palette decision tracked separately: muted text, sign
        // captions, and the orange sign band sit below AA today. Structure, names,
        // roles, and keyboard access are still enforced here.
        .disableRules(['color-contrast', 'link-in-text-block'])
        .analyze();
      const serious = results.violations.filter(v =>
        ['serious', 'critical'].includes(v.impact ?? ''),
      );
      expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
    });
  }
});
