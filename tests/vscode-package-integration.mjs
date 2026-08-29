import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const coveredClaims = ['@claim:vscode-reader-controls', '@claim:vscode-package-privacy'];
const packagePath = resolve('dist/site/downloads/code-listen-cursor-vscode.vsix');
const unpacked = await mkdtemp('/tmp/code-listen-cursor-vsix.');
const unzip = spawnSync('unzip', ['-q', packagePath, '-d', unpacked], { encoding: 'utf8' });
if (unzip.status !== 0) throw new Error(`Could not unpack VSIX: ${unzip.stderr}`);

const vscodeModule = resolve(unpacked, 'extension/node_modules/vscode');
await mkdir(vscodeModule, { recursive: true });
await writeFile(resolve(vscodeModule, 'index.js'), `
const state = {
  commands: new Map(), posted: [], info: [], warnings: [], html: '', receive: undefined,
  editor: {
    selection: { isEmpty: false, active: { line: 0 } },
    document: {
      languageId: 'typescriptreact',
      lineAt: () => ({ text: '  return privateSource;' }),
      getText: () => 'const privateSource = kubectl?.config;'
    }
  }
};
const disposable = () => ({ dispose() {} });
exports.__state = state;
exports.ViewColumn = { Beside: 2 };
exports.commands = {
  registerCommand(name, handler) { state.commands.set(name, handler); return disposable(); }
};
exports.window = {
  get activeTextEditor() { return state.editor; },
  createWebviewPanel() {
    const webview = {
      set html(value) { state.html = value; },
      get html() { return state.html; },
      postMessage(message) { state.posted.push(message); return Promise.resolve(true); },
      onDidReceiveMessage(handler) { state.receive = handler; return disposable(); }
    };
    return { webview, reveal() {}, onDidDispose() { return disposable(); } };
  },
  showWarningMessage(message) { state.warnings.push(message); return Promise.resolve(message); },
  showInformationMessage(message) { state.info.push(message); return Promise.resolve(message); },
  onDidChangeTextEditorSelection(handler) { state.selectionHandler = handler; return disposable(); }
};
`);

const require = createRequire(import.meta.url);
const fakeVscode = require(resolve(vscodeModule, 'index.js'));
const extension = require(resolve(unpacked, 'extension/extension/extension.js'));
const saved = new Map();
const context = {
  subscriptions: [],
  globalState: {
    get(key) { return saved.get(key); },
    async update(key, value) { saved.set(key, value); }
  }
};

try {
  let networkCalls = 0;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    networkCalls += 1;
    throw new Error('Packaged VS Code extension attempted a network request.');
  };

  extension.activate(context);
  assert.deepEqual([...fakeVscode.__state.commands.keys()].sort(), [
    'codeListenCursor.listen',
    'codeListenCursor.openSettings',
    'codeListenCursor.repeat',
    'codeListenCursor.stop',
    'codeListenCursor.toggleFollow'
  ]);

  fakeVscode.__state.commands.get('codeListenCursor.listen')();
  let spoken = fakeVscode.__state.posted.findLast((message) => message.type === 'speak');
  assert.match(spoken.text, /private Source gets kubectl optional dot config/);
  assert.equal(spoken.settings.language, 'typescript');

  fakeVscode.__state.receive({
    type: 'save-settings',
    settings: {
      language: 'rust', punctuation: 'literal', speakIndentation: false,
      indentSize: 4, rate: 1.2, pitch: 1.1, voiceURI: 'local-test',
      pronunciation: { kubectl: 'cube control' }
    }
  });
  await new Promise((done) => setImmediate(done));
  assert.deepEqual(saved.get('settings'), {
    language: 'rust', punctuation: 'literal', speakIndentation: false,
    indentSize: 4, rate: 1.2, pitch: 1.1, voiceURI: 'local-test',
    pronunciation: { async: 'a sink', argv: 'arg vee', href: 'H ref', kubectl: 'cube control' }
  });
  assert.equal(JSON.stringify([...saved]).includes('privateSource'), false);

  fakeVscode.__state.commands.get('codeListenCursor.repeat')();
  spoken = fakeVscode.__state.posted.findLast((message) => message.type === 'speak');
  assert.match(spoken.text, /private Source gets cube control optional dot config/);
  fakeVscode.__state.commands.get('codeListenCursor.stop')();
  assert.equal(fakeVscode.__state.posted.at(-1).type, 'stop');

  fakeVscode.__state.commands.get('codeListenCursor.toggleFollow')();
  assert.match(fakeVscode.__state.info.at(-1), /cursor follow is on/);
  fakeVscode.__state.editor.selection = { isEmpty: true, active: { line: 0 } };
  fakeVscode.__state.selectionHandler();
  spoken = fakeVscode.__state.posted.findLast((message) => message.type === 'speak');
  assert.equal(spoken.text, 'return private Source semicolon');

  fakeVscode.__state.commands.get('codeListenCursor.openSettings')();
  assert.match(fakeVscode.__state.html, /Reading settings/);
  assert.match(fakeVscode.__state.html, /Personal pronunciation/);
  assert.match(fakeVscode.__state.html, /Content-Security-Policy/);
  assert.match(fakeVscode.__state.html, /Only voices marked local by your system are used/);

  const browser = await chromium.launch({ headless: true });
  try {
    const exerciseVoicePolicy = async (voices) => {
      const page = await browser.newPage();
      await page.addInitScript((availableVoices) => {
        window.__constructed = [];
        window.__spoken = [];
        window.__posted = [];
        window.acquireVsCodeApi = () => ({ postMessage(message) { window.__posted.push(message); } });
        window.SpeechSynthesisUtterance = class {
          constructor(text) {
            this.text = text;
            this.voice = null;
            window.__constructed.push(text);
          }
        };
        Object.defineProperty(window, 'speechSynthesis', {
          configurable: true,
          value: {
            addEventListener() {},
            cancel() {},
            getVoices: () => availableVoices,
            speak(utterance) {
              window.__spoken.push({ text: utterance.text, localService: utterance.voice?.localService });
              utterance.onstart?.();
            }
          }
        });
      }, voices);
      const documentUrl = `data:text/html;base64,${Buffer.from(fakeVscode.__state.html).toString('base64')}`;
      await page.goto(documentUrl);
      await page.evaluate(() => {
        window.dispatchEvent(new MessageEvent('message', {
          data: {
            type: 'speak',
            text: 'private Source gets secret',
            settings: { rate: 0.9, pitch: 1, voiceURI: '' }
          }
        }));
      });
      const result = await page.evaluate(() => ({
        constructed: window.__constructed,
        spoken: window.__spoken,
        status: document.querySelector('#status')?.textContent
      }));
      await page.close();
      return result;
    };

    const blocked = await exerciseVoicePolicy([
      { default: true, lang: 'en-US', localService: false, name: 'Network only', voiceURI: 'network-only' }
    ]);
    assert.deepEqual(blocked.constructed, [], 'VS Code passed source to a non-local utterance.');
    assert.deepEqual(blocked.spoken, [], 'VS Code started a non-local speech voice.');
    assert.match(blocked.status, /No local speech voice/);

    const local = await exerciseVoicePolicy([
      { default: true, lang: 'en-US', localService: true, name: 'Local test', voiceURI: 'local-test' }
    ]);
    assert.deepEqual(local.constructed, ['private Source gets secret']);
    assert.deepEqual(local.spoken, [{ text: 'private Source gets secret', localService: true }]);
    assert.equal(local.status, 'Listening to code.');
  } finally {
    await browser.close();
  }
  assert.equal(networkCalls, 0);
  globalThis.fetch = originalFetch;

  console.log(`${coveredClaims.join(', ')} passed against the packaged VSIX.`);
} finally {
  await rm(unpacked, { recursive: true, force: true });
}
