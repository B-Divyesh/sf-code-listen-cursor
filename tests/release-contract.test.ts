import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('release-host contract', () => {
  it('gives every declared claim exactly one tagged regression @regression:claim-ledger', async () => {
    const claims = JSON.parse(await readFile(resolve('.factory/claims.json'), 'utf8')) as { id: string; test: string }[];
    const testFiles = (await readdir(resolve('tests'), { recursive: true }))
      .filter((file) => /\.(?:ts|mjs)$/.test(file));
    const sources = await Promise.all(testFiles.map((file) => readFile(resolve('tests', file), 'utf8')));
    for (const claim of claims) {
      const tag = `@claim:${claim.id}`;
      expect(sources.reduce((count, source) => count + source.split(tag).length - 1, 0), tag).toBe(1);
      expect(claim.test, `${claim.id} has no exact command`).toMatch(/^npm run |^npm test /);
    }
  });

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

  it('ships complete route metadata, social art, and footer identity @regression:route-metadata @claim:generated-artwork-provenance', async () => {
    const routes = [
      ['site/index.html', 'https://code-listen-cursor.sociobot.in/'],
      ['site/demo/index.html', 'https://code-listen-cursor.sociobot.in/demo/'],
      ['site/privacy/index.html', 'https://code-listen-cursor.sociobot.in/privacy/'],
      ['site/terms/index.html', 'https://code-listen-cursor.sociobot.in/terms/'],
      ['site/404.html', 'https://code-listen-cursor.sociobot.in/404.html']
    ];
    for (const [path, canonical] of routes) {
      const html = await readFile(resolve(path), 'utf8');
      expect(html).toMatch(new RegExp(`<link\\s+rel="canonical"\\s+href="${canonical.replaceAll('/', '\\/')}"`));
      expect(html).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png"');
      for (const property of ['og:type', 'og:url', 'og:title', 'og:description', 'og:image', 'og:image:width', 'og:image:height']) {
        expect(html, `${path} lacks ${property}`).toContain(`property="${property}"`);
      }
      for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
        expect(html, `${path} lacks ${name}`).toContain(`name="${name}"`);
      }
      expect(html).toContain('Built by Param Factory · Version 1.0.3');
      expect(html).toContain('href="/privacy/"');
      expect(html).toContain('href="/terms/"');
    }
    const social = await readFile(resolve('site/public/og-card.jpg'));
    const apple = await readFile(resolve('site/public/apple-touch-icon.png'));
    expect(social.byteLength).toBeGreaterThan(10_000);
    expect(apple.readUInt32BE(16)).toBe(180);
    expect(apple.readUInt32BE(20)).toBe(180);
    expect(await readFile(resolve('assets/src/hero-field-guide.png.json'), 'utf8')).toContain('prompt');
    expect(await readFile(resolve('.factory/design.md'), 'utf8')).toContain('factory-image');
  });

  it('@claim:mit-license ships the complete MIT grant', async () => {
    const license = await readFile(resolve('LICENSE'), 'utf8');
    expect(license).toContain('MIT License');
    expect(license).toContain('Permission is hereby granted, free of charge');
  });

  it('keeps the audited landing copy direct and synchronized @regression:plain-words', async () => {
    const html = await readFile(resolve('site/index.html'), 'utf8');
    const visibleCopy = html
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    expect(visibleCopy.toLowerCase()).not.toMatch(/\b(?:specimen|observation|anatomy|leverage|seamless|effortless|robust|powerful|intuitive|reimagine|supercharge|unlock|delightful|journey|ecosystem)\b/);
    const audit = await readFile(resolve('.factory/copy-audit.md'), 'utf8');
    const expectedHash = createHash('sha256').update(html).digest('hex');
    expect(audit).toContain(`Landing source SHA-256: \`${expectedHash}\``);
  });

  it('keeps acceptance promises executable in the sandbox @regression:verifiable-acceptance', async () => {
    const factoryFiles = (await readdir(resolve('.factory')))
      .filter((file) => /\.(?:json|md)$/.test(file) && !file.startsWith('verification'))
      .map((file) => `.factory/${file}`);
    const siteFiles = (await readdir(resolve('site'), { recursive: true }))
      .filter((file) => file.endsWith('.html'))
      .map((file) => `site/${file}`);
    const activeContractFiles = [
      'README.md', 'package.json', 'wxt.config.ts', 'vscode-extension/package.json',
      ...factoryFiles, ...siteFiles
    ];
    const activeContract = (await Promise.all(activeContractFiles.map(async (file) => (
      `${file}\n${await readFile(resolve(file), 'utf8')}`
    )))).join('\n');

    expect(activeContract).not.toMatch(/(?:20[- ]snippet (?:participant|usability) study|16\s*(?:of|\/)\s*20|participant evidence|screen[- ]reader[- ]user|screen[- ]reader users?)/i);
    expect(activeContract).not.toContain('language you can distinguish');

    const brief = JSON.parse(await readFile(resolve('.factory/brief.json'), 'utf8')) as {
      success_measure: string;
      constraints: string;
    };
    const claims = JSON.parse(await readFile(resolve('.factory/claims.json'), 'utf8')) as {
      id: string;
      test: string;
    }[];
    expect(brief.success_measure).toContain('shipped structural-cue fixture');
    expect(brief.success_measure).toContain('expected spoken symbol and indentation cue');
    expect(brief.constraints).toContain('shortcuts configurable');
    expect(claims.find(({ id }) => id === 'structure-aware-speech')?.test)
      .toBe(`npm test -- --testNamePattern ${'@claim:'}${'structure-aware-speech'}`);
  });
});
