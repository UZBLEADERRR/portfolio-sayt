import React from 'react';
import { useLanguage } from './context/LanguageContext';
import { motion } from 'motion/react';
import { Code, Palette, Smartphone, Globe, Database, Play, Send } from 'lucide-react';

export const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(15px)' }}
    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -50, scale: 0.9, filter: 'blur(15px)' }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className="min-h-screen pt-32 pb-40 px-10 flex flex-col items-center w-full absolute inset-0"
  >
    {children}
  </motion.div>
);

export function ProjectsPage() {
  const { t } = useLanguage();
  return (
    <PageWrapper>
      <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(79,124,255,0.8)]">{t('projectsTitle')}</h1>
      <p className="text-white/60 mb-12 text-lg">{t('projectsDesc')}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="glass-panel p-6 rounded-3xl hover:-translate-y-2 transition-transform duration-300 cursor-pointer group">
            <div className="w-full h-40 bg-black/40 rounded-2xl mb-4 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4F7CFF]/20 to-[#7B61FF]/20 group-hover:scale-110 transition-transform duration-500" />
              <Code className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-white/20 group-hover:text-[#00D1FF] transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Project Alpha {i}</h3>
            <p className="text-white/50 text-sm">{t('projectTech')}</p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

export function ServicesPage() {
  const { t } = useLanguage();
  const services = [
    { icon: Globe, title: t('serviceWeb'), desc: t('serviceWebDesc') },
    { icon: Smartphone, title: t('serviceMobile'), desc: t('serviceMobileDesc') },
    { icon: Palette, title: t('serviceUI'), desc: t('serviceUIDesc') },
    { icon: Database, title: t('serviceBackend'), desc: t('serviceBackendDesc') },
  ];
  return (
    <PageWrapper>
      <h1 className="text-5xl font-bold text-[#7B61FF] mb-4 drop-shadow-[0_0_15px_rgba(123,97,255,0.8)]">{t('servicesTitle')}</h1>
      <p className="text-white/60 mb-12 text-lg">{t('servicesDesc')}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {services.map((s, i) => (
          <div key={i} className="glass-panel p-8 rounded-3xl flex items-start gap-6 hover:bg-white/5 transition-colors group">
            <div className="w-16 h-16 rounded-2xl bg-[#7B61FF]/20 flex items-center justify-center border border-[#7B61FF]/30 group-hover:border-[#00D1FF] transition-colors">
              <s.icon className="w-8 h-8 text-[#00D1FF]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{s.title}</h3>
              <p className="text-white/60">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

export function CoursesPage() {
  const { t } = useLanguage();
  return (
    <PageWrapper>
      <h1 className="text-5xl font-bold text-[#00D1FF] mb-4 drop-shadow-[0_0_15px_rgba(0,209,255,0.8)]">{t('coursesTitle')}</h1>
      <p className="text-white/60 mb-12 text-lg">{t('coursesDesc')}</p>
      <div className="flex flex-col gap-6 w-full max-w-4xl">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-panel p-4 rounded-3xl flex items-center gap-6 group cursor-pointer">
            <div className="w-48 h-32 bg-black/50 rounded-2xl relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00D1FF]/20 to-transparent" />
              <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white/50 group-hover:text-white group-hover:scale-110 transition-all" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">Frontend Masterclass {i}</h3>
              <p className="text-white/50 mb-4">{t('courseDesc')}</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/70">24 {t('courseLessons')}</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/70">{t('courseCert')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

export function ResumePage() {
  const { t } = useLanguage();
  return (
    <PageWrapper>
      <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">{t('resumeTitle')}</h1>
      <p className="text-white/60 mb-12 text-lg">{t('resumeDesc')}</p>
      <div className="w-full max-w-3xl relative">
        <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-white/10" />
        {[1, 2, 3].map(i => (
          <div key={i} className="relative pl-20 mb-10">
            <div className="absolute left-[26px] top-2 w-4 h-4 rounded-full bg-[#4F7CFF] shadow-[0_0_10px_#4F7CFF]" />
            <div className="glass-panel p-6 rounded-3xl">
              <span className="text-[#00D1FF] text-sm font-bold mb-2 block">202{4-i} - {i === 1 ? t('present') : `202${5-i}`}</span>
              <h3 className="text-xl font-bold text-white mb-1">{t('resumeRole')}</h3>
              <p className="text-white/50 text-sm mb-4">{t('resumeCompany')} {i}</p>
              <p className="text-white/70">{t('resumeDetail')}</p>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

export function ContactPage() {
  const { t } = useLanguage();
  return (
    <PageWrapper>
      <h1 className="text-5xl font-bold text-[#FF4F7C] mb-4 drop-shadow-[0_0_15px_rgba(255,79,124,0.8)]">{t('contactTitle')}</h1>
      <p className="text-white/60 mb-12 text-lg">{t('contactDesc')}</p>
      <div className="w-full max-w-2xl glass-panel p-10 rounded-[40px]">
        <form className="flex flex-col gap-6" onSubmit={e => e.preventDefault()}>
          <div className="flex gap-6">
            <input type="text" placeholder={t('namePlaceholder')} className="w-1/2 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#FF4F7C]/50 transition-colors" />
            <input type="email" placeholder={t('emailPlaceholder')} className="w-1/2 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#FF4F7C]/50 transition-colors" />
          </div>
          <input type="text" placeholder={t('subjectPlaceholder')} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#FF4F7C]/50 transition-colors" />
          <textarea placeholder={t('message')} rows={5} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#FF4F7C]/50 transition-colors resize-none" />
          <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF4F7C] to-[#7B61FF] text-white font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Send size={20} />
            {t('send')}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}
