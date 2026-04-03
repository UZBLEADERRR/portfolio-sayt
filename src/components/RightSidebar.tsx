import React, { useState, useEffect } from 'react';
import { Bot, Globe, Rss, X, Send, MessageSquare, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage, Language } from '../context/LanguageContext';
import { useUI } from '../context/UIContext';

export default function RightSidebar() {
  const { activePanel, setActivePanel } = useUI();
  const { t, lang, setLang } = useLanguage();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close local mobile menu if another panel opens
  useEffect(() => {
    if (!['right-ai', 'right-blog', 'right-lang'].includes(activePanel)) {
      setIsMobileOpen(false);
    }
  }, [activePanel]);

  const togglePanel = (panel: 'right-ai' | 'right-lang' | 'right-blog') => {
    setActivePanel(activePanel === panel ? 'none' : panel);
  };

  const languages: { code: Language; name: string }[] = [
    { code: 'uz', name: 'O\'zbekcha' },
    { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English' },
    { code: 'ko', name: '한국어' }
  ];

  const posts = [
    { id: 1, title: t('post1Title'), date: t('post1Date'), content: t('post1Content') },
    { id: 2, title: t('post2Title'), date: t('post2Date'), content: t('post2Content') },
    { id: 3, title: t('post3Title'), date: t('post3Date'), content: t('post3Content') },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-row-reverse items-center gap-6 pointer-events-none">
        {/* Sidebar */}
        <div className="w-[90px] h-[70vh] rounded-[30px] glass-panel flex flex-col items-center justify-evenly py-6 pointer-events-auto shadow-[0_0_20px_rgba(79,124,255,0.1)]">
          
          <div className="flex flex-col gap-10">
            <button onClick={() => togglePanel('right-ai')} className="flex flex-col items-center gap-2 group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${activePanel === 'right-ai' ? 'bg-[#7B61FF]/20 border-[#7B61FF] shadow-[0_0_15px_rgba(123,97,255,0.5)]' : 'bg-white/5 border-white/10 group-hover:border-[#7B61FF]/50'}`}>
                <Bot className={`w-6 h-6 transition-colors ${activePanel === 'right-ai' ? 'text-[#00D1FF]' : 'text-[#7B61FF] group-hover:text-[#00D1FF]'}`} />
              </div>
              <span className="text-[10px] text-white/70 uppercase tracking-wider">{t('aiChat')}</span>
            </button>

            <button onClick={() => togglePanel('right-blog')} className="flex flex-col items-center gap-2 group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${activePanel === 'right-blog' ? 'bg-[#4F7CFF]/20 border-[#4F7CFF] shadow-[0_0_15px_rgba(79,124,255,0.5)]' : 'bg-white/5 border-white/10 group-hover:border-[#4F7CFF]/50'}`}>
                <Rss className={`w-6 h-6 transition-colors ${activePanel === 'right-blog' ? 'text-[#00D1FF]' : 'text-[#4F7CFF] group-hover:text-[#00D1FF]'}`} />
              </div>
              <span className="text-[10px] text-white/70 uppercase tracking-wider">{t('blog')}</span>
            </button>

            <button onClick={() => togglePanel('right-lang')} className="flex flex-col items-center gap-2 group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${activePanel === 'right-lang' ? 'bg-[#00D1FF]/20 border-[#00D1FF] shadow-[0_0_15px_rgba(0,209,255,0.5)]' : 'bg-white/5 border-white/10 group-hover:border-[#00D1FF]/50'}`}>
                <Globe className={`w-6 h-6 transition-colors ${activePanel === 'right-lang' ? 'text-white' : 'text-[#00D1FF] group-hover:text-white'}`} />
              </div>
              <span className="text-[10px] text-white/70 uppercase tracking-wider">{t('lang')}</span>
            </button>
          </div>

        </div>

        {/* Expanding Panels */}
        <AnimatePresence mode="wait">
          {activePanel === 'right-ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, scale: 0.9, x: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, x: 20, filter: 'blur(10px)' }}
              transition={{ duration: 0.3, type: 'spring', bounce: 0.4 }}
              className="w-[350px] h-[60vh] glass-panel rounded-[30px] p-6 pointer-events-auto flex flex-col relative"
            >
              <button onClick={() => setActivePanel('none')} className="absolute top-6 right-6 text-white/50 hover:text-white">
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <Bot className="text-[#7B61FF]" size={28} />
                <h3 className="text-xl font-bold text-white">{t('aiChat')}</h3>
              </div>
              
              <div className="flex-1 bg-black/20 rounded-2xl p-4 mb-4 overflow-y-auto border border-white/5 flex flex-col gap-4 custom-scrollbar">
                <div className="bg-[#7B61FF]/20 border border-[#7B61FF]/30 p-3 rounded-2xl rounded-tl-none self-start max-w-[85%]">
                  <p className="text-sm text-white/90">{t('aiGreeting')}</p>
                </div>
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  placeholder={t('message')} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm text-white outline-none focus:border-[#7B61FF]/50 focus:bg-white/10 transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-[#7B61FF] flex items-center justify-center hover:bg-[#6A4BFF] transition-colors">
                  <Send size={14} className="text-white ml-[-2px]" />
                </button>
              </div>
            </motion.div>
          )}

          {activePanel === 'right-blog' && (
            <motion.div
              key="blog"
              initial={{ opacity: 0, scale: 0.9, x: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, x: 20, filter: 'blur(10px)' }}
              transition={{ duration: 0.3, type: 'spring', bounce: 0.4 }}
              className="w-[350px] h-[60vh] glass-panel rounded-[30px] p-6 pointer-events-auto flex flex-col relative"
            >
              <button onClick={() => setActivePanel('none')} className="absolute top-6 right-6 text-white/50 hover:text-white">
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <Rss className="text-[#4F7CFF]" size={28} />
                <h3 className="text-xl font-bold text-white">{t('blog')}</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {posts.map(post => (
                  <div key={post.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium text-sm">{post.title}</h4>
                      <span className="text-[10px] text-white/40 whitespace-nowrap ml-2">{post.date}</span>
                    </div>
                    <p className="text-white/70 text-xs leading-relaxed">{post.content}</p>
                    <div className="mt-3 flex items-center gap-2 text-white/40 hover:text-[#00D1FF] cursor-pointer transition-colors w-fit">
                      <MessageSquare size={14} />
                      <span className="text-[10px]">{t('comment')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activePanel === 'right-lang' && (
            <motion.div
              key="lang"
              initial={{ opacity: 0, scale: 0.9, x: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, x: 20, filter: 'blur(10px)' }}
              transition={{ duration: 0.3, type: 'spring', bounce: 0.4 }}
              className="w-[200px] glass-panel rounded-[30px] p-4 pointer-events-auto flex flex-col gap-2"
            >
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-sm font-bold text-white">{t('selectLang')}</span>
                <button onClick={() => setActivePanel('none')} className="text-white/50 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              {languages.map(l => (
                <button 
                  key={l.code} 
                  onClick={() => { setLang(l.code); setActivePanel('none'); }}
                  className={`p-3 rounded-xl hover:bg-white/10 text-white text-sm text-left flex items-center gap-3 transition-colors group ${lang === l.code ? 'bg-white/10' : ''}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-[10px] font-bold ${lang === l.code ? 'bg-[#00D1FF]/20 border-[#00D1FF] text-[#00D1FF]' : 'bg-white/5 border-white/10 group-hover:border-[#00D1FF]/50'}`}>
                    {l.code.toUpperCase()}
                  </div>
                  {l.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed right-4 top-24 z-40 flex flex-col items-end gap-4 pointer-events-none">
        <button 
          onClick={() => {
            if (!isMobileOpen) {
              setActivePanel('right-lang');
              setIsMobileOpen(true);
            } else {
              setActivePanel('none');
              setIsMobileOpen(false);
            }
          }}
          className="w-12 h-12 rounded-full glass-panel flex items-center justify-center pointer-events-auto shadow-[0_0_20px_rgba(79,124,255,0.2)] border border-white/10"
        >
          {isMobileOpen ? <X className="w-6 h-6 text-[#00D1FF]" /> : <Menu className="w-6 h-6 text-[#7B61FF]" />}
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
              <button onClick={() => togglePanel('right-ai')} className="flex flex-col items-center gap-1 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${activePanel === 'right-ai' ? 'bg-[#7B61FF]/20 border-[#7B61FF] shadow-[0_0_15px_rgba(123,97,255,0.5)]' : 'bg-white/5 border-white/10'}`}>
                  <Bot className={`w-4 h-4 transition-colors ${activePanel === 'right-ai' ? 'text-[#00D1FF]' : 'text-[#7B61FF]'}`} />
                </div>
              </button>

              <button onClick={() => togglePanel('right-blog')} className="flex flex-col items-center gap-1 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${activePanel === 'right-blog' ? 'bg-[#4F7CFF]/20 border-[#4F7CFF] shadow-[0_0_15px_rgba(79,124,255,0.5)]' : 'bg-white/5 border-white/10'}`}>
                  <Rss className={`w-4 h-4 transition-colors ${activePanel === 'right-blog' ? 'text-[#00D1FF]' : 'text-[#4F7CFF]'}`} />
                </div>
              </button>

              <button onClick={() => togglePanel('right-lang')} className="flex flex-col items-center gap-1 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${activePanel === 'right-lang' ? 'bg-[#00D1FF]/20 border-[#00D1FF] shadow-[0_0_15px_rgba(0,209,255,0.5)]' : 'bg-white/5 border-white/10'}`}>
                  <Globe className={`w-4 h-4 transition-colors ${activePanel === 'right-lang' ? 'text-white' : 'text-[#00D1FF]'}`} />
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Panels */}
        <AnimatePresence mode="wait">
          {activePanel === 'right-ai' && (
            <motion.div
              key="ai-mobile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed right-24 top-24 w-[calc(100vw-110px)] h-[60vh] glass-panel rounded-2xl p-4 pointer-events-auto flex flex-col"
            >
              <button onClick={() => setActivePanel('none')} className="absolute top-4 right-4 text-white/50 hover:text-white">
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <Bot className="text-[#7B61FF]" size={24} />
                <h3 className="text-lg font-bold text-white">{t('aiChat')}</h3>
              </div>
              
              <div className="flex-1 bg-black/20 rounded-xl p-3 mb-3 overflow-y-auto border border-white/5 flex flex-col gap-3 custom-scrollbar">
                <div className="bg-[#7B61FF]/20 border border-[#7B61FF]/30 p-2.5 rounded-xl rounded-tl-none self-start max-w-[90%]">
                  <p className="text-xs text-white/90">{t('aiGreeting')}</p>
                </div>
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  placeholder={t('message')} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-3 pr-10 text-xs text-white outline-none focus:border-[#7B61FF]/50 focus:bg-white/10 transition-all"
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[#7B61FF] flex items-center justify-center hover:bg-[#6A4BFF] transition-colors">
                  <Send size={12} className="text-white ml-[-1px]" />
                </button>
              </div>
            </motion.div>
          )}

          {activePanel === 'right-blog' && (
            <motion.div
              key="blog-mobile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed right-24 top-24 w-[calc(100vw-110px)] h-[60vh] glass-panel rounded-2xl p-4 pointer-events-auto flex flex-col"
            >
              <button onClick={() => setActivePanel('none')} className="absolute top-4 right-4 text-white/50 hover:text-white">
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <Rss className="text-[#4F7CFF]" size={24} />
                <h3 className="text-lg font-bold text-white">{t('blog')}</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {posts.map(post => (
                  <div key={post.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className="text-white font-medium text-xs">{post.title}</h4>
                      <span className="text-[9px] text-white/40 whitespace-nowrap ml-2">{post.date}</span>
                    </div>
                    <p className="text-white/70 text-[11px] leading-relaxed">{post.content}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-white/40 hover:text-[#00D1FF] cursor-pointer transition-colors w-fit">
                      <MessageSquare size={12} />
                      <span className="text-[9px]">{t('comment')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activePanel === 'right-lang' && (
            <motion.div
              key="lang-mobile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed right-24 top-24 w-[180px] glass-panel rounded-2xl p-3 pointer-events-auto flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between mb-1 px-1">
                <span className="text-xs font-bold text-white">{t('selectLang')}</span>
                <button onClick={() => setActivePanel('none')} className="text-white/50 hover:text-white">
                  <X size={14} />
                </button>
              </div>
              {languages.map(l => (
                <button 
                  key={l.code} 
                  onClick={() => { setLang(l.code); setActivePanel('none'); }}
                  className={`p-2.5 rounded-lg hover:bg-white/10 text-white text-xs text-left flex items-center gap-2 transition-colors group ${lang === l.code ? 'bg-white/10' : ''}`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-[9px] font-bold ${lang === l.code ? 'bg-[#00D1FF]/20 border-[#00D1FF] text-[#00D1FF]' : 'bg-white/5 border-white/10'}`}>
                    {l.code.toUpperCase()}
                  </div>
                  {l.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
