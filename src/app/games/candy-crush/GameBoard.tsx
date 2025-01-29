'use client';

import React, { useEffect, useState } from 'react';
import useGameStore from './gameStore';
import Candy from './Candy';
import CandyParticle from './CandyParticle';

const GameBoard: React.FC = () => {
  const { board, selectedCandy, score, moves, maxMoves, initGame, selectCandy, matchedCandies } = useGameStore();
  const [particles, setParticles] = useState<Array<{ id: string; x: number; y: number; type: string }>>([]);

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (matchedCandies.length > 0) {
      const newParticles = matchedCandies.map(candy => ({
        id: `particle-${candy.id}`,
        x: candy.x,
        y: candy.y,
        type: candy.type
      }));
      setParticles(prev => [...prev, ...newParticles]);

      // Add sound effect here if needed
      // playMatchSound();
    }
  }, [matchedCandies]);

  const removeParticle = (particleId: string) => {
    setParticles(prev => prev.filter(p => p.id !== particleId));
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex justify-between w-full max-w-md px-4 bg-white/10 rounded-lg p-4">
        <div className="text-2xl font-bold text-white">スコア: {score}</div>
        <div className="text-2xl font-bold text-white">
          残り手数: {maxMoves - moves}
        </div>
      </div>
      
      <div
        className="relative bg-black/30 backdrop-blur-md rounded-lg p-4"
        style={{
          width: '28rem',
          height: '28rem',
        }}
      >
        {board.flat().map((candy) => (
          <Candy
            key={candy.id}
            candy={candy}
            isSelected={selectedCandy?.id === candy.id}
            isMatched={matchedCandies.some(m => m.id === candy.id)}
            onClick={() => selectCandy(candy)}
          />
        ))}
        {particles.map((particle) => (
          <CandyParticle
            key={particle.id}
            x={particle.x}
            y={particle.y}
            type={particle.type as any}
            onComplete={() => removeParticle(particle.id)}
          />
        ))}
      </div>

      <button
        onClick={() => initGame()}
        className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition-colors"
      >
        リスタート
      </button>
    </div>
  );
};

export default GameBoard;
