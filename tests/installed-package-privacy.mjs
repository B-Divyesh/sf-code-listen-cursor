import { createServer } from 'node:http';
import { mkdtemp, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const packagePath = resolve('dist/site/downloads/code-listen-cursor-chrome.zip');
const unpacked = await mkdtemp('/tmp/code-listen-cursor-package.');
const profile = await mkdtemp('/tmp/code-listen-cursor-profile.');
const unzip = spawnSync('unzip', ['-q', packagePath, '-d', unpacked], { encoding: 'utf8' });
if (unzip.status !== 0) throw new Error(`Could not unpack browser package: ${unzip.stderr}`);

const server = createServer((_request, response) => {
  response.setHeader('content-type', 'text/html; charset=utf-8');
  response.end('<!doctype html><html><body><textarea id="code">const privateSource = kubectl?.config;</textarea></body></html>');
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const address = server.address();
if (!address || typeof address === 'string') throw new Error('Could not start installed-package test server.');
const origin = `http://127.0.0.1:${address.port}`;

const context = await chromium.launchPersistentContext(profile, {
  headless: true,
  executablePath: chromium.executablePath(),
  args: [`--disable-extensions-except=${unpacked}`, `--load-extension=${unpacked}`, '--no-sandbox', '--disable-dev-shm-usage']
});

try {
  const httpRequests = [];
  context.on('request', (request) => {
    if (/^https?:/.test(request.url())) httpRequests.push(request.url());
  });
  let [worker] = context.serviceWorkers();
  worker ??= await context.waitForEvent('serviceworker', { timeout: 10_000 });
  const extensionId = new URL(worker.url()).host;

  const popup = await context.newPage();
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  await popup.getByText('Personal pronunciation', { exact: true }).click();
  await popup.locator('#written').fill('kubectl');
  await popup.locator('#spoken').fill('cube control');
  await popup.getByRole('button', { name: 'Add pronunciation' }).click();
  await popup.waitForFunction(() => document.querySelector('#pronunciation-list')?.textContent?.includes('cube control'));

  const page = await context.newPage();
  await page.goto(origin);
  await page.locator('#code').focus();
  await page.locator('#code').evaluate((element) => element.setSelectionRange(0, element.value.length));
  const result = await worker.evaluate(async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return chrome.tabs.sendMessage(tab.id, { type: 'LISTEN' });
  });
  if (!result.ok) throw new Error(`Installed package could not listen: ${JSON.stringify(result)}`);

  const stored = await worker.evaluate(() => chrome.storage.local.get(null));
  if (!stored.settings?.pronunciation || stored.settings.pronunciation.kubectl !== 'cube control') {
    throw new Error(`Reading settings were not stored locally: ${JSON.stringify(stored)}`);
  }
  if (JSON.stringify(stored).includes('privateSource')) {
    throw new Error('Installed package stored page code instead of only reading preferences.');
  }
  if (!httpRequests.every((url) => new URL(url).origin === origin)) {
    throw new Error(`Installed package made a remote request: ${JSON.stringify(httpRequests)}`);
  }
  console.log(`Installed package privacy/storage regression passed (${extensionId}).`);
} finally {
  await context.close();
  server.close();
  await rm(unpacked, { recursive: true, force: true });
  await rm(profile, { recursive: true, force: true });
}
