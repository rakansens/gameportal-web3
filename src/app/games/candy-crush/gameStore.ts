'use client';

import { create } from 'zustand';
import { GameState, Candy, CandyType, Position } from '../types/game';

const BOARD_SIZE = 8;
const CANDY_TYPES: CandyType[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const ANIMATION_DURATION = 300;

const createInitialBoard = (): Candy[][] => {
  const board: Candy[][] = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    board[y] = [];
    for (let x = 0; x < BOARD_SIZE; x++) {
      board[y][x] = {
        id: `${x}-${y}`,
        type: CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)],
        x,
        y,
        isNew: false,
        isFalling: false,
      };
    }
  }
  return board;
};

const useGameStore = create<GameState & {
  initGame: () => void;
  selectCandy: (candy: Candy) => void;
  swapCandies: (pos1: Position, pos2: Position) => Promise<void>;
  checkMatches: () => Promise<boolean>;
  removeMatches: () => Promise<void>;
  fillBoard: () => Promise<void>;
}>((set, get) => ({
  board: createInitialBoard(),
  score: 0,
  moves: 0,
  maxMoves: 20,
  level: 1,
  isGameOver: false,
  selectedCandy: null,
  matchedCandies: [],
  isAnimating: false,

  initGame: () => {
    set({
      board: createInitialBoard(),
      score: 0,
      moves: 0,
      maxMoves: 20,
      level: 1,
      isGameOver: false,
      selectedCandy: null,
      matchedCandies: [],
      isAnimating: false,
    });
  },

  selectCandy: (candy: Candy) => {
    const { selectedCandy, isAnimating } = get();
    if (isAnimating) return;

    if (!selectedCandy) {
      set({ selectedCandy: candy });
    } else {
      const isAdjacent = Math.abs(candy.x - selectedCandy.x) + Math.abs(candy.y - selectedCandy.y) === 1;
      if (isAdjacent) {
        get().swapCandies(
          { x: selectedCandy.x, y: selectedCandy.y },
          { x: candy.x, y: candy.y }
        );
      }
      set({ selectedCandy: null });
    }
  },

  swapCandies: async (pos1: Position, pos2: Position) => {
    const { board } = get();
    set({ isAnimating: true });

    const newBoard = [...board];
    const temp = { ...newBoard[pos1.y][pos1.x] };
    
    // アニメーション用の位置情報を更新
    newBoard[pos1.y][pos1.x] = { 
      ...newBoard[pos2.y][pos2.x],
      x: pos1.x,
      y: pos1.y,
    };
    newBoard[pos2.y][pos2.x] = {
      ...temp,
      x: pos2.x,
      y: pos2.y,
    };
    
    set({ board: newBoard });

    // スワップアニメーションの待機
    await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATION));

    const hasMatches = await get().checkMatches();
    if (!hasMatches) {
      // マッチがない場合は元に戻す
      newBoard[pos1.y][pos1.x] = temp;
      newBoard[pos2.y][pos2.x] = { ...newBoard[pos2.y][pos2.x], x: pos2.x, y: pos2.y };
      set({ board: newBoard });
      await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATION));
    } else {
      set(state => ({ moves: state.moves + 1 }));
    }

    set({ isAnimating: false });
  },

  checkMatches: async () => {
    const { board } = get();
    const matches: Candy[] = [];

    // 横方向のマッチをチェック
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE - 2; x++) {
        const candy1 = board[y][x];
        const candy2 = board[y][x + 1];
        const candy3 = board[y][x + 2];
        
        if (candy1.type === candy2.type && candy2.type === candy3.type) {
          matches.push(candy1, candy2, candy3);
        }
      }
    }

    // 縦方向のマッチをチェック
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE - 2; y++) {
        const candy1 = board[y][x];
        const candy2 = board[y + 1][x];
        const candy3 = board[y + 2][x];
        
        if (candy1.type === candy2.type && candy2.type === candy3.type) {
          matches.push(candy1, candy2, candy3);
        }
      }
    }

    if (matches.length > 0) {
      set({ matchedCandies: [...new Set(matches)] });
      await get().removeMatches();
      return true;
    }

    return false;
  },

  removeMatches: async () => {
    const { board, matchedCandies, score } = get();
    const newBoard = [...board];

    // マッチしたキャンディを消去アニメーション用にマーク
    matchedCandies.forEach(candy => {
      newBoard[candy.y][candy.x] = {
        ...candy,
        isMatched: true,
      };
    });

    set({ board: newBoard });
    await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATION));

    // 新しいキャンディを生成
    matchedCandies.forEach(candy => {
      for (let y = candy.y; y > 0; y--) {
        newBoard[y][candy.x] = {
          ...newBoard[y - 1][candy.x],
          y,
          isFalling: true,
        };
      }
      newBoard[0][candy.x] = {
        id: `new-${candy.x}-0-${Date.now()}`,
        type: CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)],
        x: candy.x,
        y: 0,
        isNew: true,
        isFalling: true,
      };
    });

    set({
      board: newBoard,
      score: score + matchedCandies.length * 10,
      matchedCandies: [],
    });

    await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATION));

    // 落下アニメーション完了後、状態をリセット
    matchedCandies.forEach(candy => {
      for (let y = 0; y <= candy.y; y++) {
        newBoard[y][candy.x] = {
          ...newBoard[y][candy.x],
          isNew: false,
          isFalling: false,
        };
      }
    });

    set({ board: newBoard });
    await get().fillBoard();
  },

  fillBoard: async () => {
    await get().checkMatches();
  },
}));

export default useGameStore;
