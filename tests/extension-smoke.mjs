import { createServer } from 'node:http';
import { mkdtemp, rm } from 'node:fs/promises';
import { chromium } from 'playwright';

const server = createServer((_request, response) => {
  response.setHeader('content-type', 'text/html');
  response.end('<!doctype html><html><body><textarea id="code">const fern = plant?.name;</textarea></body></html>');
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
if (!address || typeof address === 'string') throw new Error('Could not start smoke-test server.');

const profile = await mkdtemp('/tmp/code-listen-cursor-smoke.');
const extensionPath = new URL('../dist/extension/chrome-mv3', import.meta.url).pathname;
const context = await chromium.launchPersistentContext(profile, {
  headless: true,
  executablePath: chromium.executablePath(),
  args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`, '--no-sandbox', '--disable-dev-shm-usage']
});

try {
  let [worker] = context.serviceWorkers();
  worker ??= await context.waitForEvent('serviceworker', { timeout: 10_000 });
  const extensionId = new URL(worker.url()).host;
  const popup = await context.newPage();
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  if (await popup.title() !== 'Code Listen Cursor') throw new Error('Popup did not load.');
  await popup.close();

  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${address.port}`);
  await page.locator('#code').focus();
  await page.locator('#code').evaluate((element) => element.setSelectionRange(0, 12));
  await page.waitForTimeout(400);
  const result = await worker.evaluate(async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return chrome.tabs.sendMessage(tab.id, { type: 'LISTEN' });
  });
  if (!result.ok || result.state !== 'speaking') throw new Error(`Listen failed: ${JSON.stringify(result)}`);
  console.log(`Extension smoke passed (${extensionId}).`);
} finally {
  await context.close();
  server.close();
  await rm(profile, { recursive: true, force: true });
}
