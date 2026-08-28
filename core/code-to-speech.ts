import type { CodeLanguage, ListenSettings, PunctuationLevel } from './settings';

const ESSENTIAL: Record<string, string> = {
  '===': 'strictly equals', '!==': 'strictly not equals', '=>': 'arrow',
  '==': 'equals', '!=': 'not equals', '>=': 'greater than or equal to',
  '<=': 'less than or equal to', '&&': 'and', '||': 'or', '++': 'increment',
  '--': 'decrement', '?.': 'optional dot', '??': 'null fallback',
  '+=': 'plus gets', '-=': 'minus gets', '*=': 'times gets', '/=': 'divided by gets',
  '**': 'power', '::': 'path separator', '->': 'return arrow', '//': 'comment',
  '/*': 'comment start', '*/': 'comment end',
  '{': 'open brace', '}': 'close brace', '(': 'open paren', ')': 'close paren',
  '[': 'open bracket', ']': 'close bracket', '=': 'gets', '>': 'greater than',
  '<': 'less than', ':': 'colon', '.': 'dot', '!': 'not', '?': 'question',
  '+': 'plus', '-': 'minus', '*': 'star', '/': 'slash', '%': 'percent',
  '"': 'double quote', "'": 'single quote', '`': 'backtick'
};

const DETAILED: Record<string, string> = {
  ...ESSENTIAL, ',': 'comma', ';': 'semicolon', '&': 'ampersand', '|': 'pipe',
  '#': 'hash', '@': 'at', '\\': 'backslash', '_': 'underscore', '~': 'tilde',
  '^': 'caret'
};

const LITERAL: Record<string, string> = {
  ...DETAILED, '$': 'dollar', '…': 'ellipsis'
};

const LANGUAGE_SYMBOLS: Record<Exclude<CodeLanguage, 'auto' | 'other'>, Record<string, string>> = {
  javascript: { '=>': 'arrow function', '?.': 'optional dot', '??': 'null fallback', '//': 'comment', '/*': 'comment start', '*/': 'comment end', '$': 'dollar' },
  typescript: { '=>': 'arrow function', '?.': 'optional dot', '??': 'null fallback', '//': 'comment', '/*': 'comment start', '*/': 'comment end', '$': 'dollar' },
  python: { '#': 'comment', '**': 'power', '//': 'floor divided by', ':': 'colon' },
  rust: { '::': 'path separator', '->': 'returns', '=>': 'match arm', '&': 'reference' },
  shell: { '|': 'pipe', '&&': 'and then', '$': 'variable', '#': 'comment' }
};

function dictionary(level: PunctuationLevel, language: CodeLanguage): Record<string, string> {
  const base = level === 'essential' ? ESSENTIAL : level === 'detailed' ? DETAILED : LITERAL;
  return language === 'auto' || language === 'other' ? base : { ...base, ...LANGUAGE_SYMBOLS[language] };
}

function identifierSpeech(token: string, pronunciation: Record<string, string>): string {
  const custom = pronunciation[token] ?? pronunciation[token.toLowerCase()];
  if (custom) return custom;
  return token
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/_/g, ' ');
}

function speakLine(line: string, settings: ListenSettings): string {
  const leading = line.match(/^[\t ]*/)?.[0] ?? '';
  const spaces = [...leading].reduce((total, char) => total + (char === '\t' ? settings.indentSize : 1), 0);
  const level = Math.floor(spaces / settings.indentSize);
  const indent = settings.speakIndentation && spaces > 0
    ? `indent ${level || 1} ${level === 1 ? 'level' : 'levels'}`
    : '';
  const source = line.slice(leading.length).trimEnd();
  if (!source) return indent ? `${indent}, blank line` : 'blank line';

  const map = dictionary(settings.punctuation, settings.language);
  const symbols = Object.keys(map).sort((a, b) => b.length - a.length);
  const output: string[] = [];
  let index = 0;

  while (index < source.length) {
    const rest = source.slice(index);
    const identifier = rest.match(/^[A-Za-z_][\w$]*/)?.[0];
    if (identifier) {
      output.push(identifierSpeech(identifier, settings.pronunciation));
      index += identifier.length;
      continue;
    }
    const number = rest.match(/^\d+(?:\.\d+)?/)?.[0];
    if (number) {
      output.push(number);
      index += number.length;
      continue;
    }
    const symbol = symbols.find((candidate) => rest.startsWith(candidate));
    if (symbol) {
      output.push(map[symbol]!);
      index += symbol.length;
      continue;
    }
    if (/\s/.test(source[index] ?? '')) output.push(' ');
    index += 1;
  }

  const spoken = output.join(' ').replace(/\s+/g, ' ').trim();
  return [indent, spoken || 'symbols omitted'].filter(Boolean).join(', ');
}

export function codeToSpeech(code: string, settings: ListenSettings): string {
  const normalized = code.replace(/\r\n?/g, '\n');
  const lines = normalized.split('\n');
  return lines.map((line, index) => {
    const prefix = lines.length > 1 ? `line ${index + 1}, ` : '';
    return `${prefix}${speakLine(line, settings)}`;
  }).join('. ');
}

export function currentLine(value: string, cursor: number): string {
  const start = value.lastIndexOf('\n', Math.max(0, cursor - 1)) + 1;
  const endAt = value.indexOf('\n', cursor);
  return value.slice(start, endAt === -1 ? value.length : endAt);
}

export function detectLanguage(pathname: string, code = ''): Exclude<CodeLanguage, 'auto'> {
  const path = pathname.toLowerCase();
  if (/\.(tsx?|mts|cts)(?:$|[?#])/.test(path)) return 'typescript';
  if (/\.(jsx?|mjs|cjs)(?:$|[?#])/.test(path)) return 'javascript';
  if (/\.py(?:$|[?#])/.test(path)) return 'python';
  if (/\.rs(?:$|[?#])/.test(path)) return 'rust';
  if (/\.(?:sh|bash|zsh)(?:$|[?#])/.test(path)) return 'shell';
  if (/\b(?:const|let|function|interface)\b|=>/.test(code)) return 'javascript';
  if (/\bdef\s+\w+\(|\bimport\s+\w+|:\s*(?:#.*)?$/m.test(code)) return 'python';
  if (/\bfn\s+\w+\(|::|->/.test(code)) return 'rust';
  if (/^#!.*\b(?:ba|z)?sh\b/m.test(code)) return 'shell';
  return 'other';
}
