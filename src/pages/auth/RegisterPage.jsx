import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TreeDeciduous, Upload, ShieldCheck, MapPin, Building2, UserCircle, ArrowRight, Shield, Lock, Sprout, Loader2 } from 'lucide-react';
import { Card } from '../../components/shared/UI';
import api from '../../lib/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('FARMER');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
        const payload = {
            ...formData,
            role: role === 'LABORATORY' ? 'lab' : role.toLowerCase(),
            organization: formData.name,
            address: formData.location
        };

        await api.post('/auth/register', payload);
        navigate('/awaiting-approval');
    } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1f18] text-white selection:bg-accent selection:text-primary-dark relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-botanical.png" 
          alt="Backdrop" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1f18] via-[#0d1f18]/80 to-[#0d1f18]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
            <motion.div 
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-3 mb-8"
            >
                <div className="p-3 bg-accent rounded-2xl shadow-[0_0_30px_rgba(76,175,80,0.4)]">
                    <ShieldCheck className="w-8 h-8 text-primary-dark" />
                </div>
                <span className="text-3xl font-bold tracking-tight italic text-white">Botani<span className="text-accent font-light">Ledger</span></span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-black italic tracking-tighter text-gradient"
            >
              Registry Onboarding
            </motion.h1>
            <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.3 }}
               className="text-green-100/40 font-light mt-4"
            >
              Apply for stakeholder status in the decentralized Ayurvedic network.
            </motion.p>
            
            {error && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest max-w-md mx-auto"
               >
                 {error}
               </motion.div>
            )}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card p-12 border-white/10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
              <form onSubmit={handleSubmit} className="space-y-12">
                  {/* Role Switcher */}
                  <div className="space-y-4">
                      <label className="text-[10px] font-black text-accent uppercase tracking-[0.3em] ml-1">Identity Classification</label>
                      <div className="grid grid-cols-3 gap-4 p-2 bg-white/5 rounded-3xl border border-white/5">
                          {['FARMER', 'LABORATORY', 'MANUFACTURER'].map((r) => (
                              <button
                                  key={r}
                                  type="button"
                                  onClick={() => setRole(r)}
                                  className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                      role === r ? 'bg-accent text-primary-dark shadow-xl shadow-accent/20' : 'text-white/30 hover:text-white/60'
                                  }`}
                              >
                                  {r === 'LABORATORY' ? 'Scientific Lab' : r}
                              </button>
                          ))}
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Entity Name</label>
                          <div className="relative group">
                              <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-accent" size={18} />
                              <input 
                                  required
                                  className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] focus:bg-white/10 focus:border-accent transition-all outline-none font-bold text-white placeholder:text-white/10"
                                  placeholder={role === 'FARMER' ? 'Botanical Farm Name' : 'Registry Name'}
                                  value={formData.name}
                                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                              />
                          </div>
                      </div>
                      <div className="space-y-3">
                          <label htmlFor="email" className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Node Access Email</label>
                          <div className="relative group">
                              <UserCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-accent" size={18} />
                              <input 
                                  id="email"
                                  name="email"
                                  required type="email"
                                  className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] focus:bg-white/10 focus:border-accent transition-all outline-none font-bold text-white placeholder:text-white/10"
                                  placeholder="admin@organization.com"
                                  value={formData.email}
                                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                              />
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Secure Passkey</label>
                          <div className="relative group">
                              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-accent" size={18} />
                              <input 
                                  required type="password"
                                  className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] focus:bg-white/10 focus:border-accent transition-all outline-none font-bold text-white placeholder:text-white/10"
                                  placeholder="••••••••"
                                  value={formData.password}
                                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                              />
                          </div>
                      </div>
                      <div className="space-y-3">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Geospatial Coordinates</label>
                          <div className="relative group">
                              <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-accent" size={18} />
                              <input 
                                  required
                                  className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] focus:bg-white/10 focus:border-accent transition-all outline-none font-bold text-white placeholder:text-white/10"
                                  placeholder="Region, Province, Country"
                                  value={formData.location}
                                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                              />
                          </div>
                      </div>
                  </div>

                  {/* File Upload Section */}
                  <div className="space-y-4">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Credential Proof (License / Ayush Certification)</label>
                      <div className={`relative border-2 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center transition-all bg-white/5 ${
                          file ? 'border-accent bg-accent/5' : 'border-white/10 hover:border-accent/40'
                      }`}>
                          <input 
                              type="file" 
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={(e) => setFile(e.target.files[0])}
                              accept="image/*,.pdf"
                          />
                          {file ? (
                              <div className="text-center">
                                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center text-accent mx-auto mb-4 shadow-xl shadow-accent/10">
                                    <ShieldCheck size={32} />
                                  </div>
                                  <div className="text-lg font-bold italic text-white">{file.name}</div>
                                  <div className="text-[10px] text-accent font-black uppercase mt-2 tracking-widest">Document Secured</div>
                              </div>
                          ) : (
                              <div className="text-center space-y-4">
                                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/20 mx-auto">
                                    <Upload size={32} />
                                  </div>
                                  <div className="text-sm font-bold text-white/40 uppercase tracking-widest italic">Transfer proof for cryptographic audit</div>
                                  <p className="text-[10px] text-white/20 font-medium italic">GMP License / MSME / Farmer ID Certificate</p>
                              </div>
                          )}
                      </div>
                  </div>

                  <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting || !file}
                      className="w-full py-6 bg-accent text-primary-dark rounded-[2.5rem] font-black uppercase text-sm tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl hover:bg-white transition-all active:scale-95 disabled:grayscale disabled:opacity-30 mt-10 shadow-accent/20"
                  >
                      {isSubmitting ? (
                        <><Loader2 className="animate-spin" size={24} /> <span className="animate-pulse">Anchoring Identity...</span></>
                      ) : (
                        <>Submit to Governance Registry <ArrowRight size={24} /></>
                      )}
                  </motion.button>
              </form>
          </Card>
        </motion.div>

        <p className="text-center text-sm font-light text-white/30 mt-12">
            Recognized stakeholder? <Link to="/login" className="text-accent font-bold italic hover:underline ml-1">Sign In to Local Node</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
