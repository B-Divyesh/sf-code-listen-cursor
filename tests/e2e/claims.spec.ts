import { expect, test } from 'playwright/test';

test('@claim:demo-sandbox starts isolated sample data and reset removes its namespace', async ({ page }) => {
  await page.goto('/demo/');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await page.getByLabel('Code word').fill('fern');
  await page.getByLabel('Speak as').fill('frond');
  await page.getByRole('button', { name: 'Use pronunciation' }).click();
  await expect(page.getByLabel('Words that will be spoken')).toContainText('frond');
  expect(await page.evaluate(() => localStorage.getItem('demo:code-listen-cursor:pronunciation'))).toContain('frond');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(await page.evaluate(() => localStorage.getItem('demo:code-listen-cursor:pronunciation'))).toBeNull();
  expect(await page.evaluate(() => Object.keys(localStorage).every((key) => key.startsWith('demo:')))).toBeTruthy();
});

test('@claim:no-code-upload keeps the sample interaction on the product origin', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo/');
  await page.getByLabel('Editable sample code').fill('const fern = 3;');
  await page.getByRole('button', { name: 'Listen to code' }).click();
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBeTruthy();
});

test('@claim:offline-reload reloads the sample after first visit with no network', async ({ page, context }) => {
  await page.goto('/demo/');
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null, undefined, { timeout: 15_000 });
  expect(await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    return {
      active: registration.active?.state,
      caches: await caches.keys()
    };
  })).toEqual(expect.objectContaining({ active: 'activated', caches: expect.arrayContaining(['code-listen-cursor-v3']) }));
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Listen to sample code' })).toBeVisible();
  await context.setOffline(false);
});

test('@claim:free-download downloads the browser extension without an account', async ({ page }) => {
  await page.goto('/');
  for (const [name, filename] of [
    ['Download Chrome or Edge ZIP', 'code-listen-cursor-chrome.zip'],
    ['Download VS Code extension', 'code-listen-cursor-vscode.vsix']
  ] as const) {
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('link', { name }).click();
    expect((await downloadPromise).suggestedFilename()).toBe(filename);
  }
});
