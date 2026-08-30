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

  it('keeps every adversarial-review wording repair in the shipped pages @regression:review-1-copy', async () => {
    const [landing, demo, readme] = await Promise.all([
      readFile(resolve('site/index.html'), 'utf8'),
      readFile(resolve('site/demo/index.html'), 'utf8'),
      readFile(resolve('README.md'), 'utf8')
    ]);
    for (const copy of [
      'How the code reader works',
      'Set pronunciations for project words',
      'Code stays on your device'
    ]) expect(landing).toContain(copy);
    expect(landing).toContain('Preview sample pronunciation');
    expect(demo).toContain('Save sample pronunciation');
    expect(readme).toContain('`npm run build:site` writes the deployment to `dist/site/`.');
    expect(readme).toContain('That folder includes the demo, legal pages, packages, and service worker.');
    expect(readme).not.toContain('It produces the complete static deployment');
  });

  it('keeps every round-two review repair honest and self-describing @regression:review-2-copy', async () => {
    const [landing, demo, readme] = await Promise.all([
      readFile(resolve('site/index.html'), 'utf8'),
      readFile(resolve('site/demo/index.html'), 'utf8'),
      readFile(resolve('README.md'), 'utf8')
    ]);
    expect(landing).toContain('Preview sample pronunciation');
    expect(landing).toContain('Preview changes are not saved.');
    expect(landing).toContain('Opens an editable reader with sample code and spoken output.');
    expect(landing).toContain('<h3 id="observation-title">Spoken preview</h3>');
    expect(demo).toContain('<h2 id="observation-title">Spoken preview</h2>');
    expect(demo).toContain('Save sample pronunciation');
    expect(readme).toContain('It names symbols and indentation for developers who read better by ear.');
    expect(readme).not.toContain('It supports reading fatigue, dyslexia, low vision, and auditory coding workflows.');
    expect(landing).not.toContain('reviewed before use');
  });

  it('closes every third-round finding in the shipped product @regression:review-3-closure', async () => {
    const [landing, demo, readme, popup, popupMain, vscode] = await Promise.all([
      readFile(resolve('site/index.html'), 'utf8'),
      readFile(resolve('site/demo/index.html'), 'utf8'),
      readFile(resolve('README.md'), 'utf8'),
      readFile(resolve('entrypoints/popup/index.html'), 'utf8'),
      readFile(resolve('entrypoints/popup/main.ts'), 'utf8'),
      readFile(resolve('vscode-extension/extension.ts'), 'utf8')
    ]);
    expect(landing).toContain('current line and names its symbols and indentation.');
    expect(landing).toContain('<h3>Hear symbols and indentation</h3>');
    expect(landing).toContain('Export the map,\n                then import it in the other extension.');
    expect(landing).not.toContain('Fig. A');
    expect(landing).not.toContain('spoken structure');
    expect(demo).toContain('id="start-for-real" href="/#install-title"');
    expect(demo).toContain('<h1 id="demo-title">Try the code reader</h1>');
    expect(readme).toContain('## Use the code reader');
    expect(readme).toContain('versioned JSON pronunciation file');
    for (const source of [popup, vscode]) {
      expect(source).toContain('Export pronunciations');
      expect(source).toContain('Import pronunciation');
      expect(source).toContain('Apply imported pronunciations');
    }
    for (const source of [popupMain, vscode]) {
      expect(source).toContain('code-listen-cursor-pronunciations');
    }
    const routes = ['site/index.html', 'site/demo/index.html', 'site/privacy/index.html', 'site/terms/index.html', 'site/404.html'];
    for (const route of routes) {
      const html = await readFile(resolve(route), 'utf8');
      for (const link of ['/demo/', '/#how-it-works', '/privacy/', '/downloads/code-listen-cursor-chrome.zip']) {
        expect(html, `${route} missing shared header destination ${link}`).toContain(`href="${link}"`);
      }
      expect(html).toContain('Reads selected code and names its symbols and indentation.');
      expect(html).toContain('Source on GitHub');
    }
  });

  it('keeps every fourth-round wording and claim-ledger repair in source @regression:review-4-closure', async () => {
    const [landing, readme, claims, landingStyles, legalStyles] = await Promise.all([
      readFile(resolve('site/index.html'), 'utf8'),
      readFile(resolve('README.md'), 'utf8'),
      readFile(resolve('.factory/claims.json'), 'utf8'),
      readFile(resolve('site/style.css'), 'utf8'),
      readFile(resolve('site/legal.css'), 'utf8')
    ]);
    expect(landing).toContain('Listen to selected code, symbols, and indentation');
    expect(readme).toContain('Tests run both packaged extensions with separate local data.');
    expect(readme).toContain('Both extensions export and import the same versioned JSON pronunciation file.');
    expect(readme).not.toContain('Installed-package tests verify the browser and VS Code flows');
    expect(readme).not.toContain('Both settings surfaces export');
    expect(landingStyles).not.toMatch(/footer\s*>\s*\.product-line\s*\{\s*display:\s*none/i);
    expect(legalStyles).not.toMatch(/footer\s+\.product-line\s*\{\s*display:\s*none/i);
    const ledger = JSON.parse(claims) as { id: string; claim: string }[];
    expect(ledger.find((claim) => claim.id === 'demo-sandbox')?.claim).toContain('Start for real clears demo keys');
    expect(ledger.find((claim) => claim.id === 'landing-preview-ephemeral')?.claim)
      .toBe('Landing preview changes are not saved and disappear after reload.');
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
