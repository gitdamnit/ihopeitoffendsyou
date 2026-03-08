import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface GlitchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export function GlitchButton({ children, isLoading, className, disabled, ...props }: GlitchButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || isLoading}
      className={`
        relative group px-8 py-4 bg-primary text-primary-foreground 
        font-display font-bold text-xl tracking-widest uppercase
        border-2 border-primary hover:bg-transparent hover:text-primary
        transition-all duration-200 overflow-hidden
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className || ''}
      `}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
        {children}
      </span>
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
    </motion.button>
  );
}
