import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../lib/store';
import { ShieldCheck, Eye, EyeOff, TreeDeciduous, Loader2, Lock, ArrowRight, Globe, Shield } from 'lucide-react';
import api from '../../lib/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
        const response = await api.post('/auth/login', { email, password });
        const { user, accessToken } = response.data;
        
        login(user, accessToken);
        
        const roleRedirects = {
          farmer: '/farmer',
          lab: '/lab',
          manufacturer: '/manufacturer',
          admin: '/admin',
          regulator: '/regulator'
        };
        
        navigate(roleRedirects[user.role] || '/');
    } catch (err) {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0d1f18] text-white selection:bg-accent selection:text-primary-dark">
      {/* Left side - Cinematic Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-botanical.png" 
            alt="Botanical Traceability" 
            className="w-full h-full object-cover opacity-50 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1f18] via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 hero-overlay" />
        </div>

        <div className="relative z-10 p-20 flex flex-col justify-between h-full w-full">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-20"
            >
              <div className="p-3 bg-accent rounded-2xl shadow-[0_0_30px_rgba(76,175,80,0.4)]">
                <ShieldCheck className="w-8 h-8 text-primary-dark" />
              </div>
              <span className="text-3xl font-bold tracking-tight italic text-white">Botani<span className="text-accent font-light">Ledger</span></span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl font-bold leading-[1.1] mb-10 text-gradient italic"
            >
              Securing the <br/>
              <span className="font-light not-italic text-white">Truth of</span> <br/>
              Ayurveda.
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              <div className="flex gap-6 items-start max-w-md">
                <div className="w-1.5 h-12 gold-gradient rounded-full shrink-0" />
                <p className="text-xl text-green-100/50 leading-relaxed font-light italic">
                  "Authenticity is the soul of healing. We provide the mathematical proof."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="glass-card p-4 rounded-2xl border-white/10 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Globe size={16} className="text-accent" />
                   </div>
                   <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Global Protocol</span>
                 </div>
                 <div className="glass-card p-4 rounded-2xl border-white/10 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Lock size={16} className="text-emerald-400" />
                   </div>
                   <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">End-to-End Encrypted</span>
                 </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[10px] uppercase tracking-[0.4em] text-white/20 flex items-center gap-3"
          >
             <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
             Ecosystem Node v1.4.2 Connected
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0a1712] relative overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-900/10 blur-[120px] rounded-full -ml-64 -mb-64" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full relative z-10"
        >
          <div className="mb-12 text-center lg:text-left">
            <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
              <div className="p-2 bg-accent rounded-xl">
                 <ShieldCheck className="w-6 h-6 text-primary-dark" />
              </div>
              <span className="text-2xl font-bold tracking-tight italic text-white">Botani<span className="text-accent font-light">Ledger</span></span>
            </div>
            
            <h1 className="text-4xl font-bold italic mb-4 tracking-tight">Ecosystem Login</h1>
            <p className="text-green-100/40 font-light">Enter your secure credentials to access the ledger.</p>
            
            {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center"
                >
                    {error}
                </motion.div>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="email" className="text-[10px] font-bold text-accent uppercase tracking-widest ml-1">Official Registry Email</label>
              <div className="relative group">
                <input 
                  id="email"
                  name="email"
                  type="email" 
                  required
                  className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-3xl focus:border-accent focus:bg-white/10 transition-all outline-none font-medium placeholder:text-white/10 group-hover:border-white/20 text-white"
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3 relative">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-accent uppercase tracking-widest">Digital Keys</label>
                <Link to="#" className="text-[10px] font-bold text-white/20 hover:text-white transition-colors uppercase tracking-widest">Forgot Passkey?</Link>
              </div>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-3xl focus:border-accent focus:bg-white/10 transition-all outline-none font-medium placeholder:text-white/10 group-hover:border-white/20 text-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-[22px] text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-accent text-primary-dark rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_10px_30px_rgba(76,175,80,0.2)] flex items-center justify-center gap-3 disabled:opacity-50 mt-12"
            >
              {isSubmitting ? (
                <><Loader2 className="animate-spin" size={20} /> <span className="animate-pulse">Validating Proof...</span></>
              ) : (
                <>Sign In to Node <ArrowRight size={20} /></>
              )}
            </motion.button>

            <div className="relative py-10 flex items-center justify-center">
                <div className="border-t border-white/5 w-full absolute"></div>
                <span className="bg-[#0a1712] px-6 text-[10px] font-black text-white/10 uppercase relative z-10 tracking-[0.4em]">Governance Required</span>
            </div>

            <p className="text-center text-sm font-light text-white/30">
              New stakeholder? <Link to="/register" className="text-accent font-bold italic hover:underline ml-1">Apply for Onboarding</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
