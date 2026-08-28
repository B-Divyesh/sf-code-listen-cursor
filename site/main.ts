import { codeToSpeech, currentLine } from '../core/code-to-speech';
import { mergeSettings } from '../core/settings';
import './style.css';

const get = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
const sample = get<HTMLTextAreaElement>('code-sample');
const preview = get<HTMLOutputElement>('speech-preview');
const status = get<HTMLParagraphElement>('demo-status');
const title = get<HTMLHeadingElement>('observation-title');
const rate = get<HTMLInputElement>('demo-rate');
const map: Record<string, string> = {};

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
  utterance.voice = voices.find((voice) => voice.localService && voice.lang.startsWith('en'))
    ?? voices.find((voice) => voice.lang.startsWith('en'))
    ?? null;
  utterance.onstart = () => {
    title.textContent = 'Listening now';
    status.textContent = 'Speech is playing through your system voice.';
    delete status.dataset.error;
    document.querySelector('.observation')?.classList.add('is-listening');
  };
  utterance.onend = () => {
    title.textContent = 'Observation complete';
    status.textContent = 'Move the cursor or select another specimen to continue.';
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

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js');
  });
}
