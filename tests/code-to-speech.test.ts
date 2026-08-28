import { describe, expect, it } from 'vitest';
import { codeToSpeech, currentLine, detectLanguage } from '../core/code-to-speech';
import { mergeSettings } from '../core/settings';

describe('codeToSpeech', () => {
  it('speaks structure and indentation', () => {
    const result = codeToSpeech('  if (ready) {\n    runTask();\n  }', mergeSettings());
    expect(result).toContain('line 1, indent 1 level, if open paren ready close paren open brace');
    expect(result).toContain('line 2, indent 2 levels, run Task open paren close paren');
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
