import AxeBuilder from '@axe-core/playwright';
import { expect, test } from 'playwright/test';

test('landing page has its core content and no serious accessibility violations', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/Code Listen Cursor/);
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Listen to code without losing your place' })).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
  expect(errors).toEqual([]);
});

test('@claim:demo-reader reads a selection or current line with chosen pronunciation', async ({ page }) => {
  await page.goto('/#field-station');
  const editor = page.getByLabel('Editable code sample');
  await editor.fill('const kubectl = fern?.name;');
  await editor.evaluate((element: HTMLTextAreaElement) => element.setSelectionRange(6, 13));
  await editor.press('ArrowRight');
  await page.getByLabel('Code word').fill('kubectl');
  await page.getByLabel('Speak as').fill('cube control');
  await page.getByRole('button', { name: 'Use pronunciation' }).click();
  await expect(page.getByLabel('Words that will be spoken')).toContainText('cube control');
  await editor.evaluate((element: HTMLTextAreaElement) => element.setSelectionRange(20, 20));
  await editor.press('ArrowLeft');
  await expect(page.getByLabel('Words that will be spoken')).toContainText('fern optional dot name');
});

test('demo route, query entry, keyboard path, and mobile-safe controls work', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByRole('heading', { name: 'Listen to sample code' })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveAttribute('href', '#main');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.getByLabel('Editable sample code').focus();
  await page.keyboard.press('Control+A');
  await page.keyboard.type('const leaf = 1;');
  await page.getByRole('button', { name: 'Listen to code' }).press('Enter');
  await expect(page.getByLabel('Words that will be spoken')).toContainText('const leaf gets 1');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('all routes have landmarks, one h1, and no axe violations', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  for (const path of ['/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test('designed 404 document gives a way back', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page.getByRole('heading', { name: 'This page was not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return home' })).toHaveAttribute('href', '/');
});

test('@regression:touch-targets every visible interactive target is at least 44px', async ({ page }) => {
  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    const small = await page.locator('a:visible,button:visible,input:visible,select:visible,summary:visible,textarea:visible').evaluateAll((elements) => (
      elements.map((element) => {
        const box = element.getBoundingClientRect();
        return { label: element.textContent?.trim() || element.getAttribute('aria-label') || element.id, width: box.width, height: box.height };
      }).filter((box) => box.width < 44 || box.height < 44)
    ));
    expect(small, `${path} contains undersized targets`).toEqual([]);
  }
});

test('@regression:focus-contrast focus rings clear 3:1 on paper and dark reader surfaces', async ({ page }) => {
  await page.goto('/');
  const contrast = await page.evaluate(() => {
    const luminance = (color: string) => {
      const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [];
      const linear = channels.map((value) => {
        const normalized = value / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return (linear[0] ?? 0) * 0.2126 + (linear[1] ?? 0) * 0.7152 + (linear[2] ?? 0) * 0.0722;
    };
    const ratio = (one: string, two: string) => {
      const [lighter, darker] = [luminance(one), luminance(two)].sort((a, b) => b - a);
      return (lighter + 0.05) / (darker + 0.05);
    };
    const link = document.querySelector<HTMLAnchorElement>('.wordmark')!;
    const readerButton = document.querySelector<HTMLButtonElement>('#demo-listen')!;
    link.focus();
    const paperRing = getComputedStyle(link).outlineColor;
    readerButton.focus();
    const darkRing = getComputedStyle(readerButton).outlineColor;
    return {
      paper: ratio(paperRing, getComputedStyle(document.body).backgroundColor),
      dark: ratio(darkRing, getComputedStyle(document.querySelector('.field-station')!).backgroundColor)
    };
  });
  expect(contrast.paper).toBeGreaterThanOrEqual(3);
  expect(contrast.dark).toBeGreaterThanOrEqual(3);
});
