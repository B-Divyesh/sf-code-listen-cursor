import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const stage = resolve('.output/vscode-package');
const output = resolve('dist/extension/vscode');
const siteDownloads = resolve('site/public/downloads');
const vsix = resolve(siteDownloads, 'code-listen-cursor-vscode.vsix');

await rm(stage, { recursive: true, force: true });
await rm(output, { recursive: true, force: true });
await mkdir(resolve(stage, 'extension/extension'), { recursive: true });
await cp(resolve('.output/vscode/vscode-extension/extension.js'), resolve(stage, 'extension/extension/extension.js'));
await cp(resolve('.output/vscode/vscode-extension/settings.js'), resolve(stage, 'extension/extension/settings.js'));
await cp(resolve('.output/vscode/core'), resolve(stage, 'extension/core'), { recursive: true });
await cp(resolve('vscode-extension/package.json'), resolve(stage, 'extension/package.json'));
await writeFile(resolve(stage, '[Content_Types].xml'), '<?xml version="1.0" encoding="utf-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="json" ContentType="application/json"/><Default Extension="js" ContentType="application/javascript"/><Default Extension="xml" ContentType="application/xml"/></Types>');
await mkdir(output, { recursive: true });
await cp(resolve(stage, 'extension'), output, { recursive: true });
await mkdir(siteDownloads, { recursive: true });
await rm(vsix, { force: true });
const result = spawnSync('zip', ['-q', '-r', vsix, '.'], { cwd: stage, stdio: 'inherit' });
if (result.status !== 0) throw new Error('Could not package the VS Code extension. Ensure zip is installed.');
await mkdir(resolve('dist/site/downloads'), { recursive: true });
await cp(vsix, resolve('dist/site/downloads/code-listen-cursor-vscode.vsix'));
console.log(`Packaged ${vsix}`);
