'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import useGameStore from './store/gameStore';

const GameBoard = dynamic(() => import('./components/GameBoard'), {
  ssr: false,
});

// テスト用の譜面データ
const testSong = {
  id: 'test-song',
  title: 'RED DRAGON',
  artist: 'Test Artist',
  bpm: 120,
  difficulty: 3,
  audioUrl: '/audio/test-song.mp3',
  notes: Array.from({ length: 50 }, (_, i) => ({
    id: `note-${i}`,
    lane: Math.floor(Math.random() * 4),
    timing: 2000 + i * 500, // 2秒後から開始、500ms間隔
    speed: 300,
    hit: false,
    missed: false,
  })),
};

export default function RhythmGamePage() {
  const { setCurrentSong, startGame, resetGame } = useGameStore();

  useEffect(() => {
    setCurrentSong(testSong);
    startGame();
    return () => resetGame();
  }, [setCurrentSong, startGame, resetGame]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-cyan-400">リズムゲーム</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg text-cyan-400 transition-colors"
          >
            メニューに戻る
          </Link>
        </div>
        <GameBoard />
      </div>
    </main>
  );
}
