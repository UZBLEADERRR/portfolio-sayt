import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, Folder, Wrench, BookOpen, Rss, 
  MessageSquare, Users, Award, BarChart3, TrendingUp
} from 'lucide-react';
import { store } from '../store';

const StatCard = ({ icon: Icon, label, value, color, delay }: { icon: any; label: string; value: string | number; color: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="stat-card p-6 flex items-center gap-5"
  >
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
  const resume = store.getResume();
  const projects = store.getProjects();
  const services = store.getServices();
  const courses = store.getCourses();
  const blog = store.getBlog();
  const chats = store.getChatHistory();
  const stats = store.getStats();

  const statCards = [
    { icon: FileText, label: 'Resume yozuvlari', value: resume.length, color: '#9B6DFF' },
    { icon: Folder, label: 'Loyihalar', value: projects.length, color: '#7B61FF' },
    { icon: Wrench, label: 'Xizmatlar', value: services.length, color: '#C4A1FF' },
    { icon: BookOpen, label: 'Kurslar', value: courses.length, color: '#8B5CF6' },
    { icon: Rss, label: 'Blog postlar', value: blog.length, color: '#A78BFA' },
    { icon: MessageSquare, label: 'AI Chat xabarlari', value: chats.length, color: '#00D1FF' },
    { icon: Users, label: 'Mijozlar', value: stats[2]?.value || '0', color: '#00D68F' },
    { icon: Award, label: 'Sertifikatlar', value: stats[3]?.value || '0', color: '#FFB547' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-black bg-gradient-to-r from-[#9B6DFF] to-[#C4A1FF] bg-clip-text text-transparent"
        >
          Dashboard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-white/30 mt-2"
        >
          Portfolio boshqaruv markazi — barcha ma'lumotlarni bir joydan boshqaring
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map((stat, i) => (
          <StatCard key={i} {...stat} delay={i * 0.05} />
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-3xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="text-[#C4A1FF]" size={24} />
          <h2 className="text-xl font-bold text-white">Tezkor harakatlar</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: FileText, label: 'Resume qo\'shish', color: '#9B6DFF' },
            { icon: Folder, label: 'Loyiha qo\'shish', color: '#7B61FF' },
            { icon: Rss, label: 'Post yozish', color: '#C4A1FF' },
            { icon: BarChart3, label: 'Statistikani ko\'rish', color: '#00D1FF' },
          ].map((action, i) => (
            <button
              key={i}
              className="p-5 rounded-2xl bg-white/3 border border-white/5 hover:border-[#9B6DFF]/30 hover:bg-white/5 transition-all flex flex-col items-center gap-3 group"
            >
              <action.icon size={28} className="text-white/30 group-hover:text-[#C4A1FF] transition-colors" />
              <span className="text-white/50 text-sm group-hover:text-white transition-colors">{action.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
