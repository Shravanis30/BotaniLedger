import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../lib/store';
import { ShieldCheck, Eye, EyeOff, TreeDeciduous, Loader2 } from 'lucide-react';
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
        // response is the body { success, message, data: { user, accessToken } }
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
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/2 sidebar-gradient p-16 flex-col justify-between text-white relative">
        <div className="z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-white p-2 rounded-xl">
              <TreeDeciduous className="w-8 h-8 text-primary" />
            </div>
            <span className="text-3xl font-bold tracking-tight">BotaniLedger</span>
          </div>
          
          <h2 className="text-5xl font-bold leading-tight mb-8">
            The Golden Standard in <br/>
            <span className="text-accent-light">Ayurvedic Traceability</span>
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-1 h-12 bg-accent-light rounded-full"></div>
              <p className="text-lg text-green-100/80 max-w-md italic">
                Protecting farmers, empowering manufacturers, and securing consumers with immutable batch records.
              </p>
            </div>
          </div>
        </div>

        <div className="relative h-64 w-full bg-white/5 rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="5,5" className="animate-spin-slow" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="3,3" className="animate-spin-slower" />
                </svg>
            </div>
            <ShieldCheck className="w-24 h-24 text-accent-light z-10" />
        </div>

        <div className="text-sm text-green-100/40">
           © 2025 BotaniLedger Ecosystem v1.4.2
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-secondary/20">
        <div className="max-w-md w-full animate-fade-in">
          <div className="mb-12 text-center md:text-left">
            <div className="md:hidden flex items-center justify-center gap-2 mb-6 text-primary">
              <TreeDeciduous className="w-8 h-8" />
              <span className="text-2xl font-bold">BotaniLedger</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome back</h1>
            <p className="text-gray-500">Sign in to your secure ecosystem node</p>
            
            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold animate-in slide-in-from-top-2">
                    {error}
                </div>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700 ml-1">Official Email</label>
              <input 
                id="email"
                name="email"
                type="email" 
                required
                className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-0 transition-all outline-none bg-white font-medium"
                placeholder="yourname@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-0 transition-all outline-none bg-white font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-[44px] text-gray-400 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-green-900/10 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <><Loader2 className="animate-spin" size={20} /> Authenticating...</> : 'Sign In to Platform'}
            </button>

            <div className="relative py-4 flex items-center justify-center">
                <div className="border-t border-gray-200 w-full absolute"></div>
                <span className="bg-white px-4 text-xs font-bold text-gray-400 uppercase relative z-10 tracking-widest">Global Security Protocol</span>
            </div>

            <p className="text-center text-gray-500 font-medium">
              New stakeholder? <Link to="/register" className="text-accent-light font-bold hover:underline">Apply for Onboarding</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
