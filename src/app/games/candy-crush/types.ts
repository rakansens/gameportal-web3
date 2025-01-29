export type CandyType = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

export interface Candy {
  id: string;
  type: CandyType;
  x: number;
  y: number;
  isMatched?: boolean;
}

export interface GameState {
  board: Candy[][];
  score: number;
  moves: number;
  maxMoves: number;
  level: number;
  isGameOver: boolean;
  selectedCandy: Candy | null;
  matchedCandies: Candy[];
}

export interface Position {
  x: number;
  y: number;
}
