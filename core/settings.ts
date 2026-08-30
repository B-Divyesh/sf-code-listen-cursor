export type PunctuationLevel = 'essential' | 'detailed' | 'literal';
export type CodeLanguage = 'auto' | 'javascript' | 'typescript' | 'python' | 'rust' | 'shell' | 'other';

export interface ListenSettings {
  punctuation: PunctuationLevel;
  language: CodeLanguage;
  speakIndentation: boolean;
  indentSize: 2 | 4;
  rate: number;
  pitch: number;
  voiceURI: string;
  pronunciation: Record<string, string>;
}

/**
 * A deliberately small, portable file format shared by the browser and VS Code
 * packages. It contains pronunciation pairs only: never page text or code.
 */
export interface PronunciationExport {
  format: 'code-listen-cursor-pronunciations';
  version: 1;
  pronunciations: Record<string, string>;
}

export const DEFAULT_SETTINGS: ListenSettings = {
  punctuation: 'essential',
  language: 'auto',
  speakIndentation: true,
  indentSize: 2,
  rate: 0.9,
  pitch: 1,
  voiceURI: '',
  pronunciation: {
    async: 'a sink',
    argv: 'arg vee',
    href: 'H ref'
  }
};

export function mergeSettings(value?: Partial<ListenSettings> | null): ListenSettings {
  const hasSavedPronunciation = value !== null && value !== undefined
    && Object.prototype.hasOwnProperty.call(value, 'pronunciation');
  return {
    ...DEFAULT_SETTINGS,
    ...value,
    // An explicitly saved map is complete. This lets Remove and imported-map
    // replacement persist without silently restoring seed entries on reload.
    pronunciation: hasSavedPronunciation
      ? { ...(value?.pronunciation ?? {}) }
      : { ...DEFAULT_SETTINGS.pronunciation }
  };
}

export function pronunciationExport(pronunciations: Record<string, string>): PronunciationExport {
  return {
    format: 'code-listen-cursor-pronunciations',
    version: 1,
    pronunciations: Object.fromEntries(
      Object.entries(pronunciations)
        .filter(([written, spoken]) => written.trim().length > 0 && spoken.trim().length > 0)
        .sort(([left], [right]) => left.localeCompare(right))
    )
  };
}

export function parsePronunciationExport(value: unknown): Record<string, string> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (record.format !== 'code-listen-cursor-pronunciations' || record.version !== 1) return null;
  if (!record.pronunciations || typeof record.pronunciations !== 'object' || Array.isArray(record.pronunciations)) return null;

  const pairs = Object.entries(record.pronunciations as Record<string, unknown>);
  if (pairs.some(([written, spoken]) => !written.trim() || typeof spoken !== 'string' || !spoken.trim())) return null;
  return Object.fromEntries(pairs as [string, string][]);
}
