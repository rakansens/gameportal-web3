'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Candy as CandyType } from './types';

interface CandyProps {
  candy: CandyType;
  isSelected: boolean;
  onClick: () => void;
}

const candyColors = {
  red: '#ff4444',
  blue: '#4444ff',
  green: '#44ff44',
  yellow: '#ffff44',
  purple: '#ff44ff',
  orange: '#ff8844',
};

const candyVariants = {
  initial: (candy: CandyType) => ({
    scale: candy.isNew ? 0 : 1,
    y: candy.isNew ? -50 : 0,
    rotate: candy.isNew ? -180 : 0,
    opacity: 1,
  }),
  animate: {
    scale: 1,
    y: 0,
    rotate: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 25,
      mass: 1,
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    rotate: 180,
    transition: {
      duration: 0.2,
    },
  },
  falling: {
    y: [0, 20, 0],
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  selected: {
    scale: 1.1,
    rotate: [0, -5, 5, -5, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

const Candy: React.FC<CandyProps> = ({ candy, isSelected, onClick }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${candy.id}-${candy.type}`}
        className="absolute w-12 h-12"
        style={{
          top: `${candy.y * 3.5}rem`,
          left: `${candy.x * 3.5}rem`,
        }}
        custom={candy}
        variants={candyVariants}
        initial="initial"
        animate={[
          'animate',
          isSelected && 'selected',
          candy.isFalling && 'falling',
        ].filter(Boolean)}
        exit="exit"
        onClick={onClick}
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95, rotate: -5 }}
      >
        <motion.div
          className="w-full h-full rounded-full shadow-lg cursor-pointer"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${candyColors[candy.type]}, ${candyColors[candy.type]}cc)`,
          }}
        >
          <motion.div
            className="w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Candy;
