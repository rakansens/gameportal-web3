export interface Note {
  id: string;
  lane: number; // 0-3
  timing: number; // ミリ秒
  speed: number;
  hit: boolean;
  missed: boolean;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  difficulty: number;
  audioUrl: string;
  notes: Note[];
}

export type JudgementType = 'PERFECT' | 'GREAT' | 'GOOD' | 'MISS';

export interface Score {
  perfect: number;
  great: number;
  good: number;
  miss: number;
  combo: number;
  maxCombo: number;
  totalScore: number;
}
