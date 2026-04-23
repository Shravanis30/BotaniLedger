import React from 'react';
import LabLayout from '@/components/shared/LabLayout';
import FarmerLayout from '@/components/shared/FarmerLayout';
import AdminLayout from '@/components/shared/AdminLayout';
import { Card, Skeleton } from '@/components/shared/UI';
import { FileCheck, Download, Search, Microscope, FlaskConical } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const IssuedCertificates = () => {
  const { user } = useAuthStore();
  
  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ['labCertificates'],
    queryFn: async () => {
        const resp = await api.get('/lab/certificates');
        return resp.data || [];
    }
  });

  const getBranding = () => {
      if (user?.role === 'farmer') return {
          title: "My Botanical Certificates",
          desc: "Legal molecular proof of your farm's batch integrity."
      };
      if (user?.role === 'admin') return {
          title: "Global Certification Ledger",
          desc: "Comprehensive audit log of every certificate issued on the network."
      };
      return {
          title: "Certification Archive",
          desc: "Historical record of all botanical purity certificates issued by this node."
      };
  };

  const branding = getBranding();
  const Layout = user?.role === 'farmer' ? FarmerLayout : (user?.role === 'admin' ? AdminLayout : LabLayout);

  return (
    <Layout portalName={user?.role === 'farmer' ? "Farmer Portal" : (user?.role === 'admin' ? "Admin Portal" : "Lab Tester Node")}>
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
              <div className="w-8 h-[1px] bg-primary/20" /> Sovereign Audit Vault
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">{branding.title}</h1>
          <p className="text-gray-500 font-medium mt-2 italic text-sm">{branding.desc}</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input className="pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 ring-primary/5 focus:border-primary/20 w-full text-xs font-bold shadow-xl shadow-black/5" placeholder="Search Hash/Batch..." />
          </div>
        </div>
      </header>

      <Card className="border-none shadow-2xl shadow-black/5 overflow-hidden bg-white rounded-[2.5rem] p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 border-b border-gray-50">
              <tr>
                <th className="px-10 py-7">Cert ID / Batch</th>
                <th className="px-10 py-7">Herb Identity</th>
                <th className="px-10 py-7">Issued Timestamp</th>
                <th className="px-10 py-7">Purity Signature</th>
                <th className="px-10 py-7 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                      <td colSpan={5} className="px-10 py-8"><Skeleton className="h-12 w-full" /></td>
                  </tr>
                ))
              ) : certificates.length > 0 ? (
                certificates.map((cert, i) => (
                  <tr key={cert._id || i} className="hover:bg-primary/[0.01] transition-all group">
                    <td className="px-10 py-8 whitespace-nowrap">
                      <div className="font-mono text-[10px] font-black text-primary uppercase tracking-tighter">AYUSH::{cert.referenceNumber || cert._id?.slice(-8).toUpperCase()}</div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Batch Ref: <span className="text-gray-600">#{cert.batchId}</span></div>
                    </td>
                    <td className="px-10 py-8 min-w-[200px]">
                      <div className="font-black text-base text-gray-900 tracking-tight italic uppercase">{cert.batch?.herbSpecies?.common || 'Botanical Unit'}</div>
                      <div className="text-[9px] text-primary font-black uppercase tracking-widest mt-0.5">{cert.batch?.herbSpecies?.botanical}</div>
                    </td>
                    <td className="px-10 py-8 text-xs font-bold text-gray-500 italic whitespace-nowrap">
                        <div className="flex flex-col">
                            <span>{new Date(cert.testDate || cert.createdAt).toLocaleDateString()}</span>
                            <span className="text-[9px] text-gray-300 not-italic uppercase tracking-widest mt-0.5">{new Date(cert.testDate || cert.createdAt).toLocaleTimeString()}</span>
                        </div>
                    </td>
                    <td className="px-10 py-8 whitespace-nowrap">
                      <div className="flex gap-2">
                        <span className={cn(
                          "text-[9px] font-black px-3 py-1.5 rounded-xl border-2 uppercase tracking-widest",
                          cert.results?.overallResult === 'PASS' 
                              ? "bg-emerald-50 text-emerald-600 border-emerald-50" 
                              : "bg-red-50 text-red-500 border-red-50"
                        )}>
                           {cert.results?.overallResult || 'N/A'} QUOTIENT :: {cert.results?.purityScore || cert.results?.activeIngredient?.measured}%
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      {cert.document?.ipfsUrl ? (
                         <a 
                           href={cert.document.ipfsUrl} 
                           target="_blank" 
                           rel="noreferrer"
                           className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-400 hover:bg-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm hover:shadow-xl hover:shadow-primary/20 active:scale-95"
                         >
                           <Download size={14} /> Download Proof
                         </a>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-300 italic uppercase">No Digital Entry</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mx-auto mb-6">
                        <FileCheck size={40} />
                      </div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] italic">Archive empty. No certificates discovered.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
};

export default IssuedCertificates;
