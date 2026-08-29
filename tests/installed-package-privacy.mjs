import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';

const coveredClaims = [
  '@claim:browser-reader-controls',
  '@claim:browser-reader-settings',
  '@claim:browser-shortcut-configuration',
  '@claim:installed-package-privacy'
];
const packagePath = resolve('dist/site/downloads/code-listen-cursor-chrome.zip');
const unpacked = await mkdtemp('/tmp/code-listen-cursor-package.');
const profile = await mkdtemp('/tmp/code-listen-cursor-profile.');
const unzip = spawnSync('unzip', ['-q', packagePath, '-d', unpacked], { encoding: 'utf8' });
if (unzip.status !== 0) throw new Error(`Could not unpack browser package: ${unzip.stderr}`);

const server = createServer((_request, response) => {
  response.setHeader('content-type', 'text/html; charset=utf-8');
  response.end('<!doctype html><html><body><label for="code">Code</label><textarea id="code">const privateSource = kubectl?.config;\n  return privateSource;</textarea></body></html>');
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

  const page = await context.newPage();
  await page.goto(origin);
  const editor = page.locator('#code');
  await editor.focus();
  await editor.evaluate((element) => element.setSelectionRange(0, 38));
  await page.waitForTimeout(400);

  const targetTabId = await worker.evaluate(async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab?.id;
  });
  assert.equal(typeof targetTabId, 'number');
  const popup = await context.newPage();
  await popup.goto(`chrome-extension://${extensionId}/popup.html?tab=${targetTabId}`);
  const status = popup.locator('#status');
  await popup.waitForFunction(() => document.querySelector('#status')?.textContent === 'Ready to listen');
  const waitForStatus = (expected) => popup.waitForFunction(
    (value) => document.querySelector('#status')?.textContent === value,
    expected
  );

  await popup.getByRole('button', { name: /Repeat/ }).press('Enter');
  await waitForStatus('Nothing to repeat yet. Listen to code first.');
  assert.match(await status.innerText(), /Nothing to repeat yet/);

  const follow = popup.locator('#follow');
  await follow.press('Space');
  await waitForStatus('Cursor follow is on');
  assert.equal(await follow.getAttribute('aria-pressed'), 'true');
  assert.equal(await status.innerText(), 'Cursor follow is on');
  await popup.locator('#stop').click();
  await waitForStatus('Speech stopped');
  assert.equal(await status.innerText(), 'Speech stopped');
  await popup.getByRole('button', { name: /Stop following/ }).click();
  await waitForStatus('Cursor follow is off');
  assert.equal(await follow.getAttribute('aria-pressed'), 'false');

  await popup.getByText('Reading settings', { exact: true }).click();
  await popup.locator('#language').selectOption('typescript');
  await popup.locator('#punctuation').selectOption('detailed');
  await popup.locator('#rate').fill('1.2');
  await popup.locator('#indent').uncheck();
  await popup.getByText('Personal pronunciation', { exact: true }).click();
  await popup.locator('#written').fill('kubectl');
  await popup.locator('#spoken').fill('cube control');
  await popup.getByRole('button', { name: 'Add pronunciation' }).click();
  await popup.waitForFunction(() => document.querySelector('#pronunciation-list')?.textContent?.includes('cube control'));

  await popup.getByRole('button', { name: /Listen now/ }).click();
  await waitForStatus('No local speech voice is available. Install or enable a local system voice, then try again.');
  assert.match(await status.innerText(), /No local speech voice/);
  await popup.locator('#stop').click();
  await waitForStatus('Speech stopped');
  await popup.getByRole('button', { name: /Repeat/ }).click();
  await waitForStatus('No local speech voice is available. Install or enable a local system voice, then try again.');
  assert.match(await status.innerText(), /No local speech voice/);

  const send = (type) => worker.evaluate(
    async ({ type, tabId }) => chrome.tabs.sendMessage(tabId, { type }),
    { type, tabId: targetTabId }
  );

  let state = await send('GET_STATE');
  assert.equal(state.ok, true);
  assert.equal(state.sample, 'const privateSource = kubectl?.config;');
  assert.equal((await send('STOP')).message, 'Speech stopped');
  await popup.locator('#stop').click();
  await waitForStatus('Speech stopped');

  await editor.evaluate((element) => {
    const secondLine = element.value.indexOf('\n') + 3;
    element.focus();
    element.setSelectionRange(secondLine, secondLine);
  });
  await popup.getByRole('button', { name: /Listen now/ }).click();
  await waitForStatus('No local speech voice is available. Install or enable a local system voice, then try again.');
  state = await send('GET_STATE');
  assert.equal(state.sample, '  return privateSource;');

  await popup.getByRole('button', { name: /Follow cursor/ }).click();
  await editor.evaluate((element) => {
    element.focus();
    element.setSelectionRange(3, 3);
    element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'ArrowLeft' }));
  });
  await page.waitForTimeout(550);
  state = await send('GET_STATE');
  assert.equal(state.follow, true);
  assert.equal(state.sample, 'const privateSource = kubectl?.config;');
  assert.equal((await send('TOGGLE_FOLLOW')).follow, false);

  await editor.focus();
  await page.keyboard.press('Alt+Shift+S');
  await page.waitForTimeout(150);
  state = await send('GET_STATE');
  assert.equal(state.ok, true);
  assert.equal(state.sample, 'const privateSource = kubectl?.config;');

  const shortcuts = await context.newPage();
  await shortcuts.goto('chrome://extensions/shortcuts');
  const listenShortcut = shortcuts.locator(
    'input[aria-label="Shortcut Listen to selected code or the current line for Code Listen Cursor"]'
  );
  const editListenShortcut = shortcuts.locator(
    'cr-icon-button[aria-label="Edit shortcut Listen to selected code or the current line for Code Listen Cursor"]'
  );
  await listenShortcut.waitFor({ state: 'visible' });
  assert.equal(await listenShortcut.inputValue(), 'Alt + Shift + S', 'The packaged Listen command has no configurable default shortcut.');
  await editListenShortcut.click();
  await shortcuts.keyboard.press('Alt+Shift+L');
  await listenShortcut.waitFor({ state: 'visible' });
  assert.equal(await listenShortcut.inputValue(), 'Alt + Shift + L', 'Chromium shortcut settings did not accept a replacement Listen shortcut.');
  const shortcutAfter = await worker.evaluate(async () => {
    const commands = await chrome.commands.getAll();
    return commands.find((command) => command.name === 'listen-code')?.shortcut;
  });
  assert.equal(shortcutAfter, 'Alt+Shift+L', 'The browser did not save the replacement Listen shortcut.');
  await page.bringToFront();
  await editor.focus();
  await page.keyboard.press('Alt+Shift+L');
  await page.waitForTimeout(150);
  state = await send('GET_STATE');
  assert.equal(state.ok, true);
  assert.equal(state.sample, 'const privateSource = kubectl?.config;', 'The configured shortcut did not invoke Listen.');
  await shortcuts.bringToFront();
  await editListenShortcut.click();
  await shortcuts.keyboard.press('Alt+Shift+S');
  assert.equal(await listenShortcut.inputValue(), 'Alt + Shift + S', 'The test did not restore the default Listen shortcut.');
  await shortcuts.close();

  const stored = await worker.evaluate(() => chrome.storage.local.get(null));
  assert.deepEqual(
    {
      language: stored.settings?.language,
      punctuation: stored.settings?.punctuation,
      rate: stored.settings?.rate,
      speakIndentation: stored.settings?.speakIndentation,
      pronunciation: stored.settings?.pronunciation?.kubectl
    },
    { language: 'typescript', punctuation: 'detailed', rate: 1.2, speakIndentation: false, pronunciation: 'cube control' }
  );
  assert.equal(JSON.stringify(stored).includes('privateSource'), false, 'Installed package stored page code.');
  assert.equal(httpRequests.every((url) => new URL(url).origin === origin), true, `Remote request: ${JSON.stringify(httpRequests)}`);

  const axe = await new AxeBuilder({ page: popup }).analyze();
  assert.deepEqual(axe.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')), []);
  const smallTargets = await popup.locator('button:visible,input:visible,select:visible,summary:visible').evaluateAll((elements) => (
    elements.map((element) => element.getBoundingClientRect()).filter((box) => box.width < 44 || box.height < 44).length
  ));
  assert.equal(smallTargets, 0, 'The installed popup contains a target smaller than 44px.');

  console.log(`${coveredClaims.join(', ')} passed against the installed ZIP (${extensionId}).`);
} finally {
  await context.close();
  server.close();
  await rm(unpacked, { recursive: true, force: true });
  await rm(profile, { recursive: true, force: true });
}
