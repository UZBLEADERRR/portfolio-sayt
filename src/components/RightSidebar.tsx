import React, { useState, useEffect, useRef } from 'react';
import { Bot, Globe, Rss, X, Send, MessageSquare, Menu, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage, Language } from '../context/LanguageContext';
import { useUI } from '../context/UIContext';
import { useGeminiChat } from '../hooks/useGeminiChat';

function AIChatPanel({ isMobile = false }: { isMobile?: boolean }) {
  const { t } = useLanguage();
  const { setActivePanel } = useUI();
  const { messages, isLoading, streamingText, sendMessage, clearChat } = useGeminiChat();
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const baseClass = isMobile 
    ? "fixed right-24 top-24 w-[calc(100vw-110px)] h-[60vh] glass-panel rounded-2xl p-4 pointer-events-auto flex flex-col"
    : "w-[380px] h-[65vh] glass-panel rounded-[30px] p-6 pointer-events-auto flex flex-col relative";

  return (
    <motion.div
      key="ai"
      initial={isMobile ? { opacity: 0, x: 20 } : { opacity: 0, scale: 0.9, x: 20, filter: 'blur(10px)' }}
      animate={isMobile ? { opacity: 1, x: 0 } : { opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
      exit={isMobile ? { opacity: 0, x: 20 } : { opacity: 0, scale: 0.9, x: 20, filter: 'blur(10px)' }}
      transition={{ duration: 0.3, type: 'spring', bounce: 0.4 }}
      className={baseClass}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7B61FF] to-[#9B6DFF] flex items-center justify-center shadow-[0_0_15px_rgba(155,109,255,0.4)]">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white`}>SARVAR.GPT</h3>
            <p className="text-[10px] text-[#C4A1FF]/70">Gemini 2.0 Flash</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={clearChat} className="text-white/30 hover:text-white/60 transition-colors" title="Clear chat">
            <Trash2 size={16} />
          </button>
          <button onClick={() => setActivePanel('none')} className="text-white/50 hover:text-white">
            <X size={20} />
          </button>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 bg-black/20 rounded-2xl p-4 mb-4 overflow-y-auto border border-[#9B6DFF]/10 flex flex-col gap-3 custom-scrollbar">
        {/* Default greeting */}
        <div className="bg-gradient-to-r from-[#7B61FF]/20 to-[#9B6DFF]/10 border border-[#9B6DFF]/20 p-3 rounded-2xl rounded-tl-none self-start max-w-[85%]">
          <p className="text-sm text-white/90">{t('aiGreeting')}</p>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-[#9B6DFF]/30 border border-[#9B6DFF]/30 rounded-tr-none text-white' 
                : 'bg-gradient-to-r from-[#7B61FF]/20 to-[#9B6DFF]/10 border border-[#9B6DFF]/20 rounded-tl-none text-white/90'
            }`}>
              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
            </div>
          </div>
        ))}

        {/* Streaming text */}
        {isLoading && streamingText && (
          <div className="bg-gradient-to-r from-[#7B61FF]/20 to-[#9B6DFF]/10 border border-[#9B6DFF]/20 p-3 rounded-2xl rounded-tl-none self-start max-w-[85%]">
            <p className="text-sm text-white/90 whitespace-pre-wrap typing-cursor">{streamingText}</p>
          </div>
        )}

        {/* Loading dots */}
        {isLoading && !streamingText && (
          <div className="bg-gradient-to-r from-[#7B61FF]/20 to-[#9B6DFF]/10 border border-[#9B6DFF]/20 p-3 rounded-2xl rounded-tl-none self-start">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#C4A1FF] animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-[#C4A1FF] animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-[#C4A1FF] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="relative">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('message')} 
          disabled={isLoading}
          className="w-full bg-white/5 border border-[#9B6DFF]/20 rounded-2xl py-3 pl-4 pr-12 text-sm text-white outline-none focus:border-[#9B6DFF]/50 focus:bg-white/10 transition-all disabled:opacity-50 placeholder:text-white/30"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gradient-to-r from-[#7B61FF] to-[#9B6DFF] flex items-center justify-center hover:opacity-80 transition-all disabled:opacity-30 shadow-[0_0_10px_rgba(155,109,255,0.3)]"
        >
          <Send size={14} className="text-white ml-[-2px]" />
        </button>
      </div>
    </motion.div>
  );
}

export default function RightSidebar() {
  const { activePanel, setActivePanel } = useUI();
  const { t, lang, setLang } = useLanguage();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
        <div className="w-[90px] h-[70vh] rounded-[30px] glass-panel flex flex-col items-center justify-evenly py-6 pointer-events-auto shadow-[0_0_20px_rgba(155,109,255,0.15)]">
          <div className="flex flex-col gap-10">
            <button onClick={() => togglePanel('right-ai')} className="flex flex-col items-center gap-2 group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${activePanel === 'right-ai' ? 'bg-[#9B6DFF]/20 border-[#9B6DFF] shadow-[0_0_15px_rgba(155,109,255,0.5)]' : 'bg-white/5 border-white/10 group-hover:border-[#9B6DFF]/50'}`}>
                <Bot className={`w-6 h-6 transition-colors ${activePanel === 'right-ai' ? 'text-[#C4A1FF]' : 'text-[#9B6DFF] group-hover:text-[#C4A1FF]'}`} />
              </div>
              <span className="text-[10px] text-white/70 uppercase tracking-wider">{t('aiChat')}</span>
            </button>

            <button onClick={() => togglePanel('right-blog')} className="flex flex-col items-center gap-2 group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${activePanel === 'right-blog' ? 'bg-[#7B61FF]/20 border-[#7B61FF] shadow-[0_0_15px_rgba(123,97,255,0.5)]' : 'bg-white/5 border-white/10 group-hover:border-[#7B61FF]/50'}`}>
                <Rss className={`w-6 h-6 transition-colors ${activePanel === 'right-blog' ? 'text-[#C4A1FF]' : 'text-[#7B61FF] group-hover:text-[#C4A1FF]'}`} />
              </div>
              <span className="text-[10px] text-white/70 uppercase tracking-wider">{t('blog')}</span>
            </button>

            <button onClick={() => togglePanel('right-lang')} className="flex flex-col items-center gap-2 group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${activePanel === 'right-lang' ? 'bg-[#C4A1FF]/20 border-[#C4A1FF] shadow-[0_0_15px_rgba(196,161,255,0.5)]' : 'bg-white/5 border-white/10 group-hover:border-[#C4A1FF]/50'}`}>
                <Globe className={`w-6 h-6 transition-colors ${activePanel === 'right-lang' ? 'text-white' : 'text-[#C4A1FF] group-hover:text-white'}`} />
              </div>
              <span className="text-[10px] text-white/70 uppercase tracking-wider">{t('lang')}</span>
            </button>
          </div>
        </div>

        {/* Expanding Panels */}
        <AnimatePresence mode="wait">
          {activePanel === 'right-ai' && <AIChatPanel />}

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
                <Rss className="text-[#7B61FF]" size={28} />
                <h3 className="text-xl font-bold text-white">{t('blog')}</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {posts.map(post => (
                  <div key={post.id} className="p-4 rounded-2xl bg-white/5 border border-[#9B6DFF]/10 hover:bg-white/10 hover:border-[#9B6DFF]/20 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium text-sm">{post.title}</h4>
                      <span className="text-[10px] text-white/40 whitespace-nowrap ml-2">{post.date}</span>
                    </div>
                    <p className="text-white/60 text-xs leading-relaxed">{post.content}</p>
                    <div className="mt-3 flex items-center gap-2 text-white/40 hover:text-[#C4A1FF] transition-colors w-fit">
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
                  className={`p-3 rounded-xl hover:bg-white/10 text-white text-sm text-left flex items-center gap-3 transition-colors group ${lang === l.code ? 'bg-[#9B6DFF]/15' : ''}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-[10px] font-bold ${lang === l.code ? 'bg-[#C4A1FF]/20 border-[#C4A1FF] text-[#C4A1FF]' : 'bg-white/5 border-white/10 group-hover:border-[#C4A1FF]/50'}`}>
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
              <button onClick={() => togglePanel('right-ai')} className="flex flex-col items-center gap-1 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${activePanel === 'right-ai' ? 'bg-[#9B6DFF]/20 border-[#9B6DFF] shadow-[0_0_15px_rgba(155,109,255,0.5)]' : 'bg-white/5 border-white/10'}`}>
                  <Bot className={`w-4 h-4 transition-colors ${activePanel === 'right-ai' ? 'text-[#C4A1FF]' : 'text-[#9B6DFF]'}`} />
                </div>
              </button>

              <button onClick={() => togglePanel('right-blog')} className="flex flex-col items-center gap-1 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${activePanel === 'right-blog' ? 'bg-[#7B61FF]/20 border-[#7B61FF] shadow-[0_0_15px_rgba(123,97,255,0.5)]' : 'bg-white/5 border-white/10'}`}>
                  <Rss className={`w-4 h-4 transition-colors ${activePanel === 'right-blog' ? 'text-[#C4A1FF]' : 'text-[#7B61FF]'}`} />
                </div>
              </button>

              <button onClick={() => togglePanel('right-lang')} className="flex flex-col items-center gap-1 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${activePanel === 'right-lang' ? 'bg-[#C4A1FF]/20 border-[#C4A1FF] shadow-[0_0_15px_rgba(196,161,255,0.5)]' : 'bg-white/5 border-white/10'}`}>
                  <Globe className={`w-4 h-4 transition-colors ${activePanel === 'right-lang' ? 'text-white' : 'text-[#C4A1FF]'}`} />
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Panels */}
        <AnimatePresence mode="wait">
          {activePanel === 'right-ai' && <AIChatPanel isMobile />}

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
                <Rss className="text-[#7B61FF]" size={24} />
                <h3 className="text-lg font-bold text-white">{t('blog')}</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {posts.map(post => (
                  <div key={post.id} className="p-3 rounded-xl bg-white/5 border border-[#9B6DFF]/10">
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className="text-white font-medium text-xs">{post.title}</h4>
                      <span className="text-[9px] text-white/40 whitespace-nowrap ml-2">{post.date}</span>
                    </div>
                    <p className="text-white/60 text-[11px] leading-relaxed">{post.content}</p>
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
                  className={`p-2.5 rounded-lg hover:bg-white/10 text-white text-xs text-left flex items-center gap-2 transition-colors group ${lang === l.code ? 'bg-[#9B6DFF]/15' : ''}`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-[9px] font-bold ${lang === l.code ? 'bg-[#C4A1FF]/20 border-[#C4A1FF] text-[#C4A1FF]' : 'bg-white/5 border-white/10'}`}>
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
