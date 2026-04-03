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
  const { activePanel, setActivePanel } = useUI();

  return (
    <>
      {/* Backdrop for better contrast */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setActivePanel('none')}
        className="fixed inset-0 z-40 panel-backdrop pointer-events-auto"
      />

      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col pointer-events-none"
        style={{ top: 'clamp(60px, 10vh, 80px)' }}
      >
        {/* Glass background */}
        <div className="flex-1 glass-panel rounded-t-[32px] md:rounded-t-[48px] flex flex-col overflow-hidden border-t border-[#9B6DFF]/40 shadow-[0_-20px_80px_rgba(0,0,0,0.8)] pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-5 md:px-10 py-4 md:py-6 border-b border-white/10 flex-shrink-0 bg-white/[0.02]">
            <div className="flex items-center gap-2 md:gap-4">
              {icon && <div className="text-[#C4A1FF] scale-90 md:scale-100">{icon}</div>}
              <h2 
                className="text-xl md:text-3xl font-black tracking-tight"
                style={{ 
                  background: `linear-gradient(135deg, ${titleColor}, #E8D5FF)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {title}
              </h2>
            </div>
            <button 
              onClick={() => setActivePanel('none')}
              className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#9B6DFF]/50 transition-all flex items-center justify-center group"
            >
              <X size={20} className="text-white/40 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 md:px-10 py-6 md:py-10 slide-panel-content custom-scrollbar">
            <div className="max-w-6xl mx-auto w-full">
              {children}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
