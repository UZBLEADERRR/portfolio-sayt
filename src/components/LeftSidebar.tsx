import React, { useState, useEffect } from 'react';
import { Briefcase, FolderKanban, Users, Award, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../context/UIContext';

export default function LeftSidebar() {
  const { activePanel, setActivePanel, activeStatId, setActiveStatId } = useUI();
  const { t } = useLanguage();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (activePanel !== 'left-stats') {
      setIsMobileOpen(false);
    }
  }, [activePanel]);

  // Fetch stats from API
  const iconMap: Record<string, typeof Briefcase> = { Briefcase, FolderKanban, Users, Award };
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/data/stats')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setStats(data.map((s: any) => ({
            icon: iconMap[s.icon] || Briefcase,
            value: s.value,
            label: s.label,
            details: s.details || [],
          })));
        }
      })
      .catch(() => {});
  }, []);

  const handleStatClick = (i: number) => {
    if (activeStatId === i && activePanel === 'left-stats') {
      setActivePanel('none');
      setActiveStatId(null);
    } else {
      setActivePanel('left-stats');
      setActiveStatId(i);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-5 top-1/2 -translate-y-1/2 z-40 items-center gap-6 pointer-events-none">
        <div className="w-[90px] h-[70vh] rounded-[30px] glass-panel flex flex-col items-center justify-evenly py-6 pointer-events-auto shadow-[0_0_20px_rgba(155,109,255,0.15)]">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              onClick={() => handleStatClick(i)}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${activeStatId === i && activePanel === 'left-stats' ? 'bg-[#9B6DFF]/20 border-[#9B6DFF] shadow-[0_0_15px_rgba(155,109,255,0.5)]' : 'bg-white/5 border-white/10 group-hover:border-[#9B6DFF]/50 group-hover:shadow-[0_0_15px_rgba(155,109,255,0.3)]'}`}>
                <stat.icon className={`w-5 h-5 transition-colors ${activeStatId === i && activePanel === 'left-stats' ? 'text-[#C4A1FF]' : 'text-[#9B6DFF] group-hover:text-[#C4A1FF]'}`} />
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-white">{stat.value}</div>
                <div className="text-[9px] text-white/70 uppercase tracking-wider">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {activePanel === 'left-stats' && activeStatId !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, x: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.3, type: 'spring', bounce: 0.4 }}
              className="w-[320px] h-[60vh] glass-panel rounded-[30px] p-6 pointer-events-auto flex flex-col relative"
            >
              <button 
                onClick={() => setActivePanel('none')}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#9B6DFF]/20 border border-[#9B6DFF]/50 flex items-center justify-center text-[#C4A1FF]">
                  {React.createElement(stats[activeStatId].icon, { size: 24 })}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{stats[activeStatId].label}</h3>
                  <p className="text-sm text-[#9B6DFF]">{stats[activeStatId].value} {t('statIndicator')}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {stats[activeStatId].details.map((detail, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 + 0.2 }}
                    className="p-4 rounded-2xl bg-white/5 border border-[#9B6DFF]/10 hover:bg-white/10 hover:border-[#9B6DFF]/20 transition-all cursor-pointer group"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#9B6DFF] mb-2 group-hover:bg-[#C4A1FF] group-hover:shadow-[0_0_10px_#C4A1FF] transition-all" />
                    <h4 className="text-white/90 font-medium">{detail}</h4>
                    <p className="text-white/40 text-xs mt-1">{t('statDetail')}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed left-4 top-24 z-40 flex flex-col items-start gap-4 pointer-events-none">
        <button 
          onClick={() => {
            if (!isMobileOpen) {
              setActivePanel('left-stats');
              setIsMobileOpen(true);
            } else {
              setActivePanel('none');
              setIsMobileOpen(false);
            }
          }}
          className="w-12 h-12 rounded-full glass-panel flex items-center justify-center pointer-events-auto shadow-[0_0_20px_rgba(155,109,255,0.2)] border border-[#9B6DFF]/20"
        >
          {isMobileOpen ? <X className="w-6 h-6 text-[#C4A1FF]" /> : <Menu className="w-6 h-6 text-[#9B6DFF]" />}
        </button>

        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="w-16 py-4 rounded-[20px] glass-panel flex flex-col items-center gap-6 pointer-events-auto"
            >
              {stats.map((stat, i) => (
                <div 
                  key={i} 
                  onClick={() => handleStatClick(i)}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${activeStatId === i && activePanel === 'left-stats' ? 'bg-[#9B6DFF]/20 border-[#9B6DFF] shadow-[0_0_15px_rgba(155,109,255,0.5)]' : 'bg-white/5 border-white/10'}`}>
                    <stat.icon className={`w-4 h-4 transition-colors ${activeStatId === i && activePanel === 'left-stats' ? 'text-[#C4A1FF]' : 'text-[#9B6DFF]'}`} />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Panel */}
        <AnimatePresence>
          {activePanel === 'left-stats' && activeStatId !== null && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="fixed left-24 top-24 w-[calc(100vw-110px)] h-[60vh] glass-panel rounded-2xl p-4 pointer-events-auto flex flex-col"
            >
              <button 
                onClick={() => setActivePanel('none')}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#9B6DFF]/20 border border-[#9B6DFF]/50 flex items-center justify-center text-[#C4A1FF]">
                  {React.createElement(stats[activeStatId].icon, { size: 20 })}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{stats[activeStatId].label}</h3>
                  <p className="text-xs text-[#9B6DFF]">{stats[activeStatId].value} {t('statIndicator')}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {stats[activeStatId].details.map((detail, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-[#9B6DFF]/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9B6DFF] mb-1.5" />
                    <h4 className="text-white/90 font-medium text-sm">{detail}</h4>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
