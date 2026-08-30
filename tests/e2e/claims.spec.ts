import { expect, test } from 'playwright/test';

test('@claim:demo-sandbox restores the complete isolated reader state and Start for real preserves real data', async ({ page }) => {
  await page.addInitScript(() => {
    const speech = { cancelCalls: 0, spoken: [] as string[] };
    class MockUtterance {
      text: string;
      voice: SpeechSynthesisVoice | null = null;
      rate = 1;
      onstart: (() => void) | null = null;

      constructor(text: string) {
        this.text = text;
      }
    }
    const localVoice = {
      default: true,
      lang: 'en-US',
      localService: true,
      name: 'Demo reset local voice',
      voiceURI: 'demo-reset-local'
    } as SpeechSynthesisVoice;
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: MockUtterance });
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        cancel() { speech.cancelCalls += 1; },
        getVoices: () => [localVoice],
        speak(utterance: MockUtterance) {
          speech.spoken.push(utterance.text);
          utterance.onstart?.();
        },
        addEventListener() {}
      }
    });
    Object.defineProperty(window, '__demoResetSpeech', { value: speech });
  });
  await page.goto('/demo/');
  const originalCode = await page.getByLabel('Editable sample code').inputValue();
  await page.evaluate(() => localStorage.setItem('code-listen-cursor:real-sentinel', 'keep'));
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await page.getByLabel('Code word').fill('fern');
  await page.getByLabel('Speak as').fill('frond');
  await page.getByRole('button', { name: 'Save sample pronunciation' }).click();
  await expect(page.getByLabel('Words that will be spoken')).toContainText('frond');
  expect(await page.evaluate(() => localStorage.getItem('demo:code-listen-cursor:pronunciation'))).toContain('frond');

  const editor = page.getByLabel('Editable sample code');
  await editor.fill('const kubectl = fern?.name;');
  await editor.evaluate((element: HTMLTextAreaElement) => {
    element.setSelectionRange(6, 13);
    element.dispatchEvent(new Event('select', { bubbles: true }));
  });
  await page.getByLabel('Punctuation').selectOption('literal');
  await page.getByLabel('Speak indentation').uncheck();
  await page.getByLabel(/Reading rate/).fill('1.5');
  await page.getByRole('button', { name: 'Listen to code' }).click();
  await expect(page.locator('#demo-status')).toHaveText('Listening now. Speech is playing through your system voice.');
  await expect(page.locator('.observation')).toHaveClass(/is-listening/);
  const cancelCallsBeforeReset = await page.evaluate(() => (window as typeof window & {
    __demoResetSpeech: { cancelCalls: number };
  }).__demoResetSpeech.cancelCalls);

  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(editor).toHaveValue(originalCode);
  await expect(page.getByLabel('Words that will be spoken')).toHaveText('const describe Plant gets a sink open paren fern close paren arrow open brace');
  await expect(page.locator('#demo-status')).toHaveText('Demo reset. The original sample code is ready. Nothing was saved outside this demo.');
  await expect(page.locator('#demo-status')).not.toHaveAttribute('data-error');
  await expect(page.locator('.observation')).not.toHaveClass(/is-listening/);
  await expect(page.getByLabel('Punctuation')).toHaveValue('essential');
  await expect(page.getByLabel('Speak indentation')).toBeChecked();
  await expect(page.getByLabel(/Reading rate/)).toHaveValue('0.9');
  await expect(page.getByLabel('Code word')).toHaveValue('fern');
  await expect(page.getByLabel('Speak as')).toHaveValue('furn');
  await expect.poll(() => page.evaluate(() => ({
    selectionStart: document.querySelector<HTMLTextAreaElement>('#code-sample')?.selectionStart,
    selectionEnd: document.querySelector<HTMLTextAreaElement>('#code-sample')?.selectionEnd,
    cancelCalls: (window as typeof window & { __demoResetSpeech: { cancelCalls: number } }).__demoResetSpeech.cancelCalls
  }))).toEqual({ selectionStart: 0, selectionEnd: 0, cancelCalls: cancelCallsBeforeReset + 1 });
  expect(await page.evaluate(() => localStorage.getItem('demo:code-listen-cursor:pronunciation'))).toBeNull();
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:')))).toEqual([]);
  expect(await page.evaluate(() => localStorage.getItem('code-listen-cursor:real-sentinel'))).toBe('keep');

  await page.getByLabel('Code word').fill('fern');
  await page.getByLabel('Speak as').fill('frond');
  await page.getByRole('button', { name: 'Save sample pronunciation' }).click();
  expect(await page.evaluate(() => localStorage.getItem('demo:code-listen-cursor:pronunciation'))).toContain('frond');
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/#install-title$/);
  expect(await page.evaluate(() => localStorage.getItem('demo:code-listen-cursor:pronunciation'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('code-listen-cursor:real-sentinel'))).toBe('keep');
});

test('@claim:no-code-upload keeps the sample interaction on the product origin', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo/');
  await page.getByLabel('Editable sample code').fill('const fern = 3;');
  await page.getByRole('button', { name: 'Listen to code' }).click();
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBeTruthy();
});

test('@claim:local-voice never gives source to an automatic non-local voice', async ({ page }) => {
  await page.addInitScript(() => {
    const calls: { text: string; voice: SpeechSynthesisVoice | null }[] = [];
    class MockUtterance {
      text: string;
      voice: SpeechSynthesisVoice | null = null;
      rate = 1;

      constructor(text: string) {
        this.text = text;
        calls.push({ text, voice: this.voice });
      }
    }
    const networkVoice = {
      default: true,
      lang: 'en-US',
      localService: false,
      name: 'Network only',
      voiceURI: 'network-only'
    } as SpeechSynthesisVoice;
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: MockUtterance });
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        cancel() {},
        getVoices: () => [networkVoice],
        speak(utterance: SpeechSynthesisUtterance) {
          calls.push({ text: utterance.text, voice: utterance.voice });
        },
        addEventListener() {}
      }
    });
    Object.defineProperty(window, '__speechCalls', { value: calls });
  });
  await page.goto('/demo/');
  const preview = page.getByLabel('Words that will be spoken');
  await expect(preview).toContainText('const describe Plant');
  await page.getByRole('button', { name: 'Listen to code' }).click();
  await expect(page.locator('#demo-status')).toContainText('Local voice needed');
  await expect(page.locator('#demo-status')).toContainText('voice marked local');
  expect(await page.evaluate(() => (window as typeof window & { __speechCalls: unknown[] }).__speechCalls)).toEqual([]);
  await expect(preview).toContainText('const describe Plant');
});

test('@claim:offline-reload reloads the working reader after first visit with no network', async ({ browser }) => {
  const offlineContext = await browser.newContext();
  const page = await offlineContext.newPage();
  await page.addInitScript(() => {
    const spoken: string[] = [];
    class MockUtterance {
      text: string;
      voice: SpeechSynthesisVoice | null = null;
      rate = 1;
      onstart: (() => void) | null = null;
      onend: (() => void) | null = null;
      onerror: ((event: SpeechSynthesisErrorEvent) => void) | null = null;
      constructor(text: string) { this.text = text; }
    }
    const localVoice = {
      default: true,
      lang: 'en-US',
      localService: true,
      name: 'Offline local test voice',
      voiceURI: 'offline-local-test'
    } as SpeechSynthesisVoice;
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: MockUtterance });
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        cancel() {},
        getVoices: () => [localVoice],
        speak(utterance: MockUtterance) {
          spoken.push(utterance.text);
          utterance.onstart?.();
        },
        addEventListener() {}
      }
    });
    Object.defineProperty(window, '__offlineSpeech', { value: spoken });
  });
  try {
    await page.goto('/demo/');
    await page.waitForFunction(() => navigator.serviceWorker?.controller !== null, undefined, { timeout: 15_000 });
    await page.evaluate(async () => {
      const stale = await caches.open('code-listen-cursor-v6');
      await stale.put('/stale-shell', new Response('stale'));
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    });
    await page.reload();
    await page.waitForFunction(() => navigator.serviceWorker?.controller !== null, undefined, { timeout: 15_000 });
    expect(await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
      return {
        active: registration.active?.state,
        caches: await caches.keys()
      };
    })).toEqual({ active: 'activated', caches: ['code-listen-cursor-v7'] });
    await page.reload();
    await offlineContext.setOffline(true);
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Try the code reader' })).toBeVisible();
    await page.getByLabel('Editable sample code').fill('const offlineFern = 3;');
    await page.getByRole('button', { name: 'Listen to code' }).click();
    await expect(page.getByLabel('Words that will be spoken')).toHaveText('const offline Fern gets 3');
    await expect(page.locator('#demo-status')).toHaveText('Listening now. Speech is playing through your system voice.');
    expect(await page.evaluate(() => (window as typeof window & { __offlineSpeech: string[] }).__offlineSpeech))
      .toEqual(['const offline Fern gets 3']);
  } finally {
    await offlineContext.setOffline(false);
    await offlineContext.close();
  }
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
