import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('release-host contract', () => {
  it('ships CSP, immutable asset caching, no-cache service worker, and a status 404 @regression:host-policy', async () => {
    const config = JSON.parse(await readFile(resolve('site/public/staticwebapp.config.json'), 'utf8')) as {
      globalHeaders: Record<string, string>;
      routes: { route: string; headers: Record<string, string> }[];
      responseOverrides: Record<string, { rewrite: string; statusCode: number }>;
    };
    expect(config.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
    expect(config.globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(config.routes.find((route) => route.route === '/assets/*')?.headers['Cache-Control']).toContain('immutable');
    expect(config.routes.find((route) => route.route === '/sw.js')?.headers['Cache-Control']).toBe('no-cache');
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
  });

  it('keeps a native VS Code settings and command adapter alongside the MV3 adapter @regression:vscode-adapter', async () => {
    const manifest = JSON.parse(await readFile(resolve('vscode-extension/package.json'), 'utf8')) as {
      contributes: { commands: { command: string }[] };
    };
    expect(manifest.contributes.commands.map((command) => command.command)).toEqual(expect.arrayContaining([
      'codeListenCursor.listen', 'codeListenCursor.repeat', 'codeListenCursor.openSettings', 'codeListenCursor.toggleFollow', 'codeListenCursor.stop'
    ]));
    const source = await readFile(resolve('vscode-extension/extension.ts'), 'utf8');
    expect(source).toContain("globalState.update('settings'");
    expect(source).toContain('Personal pronunciation');
    expect(source).toContain('Punctuation detail');
    expect(source).toContain('Spaces per indent');
  });
});
