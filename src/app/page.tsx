'use client';

import Link from 'next/link';

const games = [
  {
    title: 'キャンディクラッシュ',
    description: '3つ以上同じ色のキャンディを揃えて消していくパズルゲーム',
    href: '/games/candy-crush',
    imageUrl: '/images/candy-crush.png',
    tags: ['Puzzle', 'Casual', 'Match3'],
  },
  {
    title: 'リズムゲーム',
    description: '音楽に合わせてキーを押すリズムゲーム。D/F/J/Kキーで操作',
    href: '/games/rhythm-game',
    imageUrl: '/images/rhythm-game.png',
    tags: ['Music', 'Action', 'Rhythm'],
  },
  {
    title: '3Dリズムゲーム',
    description: '3D空間で音楽に合わせてキーを押すリズムゲーム。D/F/J/Kキーで操作',
    href: '/games/rhythm-game-3d',
    imageUrl: '/images/rhythm-game.jpg',
    tags: ['3D', 'Music', 'Action'],
  },
  {
    title: 'テトリス',
    description: 'クラシックなテトリスゲーム。矢印キーで操作',
    href: '/games/tetris',
    imageUrl: '/images/tetris.png',
    tags: ['Puzzle', 'Classic', 'Action'],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          ゲームポータル
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link
              key={game.href}
              href={game.href}
              className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-700">
                {game.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={game.imageUrl}
                    alt={game.title}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {game.title}
                </h2>
                <p className="text-gray-400 mb-4">{game.description}</p>
                <div className="flex flex-wrap gap-2">
                  {game.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm bg-gray-700 text-cyan-400 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gray-900 opacity-0 group-hover:opacity-50 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
