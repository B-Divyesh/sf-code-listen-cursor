import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const browserZip = resolve('dist/site/downloads/code-listen-cursor-chrome.zip');
const vscodeVsix = resolve('dist/site/downloads/code-listen-cursor-vscode.vsix');

for (const artifact of [browserZip, vscodeVsix]) {
  if (!existsSync(artifact)) throw new Error(`Missing package: ${artifact}`);
  if (spawnSync('unzip', ['-t', artifact], { stdio: 'ignore' }).status !== 0) throw new Error(`Invalid ZIP package: ${artifact}`);
}

const manifest = spawnSync('unzip', ['-p', browserZip, 'manifest.json'], { encoding: 'utf8' });
if (manifest.status !== 0 || JSON.parse(manifest.stdout).manifest_version !== 3) throw new Error('Browser package is not MV3.');
const vscodeManifest = spawnSync('unzip', ['-p', vscodeVsix, 'extension/package.json'], { encoding: 'utf8' });
if (vscodeManifest.status !== 0 || JSON.parse(vscodeManifest.stdout).main !== './extension/extension.js') throw new Error('VS Code package has no extension entry point.');
const vscodeEntry = spawnSync('unzip', ['-p', vscodeVsix, 'extension/extension/extension.js'], { encoding: 'utf8' });
if (vscodeEntry.status !== 0 || !vscodeEntry.stdout.includes('../core/code-to-speech')) throw new Error('VS Code package main entry is missing or cannot resolve shared core code.');
const vscodeSettings = spawnSync('unzip', ['-p', vscodeVsix, 'extension/extension/settings.js'], { encoding: 'utf8' });
if (vscodeSettings.status !== 0 || !vscodeSettings.stdout.includes('readingSettings')) throw new Error('VS Code package is missing its reading-settings adapter.');
const siteConfig = JSON.parse(readFileSync(resolve('dist/site/staticwebapp.config.json'), 'utf8'));
if (!siteConfig.globalHeaders['Content-Security-Policy'] || siteConfig.responseOverrides['404']?.statusCode !== 404) {
  throw new Error('Static host policy is missing CSP or a real 404 response.');
}

console.log('Browser package, VS Code package, CSP policy, and 404 policy are valid.');
