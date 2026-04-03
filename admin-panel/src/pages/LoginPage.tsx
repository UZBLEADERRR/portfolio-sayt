import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { store } from '../store';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await store.login(username.trim(), password.trim());
    if (success) {
      onLogin();
    } else {
      setError('Login yoki parol noto\'g\'ri');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'radial-gradient(ellipse at 50% 30%, #051015 0%, #020810 100%)' }}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-[#00D1FF]"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0.1, 0.5, 0.1], scale: [1, 2, 1] }}
            transition={{ duration: 4 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="glass-card rounded-[40px] p-8 md:p-12 relative overflow-hidden border-white/5 bg-black/20 backdrop-blur-3xl">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00D1FF]/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#00FFCC]/10 rounded-full blur-[80px]" />

          <div className="flex flex-col items-center mb-12 relative z-10">
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#00D1FF] to-[#00FFCC] flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(0,209,255,0.4)]"
            >
              <Shield className="w-10 h-10 text-black" />
            </motion.div>
            <h1 className="text-3xl font-black text-white tracking-widest">SARVAR.GPT</h1>
            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-[#00D1FF] to-transparent mt-3 opacity-50" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="text-[#00D1FF] text-[10px] font-black uppercase tracking-[0.2em] mb-3 block opacity-70">Administrator Login</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="input-field text-sm bg-white/5 border-white/10 focus:border-[#00D1FF]/50" placeholder="Username" required />
            </div>
            <div>
              <label className="text-[#00D1FF] text-[10px] font-black uppercase tracking-[0.2em] mb-3 block opacity-70">Security Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="input-field text-sm pr-12 bg-white/5 border-white/10 focus:border-[#00D1FF]/50" placeholder="Password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#00D1FF] transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 text-[#FF4F6D] text-xs bg-[#FF4F6D]/10 px-4 py-4 rounded-2xl border border-[#FF4F6D]/20 font-bold">
                <AlertCircle size={14} />{error}
              </motion.div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-5 text-sm font-black uppercase tracking-widest rounded-2xl disabled:opacity-50 shadow-[0_0_30px_rgba(0,209,255,0.2)] hover:shadow-[0_0_40px_rgba(0,209,255,0.4)]">
              {loading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : 'Sistemaga Kirish'}
            </button>
          </form>
          <p className="text-white/10 text-[9px] text-center mt-12 font-bold tracking-widest">SARVAR.GPT SECURE ACCESS v2.0</p>
        </div>
      </motion.div>
    </div>
  );
}
