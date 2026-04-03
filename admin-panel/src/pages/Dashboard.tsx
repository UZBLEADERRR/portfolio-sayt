import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Folder, Wrench, BookOpen, Rss, MessageSquare, Users, Award, BarChart3, TrendingUp } from 'lucide-react';
import { store } from '../store';

const StatCard = ({ icon: Icon, label, value, color, delay }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="stat-card p-6 flex items-center gap-5">
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
      <Icon className="w-7 h-7" style={{ color }} />
    </div>
    <div>
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="text-white/40 text-sm">{label}</p>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const [counts, setCounts] = useState({ resume: 0, projects: 0, services: 0, courses: 0, blog: 0, chats: 0 });

  useEffect(() => {
    async function load() {
      const [resume, projects, services, courses, blog, chats] = await Promise.all([
        store.getResume(), store.getProjects(), store.getServices(),
        store.getCourses(), store.getBlog(), store.getChatHistory(),
      ]);
      setCounts({
        resume: resume?.length || 0, projects: projects?.length || 0,
        services: services?.length || 0, courses: courses?.length || 0,
        blog: blog?.length || 0, chats: chats?.length || 0,
      });
    }
    load();
  }, []);

  const statCards = [
    { icon: FileText, label: 'Resume', value: counts.resume, color: '#9B6DFF' },
    { icon: Folder, label: 'Loyihalar', value: counts.projects, color: '#7B61FF' },
    { icon: Wrench, label: 'Xizmatlar', value: counts.services, color: '#C4A1FF' },
    { icon: BookOpen, label: 'Kurslar', value: counts.courses, color: '#8B5CF6' },
    { icon: Rss, label: 'Blog', value: counts.blog, color: '#A78BFA' },
    { icon: MessageSquare, label: 'Chat xabarlari', value: counts.chats, color: '#00D1FF' },
  ];

  return (
    <div>
      <div className="mb-10">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl font-black bg-gradient-to-r from-[#9B6DFF] to-[#C4A1FF] bg-clip-text text-transparent">Dashboard</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-white/30 mt-2">Portfolio boshqaruv markazi</motion.p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {statCards.map((stat, i) => <StatCard key={i} {...stat} delay={i * 0.05} />)}
      </div>
    </div>
  );
}
