import dynamic from 'next/dynamic';

// Three.jsコンポーネントをNoSSRで読み込む
const Game3D = dynamic(() => import('../../../components/games/rhythm-game-3d/Game3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="text-cyan-400 text-2xl">Loading 3D Game...</div>
    </div>
  ),
});

const RhythmGame3DPage = () => {
  return <Game3D />;
};

export default RhythmGame3DPage;
