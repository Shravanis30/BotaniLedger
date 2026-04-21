import React from 'react';
import { Card, StatusBadge, Skeleton } from '@/components/shared/UI';
import { 
  PlusCircle, Database, RefreshCw, 
  List, PackageCheck, SignalHigh, 
  ChevronRight, ArrowUpRight, MapPin, Smartphone, Activity
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useOfflineStore } from '@/lib/offlineStore';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import FarmerLayout from '@/components/shared/FarmerLayout';

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { isOnline, pendingBatches } = useOfflineStore();

  const { data: batches = [], isLoading } = useQuery({
    queryKey: ['farmerBatches'],
    queryFn: async () => {
        const resp = await api.get('/farmer/batches');
        return resp.data || [];
    }
  });


  const stats = [
    { 
        label: "Total Batches", 
        value: batches.length.toString().padStart(2, '0'), 
        color: "text-blue-600", 
        icon: Database 
    },
    { 
        label: "Pending Lab", 
        value: batches.filter(b => ['PENDING', 'LAB_TESTING'].includes(b.blockchainRecord?.status)).length.toString().padStart(2, '0'), 
        color: "text-amber-600", 
        icon: Smartphone 
    },
    { 
        label: "Passed & Approved", 
        value: batches.filter(b => ['LAB_PASSED', 'MANUFACTURER_APPROVED', 'QR_GENERATED'].includes(b.blockchainRecord?.status)).length.toString().padStart(2, '0'), 
        color: "text-success", 
        icon: PackageCheck 
    },
    { 
        label: "Sync Queue", 
        value: pendingBatches.length.toString().padStart(2, '0'), 
        color: "text-orange-600", 
        icon: RefreshCw 
    }
  ];

  return (
    <FarmerLayout portalName="Farmer Portal">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">Farmer Dashboard</h1>
            <p className="text-gray-500 font-medium mt-1">Monitoring your herbal batch integrity and network sync status.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
               {pendingBatches.length > 0 && (
                   <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-warning text-warning rounded-2xl font-bold hover:bg-warning/5 transition-all">
                       <RefreshCw size={18} />
                       Sync Drafts ({pendingBatches.length})
                   </button>
               )}
               <Link to="/farmer/record" className="flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary-mid transition-all shadow-xl shadow-green-900/20 active:scale-95">
                   <PlusCircle size={18} />
                   Record New Batch
               </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <Card key={i} className="p-8 border-none shadow-xl shadow-black/5 hover:shadow-2xl transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                   <div className="p-4 bg-gray-50 rounded-2xl">
                       <stat.icon className={stat.color} size={24} />
                   </div>
                   {isLoading ? (
                       <Skeleton className="h-6 w-12 rounded-full" />
                   ) : stat.trend && (
                       <span className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2.5 py-1.5 rounded-full">
                           <ArrowUpRight size={14} /> {stat.trend}
                       </span>
                   )}
              </div>
              {isLoading ? (
                  <Skeleton className="h-10 w-20 mb-2" />
              ) : (
                  <div className="text-4xl font-black text-gray-900 mb-1">{stat.value}</div>
              )}
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Quick Actions & Recent Table */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 space-y-8 min-w-0">
            <Card className="border-none shadow-xl shadow-black/5 p-0 overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-extrabold text-xl text-gray-900">Recent Herb Collections</h3>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-4 py-2 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-colors">Filters</button>
                    <Link to="/farmer/batches" className="flex-1 sm:flex-none px-4 py-2 bg-primary/5 text-[10px] font-black text-primary uppercase tracking-widest rounded-xl hover:bg-primary/10 transition-colors flex items-center justify-center gap-1">
                        View All <ChevronRight size={14} />
                    </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                   <thead className="bg-gray-50/50 text-[10px] uppercase tracking-[0.22em] font-black text-gray-400 border-b border-gray-50">
                      <tr>
                        <th className="px-8 py-5">Batch Registry</th>
                        <th className="px-8 py-5">Origin Metadata</th>
                        <th className="px-8 py-5 text-center">AI Confidence</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {isLoading ? (
                          [...Array(3)].map((_, i) => (
                              <tr key={i}>
                                  <td colSpan={5} className="px-8 py-6"><Skeleton className="h-12 w-full" /></td>
                              </tr>
                          ))
                      ) : batches.length > 0 ? (
                        batches.slice(0, 5).map((batch, i) => (
                            <tr key={i} className="group hover:bg-primary/[0.01] transition-colors">
                                <td className="px-8 py-6">
                                    <div className="font-mono text-[9px] font-bold text-primary mb-1 uppercase tracking-tighter transition-all group-hover:tracking-normal">NODE::{batch.batchId?.slice(-12)}</div>
                                    <div className="font-black text-gray-900 text-sm group-hover:text-primary transition-colors">{batch.herbSpecies?.common}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="text-sm font-bold text-gray-600 mb-1.5 flex items-center gap-2 italic">
                                        <Activity size={12} className="text-gray-300" />
                                        {new Date(batch.collectionDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-xl w-fit uppercase tracking-widest">
                                        <MapPin size={12} className="text-primary" />
                                        {batch.location?.zone || 'Central Forest'}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col items-center">
                                        <div className="text-[10px] font-black text-success uppercase tracking-widest">{batch.aiVerification?.confidence || 0}%</div>
                                        <div className="w-16 h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden border border-gray-50">
                                            <div className="h-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]" style={{ width: `${batch.aiVerification?.confidence || 0}%` }}></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <StatusBadge status={batch.blockchainRecord?.status || 'PENDING'} />
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex gap-2 justify-end whitespace-nowrap">
                                        <button 
                                          onClick={() => navigate(`/verify/${batch.batchId}`)}
                                          className="px-4 py-2 bg-white border border-gray-100 text-[10px] font-black text-gray-600 rounded-xl hover:text-primary hover:border-primary transition-all uppercase tracking-widest active:scale-95 shadow-sm"
                                        >
                                            Audit
                                        </button>
                                        <button 
                                          onClick={() => navigate(`/verify/${batch.batchId}`)}
                                          className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                                          title="View Trace"
                                        >
                                            <Activity size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                          ))
                      ) : (
                          <tr>
                              <td colSpan={5} className="px-8 py-16 text-center">
                                  <div className="flex flex-col items-center justify-center opacity-30">
                                      <Database size={48} className="mb-4" />
                                      <p className="text-[10px] uppercase font-black tracking-[0.4em]">No blockchain records found</p>
                                  </div>
                              </td>
                          </tr>
                      )}
                   </tbody>
                </table>
              </div>
              <div className="p-8 border-t border-gray-50 flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">
                  <span>Distributed Ledger Synchronization Established</span>
                  <div className="flex gap-2">
                       <button className="p-2.5 bg-white border border-gray-100 rounded-xl opacity-50 cursor-not-allowed text-gray-400 shadow-sm">
                          <ChevronRight className="rotate-180" size={16} />
                       </button>
                       <button className="p-2.5 bg-white border border-gray-100 rounded-xl hover:text-primary hover:border-primary transition-all shadow-sm">
                          <ChevronRight size={16} />
                       </button>
                  </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
             <Card className="p-8 sidebar-gradient text-white border-none shadow-xl shadow-green-900/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
                <h3 className="font-black text-xl mb-10 flex items-center gap-3 relative z-10 italic">
                    <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                        <SignalHigh size={20} className="text-accent-light" />
                    </div>
                    Sync Intelligence
                </h3>
                <div className="space-y-10 relative z-10">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <div className="text-[10px] font-black text-green-100/40 uppercase tracking-[0.25em]">Pending Synced</div>
                        <div className="text-3xl font-black italic">{pendingBatches.length}</div>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <div className="text-[10px] font-black text-green-100/40 uppercase tracking-[0.25em]">Node Identity</div>
                        <div className="text-[11px] font-mono font-black opacity-80 uppercase tracking-tighter">PR_NODE_048</div>
                    </div>
                    <button className={cn(
                        "w-full py-5 rounded-[2rem] font-black transition-all flex items-center justify-center gap-3 shadow-2xl uppercase text-[11px] tracking-widest",
                        isOnline 
                            ? "bg-accent-light text-primary-dark hover:bg-white hover:scale-[1.02] active:scale-95 shadow-accent-light/20" 
                            : "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                    )}>
                        <RefreshCw size={18} className={cn(isOnline && pendingBatches.length > 0 && "animate-spin")} />
                        {isOnline ? (pendingBatches.length > 0 ? "Sync Consensus" : "Ledger In Sync ✓") : "Protocol Awaiting Link"}
                    </button>
                </div>
             </Card>

             <Card className="p-8 bg-white border-none shadow-xl shadow-black/5 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <Activity size={100} />
                 </div>
                 <h4 className="font-black text-[10px] text-gray-400 mb-8 uppercase tracking-[0.3em] flex items-center gap-2">
                    Infrastructure Guides <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                 </h4>
                 <div className="space-y-4 relative z-10">
                     {[
                         "5-point macro photo protocol",
                         "Syncing in low-signal zones",
                         "Lab compliance standards"
                     ].map((guide, i) => (
                         <div key={i} className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-white transition-all cursor-pointer group shadow-sm">
                             <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                                 <PlusCircle size={16} />
                             </div>
                             <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight">{guide}</span>
                         </div>
                     ))}
                 </div>
             </Card>
          </div>
        </div>
    </FarmerLayout>
  );
};

export default FarmerDashboard;
