import React from 'react';
import { Search, Instagram, Send, Mail, Phone, Github, Linkedin, X } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      <div className="fixed top-2 md:top-5 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-full max-w-5xl h-[60px] md:h-[70px] rounded-[30px] md:rounded-[40px] glass-panel flex items-center justify-between px-4 md:px-6 shadow-[0_0_15px_rgba(79,124,255,0.2)] z-50">
        {/* Left */}
        <Link to="/" className="px-4 md:px-6 py-1.5 md:py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10 text-xs md:text-sm font-medium tracking-wide">
          Portfolio
        </Link>

        {/* Center */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="w-full h-10 rounded-full bg-white/5 border border-white/10 flex items-center px-4 text-white/50 text-sm">
            <Search className="w-4 h-4 mr-3 text-white/40" />
            <span>{t('search')}</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={toggleSocialPanel}
            className="px-4 md:px-6 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-[#4F7CFF] to-[#7B61FF] hover:opacity-90 transition-opacity text-xs md:text-sm font-medium shadow-[0_0_20px_rgba(79,124,255,0.4)] whitespace-nowrap"
          >
            {t('connect')}
          </button>
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#00D1FF] shadow-[0_0_10px_#00D1FF] animate-pulse" />
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
            className="fixed top-[70px] md:top-[90px] right-4 md:right-1/2 md:translate-x-[450px] w-[280px] glass-panel rounded-2xl p-4 z-50 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10"
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
                  className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
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
