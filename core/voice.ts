export interface LocalVoice {
  localService: boolean;
  lang: string;
  voiceURI?: string;
}

/** Pick only a voice the platform marks local, honoring a saved local choice first. */
export function preferredLocalVoice<T extends LocalVoice>(voices: T[], preferredVoiceURI = ''): T | null {
  const localVoices = voices.filter((voice) => voice.localService === true);
  return localVoices.find((voice) => preferredVoiceURI !== '' && voice.voiceURI === preferredVoiceURI)
    ?? localVoices.find((voice) => voice.lang.toLowerCase().startsWith('en'))
    ?? localVoices[0]
    ?? null;
}
