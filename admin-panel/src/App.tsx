import React, { useState } from 'react';
import { store } from './store';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ResumeManager from './pages/ResumeManager';
import { ProjectsManager, ServicesManager, CoursesManager, BlogManager, StatsManager, SocialsManager, MessagesManager } from './pages/Managers';
import { AISettingsPage, ChatHistoryPage } from './pages/AIPages';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const pages: Record<string, React.ReactNode> = {
    'dashboard': <Dashboard />,
    'resume': <ResumeManager />,
    'projects': <ProjectsManager />,
    'services': <ServicesManager />,
    'courses': <CoursesManager />,
    'blog': <BlogManager />,
    'stats': <StatsManager />,
    'socials': <SocialsManager />,
    'messages': <MessagesManager />,
    'ai-settings': <AISettingsPage />,
    'chat-history': <ChatHistoryPage />,
  };

  return (
    <Layout
      activePage={activePage}
      onNavigate={setActivePage}
      onLogout={() => { window.location.reload(); }}
    >
      {pages[activePage] || <Dashboard />}
    </Layout>
  );
}
