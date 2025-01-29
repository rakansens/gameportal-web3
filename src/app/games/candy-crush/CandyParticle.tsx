'use client';

import { motion } from 'framer-motion';
import { CandyType } from './types';

interface CandyParticleProps {
  x: number;
  y: number;
  type: CandyType;
  onComplete: () => void;
}

const candyColors = {
  red: '#ff4444',
  blue: '#4444ff',
  green: '#44ff44',
  yellow: '#ffff44',
  purple: '#ff44ff',
  orange: '#ff8844',
};

const CandyParticle: React.FC<CandyParticleProps> = ({ x, y, type, onComplete }) => {
  const particles = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i * Math.PI * 2) / 12;
    const radius = Math.random() * 50 + 30;
    const delay = Math.random() * 0.2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      scale: Math.random() * 0.5 + 0.5,
      rotation: Math.random() * 720 - 360,
      delay,
    };
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: `${y * 3.5}rem`,
        left: `${x * 3.5}rem`,
        width: '3rem',
        height: '3rem',
        pointerEvents: 'none',
      }}
    >
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '0.75rem',
            height: '0.75rem',
            borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, ${candyColors[type]}, ${candyColors[type]}88)`,
            boxShadow: `0 0 10px ${candyColors[type]}`,
            left: '50%',
            top: '50%',
            x: '-50%',
            y: '-50%',
          }}
          initial={{
            scale: 1,
            opacity: 1,
            x: '-50%',
            y: '-50%',
          }}
          animate={{
            scale: 0,
            opacity: 0,
            x: ['-50%', `calc(-50% + ${particle.x}px)`],
            y: ['-50%', `calc(-50% + ${particle.y}px)`],
            rotate: particle.rotation,
          }}
          transition={{
            duration: 0.6,
            ease: [0.32, 0, 0.67, 0],
            delay: particle.delay,
          }}
          onAnimationComplete={i === 0 ? onComplete : undefined}
        >
          <motion.div
            className="w-full h-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent)',
            }}
            animate={{
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
              delay: particle.delay,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default CandyParticle;
