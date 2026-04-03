import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bot, Globe, Rss, X, Send, MessageSquare, Menu, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage, Language } from '../context/LanguageContext';
import { useUI } from '../context/UIContext';

// Server-side AI chat via /api/chat
interface ChatMessage { id: string; role: 'user' | 'assistant'; content: string; }

function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], userMessage: text }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: Date.now().toString() + '-a',
        role: 'assistant',
        content: data.text || data.error || 'Xatolik yuz berdi',
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [...prev, { id: Date.now().toString() + '-e', role: 'assistant', content: `❌ ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearChat = useCallback(() => setMessages([]), []);
  return { messages, isLoading, sendMessage, clearChat };
}

function AIChatPanel({ isMobile = false }: { isMobile?: boolean }) {
  const { t } = useLanguage();
  const { setActivePanel } = useUI();
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) { sendMessage(input.trim()); setInput(''); }
  };

  const formatContent = (content: string) => {
    // Simple bold formatter that strips ** and wraps in <b> for better look
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-[#C4A1FF] font-black">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const baseClass = isMobile 
    ? "fixed right-16 top-24 w-[calc(100vw-80px)] h-[65vh] glass-panel rounded-2xl p-4 pointer-events-auto flex flex-col"
    : "w-[550px] h-[70vh] glass-panel rounded-[40px] p-8 pointer-events-auto flex flex-col relative";

  return (
    <motion.div key="ai"
      initial={isMobile ? { opacity: 0, x: 20 } : { opacity: 0, scale: 0.95, x: 40, filter: 'blur(15px)' }}
      animate={isMobile ? { opacity: 1, x: 0 } : { opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
      exit={isMobile ? { opacity: 0, x: 20 } : { opacity: 0, scale: 0.9, x: 40, filter: 'blur(15px)' }}
      transition={{ duration: 0.4, type: 'spring', damping: 20 }}
      className={baseClass}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7B61FF] to-[#9B6DFF] flex items-center justify-center shadow-[0_0_20px_rgba(155,109,255,0.5)]">
            <Bot className="text-white" size={24} />
          </div>
          <div>
            <h3 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-black text-white tracking-tight`}>SARVAR.GPT</h3>
            <p className="text-[10px] text-[#C4A1FF] uppercase font-bold tracking-widest opacity-60">AI Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={clearChat} className="p-2 rounded-xl bg-white/5 text-white/30 hover:text-[#FF4F6D] hover:bg-[#FF4F6D]/10 transition-all"><Trash2 size={18} /></button>
          <button onClick={() => setActivePanel('none')} className="p-2 rounded-xl bg-white/5 text-white/50 hover:text-white transition-all"><X size={22} /></button>
        </div>
      </div>
      
      <div className="flex-1 bg-black/30 rounded-[24px] p-5 mb-5 overflow-y-auto border border-white/5 flex flex-col gap-4 custom-scrollbar">
        <div className="bg-gradient-to-r from-[#7B61FF]/20 to-[#9B6DFF]/10 border border-[#9B6DFF]/20 p-4 rounded-3xl rounded-tl-none self-start max-w-[90%]">
          <p className="text-sm text-white/90 leading-relaxed">{t('aiGreeting')}</p>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-4 rounded-3xl text-[15px] leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-[#9B6DFF]/40 border border-[#9B6DFF]/40 rounded-tr-none text-white' 
                : 'bg-white/5 border border-white/10 rounded-tl-none text-white/90'
            }`}>
              <p className="whitespace-pre-wrap break-words">{formatContent(msg.content)}</p>
            </div>
          </div>
        ))}

        {isLoading && (
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

      <div className="relative">
        <input 
          type="text" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder={t('message')} disabled={isLoading}
          className="w-full bg-white/5 border border-[#9B6DFF]/20 rounded-2xl py-3 pl-4 pr-12 text-sm text-white outline-none focus:border-[#9B6DFF]/50 focus:bg-white/10 transition-all disabled:opacity-50 placeholder:text-white/30"
        />
        <button onClick={handleSend} disabled={isLoading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gradient-to-r from-[#7B61FF] to-[#9B6DFF] flex items-center justify-center hover:opacity-80 transition-all disabled:opacity-30 shadow-[0_0_10px_rgba(155,109,255,0.3)]">
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
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!['right-ai', 'right-blog', 'right-lang'].includes(activePanel)) {
      setIsMobileOpen(false);
    }
  }, [activePanel]);

  // Fetch blog from API
  useEffect(() => {
    fetch('/api/data/blog').then(r => r.ok ? r.json() : []).then(d => setBlogPosts(d || [])).catch(() => {});
  }, [activePanel]);

  const togglePanel = (panel: 'right-ai' | 'right-lang' | 'right-blog') => {
    setActivePanel(activePanel === panel ? 'none' : panel);
  };

  const languages: { code: Language; name: string }[] = [
    { code: 'uz', name: 'O\'zbekcha' }, { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English' }, { code: 'ko', name: '한국어' }
  ];

  const BlogPanel = ({ mobile = false }: { mobile?: boolean }) => (
    <motion.div key="blog" initial={{ opacity: 0, ...(mobile ? { x: 20 } : { scale: 0.9, x: 20, filter: 'blur(10px)' }) }}
      animate={{ opacity: 1, ...(mobile ? { x: 0 } : { scale: 1, x: 0, filter: 'blur(0px)' }) }}
      exit={{ opacity: 0, ...(mobile ? { x: 20 } : { scale: 0.9, x: 20, filter: 'blur(10px)' }) }}
      transition={{ duration: 0.3, type: 'spring', bounce: 0.4 }}
      className={mobile ? "fixed right-24 top-24 w-[calc(100vw-110px)] h-[60vh] glass-panel rounded-2xl p-4 pointer-events-auto flex flex-col" : "w-[350px] h-[60vh] glass-panel rounded-[30px] p-6 pointer-events-auto flex flex-col relative"}>
      <button onClick={() => setActivePanel('none')} className="absolute top-4 right-4 text-white/50 hover:text-white"><X size={20} /></button>
      <div className="flex items-center gap-3 mb-4"><Rss className="text-[#7B61FF]" size={24} /><h3 className="text-lg font-bold text-white">{t('blog')}</h3></div>
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {blogPosts.length === 0 ? (
          <div className="text-center py-10 text-white/20"><Rss size={32} className="mx-auto mb-3" /><p className="text-sm">Blog postlar hali qo'shilmagan</p></div>
        ) : blogPosts.map((post: any) => (
          <div key={post.id} className="p-4 rounded-2xl bg-white/5 border border-[#9B6DFF]/10 hover:bg-white/10 transition-all">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-white font-medium text-sm">{post.title}</h4>
              <span className="text-[10px] text-white/40 whitespace-nowrap ml-2">{post.date}</span>
            </div>
            <p className="text-white/60 text-xs leading-relaxed line-clamp-3">{post.content}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const LangPanel = ({ mobile = false }: { mobile?: boolean }) => (
    <motion.div key="lang" initial={{ opacity: 0, ...(mobile ? { x: 20 } : { scale: 0.9, x: 20, filter: 'blur(10px)' }) }}
      animate={{ opacity: 1, ...(mobile ? { x: 0 } : { scale: 1, x: 0, filter: 'blur(0px)' }) }}
      exit={{ opacity: 0, ...(mobile ? { x: 20 } : { scale: 0.9, x: 20, filter: 'blur(10px)' }) }}
      transition={{ duration: 0.3, type: 'spring', bounce: 0.4 }}
      className={mobile ? "fixed right-24 top-24 w-[180px] glass-panel rounded-2xl p-3 pointer-events-auto flex flex-col gap-1.5" : "w-[200px] glass-panel rounded-[30px] p-4 pointer-events-auto flex flex-col gap-2"}>
      <div className="flex items-center justify-between mb-1 px-1">
        <span className="text-xs font-bold text-white">{t('selectLang')}</span>
        <button onClick={() => setActivePanel('none')} className="text-white/50 hover:text-white"><X size={14} /></button>
      </div>
      {languages.map(l => (
        <button key={l.code} onClick={() => { setLang(l.code); setActivePanel('none'); }}
          className={`p-2.5 rounded-lg hover:bg-white/10 text-white text-xs text-left flex items-center gap-2 transition-colors ${lang === l.code ? 'bg-[#9B6DFF]/15' : ''}`}>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-[9px] font-bold ${lang === l.code ? 'bg-[#C4A1FF]/20 border-[#C4A1FF] text-[#C4A1FF]' : 'bg-white/5 border-white/10'}`}>{l.code.toUpperCase()}</div>
          {l.name}
        </button>
      ))}
    </motion.div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-row-reverse items-center gap-6 pointer-events-none">
        <div className="w-[90px] h-[70vh] rounded-[30px] glass-panel flex flex-col items-center justify-evenly py-6 pointer-events-auto shadow-[0_0_20px_rgba(155,109,255,0.15)]">
          <div className="flex flex-col gap-10">
            {[
              { panel: 'right-ai' as const, icon: Bot, label: t('aiChat'), color: '#9B6DFF' },
              { panel: 'right-blog' as const, icon: Rss, label: t('blog'), color: '#7B61FF' },
              { panel: 'right-lang' as const, icon: Globe, label: t('lang'), color: '#C4A1FF' },
            ].map(({ panel, icon: Icon, label, color }) => (
              <button key={panel} onClick={() => togglePanel(panel)} className="flex flex-col items-center gap-2 group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${activePanel === panel ? `bg-[${color}]/20 border-[${color}] shadow-[0_0_15px_${color}80]` : 'bg-white/5 border-white/10 group-hover:border-[#9B6DFF]/50'}`}>
                  <Icon className={`w-6 h-6 transition-colors ${activePanel === panel ? 'text-[#C4A1FF]' : `text-[${color}] group-hover:text-[#C4A1FF]`}`} />
                </div>
                <span className="text-[10px] text-white/70 uppercase tracking-wider">{label}</span>
              </button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          {activePanel === 'right-ai' && <AIChatPanel />}
          {activePanel === 'right-blog' && <BlogPanel />}
          {activePanel === 'right-lang' && <LangPanel />}
        </AnimatePresence>
      </div>

      {/* Mobile */}
      <div className="md:hidden fixed right-4 top-24 z-40 flex flex-col items-end gap-4 pointer-events-none">
        <button onClick={() => { if (!isMobileOpen) { setActivePanel('right-lang'); setIsMobileOpen(true); } else { setActivePanel('none'); setIsMobileOpen(false); }}}
          className="w-12 h-12 rounded-full glass-panel flex items-center justify-center pointer-events-auto shadow-[0_0_20px_rgba(155,109,255,0.2)] border border-[#9B6DFF]/20">
          {isMobileOpen ? <X className="w-6 h-6 text-[#C4A1FF]" /> : <Menu className="w-6 h-6 text-[#9B6DFF]" />}
        </button>
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div initial={{ opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="w-16 py-4 rounded-[20px] glass-panel flex flex-col items-center gap-6 pointer-events-auto">
              {[{ panel: 'right-ai' as const, icon: Bot, color: '#9B6DFF' }, { panel: 'right-blog' as const, icon: Rss, color: '#7B61FF' }, { panel: 'right-lang' as const, icon: Globe, color: '#C4A1FF' }].map(({ panel, icon: Icon }) => (
                <button key={panel} onClick={() => togglePanel(panel)} className="flex flex-col items-center gap-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${activePanel === panel ? 'bg-[#9B6DFF]/20 border-[#9B6DFF] shadow-[0_0_15px_rgba(155,109,255,0.5)]' : 'bg-white/5 border-white/10'}`}>
                    <Icon className={`w-4 h-4 transition-colors ${activePanel === panel ? 'text-[#C4A1FF]' : 'text-[#9B6DFF]'}`} />
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {activePanel === 'right-ai' && <AIChatPanel isMobile />}
          {activePanel === 'right-blog' && <BlogPanel mobile />}
          {activePanel === 'right-lang' && <LangPanel mobile />}
        </AnimatePresence>
      </div>
    </>
  );
}
