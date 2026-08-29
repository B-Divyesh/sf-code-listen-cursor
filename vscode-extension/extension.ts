import * as vscode from 'vscode';
import { codeToSpeech } from '../core/code-to-speech';
import type { ListenSettings } from '../core/settings';
import { readingSettings, storedSettings } from './settings';

let lastText = '';
let lastLanguageId = 'plaintext';
let follow = false;
let panel: vscode.WebviewPanel | undefined;
let extensionContext: vscode.ExtensionContext | undefined;

function sourceAtCursor(): { text: string; languageId: string } {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return { text: '', languageId: 'plaintext' };
  const selection = editor.selection;
  return {
    text: selection.isEmpty ? editor.document.lineAt(selection.active.line).text : editor.document.getText(selection),
    languageId: editor.document.languageId
  };
}

function savedSettings(): ListenSettings {
  return storedSettings(extensionContext?.globalState.get<unknown>('settings'));
}

async function saveSettings(value: unknown): Promise<void> {
  if (!extensionContext) return;
  const settings = storedSettings(value);
  await extensionContext.globalState.update('settings', settings);
  void panel?.webview.postMessage({ type: 'settings', settings });
}

function webviewHtml(nonce: string): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}';">
  <title>Code Listen Cursor</title>
  <style nonce="${nonce}">
    body{font:16px/1.5 system-ui,sans-serif;color:#17231d;background:#fcfaf1;margin:1rem;max-width:42rem}
    button,input,select{font:inherit}
    button,select,input{min-width:44px;min-height:44px}
    label{display:block;margin-top:.75rem}
    fieldset{margin:1rem 0;padding:1rem;border:1px solid #6f7c70}
    input[type=range]{width:100%}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
    .actions{display:flex;gap:.75rem;flex-wrap:wrap}
    .voice-note{margin:.35rem 0 0}
    li{margin:.35rem 0}
    li button{margin-left:.5rem}
    @media(max-width:390px){.row{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <main>
    <h1>Code Listen Cursor</h1>
    <p id="status" role="status" aria-live="polite">Ready to listen.</p>
    <div class="actions">
      <button type="button" id="listen">Listen to current code</button>
      <button type="button" id="stop">Stop</button>
    </div>
    <fieldset>
      <legend>Reading settings</legend>
      <div class="row">
        <label>Code language<select id="language"><option value="auto">Detect from editor</option><option value="javascript">JavaScript</option><option value="typescript">TypeScript</option><option value="python">Python</option><option value="rust">Rust</option><option value="shell">Shell</option><option value="other">Other</option></select></label>
        <label>Punctuation detail<select id="punctuation"><option value="essential">Essential structure</option><option value="detailed">Detailed</option><option value="literal">Every symbol</option></select></label>
      </div>
      <label>System voice<select id="voice" aria-describedby="voice-note"><option value="">Automatic local voice</option></select></label>
      <p class="voice-note" id="voice-note">Only voices marked local by your system are used.</p>
      <label>Reading rate <output id="rate-value">0.9×</output><input id="rate" type="range" min="0.5" max="1.5" step="0.1"></label>
      <label>Pitch <output id="pitch-value">1.0</output><input id="pitch" type="range" min="0" max="2" step="0.1"></label>
      <label><input id="indent" type="checkbox"> Speak indentation</label>
      <label>Spaces per indent<select id="indent-size"><option value="2">2 spaces</option><option value="4">4 spaces</option></select></label>
    </fieldset>
    <fieldset>
      <legend>Personal pronunciation</legend>
      <form id="pronunciation-form">
        <div class="row">
          <label>Code word<input id="written" required autocomplete="off"></label>
          <label>Speak as<input id="spoken" required autocomplete="off"></label>
        </div>
        <button type="submit">Add pronunciation</button>
      </form>
      <ul id="pronunciation-list" aria-label="Personal pronunciations"></ul>
    </fieldset>
  </main>
  <script nonce="${nonce}">
    const vscode=acquireVsCodeApi();
    const $=id=>document.getElementById(id);
    let settings={punctuation:'essential',language:'auto',speakIndentation:true,indentSize:2,rate:.9,pitch:1,voiceURI:'',pronunciation:{}};
    const status=$('status');
    function setStatus(value){status.textContent=value}
    function render(){
      $('language').value=settings.language;
      $('punctuation').value=settings.punctuation;
      $('voice').value=settings.voiceURI;
      $('rate').value=String(settings.rate);
      $('rate-value').value=settings.rate.toFixed(1)+'×';
      $('pitch').value=String(settings.pitch);
      $('pitch-value').value=settings.pitch.toFixed(1);
      $('indent').checked=settings.speakIndentation;
      $('indent-size').value=String(settings.indentSize);
      const list=$('pronunciation-list');
      list.replaceChildren(...Object.entries(settings.pronunciation).sort().map(([written,spoken])=>{
        const item=document.createElement('li');
        item.append(document.createTextNode(written+' → '+spoken));
        const button=document.createElement('button');
        button.type='button';
        button.textContent='Remove';
        button.setAttribute('aria-label','Remove pronunciation for '+written);
        button.onclick=()=>{delete settings.pronunciation[written];save()};
        item.append(button);
        return item;
      }))
    }
    function localVoices(){return speechSynthesis.getVoices().filter(item=>item.localService===true)}
    function loadVoices(){
      const voice=$('voice');
      const selected=settings.voiceURI;
      const voices=localVoices();
      const firstLabel=voices.length?'Automatic local voice':'No local voice available';
      voice.replaceChildren(new Option(firstLabel,''),...voices.map(item=>new Option(item.name+' ('+item.lang+')',item.voiceURI)));
      voice.value=voices.some(item=>item.voiceURI===selected)?selected:'';
      voice.disabled=voices.length===0;
    }
    function save(){
      settings.punctuation=$('punctuation').value;
      settings.language=$('language').value;
      settings.voiceURI=$('voice').value;
      settings.rate=Number($('rate').value);
      settings.pitch=Number($('pitch').value);
      settings.speakIndentation=$('indent').checked;
      settings.indentSize=Number($('indent-size').value);
      $('rate-value').value=settings.rate.toFixed(1)+'×';
      $('pitch-value').value=settings.pitch.toFixed(1);
      vscode.postMessage({type:'save-settings',settings})
    }
    for(const id of ['language','punctuation','voice','rate','pitch','indent','indent-size']) $(id).addEventListener('input',save);
    $('pronunciation-form').addEventListener('submit',event=>{
      event.preventDefault();
      const written=$('written').value.trim();
      const spoken=$('spoken').value.trim();
      if(!written||!spoken)return;
      settings.pronunciation[written]=spoken;
      $('written').value='';
      $('spoken').value='';
      render();
      save()
    });
    $('listen').onclick=()=>vscode.postMessage({type:'listen'});
    $('stop').onclick=()=>vscode.postMessage({type:'stop'});
    window.addEventListener('message',({data})=>{
      if(data.type==='settings'){settings=data.settings;render();loadVoices()}
      if(data.type==='speak'){
        const voices=localVoices();
        const voice=voices.find(item=>item.voiceURI===data.settings.voiceURI)||voices.find(item=>item.lang.toLowerCase().startsWith('en'))||voices[0];
        if(!voice){
          speechSynthesis.cancel();
          setStatus('No local speech voice is available. Install or enable one, then try again.');
          return
        }
        const utterance=new SpeechSynthesisUtterance(data.text);
        utterance.rate=data.settings.rate;
        utterance.pitch=data.settings.pitch;
        utterance.voice=voice;
        utterance.onstart=()=>setStatus('Listening to code.');
        utterance.onend=()=>setStatus('Ready to listen.');
        utterance.onerror=()=>setStatus('Speech could not start. Check an installed local voice.');
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance)
      }
      if(data.type==='stop'){speechSynthesis.cancel();setStatus('Speech stopped.')}
    });
    speechSynthesis.addEventListener('voiceschanged',loadVoices,{once:true});
    vscode.postMessage({type:'ready'});
  </script>
</body>
</html>`;
}

function speechPanel(): vscode.WebviewPanel {
  if (panel) {
    panel.reveal(vscode.ViewColumn.Beside);
    return panel;
  }
  panel = vscode.window.createWebviewPanel(
    'codeListenCursor.speech',
    'Code Listen Cursor',
    vscode.ViewColumn.Beside,
    { enableScripts: true, retainContextWhenHidden: true }
  );
  const nonce = String(Date.now());
  panel.webview.html = webviewHtml(nonce);
  panel.webview.onDidReceiveMessage((message: { type?: string; settings?: unknown }) => {
    if (message.type === 'ready') void panel?.webview.postMessage({ type: 'settings', settings: savedSettings() });
    if (message.type === 'save-settings') void saveSettings(message.settings);
    if (message.type === 'listen') listen();
    if (message.type === 'stop') void panel?.webview.postMessage({ type: 'stop' });
  });
  panel.onDidDispose(() => { panel = undefined; });
  return panel;
}

function listen(text?: string, languageId?: string): void {
  if (text === undefined) {
    const source = sourceAtCursor();
    text = source.text;
    languageId = source.languageId;
  }
  if (!text.trim()) {
    void vscode.window.showWarningMessage('Code Listen Cursor: select code or place the cursor on a non-empty line.');
    return;
  }
  lastText = text;
  lastLanguageId = languageId ?? 'plaintext';
  const settings = readingSettings(extensionContext?.globalState.get<unknown>('settings'), lastLanguageId);
  const reader = speechPanel();
  void reader.webview.postMessage({ type: 'speak', text: codeToSpeech(text, settings), settings });
}

export function activate(context: vscode.ExtensionContext): void {
  extensionContext = context;
  context.subscriptions.push(
    vscode.commands.registerCommand('codeListenCursor.listen', () => listen()),
    vscode.commands.registerCommand('codeListenCursor.repeat', () => {
      if (lastText) listen(lastText, lastLanguageId);
      else void vscode.window.showWarningMessage('Code Listen Cursor: nothing to repeat yet.');
    }),
    vscode.commands.registerCommand('codeListenCursor.openSettings', () => { speechPanel(); }),
    vscode.commands.registerCommand('codeListenCursor.toggleFollow', () => {
      follow = !follow;
      void vscode.window.showInformationMessage(`Code Listen Cursor: cursor follow is ${follow ? 'on' : 'off'}.`);
    }),
    vscode.commands.registerCommand('codeListenCursor.stop', () => {
      void panel?.webview.postMessage({ type: 'stop' });
    }),
    vscode.window.onDidChangeTextEditorSelection(() => { if (follow) listen(); })
  );
}

export function deactivate(): void {
  void panel?.webview.postMessage({ type: 'stop' });
}
