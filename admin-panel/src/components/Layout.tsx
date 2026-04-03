import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, FileText, Folder, Wrench, BookOpen, 
  Rss, Bot, MessageSquare, BarChart3, Share2, LogOut,
  ChevronLeft, ChevronRight, Shield, Mail
} from 'lucide-react';
import { store } from '../store';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'resume', icon: FileText, label: 'Resume' },
  { id: 'projects', icon: Folder, label: 'Loyihalar' },
  { id: 'services', icon: Wrench, label: 'Xizmatlar' },
  { id: 'courses', icon: BookOpen, label: 'Kurslar' },
  { id: 'blog', icon: Rss, label: 'Blog' },
  { id: 'stats', icon: BarChart3, label: 'Statistika' },
  { id: 'socials', icon: Share2, label: 'Tarmoqlar' },
  { id: 'messages', icon: Mail, label: 'Xabarlar' },
  { id: 'ai-settings', icon: Bot, label: 'AI Sozlamalar' },
  { id: 'chat-history', icon: MessageSquare, label: 'Chat Tarixi' },
];

export default function Layout({ children, activePage, onNavigate, onLogout }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    store.setAuth(false);
    onLogout();
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'radial-gradient(ellipse at 20% 30%, #1a0a2e 0%, #0a0515 50%, #050210 100%)' }}>
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="h-full flex flex-col border-r border-[#9B6DFF]/10 bg-[#0a0515]/80 backdrop-blur-xl flex-shrink-0 relative z-20"
      >
        {/* Header */}
        <div className="p-5 flex items-center gap-3 border-b border-[#9B6DFF]/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7B61FF] to-[#9B6DFF] flex items-center justify-center shadow-[0_0_20px_rgba(155,109,255,0.3)] flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-sm font-bold text-white whitespace-nowrap">SARVAR.GPT</h2>
                <p className="text-[10px] text-white/30">Admin Panel</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`sidebar-item w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-left transition-all ${
                activePage === item.id 
                  ? 'active bg-[#9B6DFF]/15 text-white border-r-0' 
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <item.icon size={20} className={`flex-shrink-0 ${activePage === item.id ? 'text-[#C4A1FF]' : ''}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[#9B6DFF]/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-[#FF4F6D] hover:bg-[#FF4F6D]/10 transition-all"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  Chiqish
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1a1128] border border-[#9B6DFF]/20 flex items-center justify-center text-white/40 hover:text-white hover:border-[#9B6DFF]/40 transition-all z-30"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-10 max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
