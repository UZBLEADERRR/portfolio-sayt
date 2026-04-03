import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit3, Save, X, Wrench, BookOpen, Rss, BarChart3, Share2, Folder } from 'lucide-react';
import { store, ServiceItem, CourseItem, BlogPost, StatItem, SocialLink, ProjectItem } from '../store';

// Generic async CRUD Manager
function CRUDManager<T extends { id: string }>({
  title, icon: Icon, color, getData, setData, fields, renderItem
}: {
  title: string; icon: any; color: string;
  getData: () => Promise<T[]>; setData: (data: T[]) => void;
  fields: { key: keyof T; label: string; type?: string; rows?: number }[];
  renderItem: (item: T) => React.ReactNode;
}) {
  const [items, setItems] = useState<T[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<T>>({});

  useEffect(() => { getData().then(d => setItems(d || [])); }, []);
  const save = (data: T[]) => { setItems(data); setData(data); };

  const add = () => {
    const newItem: any = { id: Date.now().toString() };
    fields.forEach(f => { newItem[f.key] = f.type === 'number' ? 0 : f.type === 'boolean' ? false : ''; });
    setForm(newItem); setEditing('new');
  };

  const saveEdit = () => {
    const item = form as T;
    editing === 'new' ? save([item, ...items]) : save(items.map(i => i.id === editing ? item : i));
    setEditing(null); setForm({});
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black bg-clip-text text-transparent flex items-center gap-3" style={{ backgroundImage: `linear-gradient(135deg, ${color}, #C4A1FF)` }}>
          <Icon size={32} style={{ color }} /> {title}
        </h1>
        <button onClick={add} className="btn-primary"><Plus size={18} /> Qo'shish</button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass-card rounded-2xl p-6 mb-6 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {fields.map(f => (
                <div key={f.key as string} className={f.rows ? 'md:col-span-2' : ''}>
                  <label className="text-white/40 text-xs mb-1 block">{f.label}</label>
                  {f.type === 'boolean' ? (
                    <label className="flex items-center gap-2 text-white/50 text-sm"><input type="checkbox" checked={(form as any)[f.key] || false} onChange={e => setForm({...form, [f.key]: e.target.checked} as any)} className="w-4 h-4" />{f.label}</label>
                  ) : f.rows ? (
                    <textarea className="input-field text-sm" rows={f.rows} value={String((form as any)[f.key] || '')} onChange={e => setForm({...form, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value} as any)} />
                  ) : (
                    <input className="input-field text-sm" type={f.type || 'text'} value={String((form as any)[f.key] || '')} onChange={e => setForm({...form, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value} as any)} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={saveEdit} className="btn-primary"><Save size={16} /> Saqlash</button>
              <button onClick={() => { setEditing(null); setForm({}); }} className="btn-ghost"><X size={16} /> Bekor</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="glass-card rounded-2xl p-5 flex items-center justify-between gap-4 group">
            <div className="flex-1">{renderItem(item)}</div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button onClick={() => { setForm({...item}); setEditing(item.id); }} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#C4A1FF]"><Edit3 size={14} /></button>
              <button onClick={() => save(items.filter(i => i.id !== item.id))} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#FF4F6D]"><Trash2 size={14} /></button>
            </div>
          </motion.div>
        ))}
        {items.length === 0 && <div className="text-center py-16 text-white/20"><Icon size={40} className="mx-auto mb-3" /><p>Hozircha ma'lumot yo'q</p></div>}
      </div>
    </div>
  );
}

export function ProjectsManager() {
  return <CRUDManager<ProjectItem> title="Loyihalar" icon={Folder} color="#7B61FF" getData={store.getProjects} setData={store.setProjects}
    fields={[{ key: 'title', label: 'Nomi' }, { key: 'tech', label: 'Texnologiyalar' }, { key: 'url', label: 'URL' }, { key: 'imageUrl', label: 'Rasm URL' }, { key: 'description', label: 'Tavsif', rows: 2 }]}
    renderItem={item => <div><h3 className="text-white font-bold">{item.title}</h3><p className="text-white/40 text-sm">{item.description}</p><p className="text-[#C4A1FF]/40 text-xs">{item.tech}</p></div>}
  />;
}

export function ServicesManager() {
  return <CRUDManager<ServiceItem> title="Xizmatlar" icon={Wrench} color="#8B5CF6" getData={store.getServices} setData={store.setServices}
    fields={[{ key: 'title', label: 'Nomi' }, { key: 'icon', label: 'Icon (Globe, Smartphone, etc)' }, { key: 'description', label: 'Tavsif', rows: 2 }]}
    renderItem={item => <div><h3 className="text-white font-bold">{item.title}</h3><p className="text-white/40 text-sm">{item.description}</p></div>}
  />;
}

export function CoursesManager() {
  return <CRUDManager<CourseItem> title="Kurslar" icon={BookOpen} color="#7C3AED" getData={store.getCourses} setData={store.setCourses}
    fields={[{ key: 'title', label: 'Nomi' }, { key: 'lessons', label: 'Darslar soni', type: 'number' }, { key: 'hasCertificate', label: 'Sertifikat', type: 'boolean' }, { key: 'description', label: 'Tavsif', rows: 2 }]}
    renderItem={item => <div><div className="flex items-center gap-3 mb-1"><h3 className="text-white font-bold">{item.title}</h3><span className="px-2 py-0.5 rounded-full bg-[#9B6DFF]/10 text-[#C4A1FF] text-xs">{item.lessons} dars</span></div><p className="text-white/40 text-sm">{item.description}</p></div>}
  />;
}

export function BlogManager() {
  return <CRUDManager<BlogPost> title="Blog" icon={Rss} color="#A78BFA" getData={store.getBlog} setData={store.setBlog}
    fields={[{ key: 'title', label: 'Sarlavha' }, { key: 'date', label: 'Sana' }, { key: 'content', label: 'Mazmun', rows: 4 }]}
    renderItem={item => <div><div className="flex items-center gap-3 mb-1"><h3 className="text-white font-bold">{item.title}</h3><span className="text-white/25 text-xs">{item.date}</span></div><p className="text-white/40 text-sm line-clamp-2">{item.content}</p></div>}
  />;
}

export function StatsManager() {
  const [items, setItems] = useState<StatItem[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  useEffect(() => { store.getStats().then(d => setItems(d || [])); }, []);
  const save = (d: StatItem[]) => { setItems(d); store.setStats(d); };

  const saveEdit = () => {
    const item = { ...form, details: form.detailsText?.split('\n').filter(Boolean) || [] };
    delete item.detailsText;
    editing === 'new' ? save([item, ...items]) : save(items.map((i: any) => i.id === editing ? item : i));
    setEditing(null); setForm({});
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black bg-gradient-to-r from-[#00D1FF] to-[#C4A1FF] bg-clip-text text-transparent flex items-center gap-3"><BarChart3 size={32} className="text-[#00D1FF]" /> Statistika</h1>
        <button onClick={() => { setForm({ id: Date.now().toString(), value: '', label: '', icon: 'Briefcase', details: [], detailsText: '' }); setEditing('new'); }} className="btn-primary"><Plus size={18} /> Qo'shish</button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass-card rounded-2xl p-6 mb-6 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div><label className="text-white/40 text-xs mb-1 block">Qiymat</label><input className="input-field text-sm" value={form.value || ''} onChange={e => setForm({...form, value: e.target.value})} /></div>
              <div><label className="text-white/40 text-xs mb-1 block">Label</label><input className="input-field text-sm" value={form.label || ''} onChange={e => setForm({...form, label: e.target.value})} /></div>
              <div><label className="text-white/40 text-xs mb-1 block">Icon</label><input className="input-field text-sm" value={form.icon || ''} onChange={e => setForm({...form, icon: e.target.value})} /></div>
            </div>
            <div className="mb-4"><label className="text-white/40 text-xs mb-1 block">Tafsilotlar (har qator alohida)</label><textarea className="input-field text-sm" rows={4} value={form.detailsText || ''} onChange={e => setForm({...form, detailsText: e.target.value})} /></div>
            <div className="flex gap-3">
              <button onClick={saveEdit} className="btn-primary"><Save size={16} /> Saqlash</button>
              <button onClick={() => { setEditing(null); setForm({}); }} className="btn-ghost"><X size={16} /> Bekor</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="stat-card p-6 group relative">
            <div className="flex items-center gap-4 mb-4"><div className="text-4xl font-black text-white">{item.value}</div><p className="text-white/70 font-medium">{item.label}</p></div>
            <div className="space-y-1">{item.details?.map((d, j) => <div key={j} className="text-white/40 text-sm flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#9B6DFF]"/>{d}</div>)}</div>
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setForm({...item, detailsText: item.details?.join('\n')}); setEditing(item.id); }} className="w-8 h-8 rounded-lg bg-black/30 flex items-center justify-center text-white/40 hover:text-[#C4A1FF]"><Edit3 size={14} /></button>
              <button onClick={() => save(items.filter(i => i.id !== item.id))} className="w-8 h-8 rounded-lg bg-black/30 flex items-center justify-center text-white/40 hover:text-[#FF4F6D]"><Trash2 size={14} /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function SocialsManager() {
  return <CRUDManager<SocialLink> title="Tarmoqlar" icon={Share2} color="#C4A1FF" getData={store.getSocials} setData={store.setSocials}
    fields={[{ key: 'platform', label: 'Platforma' }, { key: 'url', label: 'URL' }, { key: 'icon', label: 'Icon (Instagram, Send, etc)' }]}
    renderItem={item => <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-[#9B6DFF]/10 border border-[#9B6DFF]/20 flex items-center justify-center"><Share2 size={18} className="text-[#C4A1FF]" /></div><div><h3 className="text-white font-bold">{item.platform}</h3><p className="text-white/30 text-xs">{item.url}</p></div></div>}
  />;
}
