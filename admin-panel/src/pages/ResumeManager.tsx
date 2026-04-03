import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit3, Save, X, FileText } from 'lucide-react';
import { store, ResumeItem } from '../store';

export default function ResumeManager() {
  const [items, setItems] = useState<ResumeItem[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<ResumeItem>>({});

  useEffect(() => { setItems(store.getResume()); }, []);

  const save = (data: ResumeItem[]) => { setItems(data); store.setResume(data); };

  const add = () => {
    const newItem: ResumeItem = {
      id: Date.now().toString(),
      role: '', company: '', startYear: '2024', endYear: '', description: '', isPresent: false,
    };
    setForm(newItem);
    setEditing('new');
  };

  const saveEdit = () => {
    if (!form.role || !form.company) return;
    const item = form as ResumeItem;
    if (editing === 'new') {
      save([item, ...items]);
    } else {
      save(items.map(i => i.id === editing ? item : i));
    }
    setEditing(null);
    setForm({});
  };

  const remove = (id: string) => save(items.filter(i => i.id !== id));

  const startEdit = (item: ResumeItem) => {
    setForm({ ...item });
    setEditing(item.id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-[#9B6DFF] to-[#C4A1FF] bg-clip-text text-transparent flex items-center gap-3">
            <FileText size={32} className="text-[#9B6DFF]" /> Resume Manager
          </h1>
          <p className="text-white/30 mt-1">Tajriba va malakalaringizni boshqaring</p>
        </div>
        <button onClick={add} className="btn-primary"><Plus size={18} /> Qo'shish</button>
      </div>

      {/* Edit Form */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card rounded-2xl p-6 mb-6 overflow-hidden"
          >
            <h3 className="text-white font-bold mb-4">{editing === 'new' ? 'Yangi yozuv' : 'Tahrirlash'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-white/40 text-xs mb-1 block">Lavozim</label>
                <input className="input-field text-sm" value={form.role || ''} onChange={e => setForm({...form, role: e.target.value})} placeholder="Senior Developer" />
              </div>
              <div>
                <label className="text-white/40 text-xs mb-1 block">Kompaniya</label>
                <input className="input-field text-sm" value={form.company || ''} onChange={e => setForm({...form, company: e.target.value})} placeholder="Tech Company" />
              </div>
              <div>
                <label className="text-white/40 text-xs mb-1 block">Boshlanish yili</label>
                <input className="input-field text-sm" value={form.startYear || ''} onChange={e => setForm({...form, startYear: e.target.value})} placeholder="2024" />
              </div>
              <div>
                <label className="text-white/40 text-xs mb-1 block">Tugash yili</label>
                <div className="flex items-center gap-3">
                  <input className="input-field text-sm flex-1" value={form.endYear || ''} onChange={e => setForm({...form, endYear: e.target.value})} placeholder="2025" disabled={form.isPresent} />
                  <label className="flex items-center gap-2 text-white/50 text-sm whitespace-nowrap">
                    <input type="checkbox" checked={form.isPresent || false} onChange={e => setForm({...form, isPresent: e.target.checked, endYear: ''})} className="w-4 h-4 rounded" />
                    Hozir
                  </label>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-white/40 text-xs mb-1 block">Tavsif</label>
              <textarea className="input-field text-sm" rows={3} value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} placeholder="Tajriba haqida..." />
            </div>
            <div className="flex gap-3">
              <button onClick={saveEdit} className="btn-primary"><Save size={16} /> Saqlash</button>
              <button onClick={() => { setEditing(null); setForm({}); }} className="btn-ghost"><X size={16} /> Bekor</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-2xl p-5 flex items-start justify-between gap-4 group"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="text-white font-bold">{item.role}</h3>
                <span className="px-3 py-1 rounded-full bg-[#9B6DFF]/15 text-[#C4A1FF] text-xs border border-[#9B6DFF]/20">
                  {item.startYear} - {item.isPresent ? 'Hozirgacha' : item.endYear}
                </span>
              </div>
              <p className="text-white/50 text-sm mb-1">{item.company}</p>
              <p className="text-white/35 text-sm">{item.description}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button onClick={() => startEdit(item)} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#C4A1FF] hover:border-[#9B6DFF]/30 transition-all">
                <Edit3 size={14} />
              </button>
              <button onClick={() => remove(item.id)} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#FF4F6D] hover:border-[#FF4F6D]/30 transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-20 text-white/20">
          <FileText size={48} className="mx-auto mb-4" />
          <p>Hozircha resume yozuvlari yo'q</p>
        </div>
      )}
    </div>
  );
}
