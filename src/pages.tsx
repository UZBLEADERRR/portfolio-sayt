import React from 'react';
import { useLanguage } from './context/LanguageContext';
import { motion } from 'motion/react';
import { Code, Palette, Smartphone, Globe, Database, Play, Send } from 'lucide-react';

const AnimItem = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export function ProjectsContent() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center w-full">
      <AnimItem><p className="text-white/50 mb-10 text-base text-center max-w-2xl">{t('projectsDesc')}</p></AnimItem>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {[1, 2, 3, 4, 5, 6].map((i, idx) => (
          <AnimItem key={i} delay={idx * 0.1}>
            <div className="glass-panel p-6 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-full h-40 bg-black/30 rounded-2xl mb-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#9B6DFF]/20 to-[#C4A1FF]/20 group-hover:scale-110 transition-transform duration-500" />
                <Code className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-white/20 group-hover:text-[#C4A1FF] transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Project Alpha {i}</h3>
              <p className="text-white/40 text-sm">{t('projectTech')}</p>
            </div>
          </AnimItem>
        ))}
      </div>
    </div>
  );
}

export function ServicesContent() {
  const { t } = useLanguage();
  const services = [
    { icon: Globe, title: t('serviceWeb'), desc: t('serviceWebDesc') },
    { icon: Smartphone, title: t('serviceMobile'), desc: t('serviceMobileDesc') },
    { icon: Palette, title: t('serviceUI'), desc: t('serviceUIDesc') },
    { icon: Database, title: t('serviceBackend'), desc: t('serviceBackendDesc') },
  ];
  return (
    <div className="flex flex-col items-center w-full">
      <AnimItem><p className="text-white/50 mb-10 text-base text-center max-w-2xl">{t('servicesDesc')}</p></AnimItem>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {services.map((s, i) => (
          <AnimItem key={i} delay={i * 0.1}>
            <div className="glass-panel p-8 rounded-3xl flex items-start gap-6 hover:bg-white/5 transition-colors group">
              <div className="w-16 h-16 rounded-2xl bg-[#9B6DFF]/20 flex items-center justify-center border border-[#9B6DFF]/30 group-hover:border-[#C4A1FF] transition-colors flex-shrink-0">
                <s.icon className="w-8 h-8 text-[#C4A1FF]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{s.title}</h3>
                <p className="text-white/50">{s.desc}</p>
              </div>
            </div>
          </AnimItem>
        ))}
      </div>
    </div>
  );
}

export function CoursesContent() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center w-full">
      <AnimItem><p className="text-white/50 mb-10 text-base text-center max-w-2xl">{t('coursesDesc')}</p></AnimItem>
      <div className="flex flex-col gap-6 w-full max-w-4xl">
        {[1, 2, 3].map((i, idx) => (
          <AnimItem key={i} delay={idx * 0.1}>
            <div className="glass-panel p-4 rounded-3xl flex flex-col md:flex-row items-center gap-6 group">
              <div className="w-full md:w-48 h-32 bg-black/40 rounded-2xl relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-[#9B6DFF]/20 to-transparent" />
                <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white/50 group-hover:text-white group-hover:scale-110 transition-all" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Frontend Masterclass {i}</h3>
                <p className="text-white/40 mb-4">{t('courseDesc')}</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#9B6DFF]/15 text-xs text-[#C4A1FF] border border-[#9B6DFF]/20">24 {t('courseLessons')}</span>
                  <span className="px-3 py-1 rounded-full bg-[#9B6DFF]/15 text-xs text-[#C4A1FF] border border-[#9B6DFF]/20">{t('courseCert')}</span>
                </div>
              </div>
            </div>
          </AnimItem>
        ))}
      </div>
    </div>
  );
}

export function ResumeContent() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center w-full">
      <AnimItem><p className="text-white/50 mb-10 text-base text-center max-w-2xl">{t('resumeDesc')}</p></AnimItem>
      <div className="w-full max-w-3xl relative">
        <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#9B6DFF] via-[#C4A1FF]/30 to-transparent" />
        {[1, 2, 3].map((i, idx) => (
          <AnimItem key={i} delay={idx * 0.15}>
            <div className="relative pl-20 mb-10">
              <div className="absolute left-[26px] top-2 w-4 h-4 rounded-full bg-[#9B6DFF] shadow-[0_0_15px_#9B6DFF]" />
              <div className="glass-panel p-6 rounded-3xl">
                <span className="text-[#C4A1FF] text-sm font-bold mb-2 block">202{4-i} - {i === 1 ? t('present') : `202${5-i}`}</span>
                <h3 className="text-xl font-bold text-white mb-1">{t('resumeRole')}</h3>
                <p className="text-white/40 text-sm mb-4">{t('resumeCompany')} {i}</p>
                <p className="text-white/60">{t('resumeDetail')}</p>
              </div>
            </div>
          </AnimItem>
        ))}
      </div>
    </div>
  );
}

export function ContactContent() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center w-full">
      <AnimItem><p className="text-white/50 mb-10 text-base text-center max-w-2xl">{t('contactDesc')}</p></AnimItem>
      <AnimItem delay={0.2}>
        <div className="w-full max-w-2xl glass-panel p-10 rounded-[40px]">
          <form className="flex flex-col gap-6" onSubmit={e => e.preventDefault()}>
            <div className="flex flex-col md:flex-row gap-6">
              <input type="text" placeholder={t('namePlaceholder')} className="w-full md:w-1/2 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#9B6DFF]/50 transition-colors placeholder:text-white/30" />
              <input type="email" placeholder={t('emailPlaceholder')} className="w-full md:w-1/2 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#9B6DFF]/50 transition-colors placeholder:text-white/30" />
            </div>
            <input type="text" placeholder={t('subjectPlaceholder')} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#9B6DFF]/50 transition-colors placeholder:text-white/30" />
            <textarea placeholder={t('message')} rows={5} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#9B6DFF]/50 transition-colors resize-none placeholder:text-white/30" />
            <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#7B61FF] to-[#9B6DFF] text-white font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(155,109,255,0.4)]">
              <Send size={20} />
              {t('send')}
            </button>
          </form>
        </div>
      </AnimItem>
    </div>
  );
}
