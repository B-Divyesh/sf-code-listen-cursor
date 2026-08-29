import * as vscode from 'vscode';
import { codeToSpeech } from '../core/code-to-speech';
import { mergeSettings } from '../core/settings';

let lastText = '';
let follow = false;
let panel: vscode.WebviewPanel | undefined;

function sourceAtCursor(): string {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return '';
  const selection = editor.selection;
  if (!selection.isEmpty) return editor.document.getText(selection);
  return editor.document.lineAt(selection.active.line).text;
}

function speechPanel(): vscode.WebviewPanel {
  if (panel) return panel;
  panel = vscode.window.createWebviewPanel(
    'codeListenCursor.speech',
    'Code Listen Cursor',
    vscode.ViewColumn.Beside,
    { enableScripts: true, retainContextWhenHidden: true }
  );
  const nonce = String(Date.now());
  panel.webview.html = `<!doctype html><html lang="en"><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}';"></head><body><main><h1>Code Listen Cursor</h1><p id="status" role="status" aria-live="polite">Ready to listen.</p></main><script nonce="${nonce}">
    const status = document.getElementById('status');
    window.addEventListener('message', ({data}) => {
      if (data.type === 'stop') { speechSynthesis.cancel(); status.textContent = 'Speech stopped.'; return; }
      const utterance = new SpeechSynthesisUtterance(data.text);
      utterance.rate = data.rate;
      const voices = speechSynthesis.getVoices();
      utterance.voice = voices.find(v => v.localService && v.lang.startsWith('en')) || voices.find(v => v.lang.startsWith('en')) || null;
      utterance.onstart = () => status.textContent = 'Listening to code.';
      utterance.onend = () => status.textContent = 'Ready to listen.';
      utterance.onerror = () => status.textContent = 'Speech could not start. Check an installed system voice.';
      speechSynthesis.cancel(); speechSynthesis.speak(utterance);
    });
  </script></body></html>`;
  panel.onDidDispose(() => { panel = undefined; });
  return panel;
}

function listen(text = sourceAtCursor()): void {
  if (!text.trim()) {
    void vscode.window.showWarningMessage('Code Listen Cursor: select code or place the cursor on a non-empty line.');
    return;
  }
  lastText = text;
  const settings = mergeSettings();
  speechPanel().webview.postMessage({ type: 'speak', text: codeToSpeech(text, settings), rate: settings.rate });
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('codeListenCursor.listen', () => listen()),
    vscode.commands.registerCommand('codeListenCursor.repeat', () => {
      if (lastText) listen(lastText);
      else void vscode.window.showWarningMessage('Code Listen Cursor: nothing to repeat yet.');
    }),
    vscode.commands.registerCommand('codeListenCursor.toggleFollow', () => {
      follow = !follow;
      void vscode.window.showInformationMessage(`Code Listen Cursor: cursor follow is ${follow ? 'on' : 'off'}.`);
    }),
    vscode.commands.registerCommand('codeListenCursor.stop', () => {
      panel?.webview.postMessage({ type: 'stop' });
    }),
    vscode.window.onDidChangeTextEditorSelection(() => { if (follow) listen(); })
  );
}

export function deactivate(): void {
  panel?.webview.postMessage({ type: 'stop' });
}
