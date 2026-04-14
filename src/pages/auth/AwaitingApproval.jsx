import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ShieldAlert, TreeDeciduous, ArrowLeft, Mail } from 'lucide-react';
import { Card } from '@/components/shared/UI';

const AwaitingApproval = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in duration-700">
        <div className="flex justify-center">
            <div className="bg-amber-50 text-amber-600 p-6 rounded-[40px] shadow-2xl shadow-amber-900/10 border-4 border-white animate-pulse">
                <Clock size={48} />
            </div>
        </div>
        
        <div className="space-y-4">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">System Access Pending</h1>
            <p className="text-gray-500 font-bold leading-relaxed px-4">
                Your credentials have been securely transmitted to the <span className="text-primary underline underline-offset-4">Ministry of Ayush</span> verification node.
            </p>
        </div>

        <Card className="p-8 border-none bg-gray-50/50 shadow-inner rounded-[40px] space-y-6 text-left">
            <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm shrink-0 border border-amber-100">
                    <ShieldAlert size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Status: Unverified</h4>
                    <p className="text-xs text-gray-400 font-medium">Your node registration is currently in the 'Inactive' state on the Hyperledger Fabric ledger.</p>
                </div>
            </div>
            
            <div className="p-5 bg-white rounded-3xl border border-gray-100 italic text-[11px] text-gray-400 font-medium leading-relaxed">
                "Blockchain transactions for record collection and production batches are restricted until administrative consensus is achieved on your identity."
            </div>
        </Card>

        <div className="pt-4 space-y-4">
            <button className="w-full py-4 bg-gray-900 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl hover:bg-black transition-all">
                <Mail size={18} /> Contact Admin
            </button>
            <Link to="/login" className="flex items-center justify-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest hover:underline">
                <ArrowLeft size={14} /> Back to Entry
            </Link>
        </div>

        <div className="pt-12 text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
            <TreeDeciduous size={12} /> Secure Ayush Gateway
        </div>
      </div>
    </div>
  );
};

export default AwaitingApproval;
