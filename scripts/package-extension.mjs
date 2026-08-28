import { cp, mkdir, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const source = resolve('.output/chrome-mv3');
const extensionOut = resolve('dist/extension/chrome-mv3');
const downloads = resolve('site/public/downloads');
const zipPath = resolve(downloads, 'code-listen-cursor-chrome.zip');

await rm(resolve('dist/extension'), { recursive: true, force: true });
await mkdir(extensionOut, { recursive: true });
await cp(source, extensionOut, { recursive: true });
await mkdir(downloads, { recursive: true });
await rm(zipPath, { force: true });

const result = spawnSync('zip', ['-q', '-r', zipPath, '.'], { cwd: source, stdio: 'inherit' });
if (result.status !== 0) throw new Error('Could not package the extension ZIP. Ensure zip is installed.');

console.log(`Packaged ${zipPath}`);
