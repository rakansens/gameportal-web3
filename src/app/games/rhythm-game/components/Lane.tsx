'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LaneProps {
  width: number;
  isPressed: boolean;
  keyBinding: string;
  children?: React.ReactNode;
}

const Lane: React.FC<LaneProps> = ({ width, isPressed, keyBinding, children }) => {
  return (
    <motion.div
      className="h-full relative"
      style={{ width: `${width}px` }}
      initial={false}
      animate={{
        backgroundColor: isPressed ? 'rgba(6, 182, 212, 0.3)' : 'rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* レーンの背景ライン */}
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 h-full">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-[1px] h-full left-1/2 transform -translate-x-1/2"
              style={{
                background: `linear-gradient(to bottom, transparent, ${
                  i % 2 === 0 ? 'rgba(6, 182, 212, 0.3)' : 'rgba(6, 182, 212, 0.1)'
                } 50%, transparent)`,
                animation: `moveUp ${2 + i * 0.1}s linear infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* レーンの境界線 */}
      <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />

      {/* 判定ライン */}
      <div className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center">
        {/* グロー効果 */}
        <motion.div
          className="absolute w-16 h-8 bg-cyan-400 rounded-full blur-xl"
          initial={false}
          animate={{
            opacity: isPressed ? 0.6 : 0.2,
          }}
        />
        {/* メインの判定ライン */}
        <motion.div
          className="absolute w-16 h-2 bg-cyan-400 rounded-full"
          initial={false}
          animate={{
            scale: isPressed ? [1, 1.2, 1] : 1,
            opacity: isPressed ? 1 : 0.8,
          }}
          transition={{
            duration: 0.1,
          }}
        />
      </div>

      {/* キーバインド表示 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-cyan-400 text-sm font-bold">
        {keyBinding.toUpperCase()}
      </div>

      {/* ノートを表示 */}
      {children}
    </motion.div>
  );
};

export default Lane;
