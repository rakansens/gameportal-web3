'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';

const HIGHWAY_WIDTH = 4;
const HIGHWAY_LENGTH = 100;
const LANE_COUNT = 4;
const LANE_WIDTH = HIGHWAY_WIDTH / LANE_COUNT;

const Highway: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.1, -HIGHWAY_LENGTH / 2]}
      receiveShadow
    >
      <planeGeometry args={[HIGHWAY_WIDTH, HIGHWAY_LENGTH]} />
      <meshStandardMaterial
        color="#333"
        metalness={0.8}
        roughness={0.4}
      />

      {/* レーン区切り線 */}
      {Array.from({ length: LANE_COUNT + 1 }).map((_, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                -HIGHWAY_WIDTH / 2 + i * LANE_WIDTH,
                0,
                0,
                -HIGHWAY_WIDTH / 2 + i * LANE_WIDTH,
                HIGHWAY_LENGTH,
                0,
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#666" linewidth={2} />
        </line>
      ))}
    </mesh>
  );
};

export default Highway;
