import React from 'react';
import { Home, BookOpen, Wrench, Folder, Mail, FileText, Hexagon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useUI, PanelType } from '../context/UIContext';

export default function BottomNavbar() {
  const { activePanel, togglePanel, setActivePanel } = useUI();
  const { t } = useLanguage();

  const leftIcons: { icon: typeof Home; label: string; panelId: PanelType }[] = [
    { icon: Home, label: t('home'), panelId: 'none' as PanelType },
    { icon: BookOpen, label: t('courses'), panelId: 'page-courses' },
    { icon: Wrench, label: t('services'), panelId: 'page-services' },
  ];

  const rightIcons: { icon: typeof Home; label: string; panelId: PanelType }[] = [
    { icon: Folder, label: t('projects'), panelId: 'page-projects' },
    { icon: Mail, label: t('contact'), panelId: 'page-contact' },
    { icon: FileText, label: t('resume'), panelId: 'page-resume' },
  ];

  const getTranslateY = (index: number, isLeft: boolean) => {
    if (isLeft) {
      if (index === 0) return 'translate-y-6';
      if (index === 1) return 'translate-y-3';
      return 'translate-y-0';
    } else {
      if (index === 0) return 'translate-y-0';
      if (index === 1) return 'translate-y-3';
      return 'translate-y-6';
    }
  };

  const handleNavClick = (panelId: PanelType) => {
    if (panelId === 'none') {
      setActivePanel('none');
    } else {
      setActivePanel(activePanel === panelId ? 'none' : panelId);
    }
  };



  return (
    <>
      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="pointer-events-auto glass-panel border-t border-[#9B6DFF]/20 px-2 pb-2 pt-1" style={{ boxShadow: '0 -8px 30px rgba(155,109,255,0.2)' }}>
          <div className="flex items-center justify-around relative">
            {/* Left icons */}
            {leftIcons.map((item, i) => (
              <button
                key={'l'+i}
                onClick={() => handleNavClick(item.panelId)}
                className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all relative"
              >
                <item.icon className={`w-5 h-5 transition-colors ${activePanel === item.panelId ? 'text-[#C4A1FF] drop-shadow-[0_0_8px_rgba(196,161,255,0.8)]' : 'text-white/50'}`} />
                <span className={`text-[9px] font-medium ${activePanel === item.panelId ? 'text-[#C4A1FF]' : 'text-white/40'}`}>{item.label}</span>
                {activePanel === item.panelId && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full bg-[#9B6DFF] shadow-[0_0_8px_#9B6DFF]" />}
              </button>
            ))}

            {/* Center button */}
            <button
              onClick={() => togglePanel('video')}
              className="w-14 h-14 -mt-6 rounded-full bg-gradient-to-br from-[#7B61FF] to-[#9B6DFF] flex items-center justify-center shadow-[0_0_30px_rgba(155,109,255,0.6)] border-2 border-[#C4A1FF]/30 flex-shrink-0"
            >
              <Hexagon className="w-6 h-6 text-white fill-white/20" />
            </button>

            {/* Right icons */}
            {rightIcons.map((item, i) => (
              <button
                key={'r'+i}
                onClick={() => handleNavClick(item.panelId)}
                className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all relative"
              >
                <item.icon className={`w-5 h-5 transition-colors ${activePanel === item.panelId ? 'text-[#C4A1FF] drop-shadow-[0_0_8px_rgba(196,161,255,0.8)]' : 'text-white/50'}`} />
                <span className={`text-[9px] font-medium ${activePanel === item.panelId ? 'text-[#C4A1FF]' : 'text-white/40'}`}>{item.label}</span>
                {activePanel === item.panelId && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full bg-[#9B6DFF] shadow-[0_0_8px_#9B6DFF]" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Bottom Nav */}
      <div className="hidden md:flex fixed bottom-[-10px] left-1/2 -translate-x-1/2 w-[85%] max-w-5xl justify-center z-50 pointer-events-none">
        <div 
          className="w-full h-[110px] pointer-events-auto flex items-start pt-5 justify-evenly px-10 relative glass-panel"
          style={{
            borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
            transform: 'perspective(800px) rotateX(10deg)',
            transformOrigin: 'bottom center',
            borderBottom: 'none',
            boxShadow: '0 -10px 40px rgba(155,109,255,0.3), inset 0 10px 20px rgba(196,161,255,0.1)',
          }}
        >
          <div className="flex items-center gap-16 mt-2">
            {leftIcons.map((item, i) => (
              <button 
                key={i} 
                onClick={() => handleNavClick(item.panelId)}
                className={`text-white/60 hover:text-white hover:scale-110 transition-all duration-300 flex flex-col items-center gap-1 group ${getTranslateY(i, true)}`}
              >
                <item.icon className={`w-6 h-6 ${activePanel === item.panelId ? 'text-[#C4A1FF] drop-shadow-[0_0_10px_rgba(196,161,255,0.8)]' : 'group-hover:drop-shadow-[0_0_10px_rgba(155,109,255,0.8)]'}`} />
                <span className="text-[10px] font-medium tracking-wider">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3">
            <button 
              onClick={() => togglePanel('video')}
              className="w-[75px] h-[75px] rounded-full bg-gradient-to-br from-[#7B61FF] to-[#9B6DFF] flex items-center justify-center shadow-[0_0_40px_rgba(155,109,255,0.8)] hover:scale-110 transition-transform duration-300 border-2 border-[#C4A1FF]/30"
            >
              <Hexagon className="w-8 h-8 text-white fill-white/20" />
            </button>
          </div>

          <div className="flex items-center gap-16 mt-2">
            {rightIcons.map((item, i) => (
              <button 
                key={i} 
                onClick={() => handleNavClick(item.panelId)}
                className={`text-white/60 hover:text-white hover:scale-110 transition-all duration-300 flex flex-col items-center gap-1 group ${getTranslateY(i, false)}`}
              >
                <item.icon className={`w-6 h-6 ${activePanel === item.panelId ? 'text-[#C4A1FF] drop-shadow-[0_0_10px_rgba(196,161,255,0.8)]' : 'group-hover:drop-shadow-[0_0_10px_rgba(155,109,255,0.8)]'}`} />
                <span className="text-[10px] font-medium tracking-wider">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Video Panel */}
      <AnimatePresence>
        {activePanel === 'video' && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-[70px] md:bottom-[120px] left-1/2 -translate-x-1/2 w-[92%] md:w-[60%] max-w-3xl glass-panel rounded-3xl z-40 flex items-center justify-center p-4 md:p-6 pointer-events-auto"
          >
            <button onClick={() => setActivePanel('none')} className="absolute top-3 right-3 text-white/50 hover:text-white z-50 bg-black/30 p-2 rounded-full">
              <X size={20} />
            </button>

            <div className="w-full h-[250px] md:h-[400px] rounded-2xl overflow-hidden border border-[#9B6DFF]/20 shadow-[0_0_30px_rgba(155,109,255,0.3)] relative">
              <video 
                src="/3d_avatarim.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
