import React from 'react';
import { motion } from 'motion/react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
  trend?: string;
}

export function StatCard({ icon, label, value, color = '#0b6e4f', trend }: StatCardProps) {
  return (
    <motion.div
      className="bg-zinc-900/50 backdrop-blur-xl rounded-xl shadow-sm border border-zinc-800 p-6"
      whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(16, 185, 129, 0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <h3 className="text-3xl font-bold" style={{ color }}>{value}</h3>
          {trend && (
            <p className="text-xs text-green-600 mt-2">↑ {trend}</p>
          )}
        </div>
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${color}15` }}
        >
          <div style={{ color }}>
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
}