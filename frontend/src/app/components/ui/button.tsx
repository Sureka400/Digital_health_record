import React from 'react';
import { motion } from 'motion/react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  icon,
  fullWidth = false,
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#0b6e4f] text-white hover:bg-[#095a40] active:scale-95',
    secondary: 'bg-[#2196F3] text-white hover:bg-[#1976D2] active:scale-95',
    outline: 'border-2 border-[#0b6e4f] text-[#0b6e4f] hover:bg-[#e8f5e9] active:scale-95',
    ghost: 'text-[#0b6e4f] hover:bg-[#e8f5e9] active:scale-95',
    danger: 'bg-[#ef4444] text-white hover:bg-[#dc2626] active:scale-95',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
}
