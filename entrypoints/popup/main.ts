import { browser } from 'wxt/browser';
import type { CursorCommand, CursorState } from '../../core/messages';
import { mergeSettings, type ListenSettings } from '../../core/settings';
import './style.css';

const get = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
const status = get<HTMLParagraphElement>('status');
const followButton = get<HTMLButtonElement>('follow');
let settings: ListenSettings = mergeSettings();

async function activeTabMessage(message: CursorCommand): Promise<CursorState> {
  const requestedTab = Number(new URLSearchParams(location.search).get('tab'));
  if (Number.isInteger(requestedTab) && requestedTab > 0) {
    const response = await browser.tabs.sendMessage(requestedTab, message) as CursorState | undefined;
    if (!response || typeof response.message !== 'string') throw new Error('not-ready');
    return response;
  }
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url?.startsWith('http')) throw new Error('restricted');
  const response = await browser.tabs.sendMessage(tab.id, message) as CursorState | undefined;
  if (!response || typeof response.message !== 'string') throw new Error('not-ready');
  return response;
}

function display(state: CursorState): void {
  status.textContent = state.message;
  status.dataset.state = state.ok ? state.state : 'error';
  followButton.setAttribute('aria-pressed', String(state.follow));
  const labelNode = followButton.childNodes[0];
  if (labelNode) labelNode.textContent = state.follow ? 'Stop following ' : 'Follow cursor ';
}

async function run(message: CursorCommand): Promise<void> {
  try {
    display(await activeTabMessage(message));
  } catch (error) {
    const restricted = error instanceof Error && error.message === 'restricted';
    display({
      ok: false,
      state: 'error',
      follow: false,
      message: restricted
        ? 'This browser page is protected. Open a code page, then try again.'
        : 'The reader did not respond. Reload this code page, then try again.'
    });
  }
}

async function save(): Promise<void> {
  settings.punctuation = get<HTMLSelectElement>('punctuation').value as ListenSettings['punctuation'];
  settings.language = get<HTMLSelectElement>('language').value as ListenSettings['language'];
  settings.voiceURI = get<HTMLSelectElement>('voice').value;
  settings.rate = Number(get<HTMLInputElement>('rate').value);
  settings.speakIndentation = get<HTMLInputElement>('indent').checked;
  settings.indentSize = Number(get<HTMLSelectElement>('indent-size').value) as 2 | 4;
  await browser.storage.local.set({ settings });
  get<HTMLOutputElement>('rate-value').value = `${settings.rate.toFixed(1)}×`;
}

function renderPronunciation(): void {
  const list = get<HTMLUListElement>('pronunciation-list');
  list.replaceChildren(...Object.entries(settings.pronunciation).sort().map(([written, spoken]) => {
    const item = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = `${written} → ${spoken}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Remove';
    button.setAttribute('aria-label', `Remove pronunciation for ${written}`);
    button.addEventListener('click', () => {
      delete settings.pronunciation[written];
      void browser.storage.local.set({ settings });
      renderPronunciation();
    });
    item.append(label, button);
    return item;
  }));
}

function loadVoices(): void {
  const select = get<HTMLSelectElement>('voice');
  const voices = speechSynthesis.getVoices().filter((voice) => voice.localService);
  select.replaceChildren(new Option('Automatic local voice', ''), ...voices.map((voice) => (
    new Option(`${voice.name} (${voice.lang})`, voice.voiceURI)
  )));
  select.value = settings.voiceURI;
}

async function init(): Promise<void> {
  const stored = await browser.storage.local.get('settings');
  settings = mergeSettings(stored.settings as Partial<ListenSettings> | undefined);
  get<HTMLSelectElement>('language').value = settings.language;
  get<HTMLSelectElement>('punctuation').value = settings.punctuation;
  get<HTMLInputElement>('rate').value = String(settings.rate);
  get<HTMLOutputElement>('rate-value').value = `${settings.rate.toFixed(1)}×`;
  get<HTMLInputElement>('indent').checked = settings.speakIndentation;
  get<HTMLSelectElement>('indent-size').value = String(settings.indentSize);
  renderPronunciation();
  loadVoices();
  speechSynthesis.addEventListener('voiceschanged', loadVoices, { once: true });
  await run({ type: 'GET_STATE' });
}

get('listen').addEventListener('click', () => void run({ type: 'LISTEN' }));
get('repeat').addEventListener('click', () => void run({ type: 'REPEAT' }));
get('follow').addEventListener('click', () => void run({ type: 'TOGGLE_FOLLOW' }));
get('stop').addEventListener('click', () => void run({ type: 'STOP' }));
for (const id of ['language', 'punctuation', 'voice', 'rate', 'indent', 'indent-size']) {
  get(id).addEventListener('input', () => void save());
}
get<HTMLFormElement>('pronunciation-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const written = get<HTMLInputElement>('written').value.trim();
  const spoken = get<HTMLInputElement>('spoken').value.trim();
  if (!written || !spoken) return;
  settings.pronunciation[written] = spoken;
  void browser.storage.local.set({ settings });
  form.reset();
  renderPronunciation();
});

void init();
