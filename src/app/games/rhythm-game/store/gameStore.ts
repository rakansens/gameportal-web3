import { create } from 'zustand';
import { Note, Score, JudgementType, Song } from '../types';

interface GameState {
  currentSong: Song | null;
  isPlaying: boolean;
  startTime: number;
  notes: Note[];
  score: Score;
  judgementWindow: {
    perfect: number;
    great: number;
    good: number;
  };
  lastJudgement: {
    type: JudgementType | null;
    combo: number;
  };
  setCurrentSong: (song: Song) => void;
  startGame: () => void;
  pauseGame: () => void;
  hitNote: (lane: number, time: number) => void;
  resetGame: () => void;
  updateNotes: (currentTime: number) => void;
}

const INITIAL_SCORE: Score = {
  perfect: 0,
  great: 0,
  good: 0,
  miss: 0,
  combo: 0,
  maxCombo: 0,
  totalScore: 0,
};

// テスト用のノーツを生成
const generateTestNotes = (startDelay: number = 2000): Note[] => {
  const notes: Note[] = [];
  const totalNotes = 50; // 合計ノート数
  const baseInterval = 500; // 基本の間隔（ミリ秒）

  for (let i = 0; i < totalNotes; i++) {
    const lane = Math.floor(Math.random() * 4); // 0-3のレーン
    const timing = startDelay + (i * baseInterval); // 開始遅延 + 一定間隔

    notes.push({
      id: i.toString(),
      lane,
      timing,
      hit: false,
      missed: false,
    });
  }

  return notes;
};

const useGameStore = create<GameState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  startTime: 0,
  notes: [],
  score: { ...INITIAL_SCORE },
  judgementWindow: {
    perfect: 50,  // ±50ms
    great: 100,   // ±100ms
    good: 150,    // ±150ms
  },
  lastJudgement: {
    type: null,
    combo: 0,
  },

  setCurrentSong: (song: Song) => {
    const notes = generateTestNotes();
    set({ currentSong: song, notes });
  },

  startGame: () => {
    const startDelay = 2000; // 2秒後から開始
    const notes = generateTestNotes(startDelay);
    const startTime = Date.now();
    
    set({
      isPlaying: true,
      startTime,
      notes,
      score: { ...INITIAL_SCORE },
    });

    console.log('Game started:', {
      startTime,
      notesCount: notes.length,
      firstNote: notes[0],
    });
  },

  pauseGame: () => {
    set({ isPlaying: false });
  },

  hitNote: (lane: number, time: number) => {
    const { notes, judgementWindow, score } = get();
    const currentTime = time - get().startTime;

    // レーンの最も近いノートを探す（まだヒットしていないもののみ）
    const targetNote = notes
      .filter(note => !note.hit && !note.missed && note.lane === lane)
      .sort((a, b) => Math.abs(a.timing - currentTime) - Math.abs(b.timing - currentTime))[0];

    if (!targetNote) return;

    const timeDiff = Math.abs(targetNote.timing - currentTime);
    let judgement: JudgementType = 'MISS';
    let points = 0;

    if (timeDiff <= judgementWindow.perfect) {
      judgement = 'PERFECT';
      points = 1000;
    } else if (timeDiff <= judgementWindow.great) {
      judgement = 'GREAT';
      points = 800;
    } else if (timeDiff <= judgementWindow.good) {
      judgement = 'GOOD';
      points = 500;
    } else if (timeDiff > 200) { // 判定範囲外の場合は無視
      return;
    }

    const newCombo = judgement === 'MISS' ? 0 : score.combo + 1;
    const newMaxCombo = Math.max(score.maxCombo, newCombo);

    set(state => ({
      notes: state.notes.map(note =>
        note.id === targetNote.id ? { ...note, hit: true } : note
      ),
      score: {
        ...state.score,
        [judgement.toLowerCase()]: state.score[judgement.toLowerCase()] + 1,
        combo: newCombo,
        maxCombo: newMaxCombo,
        totalScore: state.score.totalScore + points * (1 + newCombo * 0.01),
      },
      lastJudgement: {
        type: judgement,
        combo: newCombo,
      },
    }));
  },

  updateNotes: (currentTime: number) => {
    const { notes, score } = get();
    const missedNotes = notes.filter(
      note => !note.hit && !note.missed && note.timing < currentTime - 200
    );

    if (missedNotes.length > 0) {
      set(state => ({
        notes: state.notes.map(note =>
          missedNotes.includes(note) ? { ...note, missed: true } : note
        ),
        score: {
          ...state.score,
          miss: state.score.miss + missedNotes.length,
          combo: 0,
        },
        lastJudgement: {
          type: 'MISS',
          combo: 0,
        },
      }));
    }
  },

  resetGame: () => {
    set({
      isPlaying: false,
      startTime: 0,
      notes: [],
      score: { ...INITIAL_SCORE },
      lastJudgement: {
        type: null,
        combo: 0,
      },
    });
  },
}));

export default useGameStore;
