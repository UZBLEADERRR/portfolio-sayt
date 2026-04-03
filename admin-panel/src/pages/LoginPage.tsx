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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const creds = store.getCredentials();
      if (username === creds.username && password === creds.password) {
        store.setAuth(true);
        onLogin();
      } else {
        setError('Login yoki parol noto\'g\'ri');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at 50% 30%, #1a0a2e 0%, #0a0515 60%, #050210 100%)' }}>
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#9B6DFF]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-[32px] p-10 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#9B6DFF]/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#7B61FF]/15 rounded-full blur-[80px]" />

          {/* Logo */}
          <div className="flex flex-col items-center mb-10 relative z-10">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#7B61FF] to-[#9B6DFF] flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(155,109,255,0.4)]"
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-[#9B6DFF] via-[#C4A1FF] to-[#7B61FF] bg-clip-text text-transparent">
              SARVAR.GPT
            </h1>
            <p className="text-white/40 text-sm mt-2">Admin Panel</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div>
              <label className="text-white/50 text-xs font-medium mb-2 block uppercase tracking-wider">Login</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field text-sm"
                placeholder="Username kiriting"
                required
              />
            </div>

            <div>
              <label className="text-white/50 text-xs font-medium mb-2 block uppercase tracking-wider">Parol</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field text-sm pr-12"
                  placeholder="Parolni kiriting"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-[#FF4F6D] text-sm bg-[#FF4F6D]/10 px-4 py-3 rounded-xl border border-[#FF4F6D]/20"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-4 text-base rounded-2xl disabled:opacity-50"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                'Kirish'
              )}
            </button>
          </form>

          <p className="text-white/20 text-[10px] text-center mt-8 relative z-10">
            Default: admin / sarvar2024
          </p>
        </div>
      </motion.div>
    </div>
  );
}
