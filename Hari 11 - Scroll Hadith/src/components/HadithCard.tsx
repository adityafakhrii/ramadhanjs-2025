import React from 'react';
import { motion } from 'framer-motion';
import type { Hadith } from '../types';

interface HadithCardProps {
  hadith: Hadith;
  index: number;
}

export const HadithCard: React.FC<HadithCardProps> = ({ hadith, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="w-full p-6 rounded-2xl backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 shadow-lg border border-white/20 dark:border-gray-700/20"
    >
      <div className="mb-4 text-right">
        <p className="text-2xl leading-relaxed font-arabic text-gray-800 dark:text-gray-200">
          {hadith.arab}
        </p>
      </div>
      <div className="space-y-2">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {hadith.id}
        </p>
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Perawi:</span> {hadith.narrator}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">No:</span> {hadith.number}
          </p>
        </div>
      </div>
    </motion.div>
  );
};