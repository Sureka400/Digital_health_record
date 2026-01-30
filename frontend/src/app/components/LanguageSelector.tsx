import React from 'react';
import { motion } from 'motion/react';

interface LanguageSelectorProps {
  onSelect: (language: string) => void;
}

export function LanguageSelector({ onSelect }: LanguageSelectorProps) {
  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {languages.map((lang) => (
        <motion.button
          key={lang.code}
          onClick={() => onSelect(lang.code)}
          className="p-4 bg-zinc-800/50 border-2 border-zinc-700 rounded-xl hover:border-primary hover:bg-[#0b6e4f]/20 transition-all duration-200 active:scale-95"
        >
          <div className="text-2xl mb-1">{lang.native}</div>
          <div className="text-sm text-gray-400">{lang.name}</div>
        </motion.button>
      ))}
    </div>
  );
}