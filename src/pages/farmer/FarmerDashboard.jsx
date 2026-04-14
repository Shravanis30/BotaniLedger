import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/shared/Sidebar';
import { Card, StatusBadge, Skeleton } from '@/components/shared/UI';
import { 
  BarChart3, PlusCircle, Database, RefreshCw, 
  Settings, LayoutDashboard, List, PackageCheck, SignalHigh, 
  ChevronRight, ArrowUpRight, MapPin, Smartphone, ArrowRight, Activity,
  Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useOfflineStore } from '@/lib/offlineStore';
import { cn } from '@/lib/utils';

const FarmerDashboard = () => {
  const { isOnline, pendingBatches } = useOfflineStore();

  const { data: batches = [], isLoading } = useQuery({
    queryKey: ['farmerBatches'],
    queryFn: async () => {
        const resp = await api.get('/farmer/batches');
        return resp.data || [];
    }
  });

  const sidebarItems = [
    { label: 'Dashboard', to: '/farmer', icon: LayoutDashboard, end: true },
    { label: 'Record Collection', to: '/farmer/record', icon: PlusCircle },
    { label: 'My Batches', to: '/farmer/batches', icon: List },
    { label: 'Sync Status', to: '/farmer/sync', icon: RefreshCw },
    { label: 'Settings', to: '/farmer/settings', icon: Settings },
  ];

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
    <div className="flex bg-background min-h-screen">
      <Sidebar portalName="Farmer Portal" items={sidebarItems} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Farmer Dashboard</h1>
            <p className="text-gray-500 font-medium mt-1">Monitoring your herbal batch integrity and network sync status.</p>
          </div>
          
          <div className="flex gap-4">
               {pendingBatches.length > 0 && (
                   <button className="flex items-center gap-2 px-6 py-3 border-2 border-warning text-warning rounded-2xl font-bold hover:bg-warning/5 transition-all">
                       <RefreshCw size={18} />
                       Sync Drafts ({pendingBatches.length})
                   </button>
               )}
               <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all">
                   <Smartphone size={18} />
                   Open Mobile View
               </button>
               <Link to="/farmer/record" className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary-mid transition-all shadow-xl shadow-green-900/20">
                   <PlusCircle size={18} />
                   Record New Batch
               </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <Card key={i} className="p-8 border-none shadow-sm hover:shadow-md transition-shadow">
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
              <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em]">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Quick Actions & Recent Table */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <Card className="border-none shadow-sm">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-xl text-gray-800">Recent Herb Collections</h3>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-50 text-xs font-bold text-gray-500 rounded-xl hover:bg-gray-100 transition-colors">Filters</button>
                    <Link to="/farmer/batches" className="px-4 py-2 bg-primary/5 text-xs font-bold text-primary rounded-xl hover:bg-primary/10 transition-colors flex items-center gap-1">
                        View All <ChevronRight size={14} />
                    </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-gray-50/50 text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">
                      <tr>
                        <th className="px-8 py-5">Batch ID</th>
                        <th className="px-8 py-5">Herb Species</th>
                        <th className="px-8 py-5">Date</th>
                        <th className="px-8 py-5">GPS Location</th>
                        <th className="px-8 py-5 text-center">AI Match</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {isLoading ? (
                          [...Array(3)].map((_, i) => (
                              <tr key={i}>
                                  <td colSpan={7} className="px-8 py-6"><Skeleton className="h-12 w-full" /></td>
                              </tr>
                          ))
                      ) : batches.length > 0 ? (
                        batches.slice(0, 5).map((batch, i) => (
                            <tr key={i} className="group hover:bg-primary/[0.02] transition-colors">
                                <td className="px-8 py-6 font-mono text-xs font-bold text-primary">{batch.batchId}</td>
                                <td className="px-8 py-6">
                                    <div className="font-bold text-gray-900 text-sm mb-0.5">{batch.herbSpecies?.common}</div>
                                    <div className="text-[10px] text-gray-400 font-medium italic lowercase">{batch.herbSpecies?.botanical || ''}</div>
                                </td>
                                <td className="px-8 py-6 text-sm font-bold text-gray-600">
                                    {new Date(batch.collectionDate).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg w-fit">
                                        <MapPin size={12} className="text-primary" />
                                        {batch.location?.address || batch.location?.zone || 'Assigned Farm'}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col items-center">
                                        <div className="text-xs font-black text-success">{batch.aiVerification?.confidence || 0}%</div>
                                        <div className="w-12 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                            <div className="h-full bg-success" style={{ width: `${batch.aiVerification?.confidence || 0}%` }}></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <StatusBadge status={batch.blockchainRecord?.status || 'PENDING'} />
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex gap-2 justify-end">
                                        <button className="px-3 py-1.5 bg-white border border-gray-200 text-[10px] font-bold text-gray-600 rounded-lg hover:bg-gray-50 transition-all uppercase tracking-wider">
                                            View Details
                                        </button>
                                        <button className="p-1.5 bg-primary/5 text-primary rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm">
                                            <Activity size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                          ))
                      ) : (
                          <tr>
                              <td colSpan={7} className="px-8 py-12 text-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                                  No collections recorded yet
                              </td>
                          </tr>
                      )}
                   </tbody>
                </table>
              </div>
              <div className="p-6 border-t border-gray-50 flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>Showing {isLoading ? '...' : (batches.length > 5 ? 5 : batches.length)} of {batches.length} batches</span>
                  <div className="flex gap-2">
                       <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg opacity-50 cursor-not-allowed text-gray-400">Previous</button>
                       <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">Next</button>
                  </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
             <Card className="p-8 sidebar-gradient text-white border-none shadow-xl shadow-green-900/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] -mr-16 -mt-16"></div>
                <h3 className="font-bold text-xl mb-8 flex items-center gap-3 relative z-10">
                    <div className="p-2 bg-white/10 rounded-xl">
                        <SignalHigh size={20} className="text-accent-light" />
                    </div>
                    Network Status
                </h3>
                <div className="space-y-8 relative z-10">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <div className="text-xs font-bold text-green-100/60 uppercase tracking-widest">Offline Queue</div>
                        <div className="text-2xl font-black">{pendingBatches.length} Drafts</div>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <div className="text-xs font-bold text-green-100/60 uppercase tracking-widest">Last Sync</div>
                        <div className="text-sm font-black">Today, 08:34 AM</div>
                    </div>
                    <button className={cn(
                        "w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-lg",
                        isOnline 
                            ? "bg-accent-light text-primary-dark hover:bg-white hover:scale-[1.02] shadow-accent-light/20" 
                            : "bg-white/10 text-white/50 cursor-not-allowed"
                    )}>
                        <RefreshCw size={18} className={cn(isOnline && pendingBatches.length > 0 && "animate-spin")} />
                        {isOnline ? (pendingBatches.length > 0 ? "Sync Now" : "All Systems Synced ✓") : "Waiting for Network"}
                    </button>
                </div>
             </Card>

             <Card className="p-8 border-dashed border-2 bg-gray-50/50 border-gray-200 shadow-none">
                 <h4 className="font-black text-[10px] text-gray-400 mb-6 uppercase tracking-[0.2em]">Collector Intelligence</h4>
                 <div className="space-y-4">
                     {[
                         "5-point macro photo protocol",
                         "Syncing in low-signal zones",
                         "Lab compliance standards"
                     ].map((guide, i) => (
                         <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-primary-light transition-all cursor-pointer group shadow-sm">
                             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                 <PlusCircle size={16} />
                             </div>
                             <span className="text-xs font-black text-gray-700">{guide}</span>
                         </div>
                     ))}
                 </div>
             </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;
