import { browser } from 'wxt/browser';
import { codeToSpeech, currentLine, detectLanguage } from '../core/code-to-speech';
import type { CursorCommand, CursorState } from '../core/messages';
import { mergeSettings, type ListenSettings } from '../core/settings';
import { preferredLocalVoice } from '../core/voice';

let lastSource = '';
let follow = false;
let speaking = false;
let followTimer = 0;
let toast: HTMLElement | null = null;

function sourceAtCursor(): string {
  const active = document.activeElement;
  if (active instanceof HTMLTextAreaElement || (active instanceof HTMLInputElement && /^(text|search|url|email)$/.test(active.type))) {
    const start = active.selectionStart ?? 0;
    const end = active.selectionEnd ?? start;
    return start !== end ? active.value.slice(start, end) : currentLine(active.value, start);
  }
  const selection = window.getSelection();
  if (selection && !selection.isCollapsed) return selection.toString();
  const node = selection?.anchorNode;
  const element = node instanceof Element ? node : node?.parentElement;
  const codeLine = element?.closest('.view-line, .cm-line, [data-line-number], td.blob-code, [role="row"]');
  if (codeLine?.textContent?.trim()) return codeLine.textContent;
  const text = node?.textContent ?? '';
  if (text.trim()) {
    const offset = Math.min(selection?.anchorOffset ?? 0, text.length);
    return currentLine(text, offset);
  }
  return '';
}

function showStatus(message: string, kind: 'listening' | 'notice' | 'error' = 'notice'): void {
  toast?.remove();
  const host = document.createElement('div');
  host.setAttribute('data-code-listen-cursor', '');
  const root = host.attachShadow({ mode: 'closed' });
  const box = document.createElement('div');
  box.setAttribute('role', kind === 'error' ? 'alert' : 'status');
  box.textContent = `${kind === 'listening' ? '▶ ' : kind === 'error' ? '! ' : '• '}${message}`;
  const style = document.createElement('style');
  style.textContent = `div{position:fixed;z-index:2147483647;right:20px;bottom:20px;max-width:min(380px,calc(100vw - 40px));padding:12px 16px;border:1px solid #17231d;border-left:5px solid ${kind === 'error' ? '#a2462e' : '#315b43'};border-radius:5px;background:#fcfaf1;color:#17231d;box-shadow:4px 4px 0 rgb(23 35 29 / .2);font:600 16px/1.4 ui-monospace,SFMono-Regular,Consolas,monospace}`;
  root.append(style, box);
  document.documentElement.append(host);
  toast = host;
  window.setTimeout(() => {
    if (toast === host) {
      host.remove();
      toast = null;
    }
  }, kind === 'error' ? 6500 : 3500);
}

async function listen(source = sourceAtCursor()): Promise<CursorState> {
  const trimmed = source.trimEnd();
  if (!trimmed.trim()) {
    const message = 'No code found. Select code or place the cursor on a text line.';
    showStatus(message, 'error');
    return { ok: false, state: 'error', message, follow };
  }
  if (!('speechSynthesis' in window)) {
    const message = 'Speech is not available in this browser. Try current Chrome or Edge.';
    showStatus(message, 'error');
    return { ok: false, state: 'error', message, follow };
  }
  if (trimmed.length > 12000) {
    const message = 'That selection is too long. Select at most 12,000 characters.';
    showStatus(message, 'error');
    return { ok: false, state: 'error', message, follow };
  }

  const stored = await browser.storage.local.get('settings');
  const settings = mergeSettings(stored.settings as Partial<ListenSettings> | undefined);
  const effectiveSettings = settings.language === 'auto'
    ? { ...settings, language: detectLanguage(location.pathname, trimmed) }
    : settings;
  lastSource = trimmed;
  const voice = preferredLocalVoice(window.speechSynthesis.getVoices(), settings.voiceURI);
  if (!voice) {
    window.speechSynthesis.cancel();
    const message = 'No local speech voice is available. Install or enable a local system voice, then try again.';
    showStatus(message, 'error');
    return { ok: false, state: 'error', message, follow };
  }
  const utterance = new SpeechSynthesisUtterance(codeToSpeech(trimmed, effectiveSettings));
  utterance.rate = settings.rate;
  utterance.pitch = settings.pitch;
  utterance.voice = voice;
  utterance.onstart = () => { speaking = true; showStatus('Listening to code', 'listening'); };
  utterance.onend = () => { speaking = false; };
  utterance.onerror = (event) => {
    speaking = false;
    if (event.error !== 'canceled' && event.error !== 'interrupted') {
      showStatus('Speech stopped unexpectedly. Check your system voice and try again.', 'error');
    }
  };
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return { ok: true, state: 'speaking', message: 'Listening to code', follow, sample: trimmed.slice(0, 80) };
}

function toggleFollow(): CursorState {
  follow = !follow;
  const message = follow ? 'Cursor follow is on' : 'Cursor follow is off';
  showStatus(message);
  return { ok: true, state: follow ? 'following' : 'idle', message, follow };
}

function onSelectionChange(): void {
  if (!follow) return;
  window.clearTimeout(followTimer);
  followTimer = window.setTimeout(() => {
    const source = sourceAtCursor().trimEnd();
    if (source && source !== lastSource) void listen(source);
  }, 400);
}

export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  main() {
    document.addEventListener('selectionchange', onSelectionChange, { passive: true });
    document.addEventListener('keyup', onSelectionChange, { passive: true });
    browser.runtime.onMessage.addListener(async (message: CursorCommand): Promise<CursorState> => {
      if (message.type === 'LISTEN') return listen();
      if (message.type === 'REPEAT') {
        if (lastSource) return listen(lastSource);
        const error = 'Nothing to repeat yet. Listen to code first.';
        showStatus(error, 'error');
        return { ok: false, state: 'error', message: error, follow };
      }
      if (message.type === 'TOGGLE_FOLLOW') return toggleFollow();
      if (message.type === 'STOP') {
        window.speechSynthesis?.cancel();
        speaking = false;
        showStatus('Speech stopped');
        return { ok: true, state: follow ? 'following' : 'idle', message: 'Speech stopped', follow };
      }
      return {
        ok: true,
        state: speaking ? 'speaking' : follow ? 'following' : 'idle',
        message: speaking ? 'Listening to code' : follow ? 'Cursor follow is on' : 'Ready to listen',
        follow,
        sample: lastSource.slice(0, 80)
      };
    });
  }
});
