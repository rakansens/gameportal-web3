'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const GameBoard = dynamic(() => import('./GameBoard'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[28rem]">
      <div className="text-white text-xl">Loading...</div>
    </div>
  ),
});

export default function CandyCrushPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-500 to-purple-600 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">キャンディクラッシュ</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
          >
            メニューに戻る
          </Link>
        </div>
        <GameBoard />
      </div>
    </main>
  );
}
