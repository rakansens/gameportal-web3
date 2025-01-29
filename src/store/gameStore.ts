import { create } from 'zustand';

interface Note {
  id: number;
  lane: number;
  timing: number;
  hit?: boolean;
  missed?: boolean;
}

interface GameState {
  notes: Note[];
  score: number;
  combo: number;
  startGame: () => void;
  updateNotes: (deltaTime: number) => void;
  hitNote: (lane: number) => void;
}

// テスト用のノーツデータ
const TEST_NOTES: Note[] = [
  { id: 1, lane: 0, timing: 1000 },
  { id: 2, lane: 1, timing: 2000 },
  { id: 3, lane: 2, timing: 3000 },
  { id: 4, lane: 3, timing: 4000 },
  { id: 5, lane: 0, timing: 5000 },
];

export const useGameStore = create<GameState>((set) => ({
  notes: [],
  score: 0,
  combo: 0,

  startGame: () => {
    set({ notes: [...TEST_NOTES] });
  },

  updateNotes: (deltaTime: number) => {
    set((state) => {
      const updatedNotes = state.notes.map((note) => ({
        ...note,
        timing: note.timing - deltaTime,
      }));

      // ミスしたノーツを処理
      const processedNotes = updatedNotes.map((note) => {
        if (note.timing < -500 && !note.hit && !note.missed) {
          return { ...note, missed: true };
        }
        return note;
      });

      return { notes: processedNotes };
    });
  },

  hitNote: (lane: number) => {
    set((state) => {
      const noteIndex = state.notes.findIndex(
        (note) => note.lane === lane && !note.hit && !note.missed
      );

      if (noteIndex === -1) return state;

      const updatedNotes = [...state.notes];
      updatedNotes[noteIndex] = { ...updatedNotes[noteIndex], hit: true };

      return {
        notes: updatedNotes,
        score: state.score + 100,
        combo: state.combo + 1,
      };
    });
  },
}));
