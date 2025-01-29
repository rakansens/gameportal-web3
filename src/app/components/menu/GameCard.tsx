'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface GameCardProps {
  title: string;
  description: string;
  href: string;
  imageUrl: string;
  color: string;
}

const GameCard: React.FC<GameCardProps> = ({ title, description, href, imageUrl, color }) => {
  return (
    <Link href={href}>
      <motion.div
        className="relative group cursor-pointer rounded-xl overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className="w-full aspect-[4/3] bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
          style={{ backgroundColor: `${color}33` }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-sm opacity-90">{description}</p>
        </div>
      </motion.div>
    </Link>
  );
};

export default GameCard;
