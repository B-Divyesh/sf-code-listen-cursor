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
  return {
    ...DEFAULT_SETTINGS,
    ...value,
    pronunciation: { ...DEFAULT_SETTINGS.pronunciation, ...(value?.pronunciation ?? {}) }
  };
}
