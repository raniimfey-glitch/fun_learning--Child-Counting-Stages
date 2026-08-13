export interface NumberItem {
  n: number;
  e: string;
  w: string;
  s: string;
  emoji: string;
  shBg: string;
  wBg: string;
  wc: string[];
  ng: string;
  accept?: string[];
}

export type CharacterType = 'girl' | 'boy' | null;
export type LevelType = 1 | 2 | 3 | 4;

export interface MistakeItem {
  num: NumberItem;
  said: string;
}

export type AudioEngineMode = 'auto' | 'gemini' | 'native';

export interface AudioSettings {
  engine: AudioEngineMode;
  rate: number; // Speech speed e.g. 0.85
  voiceGender: 'female' | 'male';
}
