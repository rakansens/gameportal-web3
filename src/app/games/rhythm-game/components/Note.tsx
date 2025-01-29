'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Note as NoteType } from '../types';

interface NoteProps {
  note: NoteType;
  currentTime: number;
  laneWidth: number;
}

const LANE_HEIGHT = 600; // レーンの高さ（px）
const NOTE_SPEED = 0.3; // ノートの落下速度（px/ms）

const Note: React.FC<NoteProps> = ({ note, currentTime, laneWidth }) => {
  // ノートの位置を計算（上から下に落ちる）
  const y = (currentTime - (note.timing - 2000)) * NOTE_SPEED;

  // 画面外のノートは描画しない
  if (y < -50 || y > LANE_HEIGHT + 50 || note.hit || note.missed) {
    return null;
  }

  return (
    <motion.div
      className="absolute w-full"
      style={{
        top: 0,
        y,
      }}
    >
      <div
        className="absolute left-1/2 -translate-x-1/2 w-16 h-8 bg-gradient-to-b from-cyan-400 to-cyan-600 
                   rounded-lg shadow-lg border-2 border-cyan-300 flex items-center justify-center"
        style={{
          boxShadow: '0 0 15px rgba(34, 211, 238, 0.5)',
        }}
      >
        {/* 光るエフェクト */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent rounded-lg" />
        
        {/* 残像エフェクト */}
        <motion.div
          className="absolute inset-0 bg-cyan-400/30 rounded-lg"
          initial={{ opacity: 0, y: -5 }}
          animate={{ 
            opacity: [0, 0.5, 0],
            y: [-5, 0, 5]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* 内側の光 */}
        <div className="absolute inset-2 bg-cyan-300/20 rounded-md backdrop-blur-sm" />
      </div>
    </motion.div>
  );
};

export default Note;
