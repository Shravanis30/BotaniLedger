import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ShieldAlert, TreeDeciduous, ArrowLeft, Mail, ChevronLeft, ShieldCheck, Lock } from 'lucide-react';
import { Card } from '../../components/shared/UI';

const AwaitingApproval = () => {
  return (
    <div className="min-h-screen bg-[#0d1f18] text-white selection:bg-accent selection:text-primary-dark relative overflow-hidden flex items-center justify-center">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <img 
          src="/hero-botanical.png" 
          alt="Backdrop" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1f18] via-transparent to-[#0d1f18]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full px-6 text-center space-y-12 relative z-10"
      >
        <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-accent/20 blur-[60px] rounded-full animate-pulse" />
            <motion.div 
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ repeat: Infinity, duration: 4, repeatType: "reverse", ease: "easeInOut" }}
              className="bg-accent text-primary-dark p-8 rounded-[3rem] shadow-[0_0_50px_rgba(76,175,80,0.4)] relative z-10"
            >
                <Clock size={48} />
            </motion.div>
        </div>
        
        <div className="space-y-4">
            <h1 className="text-4xl font-black italic tracking-tighter text-gradient">Audit in Progress</h1>
            <p className="text-green-100/40 font-light leading-relaxed px-6">
                Your credentials have been securely broadcasted to the <span className="text-accent font-bold italic">Ministry Governance Node</span> for cryptographic verification.
            </p>
        </div>

        <Card className="glass-card p-10 border-white/5 rounded-[3rem] space-y-8 text-left bg-white/5">
            <div className="flex gap-5 items-start">
                <div className="p-3 bg-white/5 rounded-2xl flex items-center justify-center text-accent shadow-inner border border-white/10 shrink-0">
                    <ShieldAlert size={24} />
                </div>
                <div>
                    <h4 className="text-xs font-black text-accent uppercase tracking-[0.2em] mb-2">Status: Pending Validation</h4>
                    <p className="text-xs text-white/40 font-light leading-relaxed italic">The system is awaiting administrative consensus to activate your account on the permanent ledger.</p>
                </div>
            </div>
            
            <div className="p-6 bg-[#0a1712]/50 rounded-[2rem] border border-white/5 italic text-sm text-white/30 font-light leading-loose relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <Lock size={40} />
                </div>
                "Stakeholder writes to the blockchain are currently suspended. Access will be granted once the verified identity certificate is issued."
            </div>
        </Card>

        <div className="pt-6 space-y-6">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-white text-primary-dark rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl hover:bg-accent transition-all"
            >
                <Mail size={18} /> Support Registry
            </motion.button>
            <Link to="/login" className="flex items-center justify-center gap-2 text-white/20 font-black uppercase text-[10px] tracking-[0.4em] hover:text-accent transition-all group">
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                Abort & Return
            </Link>
        </div>

        <div className="pt-12 text-[10px] font-black text-white/5 uppercase tracking-[0.5em] flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-white/5" />
            SECURED GATEWAY
            <div className="h-px w-8 bg-white/5" />
        </div>
      </motion.div>
    </div>
  );
};

export default AwaitingApproval;
