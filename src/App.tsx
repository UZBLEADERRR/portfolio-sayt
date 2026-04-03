import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import TopNavbar from './components/TopNavbar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import BottomNavbar from './components/BottomNavbar';
import HeroSystem from './components/HeroSystem';
import { LanguageProvider } from './context/LanguageContext';
import { UIProvider } from './context/UIContext';
import { ProjectsPage, ServicesPage, CoursesPage, ResumePage, ContactPage } from './pages';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            initial={{ opacity: 0, filter: 'blur(15px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(15px)' }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <HeroSystem />
          </motion.div>
        } />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <UIProvider>
        <BrowserRouter>
          <div className="relative w-screen h-screen overflow-hidden text-white bg-[#020611]">
            {/* Fixed Navigation & Sidebars */}
            <TopNavbar />
            <LeftSidebar />
            <RightSidebar />
            <BottomNavbar />

            {/* Scrollable Main Content Area */}
            <main className="absolute inset-0 overflow-y-auto overflow-x-hidden z-10 scroll-smooth">
              <div className="px-4 md:px-[120px] min-h-full relative">
                <AnimatedRoutes />
              </div>
            </main>
          </div>
        </BrowserRouter>
      </UIProvider>
    </LanguageProvider>
  );
}
