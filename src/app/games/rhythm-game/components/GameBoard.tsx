'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';
import { useSoundEffects } from '../hooks/useSoundEffects';
import Lane from './Lane';
import Note from './Note';

const KEY_BINDINGS = ['d', 'f', 'j', 'k'];
const LANE_WIDTH = 100; // レーンの幅を調整

const judgementColors = {
  PERFECT: '#00ffcc',
  GREAT: '#00ff00',
  GOOD: '#ffff00',
  MISS: '#ff0000',
};

const GameBoard: React.FC = () => {
  const { notes, isPlaying, startTime, hitNote, lastJudgement, score, startGame, updateNotes } = useGameStore();
  const [currentTime, setCurrentTime] = useState(0);
  const [pressedKeys, setPressedKeys] = useState<{ [key: string]: boolean }>({});
  const { playJudgementSound, playHitSound } = useSoundEffects();

  // デバッグ用：ノーツの状態を監視
  useEffect(() => {
    console.log('Current notes:', notes);
    console.log('Is playing:', isPlaying);
    console.log('Current time:', currentTime);
    console.log('Start time:', startTime);
  }, [notes, isPlaying, currentTime, startTime]);

  useEffect(() => {
    startGame();
  }, [startGame]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const laneIndex = KEY_BINDINGS.indexOf(key);

      if (laneIndex !== -1 && !pressedKeys[key]) {
        setPressedKeys(prev => ({ ...prev, [key]: true }));
        hitNote(laneIndex, Date.now());
        playHitSound();
      }
    },
    [hitNote, pressedKeys, playHitSound]
  );

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (KEY_BINDINGS.includes(key)) {
      setPressedKeys(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  useEffect(() => {
    if (lastJudgement.type) {
      playJudgementSound(lastJudgement.type);
    }
  }, [lastJudgement.type, playJudgementSound]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (!isPlaying) return;

    const updateTime = () => {
      const newTime = Date.now() - startTime;
      setCurrentTime(newTime);
      updateNotes(newTime);
      requestAnimationFrame(updateTime);
    };

    const animationFrame = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, startTime, updateNotes]);

  return (
    <div className="relative w-full max-w-2xl mx-auto h-[600px] bg-gray-900/80 rounded-lg overflow-hidden perspective-1000 shadow-2xl">
      {/* レーン */}
      <div className="absolute inset-0 flex justify-center gap-1">
        {KEY_BINDINGS.map((key, index) => (
          <Lane
            key={index}
            width={LANE_WIDTH}
            isPressed={pressedKeys[key]}
            keyBinding={key}
          >
            {notes
              .filter(note => note.lane === index)
              .map(note => (
                <Note
                  key={note.id}
                  note={note}
                  currentTime={currentTime}
                  laneWidth={LANE_WIDTH}
                />
              ))}
          </Lane>
        ))}
      </div>

      {/* 判定表示 */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10">
        <AnimatePresence mode="wait">
          {lastJudgement.type && (
            <motion.div
              key={`${lastJudgement.type}-${lastJudgement.combo}`}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -20 }}
              className="flex flex-col items-center"
            >
              <div
                className="text-4xl font-bold"
                style={{ color: judgementColors[lastJudgement.type] }}
              >
                {lastJudgement.type}
              </div>
              {lastJudgement.combo > 1 && (
                <div className="text-2xl text-white">
                  {lastJudgement.combo} Combo!
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* スコア表示 */}
      <div className="absolute top-4 right-4 text-right">
        <div className="text-3xl font-bold text-white">
          {Math.floor(score.totalScore).toLocaleString()}
        </div>
        <div className="text-sm text-gray-300">
          Max Combo: {score.maxCombo}
        </div>
      </div>

      {/* デバッグ情報 */}
      <div className="absolute top-4 left-4 text-left text-xs text-white/50">
        <div>Notes: {notes.length}</div>
        <div>Current Time: {currentTime}</div>
        <div>Is Playing: {isPlaying ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
};

export default GameBoard;
