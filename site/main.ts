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
const preview = get<HTMLDivElement>('speech-preview');
const status = get<HTMLParagraphElement>('demo-status');
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
  preview.textContent = spokenText();
}

function listen(): void {
  const code = source();
  if (!code.trim()) {
    status.textContent = 'Nothing to read. Add code, select code, or place the cursor on a non-empty line.';
    status.dataset.error = 'true';
    return;
  }
  if (!('speechSynthesis' in window)) {
    status.textContent = 'Speech unavailable. Try the current version of Chrome or Edge.';
    status.dataset.error = 'true';
    return;
  }
  const text = spokenText();
  preview.textContent = text;
  const voice = preferredLocalVoice(speechSynthesis.getVoices());
  if (!voice) {
    speechSynthesis.cancel();
    status.textContent = 'Local voice needed. Install or enable a voice marked local on this device, then try again. The spoken preview is still available.';
    status.dataset.error = 'true';
    document.querySelector('.observation')?.classList.remove('is-listening');
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = Number(rate.value);
  utterance.voice = voice;
  utterance.onstart = () => {
    status.textContent = 'Listening now. Speech is playing through your system voice.';
    delete status.dataset.error;
    document.querySelector('.observation')?.classList.add('is-listening');
  };
  utterance.onend = () => {
    status.textContent = 'Reading complete. Move the cursor or select another line to continue.';
    document.querySelector('.observation')?.classList.remove('is-listening');
  };
  utterance.onerror = (event) => {
    document.querySelector('.observation')?.classList.remove('is-listening');
    if (event.error === 'canceled' || event.error === 'interrupted') return;
    status.textContent = 'Speech stopped. Check that your device has an English system voice, then try again.';
    status.dataset.error = 'true';
  };
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

get('demo-listen').addEventListener('click', listen);
get('demo-stop').addEventListener('click', () => {
  speechSynthesis?.cancel();
  status.textContent = 'Speech stopped. Your code is still in place.';
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
  status.textContent = isDemo
    ? `${written} will now be spoken as ${spoken}.`
    : `This preview will say ${spoken} for ${written} until you reload.`;
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
    status.textContent = 'Demo reset. The original sample code is ready. Nothing was saved outside this demo.';
    updatePreview();
  });
}

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js');
  });
}
