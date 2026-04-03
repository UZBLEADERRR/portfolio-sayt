import React, { useState, useEffect } from 'react';
import { useLanguage } from './context/LanguageContext';
import { motion } from 'motion/react';
import { Code, Palette, Smartphone, Globe, Database, Play, Send, Wrench, ExternalLink } from 'lucide-react';

// Fetch data from API
async function fetchData(key: string) {
  try {
    const res = await fetch(`/api/data/${key}`);
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

const AnimItem = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
);

export function ProjectsContent() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<any[]>([]);
  useEffect(() => { fetchData('projects').then(setProjects); }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <AnimItem><p className="text-white/50 mb-10 text-base text-center max-w-2xl">{t('projectsDesc')}</p></AnimItem>
      {projects.length === 0 ? (
        <div className="text-center py-16 text-white/20"><Code size={40} className="mx-auto mb-3" /><p>Loyihalar hali qo'shilmagan</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {projects.map((p: any, idx: number) => (
            <AnimItem key={p.id} delay={idx * 0.1}>
              <div className="glass-panel p-6 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group">
                <div className="w-full h-40 bg-black/30 rounded-2xl mb-4 overflow-hidden relative">
                  {p.imageUrl ? <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" /> : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#9B6DFF]/20 to-[#C4A1FF]/20 flex items-center justify-center"><Code className="w-10 h-10 text-white/20" /></div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
                <p className="text-white/50 text-sm mb-2">{p.description}</p>
                <p className="text-[#C4A1FF]/60 text-xs">{p.tech}</p>
                {p.url && p.url !== '#' && <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-[#C4A1FF] text-sm hover:text-white transition-colors"><ExternalLink size={14} /> Ko'rish</a>}
              </div>
            </AnimItem>
          ))}
        </div>
      )}
    </div>
  );
}

const iconMap: Record<string, any> = { Globe, Smartphone, Palette, Database, Wrench, Code };

export function ServicesContent() {
  const { t } = useLanguage();
  const [services, setServices] = useState<any[]>([]);
  useEffect(() => { fetchData('services').then(setServices); }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <AnimItem><p className="text-white/50 mb-10 text-base text-center max-w-2xl">{t('servicesDesc')}</p></AnimItem>
      {services.length === 0 ? (
        <div className="text-center py-16 text-white/20"><Wrench size={40} className="mx-auto mb-3" /><p>Xizmatlar hali qo'shilmagan</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {services.map((s: any, i: number) => {
            const IconComp = iconMap[s.icon] || Globe;
            return (
              <AnimItem key={s.id} delay={i * 0.1}>
                <div className="glass-panel p-8 rounded-3xl flex items-start gap-6 hover:bg-white/5 transition-colors group">
                  <div className="w-16 h-16 rounded-2xl bg-[#9B6DFF]/20 flex items-center justify-center border border-[#9B6DFF]/30 flex-shrink-0"><IconComp className="w-8 h-8 text-[#C4A1FF]" /></div>
                  <div><h3 className="text-2xl font-bold text-white mb-2">{s.title}</h3><p className="text-white/50">{s.description}</p></div>
                </div>
              </AnimItem>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CoursesContent() {
  const { t } = useLanguage();
  const [courses, setCourses] = useState<any[]>([]);
  useEffect(() => { fetchData('courses').then(setCourses); }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <AnimItem><p className="text-white/50 mb-10 text-base text-center max-w-2xl">{t('coursesDesc')}</p></AnimItem>
      {courses.length === 0 ? (
        <div className="text-center py-16 text-white/20"><Play size={40} className="mx-auto mb-3" /><p>Kurslar hali qo'shilmagan</p></div>
      ) : (
        <div className="flex flex-col gap-6 w-full max-w-4xl">
          {courses.map((c: any, idx: number) => (
            <AnimItem key={c.id} delay={idx * 0.1}>
              <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 group">
                <div className="w-full md:w-48 h-32 bg-black/40 rounded-2xl relative overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#9B6DFF]/20 to-transparent" />
                  <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white/50 group-hover:text-white transition-all" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{c.title}</h3>
                  <p className="text-white/40 mb-4">{c.description}</p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#9B6DFF]/15 text-xs text-[#C4A1FF] border border-[#9B6DFF]/20">{c.lessons} dars</span>
                    {c.hasCertificate && <span className="px-3 py-1 rounded-full bg-[#9B6DFF]/15 text-xs text-[#C4A1FF] border border-[#9B6DFF]/20">Sertifikat</span>}
                  </div>
                </div>
              </div>
            </AnimItem>
          ))}
        </div>
      )}
    </div>
  );
}

export function ResumeContent() {
  const { t } = useLanguage();
  const [resume, setResume] = useState<any[]>([]);
  useEffect(() => { fetchData('resume').then(setResume); }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <AnimItem><p className="text-white/50 mb-10 text-base text-center max-w-2xl">{t('resumeDesc')}</p></AnimItem>
      {resume.length === 0 ? (
        <div className="text-center py-16 text-white/20"><p>Resume hali qo'shilmagan</p></div>
      ) : (
        <div className="w-full max-w-3xl relative">
          <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#9B6DFF] via-[#C4A1FF]/30 to-transparent" />
          {resume.map((r: any, idx: number) => (
            <AnimItem key={r.id} delay={idx * 0.15}>
              <div className="relative pl-20 mb-10">
                <div className="absolute left-[26px] top-2 w-4 h-4 rounded-full bg-[#9B6DFF] shadow-[0_0_15px_#9B6DFF]" />
                <div className="glass-panel p-6 rounded-3xl">
                  <span className="text-[#C4A1FF] text-sm font-bold mb-2 block">{r.startYear} - {r.isPresent ? 'Hozirgacha' : r.endYear}</span>
                  <h3 className="text-xl font-bold text-white mb-1">{r.role}</h3>
                  <p className="text-white/40 text-sm mb-4">{r.company}</p>
                  <p className="text-white/60">{r.description}</p>
                </div>
              </div>
            </AnimItem>
          ))}
        </div>
      )}
    </div>
  );
}

export function ContactContent() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <AnimItem><p className="text-white/50 mb-10 text-base text-center max-w-2xl">{t('contactDesc')}</p></AnimItem>
      <AnimItem delay={0.2}>
        <div className="w-full max-w-2xl glass-panel p-10 rounded-[40px]">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-6">
              <input 
                type="text" 
                placeholder={t('namePlaceholder')} 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
                className="w-full md:w-1/2 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#9B6DFF]/50 transition-colors placeholder:text-white/30" 
              />
              <input 
                type="email" 
                placeholder={t('emailPlaceholder')} 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
                className="w-full md:w-1/2 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#9B6DFF]/50 transition-colors placeholder:text-white/30" 
              />
            </div>
            <input 
              type="text" 
              placeholder={t('subjectPlaceholder')} 
              value={formData.subject}
              onChange={e => setFormData({...formData, subject: e.target.value})}
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#9B6DFF]/50 transition-colors placeholder:text-white/30" 
            />
            <textarea 
              placeholder={t('message')} 
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              required
              rows={5} 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#9B6DFF]/50 transition-colors resize-none placeholder:text-white/30" 
            />
            
            {status === 'success' && <div className="text-green-400 text-sm text-center">Xabaringiz yuborildi! Tez orada javob beramiz.</div>}
            {status === 'error' && <div className="text-red-400 text-sm text-center">Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.</div>}

            <button 
              disabled={status === 'loading'}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#7B61FF] to-[#9B6DFF] text-white font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(155,109,255,0.4)] disabled:opacity-50"
            >
              {status === 'loading' ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={20} />{t('send')}</>}
            </button>
          </form>
        </div>
      </AnimItem>
    </div>
  );
}
