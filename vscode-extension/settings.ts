import { mergeSettings, type CodeLanguage, type ListenSettings } from '../core/settings';

const LANGUAGES: readonly CodeLanguage[] = ['auto', 'javascript', 'typescript', 'python', 'rust', 'shell', 'other'];
const PUNCTUATION = ['essential', 'detailed', 'literal'] as const;

function stringRecord(value: unknown): Record<string, string> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter((entry): entry is [string, string] => typeof entry[1] === 'string');
  return Object.fromEntries(entries);
}

/** Make VS Code's persisted local state safe to pass to the shared reader. */
export function storedSettings(value: unknown): ListenSettings {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return mergeSettings();
  const raw = value as Record<string, unknown>;
  const partial: Partial<ListenSettings> = {};
  if (PUNCTUATION.includes(raw.punctuation as typeof PUNCTUATION[number])) partial.punctuation = raw.punctuation as ListenSettings['punctuation'];
  if (LANGUAGES.includes(raw.language as CodeLanguage)) partial.language = raw.language as CodeLanguage;
  if (typeof raw.speakIndentation === 'boolean') partial.speakIndentation = raw.speakIndentation;
  if (raw.indentSize === 2 || raw.indentSize === 4) partial.indentSize = raw.indentSize;
  if (typeof raw.rate === 'number' && raw.rate >= 0.5 && raw.rate <= 1.5) partial.rate = raw.rate;
  if (typeof raw.pitch === 'number' && raw.pitch >= 0 && raw.pitch <= 2) partial.pitch = raw.pitch;
  if (typeof raw.voiceURI === 'string') partial.voiceURI = raw.voiceURI;
  const pronunciation = stringRecord(raw.pronunciation);
  if (pronunciation) partial.pronunciation = pronunciation;
  return mergeSettings(partial);
}

/** VS Code language ids map to the same language-aware punctuation rules as the browser reader. */
export function languageForEditor(languageId: string): Exclude<CodeLanguage, 'auto'> {
  const id = languageId.toLowerCase();
  if (id === 'javascript' || id === 'javascriptreact') return 'javascript';
  if (id === 'typescript' || id === 'typescriptreact') return 'typescript';
  if (id === 'python') return 'python';
  if (id === 'rust') return 'rust';
  if (id === 'shellscript' || id === 'shell' || id === 'bash' || id === 'zsh') return 'shell';
  return 'other';
}

export function readingSettings(value: unknown, languageId: string): ListenSettings {
  const settings = storedSettings(value);
  return settings.language === 'auto' ? { ...settings, language: languageForEditor(languageId) } : settings;
}
