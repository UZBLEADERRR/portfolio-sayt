import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bot, Save, Trash2, MessageSquare } from 'lucide-react';
import { store, AISettings } from '../store';

export function AISettingsPage() {
  const [settings, setSettings] = useState<AISettings>({ systemPrompt: '', greeting: '', knowledgeBase: '' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    store.getAISettings().then(s => {
      if (s && typeof s === 'object' && s.systemPrompt !== undefined) setSettings(s);
      setLoading(false);
    });
  }, []);

  const handleSave = () => {
    store.setAISettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="text-white/30 text-center py-20">Yuklanmoqda...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black bg-gradient-to-r from-[#9B6DFF] to-[#00D1FF] bg-clip-text text-transparent flex items-center gap-3"><Bot size={32} className="text-[#9B6DFF]" /> AI Sozlamalar</h1>
        <p className="text-white/30 mt-1">AI chatbot konfiguratsiyasini boshqaring</p>
      </div>
      <div className="space-y-6 max-w-3xl">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-white font-bold mb-1">System Prompt</h3>
          <p className="text-white/30 text-sm mb-4">AI qanday javob berishini aniqlaydi</p>
          <textarea className="input-field text-sm font-mono" rows={8} value={settings.systemPrompt} onChange={e => setSettings({...settings, systemPrompt: e.target.value})} />
        </div>
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-white font-bold mb-1">Salomlash xabari</h3>
          <textarea className="input-field text-sm" rows={3} value={settings.greeting} onChange={e => setSettings({...settings, greeting: e.target.value})} />
        </div>
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-white font-bold mb-1">Bilim bazasi</h3>
          <p className="text-white/30 text-sm mb-4">AI ga qo'shimcha kontekst bering</p>
          <textarea className="input-field text-sm" rows={10} value={settings.knowledgeBase} onChange={e => setSettings({...settings, knowledgeBase: e.target.value})} placeholder="Masalan: Sarvar 1999 yilda tug'ilgan..." />
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleSave} className="btn-primary"><Save size={18} /> Saqlash</button>
          {saved && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#00D68F] text-sm">✅ Saqlandi!</motion.span>}
        </div>
      </div>
    </div>
  );
}

export function ChatHistoryPage() {
  const [chats, setChats] = useState<any[]>([]);
  useEffect(() => { store.getChatHistory().then(d => setChats(d || [])); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black bg-gradient-to-r from-[#00D1FF] to-[#C4A1FF] bg-clip-text text-transparent flex items-center gap-3"><MessageSquare size={32} className="text-[#00D1FF]" /> Chat Tarixi</h1>
        {chats.length > 0 && <button onClick={() => { store.setChatHistory([]); setChats([]); }} className="btn-danger flex items-center gap-2"><Trash2 size={16} /> O'chirish</button>}
      </div>
      {chats.length === 0 ? (
        <div className="text-center py-20 text-white/20"><MessageSquare size={48} className="mx-auto mb-4" /><p>Hozircha chat tarixi yo'q</p></div>
      ) : (
        <div className="space-y-3">
          {chats.map((msg: any) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#9B6DFF]/20 border border-[#9B6DFF]/20 text-white' : 'bg-white/5 border border-white/10 text-white/80'}`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
