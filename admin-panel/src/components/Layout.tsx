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
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    store.setAuth(false);
    onLogout();
  };

  const nav = (
    <nav className="flex-1 overflow-y-auto py-4 px-3">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
          className={`sidebar-item w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-left transition-all ${
            activePage === item.id 
              ? 'active bg-[#00D1FF]/15 text-white' 
              : 'text-white/50 hover:text-white'
          }`}
        >
          <item.icon size={20} className={`flex-shrink-0 ${activePage === item.id ? 'text-[#00D1FF]' : ''}`} />
          <span className={`text-sm font-medium whitespace-nowrap ${(collapsed && !mobileOpen) ? 'hidden' : 'block'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'radial-gradient(ellipse at 20% 30%, #051015 0%, #020810 100%)' }}>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-5 right-5 z-50 w-12 h-12 rounded-2xl bg-[#00D1FF]/20 border border-[#00D1FF]/30 flex items-center justify-center text-[#00D1FF] shadow-[0_0_20px_rgba(0,209,255,0.3)]"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar - Desktop */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 280 }}
        className="hidden md:flex h-full flex-col border-r border-white/5 bg-black/40 backdrop-blur-3xl flex-shrink-0 relative z-20"
      >
        <div className="p-6 flex items-center gap-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D1FF] to-[#00FFCC] flex items-center justify-center shadow-[0_0_30px_rgba(0,209,255,0.4)] flex-shrink-0">
            <Shield className="w-5 h-5 text-black" />
          </div>
          {!collapsed && <h2 className="text-sm font-black text-white tracking-widest">SARVAR.GPT</h2>}
        </div>
        {nav}
        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/30 hover:text-[#FF4F6D] hover:bg-[#FF4F6D]/10 transition-all font-bold">
            <LogOut size={20} />
            {!collapsed && <span>Chiqish</span>}
          </button>
        </div>
        <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#051015] border border-white/10 flex items-center justify-center text-white/40 hover:text-[#00D1FF] transition-all">
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="md:hidden fixed inset-y-0 left-0 w-72 bg-[#051015] border-r border-[#00D1FF]/20 z-50 flex flex-col">
              <div className="p-6 flex items-center gap-4 border-b border-white/5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D1FF] to-[#00FFCC] flex items-center justify-center"><Shield className="w-5 h-5 text-black" /></div>
                <h2 className="text-sm font-black text-white tracking-widest">SARVAR.GPT</h2>
              </div>
              {nav}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-5 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

import { Menu } from 'lucide-react';
