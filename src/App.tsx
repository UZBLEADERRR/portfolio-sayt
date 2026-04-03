import React from 'react';
import { AnimatePresence } from 'motion/react';
import TopNavbar from './components/TopNavbar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import BottomNavbar from './components/BottomNavbar';
import HeroSystem from './components/HeroSystem';
import SlidePanel from './components/SlidePanel';
import RocketCursor from './components/RocketCursor';
import { LanguageProvider } from './context/LanguageContext';
import { UIProvider, useUI } from './context/UIContext';
import { useLanguage } from './context/LanguageContext';
import { ProjectsContent, ServicesContent, CoursesContent, ResumeContent, ContactContent } from './pages';
import { Folder, Wrench, BookOpen, FileText, Mail } from 'lucide-react';

function PanelManager() {
  const { activePanel } = useUI();
  const { t } = useLanguage();

  const panelConfig: Record<string, { title: string; color: string; icon: React.ReactNode; content: React.ReactNode }> = {
    'page-projects': { title: t('projectsTitle'), color: '#9B6DFF', icon: <Folder size={28} />, content: <ProjectsContent /> },
    'page-services': { title: t('servicesTitle'), color: '#8B5CF6', icon: <Wrench size={28} />, content: <ServicesContent /> },
    'page-courses': { title: t('coursesTitle'), color: '#7C3AED', icon: <BookOpen size={28} />, content: <CoursesContent /> },
    'page-resume': { title: t('resumeTitle'), color: '#DDD6FE', icon: <FileText size={28} />, content: <ResumeContent /> },
    'page-contact': { title: t('contactTitle'), color: '#A78BFA', icon: <Mail size={28} />, content: <ContactContent /> },
  };

  const config = panelConfig[activePanel];

  return (
    <AnimatePresence mode="wait">
      {config && (
        <SlidePanel
          key={activePanel}
          title={config.title}
          titleColor={config.color}
          icon={config.icon}
        >
          {config.content}
        </SlidePanel>
      )}
    </AnimatePresence>
  );
}

function AppContent() {
  return (
    <div className="relative w-screen h-screen overflow-hidden text-white" style={{ background: '#0a0515' }}>
      {/* Rocket cursor */}
      <RocketCursor />
      
      {/* 3D Background */}
      <HeroSystem />
      
      {/* Fixed Navigation & Sidebars */}
      <TopNavbar />
      <LeftSidebar />
      <RightSidebar />
      <BottomNavbar />

      {/* Slide Panels */}
      <PanelManager />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <UIProvider>
        <AppContent />
      </UIProvider>
    </LanguageProvider>
  );
}
