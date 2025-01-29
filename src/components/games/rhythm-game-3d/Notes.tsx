'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../../store/gameStore';
import * as THREE from 'three';

const HIGHWAY_WIDTH = 4;
const LANE_COUNT = 4;
const LANE_WIDTH = HIGHWAY_WIDTH / LANE_COUNT;
const NOTE_SPEED = 20; // 1秒あたりの移動距離

interface NoteProps {
  position: [number, number, number];
  hit?: boolean;
}

const Note: React.FC<NoteProps> = ({ position, hit }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <boxGeometry args={[LANE_WIDTH * 0.8, 0.2, 0.5]} />
      <meshStandardMaterial
        color={hit ? "#ff0000" : "#00ffff"}
        emissive={hit ? "#ff0000" : "#00ffff"}
        emissiveIntensity={0.5}
        transparent
        opacity={hit ? 0.5 : 0.8}
      />
    </mesh>
  );
};

const Notes: React.FC = () => {
  const { notes, updateNotes } = useGameStore();
  const groupRef = useRef<THREE.Group>(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    lastTimeRef.current = Date.now();
  }, []);

  useFrame(() => {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTimeRef.current;
    updateNotes(deltaTime);
    lastTimeRef.current = currentTime;
  });

  return (
    <group ref={groupRef}>
      {notes.map((note) => {
        const x = -HIGHWAY_WIDTH / 2 + LANE_WIDTH / 2 + note.lane * LANE_WIDTH;
        const z = -(note.timing / 1000) * NOTE_SPEED;

        return (
          <Note
            key={note.id}
            position={[x, 0, z]}
            hit={note.hit || note.missed}
          />
        );
      })}
    </group>
  );
};

export default Notes;
