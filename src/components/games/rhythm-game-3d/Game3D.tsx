'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import dynamic from 'next/dynamic';

// コンポーネントを動的にインポート
const Highway = dynamic(() => import('./Highway'), { ssr: false });
const Notes = dynamic(() => import('./Notes'), { ssr: false });

import { useGameStore } from '../../../store/gameStore';

const Game3D: React.FC = () => {
  const { startGame } = useGameStore();

  useEffect(() => {
    startGame();
  }, [startGame]);

  return (
    <div className="fixed inset-0 w-full h-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          stencil: false,
          depth: true,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* カメラ設定 */}
        <PerspectiveCamera
          makeDefault
          position={[0, 5, 10]}
          fov={75}
        />
        
        {/* 環境光 */}
        <ambientLight intensity={0.3} />
        
        {/* メインライト */}
        <directionalLight
          position={[0, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* 背景色 */}
        <color attach="background" args={['#000']} />

        {/* ハイウェイ（レーン） */}
        <Highway />

        {/* ノーツ */}
        <Notes />

        {/* デバッグ用カメラコントロール */}
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Game3D;
