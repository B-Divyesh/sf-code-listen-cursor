import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { codeToSpeech, currentLine, detectLanguage } from '../core/code-to-speech';
import { mergeSettings } from '../core/settings';
import { preferredLocalVoice } from '../core/voice';
import { languageForEditor, readingSettings, storedSettings } from '../vscode-extension/settings';

describe('codeToSpeech', () => {
  it('speaks braces, operators, indentation, camel case, and snake case explicitly', () => {
    const result = codeToSpeech('  if (user_name !== runTask) {\n    runTask();\n  }', mergeSettings());
    expect(result).toContain('line 1, indent 1 level, if open paren user name strictly not equals run Task close paren open brace');
    expect(result).toContain('line 2, indent 2 levels, run Task open paren close paren');
    expect(result).toContain('line 3, indent 1 level, close brace');
  });

  it('uses a personal pronunciation map', () => {
    const result = codeToSpeech('const kubectl = async () => argv;', mergeSettings({
      punctuation: 'detailed',
      pronunciation: { kubectl: 'cube control' }
    }));
    expect(result).toContain('cube control');
    expect(result).toContain('a sink');
    expect(result).toContain('arg vee');
  });

  it('distinguishes common operators', () => {
    expect(codeToSpeech('a !== b && c >= 3', mergeSettings())).toBe(
      'a strictly not equals b and c greater than or equal to 3'
    );
  });

  it('uses language-specific punctuation', () => {
    expect(codeToSpeech('value // 2', mergeSettings({ language: 'python' }))).toContain('floor divided by');
    expect(codeToSpeech('Result<T> -> bool', mergeSettings({ language: 'rust' }))).toContain('returns');
    expect(detectLanguage('/src/parser.ts')).toBe('typescript');
  });
});

describe('currentLine', () => {
  it('returns the line at a cursor boundary', () => {
    expect(currentLine('one\ntwo\nthree', 6)).toBe('two');
  });
});

describe('voice selection', () => {
  it('@claim:local-voice prefers an English voice marked local', () => {
    const local = { localService: true, lang: 'en-GB', id: 'local' };
    const selected = preferredLocalVoice([{ localService: false, lang: 'en-US', id: 'network' }, local]);
    expect(selected).toBe(local);
  });
});

describe('VS Code reading settings', () => {
  it('@regression:vscode-settings keeps pronunciation and reading controls in local extension state', () => {
    const settings = readingSettings({
      punctuation: 'literal',
      speakIndentation: false,
      indentSize: 4,
      rate: 1.2,
      pitch: 1.1,
      voiceURI: 'local-voice',
      pronunciation: { kubectl: 'cube control' }
    }, 'typescriptreact');
    expect(settings).toMatchObject({
      punctuation: 'literal', language: 'typescript', speakIndentation: false,
      indentSize: 4, rate: 1.2, pitch: 1.1, voiceURI: 'local-voice',
      pronunciation: expect.objectContaining({ kubectl: 'cube control' })
    });
    expect(languageForEditor('shellscript')).toBe('shell');
    expect(storedSettings({ rate: 99 }).rate).toBe(0.9);
  });
});

describe('shipped structural-cue fixtures', () => {
  it('@claim:structure-aware-speech produces every expected spoken symbol and indentation cue', () => {
    const fixtures = JSON.parse(readFileSync(resolve('tests/fixtures/structural-cues.json'), 'utf8')) as {
      id: number;
      language: 'javascript' | 'typescript' | 'python' | 'rust' | 'shell';
      code: string;
      pronunciation?: Record<string, string>;
      cues: string[];
    }[];
    expect(fixtures).toHaveLength(20);
    expect(new Set(fixtures.map(({ id }) => id)).size).toBe(20);
    for (const fixture of fixtures) {
      const spoken = codeToSpeech(fixture.code, mergeSettings({
        language: fixture.language,
        punctuation: 'detailed',
        pronunciation: fixture.pronunciation ?? {}
      }));
      for (const cue of fixture.cues) expect(spoken, `snippet ${fixture.id}`).toContain(cue);
    }
  });
});
