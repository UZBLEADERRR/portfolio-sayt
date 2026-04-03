import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit3, Save, X, Folder, ExternalLink } from 'lucide-react';
import { store, ProjectItem } from '../store';

export default function ProjectsManager() {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<ProjectItem>>({});

  useEffect(() => { setItems(store.getProjects()); }, []);
  const save = (data: ProjectItem[]) => { setItems(data); store.setProjects(data); };

  const add = () => {
    setForm({ id: Date.now().toString(), title: '', description: '', tech: '', url: '', imageUrl: '' });
    setEditing('new');
  };

  const saveEdit = () => {
    if (!form.title) return;
    const item = form as ProjectItem;
    editing === 'new' ? save([item, ...items]) : save(items.map(i => i.id === editing ? item : i));
    setEditing(null); setForm({});
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-[#7B61FF] to-[#C4A1FF] bg-clip-text text-transparent flex items-center gap-3">
            <Folder size={32} className="text-[#7B61FF]" /> Loyihalar
          </h1>
          <p className="text-white/30 mt-1">Loyihalaringizni boshqaring</p>
        </div>
        <button onClick={add} className="btn-primary"><Plus size={18} /> Qo'shish</button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass-card rounded-2xl p-6 mb-6 overflow-hidden">
            <h3 className="text-white font-bold mb-4">{editing === 'new' ? 'Yangi loyiha' : 'Tahrirlash'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div><label className="text-white/40 text-xs mb-1 block">Nomi</label><input className="input-field text-sm" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div><label className="text-white/40 text-xs mb-1 block">Texnologiyalar</label><input className="input-field text-sm" value={form.tech || ''} onChange={e => setForm({...form, tech: e.target.value})} /></div>
              <div><label className="text-white/40 text-xs mb-1 block">URL</label><input className="input-field text-sm" value={form.url || ''} onChange={e => setForm({...form, url: e.target.value})} /></div>
              <div><label className="text-white/40 text-xs mb-1 block">Rasm URL</label><input className="input-field text-sm" value={form.imageUrl || ''} onChange={e => setForm({...form, imageUrl: e.target.value})} /></div>
            </div>
            <div className="mb-4"><label className="text-white/40 text-xs mb-1 block">Tavsif</label><textarea className="input-field text-sm" rows={3} value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} /></div>
            <div className="flex gap-3">
              <button onClick={saveEdit} className="btn-primary"><Save size={16} /> Saqlash</button>
              <button onClick={() => { setEditing(null); setForm({}); }} className="btn-ghost"><X size={16} /> Bekor</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-2xl p-5 group relative">
            <div className="w-full h-32 rounded-xl bg-gradient-to-br from-[#9B6DFF]/10 to-[#7B61FF]/5 mb-4 flex items-center justify-center">
              <Folder size={32} className="text-white/10" />
            </div>
            <h3 className="text-white font-bold mb-1">{item.title}</h3>
            <p className="text-white/40 text-sm mb-2">{item.description}</p>
            <p className="text-[#C4A1FF]/60 text-xs">{item.tech}</p>
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setForm({...item}); setEditing(item.id); }} className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-white/50 hover:text-[#C4A1FF]"><Edit3 size={14} /></button>
              <button onClick={() => save(items.filter(i => i.id !== item.id))} className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-white/50 hover:text-[#FF4F6D]"><Trash2 size={14} /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
