export interface LocalVoice {
  localService: boolean;
  lang: string;
}

/** Pick a local English voice first; callers may use their platform fallback. */
export function preferredLocalVoice<T extends LocalVoice>(voices: T[]): T | null {
  return voices.find((voice) => voice.localService && voice.lang.toLowerCase().startsWith('en'))
    ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('en'))
    ?? null;
}
