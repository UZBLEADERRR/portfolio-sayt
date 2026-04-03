import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { useUI } from '../context/UIContext';

interface SlidePanelProps {
  children: React.ReactNode;
  title: string;
  titleColor?: string;
  icon?: React.ReactNode;
}

export default function SlidePanel({ children, title, titleColor = '#C4A1FF', icon }: SlidePanelProps) {
  const { setActivePanel } = useUI();

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      className="fixed bottom-0 left-0 right-0 z-40 flex flex-col"
      style={{ top: '80px' }}
    >
      {/* Glass background */}
      <div className="flex-1 glass-panel rounded-t-[30px] md:rounded-t-[40px] flex flex-col overflow-hidden border-t border-[#9B6DFF]/20 shadow-[0_-10px_60px_rgba(155,109,255,0.2)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            {icon && <div className="text-[#C4A1FF]">{icon}</div>}
            <h2 
              className="text-2xl md:text-3xl font-bold"
              style={{ 
                background: `linear-gradient(135deg, ${titleColor}, #C4A1FF)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {title}
            </h2>
          </div>
          <button 
            onClick={() => setActivePanel('none')}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#9B6DFF]/30 transition-all flex items-center justify-center group"
          >
            <X size={18} className="text-white/50 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 py-6 slide-panel-content custom-scrollbar">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
