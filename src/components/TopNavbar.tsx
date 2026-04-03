import React from 'react';
import { Instagram, Send, Mail, Phone, Github, Linkedin, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../context/UIContext';
import { motion, AnimatePresence } from 'motion/react';

export default function TopNavbar() {
  const { t } = useLanguage();
  const { activePanel, setActivePanel } = useUI();

  const toggleSocialPanel = () => {
    setActivePanel(activePanel === 'social' ? 'none' : 'social');
  };

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', url: '#', color: 'text-pink-500' },
    { icon: Send, label: 'Telegram', url: '#', color: 'text-blue-400' },
    { icon: Mail, label: 'Email', url: 'mailto:example@email.com', color: 'text-red-400' },
    { icon: Phone, label: 'Phone', url: 'tel:+998901234567', color: 'text-green-400' },
    { icon: Github, label: 'GitHub', url: '#', color: 'text-white' },
    { icon: Linkedin, label: 'LinkedIn', url: '#', color: 'text-blue-600' },
  ];

  return (
    <>
      <div className="fixed top-2 md:top-5 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] md:w-full max-w-5xl h-[54px] md:h-[70px] rounded-[24px] md:rounded-[40px] glass-panel flex items-center justify-between px-3 md:px-6 shadow-[0_0_25px_rgba(155,109,255,0.3)] z-50">
        {/* Left — Logo */}
        <button 
          onClick={() => setActivePanel('none')}
          className="px-3 md:px-6 py-1.5 md:py-2 rounded-xl md:rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10 text-[10px] md:text-sm font-bold tracking-tight uppercase"
        >
          <span className="md:hidden">CV</span>
          <span className="hidden md:inline">Portfolio</span>
        </button>

        {/* Center — SARVAR.GPT */}
        <div className="flex-1 flex justify-center overflow-hidden">
          <div className="relative">
            <h1 className="text-sm md:text-xl font-black tracking-[0.2em] md:tracking-wider bg-gradient-to-r from-[#9B6DFF] via-[#C4A1FF] to-[#7B61FF] bg-clip-text text-transparent animate-gradient bg-[length:200%_200%] select-none whitespace-nowrap">
              SARVAR.GPT
            </h1>
            <div className="absolute -bottom-1 left-0 right-0 h-[1px] md:h-[2px] bg-gradient-to-r from-transparent via-[#9B6DFF] to-transparent opacity-40 md:opacity-60" />
          </div>
        </div>

        {/* Right — Tarmoqlar button */}
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={toggleSocialPanel}
            className="px-3 md:px-6 py-1.5 md:py-2 rounded-xl md:rounded-full bg-gradient-to-r from-[#7B61FF] to-[#9B6DFF] hover:opacity-90 transition-opacity text-[10px] md:text-sm font-bold shadow-[0_0_20px_rgba(155,109,255,0.4)] whitespace-nowrap uppercase"
          >
            {t('connect')}
          </button>
          <div className="w-1.5 h-1.5 md:w-3 md:h-3 rounded-full bg-[#C4A1FF] shadow-[0_0_10px_#C4A1FF] animate-pulse shrink-0" />
        </div>
      </div>

      {/* Social Panel */}
      <AnimatePresence>
        {activePanel === 'social' && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[70px] md:top-[90px] right-4 md:right-1/2 md:translate-x-[450px] w-[280px] glass-panel rounded-2xl p-4 z-50 shadow-[0_10px_40px_rgba(123,97,255,0.3)] border border-[#9B6DFF]/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-sm">{t('connect')}</h3>
              <button onClick={() => setActivePanel('none')} className="text-white/50 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#9B6DFF]/30 transition-all group"
                >
                  <link.icon className={`w-6 h-6 ${link.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-[10px] text-white/70">{link.label}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
