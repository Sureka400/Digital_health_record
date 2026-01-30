import React from 'react';
import { motion } from 'motion/react';
import { Globe, Heart } from 'lucide-react';
import { LanguageSelector } from '@/app/components/LanguageSelector';

interface LanguageSelectionScreenProps {
  onLanguageSelect: (language: string) => void;
}

export function LanguageSelectionScreen({ onLanguageSelect }: LanguageSelectionScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 flex items-center justify-center p-4">
      <motion.div
        className="max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#0b6e4f] to-[#2196F3] rounded-2xl mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Kerala Health Portal
          </h1>
          <p className="text-lg text-gray-300 mb-1">
            Digital Health Records for Everyone
          </p>
          <p className="text-sm text-gray-400">
            सभी के लिए डिजिटल स्वास्थ्य रिकॉर्ड
          </p>
        </div>

        {/* Language Selection Card */}
        <motion.div
          className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl shadow-lg border border-zinc-800 p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#0b6e4f]/20 rounded-lg">
              <Globe className="w-6 h-6 text-[#10b981]" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Choose Your Language
              </h2>
              <p className="text-sm text-gray-400">
                अपनी भाषा चुनें | നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക
              </p>
            </div>
          </div>

          <LanguageSelector onSelect={onLanguageSelect} />
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-6 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p>Powered by Government of Kerala</p>
          <p className="mt-1">A Smart India Hackathon 2025 Initiative</p>
        </motion.div>
      </motion.div>
    </div>
  );
}