import { codeToSpeech, currentLine } from '../core/code-to-speech';
import { mergeSettings } from '../core/settings';
import { preferredLocalVoice } from '../core/voice';
import './style.css';
import './demo.css';

if (location.pathname === '/' && new URLSearchParams(location.search).has('demo')) {
  location.replace('/demo/');
}

const isDemo = location.pathname.startsWith('/demo');
const demoStorageKey = 'demo:code-listen-cursor:pronunciation';

const get = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
const sample = get<HTMLTextAreaElement>('code-sample');
const preview = get<HTMLOutputElement>('speech-preview');
const status = get<HTMLParagraphElement>('demo-status');
const title = get<HTMLHeadingElement>('observation-title');
const rate = get<HTMLInputElement>('demo-rate');
const map: Record<string, string> = {};
const originalSample = sample.value;

if (isDemo) {
  try {
    Object.assign(map, JSON.parse(localStorage.getItem(demoStorageKey) ?? '{}') as Record<string, string>);
  } catch {
    localStorage.removeItem(demoStorageKey);
  }
}

function source(): string {
  if (sample.selectionStart !== sample.selectionEnd) return sample.value.slice(sample.selectionStart, sample.selectionEnd);
  return currentLine(sample.value, sample.selectionStart);
}

function spokenText(): string {
  return codeToSpeech(source(), mergeSettings({
    punctuation: get<HTMLSelectElement>('demo-punctuation').value as 'essential' | 'detailed' | 'literal',
    speakIndentation: get<HTMLInputElement>('demo-indent').checked,
    rate: Number(rate.value),
    pronunciation: map
  }));
}

function updatePreview(): void {
  preview.value = spokenText();
}

function listen(): void {
  const code = source();
  if (!code.trim()) {
    title.textContent = 'Nothing to read';
    status.textContent = 'Add code, select code, or place the cursor on a non-empty line.';
    status.dataset.error = 'true';
    return;
  }
  if (!('speechSynthesis' in window)) {
    title.textContent = 'Speech unavailable';
    status.textContent = 'This browser does not provide speech. Try the current version of Chrome or Edge.';
    status.dataset.error = 'true';
    return;
  }
  const text = spokenText();
  preview.value = text;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = Number(rate.value);
  const voices = speechSynthesis.getVoices();
  utterance.voice = preferredLocalVoice(voices);
  utterance.onstart = () => {
    title.textContent = 'Listening now';
    status.textContent = 'Speech is playing through your system voice.';
    delete status.dataset.error;
    document.querySelector('.observation')?.classList.add('is-listening');
  };
  utterance.onend = () => {
    title.textContent = 'Reading complete';
    status.textContent = 'Move the cursor or select another line to continue.';
    document.querySelector('.observation')?.classList.remove('is-listening');
  };
  utterance.onerror = (event) => {
    document.querySelector('.observation')?.classList.remove('is-listening');
    if (event.error === 'canceled' || event.error === 'interrupted') return;
    title.textContent = 'Speech stopped';
    status.textContent = 'Check that your device has an English system voice, then try again.';
    status.dataset.error = 'true';
  };
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

get('demo-listen').addEventListener('click', listen);
get('demo-stop').addEventListener('click', () => {
  speechSynthesis?.cancel();
  title.textContent = 'Speech stopped';
  status.textContent = 'Your code is still in place.';
  document.querySelector('.observation')?.classList.remove('is-listening');
});
sample.addEventListener('select', updatePreview);
sample.addEventListener('keyup', updatePreview);
for (const id of ['demo-punctuation', 'demo-indent']) get(id).addEventListener('input', updatePreview);
rate.addEventListener('input', () => { get<HTMLOutputElement>('demo-rate-value').value = `${Number(rate.value).toFixed(1)}×`; });
get<HTMLFormElement>('demo-pronunciation').addEventListener('submit', (event) => {
  event.preventDefault();
  const written = get<HTMLInputElement>('demo-written').value.trim();
  const spoken = get<HTMLInputElement>('demo-spoken').value.trim();
  if (!written || !spoken) return;
  map[written] = spoken;
  if (isDemo) localStorage.setItem(demoStorageKey, JSON.stringify(map));
  updatePreview();
  status.textContent = `${written} will now be spoken as ${spoken}.`;
  title.textContent = 'Pronunciation recorded';
});

function updateOnlineState(): void {
  get('offline-note').hidden = navigator.onLine;
}
window.addEventListener('online', updateOnlineState);
window.addEventListener('offline', updateOnlineState);
updateOnlineState();
updatePreview();

if (isDemo) {
  get<HTMLButtonElement>('reset-demo').addEventListener('click', () => {
    sample.value = originalSample;
    for (const key of Object.keys(map)) delete map[key];
    localStorage.removeItem(demoStorageKey);
    get<HTMLInputElement>('demo-written').value = 'fern';
    get<HTMLInputElement>('demo-spoken').value = 'furn';
    get<HTMLSelectElement>('demo-punctuation').value = 'essential';
    get<HTMLInputElement>('demo-indent').checked = true;
    rate.value = '0.9';
    get<HTMLOutputElement>('demo-rate-value').value = '0.9×';
    title.textContent = 'Demo reset';
    status.textContent = 'The original sample code is ready. Nothing was saved outside this demo.';
    updatePreview();
  });
}

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js');
  });
}
