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
  await expect(page.getByRole('heading', { name: 'Hear the structure. Keep your place.' })).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  expect(errors).toEqual([]);
});

test('field station follows selection and pronunciation settings', async ({ page }) => {
  await page.goto('/#field-station');
  const editor = page.getByLabel('Editable code sample');
  await editor.fill('const kubectl = fern?.name;');
  await editor.evaluate((element: HTMLTextAreaElement) => element.setSelectionRange(6, 13));
  await editor.press('ArrowRight');
  await page.getByLabel('Code word').fill('kubectl');
  await page.getByLabel('Speak as').fill('cube control');
  await page.getByRole('button', { name: 'Use pronunciation' }).click();
  await expect(page.getByLabel('Words that will be spoken')).toContainText('cube control');
});

test('legal pages have landmarks and one h1', async ({ page }) => {
  for (const path of ['/privacy/', '/terms/']) {
    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
  }
});
