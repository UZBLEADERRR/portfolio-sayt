import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bot, Save, Trash2, MessageSquare } from 'lucide-react';
import { store, AISettings, ChatMessage } from '../store';

export function AISettingsPage() {
  const [settings, setSettings] = useState<AISettings>(store.getAISettings());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    store.setAISettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black bg-gradient-to-r from-[#9B6DFF] to-[#00D1FF] bg-clip-text text-transparent flex items-center gap-3">
          <Bot size={32} className="text-[#9B6DFF]" /> AI Sozlamalar
        </h1>
        <p className="text-white/30 mt-1">AI chatbot konfiguratsiyasini boshqaring</p>
      </div>

      <div className="space-y-6 max-w-3xl">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-white font-bold mb-1">System Prompt</h3>
          <p className="text-white/30 text-sm mb-4">AI qanday javob berishini aniqlaydi</p>
          <textarea
            className="input-field text-sm font-mono"
            rows={8}
            value={settings.systemPrompt}
            onChange={e => setSettings({...settings, systemPrompt: e.target.value})}
          />
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-white font-bold mb-1">Salomlash xabari</h3>
          <p className="text-white/30 text-sm mb-4">Chat ochilganda ko'rsatiladigan birinchi xabar</p>
          <textarea
            className="input-field text-sm"
            rows={3}
            value={settings.greeting}
            onChange={e => setSettings({...settings, greeting: e.target.value})}
          />
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-white font-bold mb-1">Bilim bazasi (Knowledge Base)</h3>
          <p className="text-white/30 text-sm mb-4">AI ga qo'shimcha kontekst bering. Bu ma'lumotlar system prompt ga qo'shiladi va AI har doim undan foydalanadi.</p>
          <textarea
            className="input-field text-sm"
            rows={10}
            value={settings.knowledgeBase}
            onChange={e => setSettings({...settings, knowledgeBase: e.target.value})}
            placeholder="Masalan: Sarvar 1999 yilda tug'ilgan. U Toshkentda yashaydi. Uning sevimli dasturlash tili TypeScript..."
          />
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handleSave} className="btn-primary">
            <Save size={18} /> Saqlash
          </button>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[#00D68F] text-sm"
            >
              ✅ Saqlandi!
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
}

export function ChatHistoryPage() {
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);

  useEffect(() => {
    const history = store.getChatHistory();
    setChats(history);
    const uniqueSessions = [...new Set(history.map(m => m.sessionId))];
    setSessions(uniqueSessions);
    if (uniqueSessions.length > 0) setActiveSession(uniqueSessions[0]);
  }, []);

  const clearAll = () => {
    store.setChatHistory([]);
    setChats([]);
    setSessions([]);
    setActiveSession(null);
  };

  const sessionMessages = chats.filter(m => m.sessionId === activeSession);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-[#00D1FF] to-[#C4A1FF] bg-clip-text text-transparent flex items-center gap-3">
            <MessageSquare size={32} className="text-[#00D1FF]" /> Chat Tarixi
          </h1>
          <p className="text-white/30 mt-1">Barcha AI chat suhbatlarini ko'ring</p>
        </div>
        {chats.length > 0 && (
          <button onClick={clearAll} className="btn-danger flex items-center gap-2">
            <Trash2 size={16} /> Hammasini o'chirish
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-20 text-white/20">
          <MessageSquare size={48} className="mx-auto mb-4" />
          <p>Hozircha chat tarixi yo'q</p>
          <p className="text-sm mt-1">Foydalanuvchilar AI chatbot bilan suhbatlashganda bu yerda ko'rinadi</p>
        </div>
      ) : (
        <div className="flex gap-6 h-[calc(100vh-200px)]">
          {/* Sessions List */}
          <div className="w-64 glass-card rounded-2xl p-4 overflow-y-auto flex-shrink-0">
            <h3 className="text-white/50 text-xs font-bold uppercase mb-3">Suhbatlar ({sessions.length})</h3>
            {sessions.map((sid, i) => {
              const sessionMsgs = chats.filter(m => m.sessionId === sid);
              const firstMsg = sessionMsgs.find(m => m.role === 'user');
              return (
                <button
                  key={sid}
                  onClick={() => setActiveSession(sid)}
                  className={`w-full p-3 rounded-xl text-left mb-2 transition-all ${activeSession === sid ? 'bg-[#9B6DFF]/15 border border-[#9B6DFF]/20' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  <p className="text-white text-sm font-medium truncate">{firstMsg?.content.slice(0, 30) || 'Suhbat'}</p>
                  <p className="text-white/25 text-xs mt-1">{sessionMsgs.length} xabar</p>
                </button>
              );
            })}
          </div>

          {/* Chat View */}
          <div className="flex-1 glass-card rounded-2xl p-6 overflow-y-auto">
            {sessionMessages.map((msg) => (
              <div key={msg.id} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-[#9B6DFF]/20 border border-[#9B6DFF]/20 rounded-tr-none text-white'
                    : 'bg-white/5 border border-white/10 rounded-tl-none text-white/80'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-white/20 text-[10px] mt-2">{new Date(msg.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
