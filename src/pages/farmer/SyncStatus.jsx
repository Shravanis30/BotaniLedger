import React, { useState } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { Card, StatusBadge, EmptyState } from '@/components/shared/UI';
import { 
  PlusCircle, LayoutDashboard, List, RefreshCw, 
  Smartphone, SignalHigh, CheckCircle, Wifi, 
  WifiOff, AlertTriangle, Clock, Database, CloudUpload, Settings
} from 'lucide-react';
import { useOfflineStore } from '@/lib/offlineStore';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const SyncStatus = () => {
  const { pendingBatches, isOnline, removeBatch } = useOfflineStore();
  const [syncing, setSyncing] = useState(false);

  const sidebarItems = [
    { label: 'Dashboard', to: '/farmer', icon: LayoutDashboard },
    { label: 'Record Collection', to: '/farmer/record', icon: PlusCircle },
    { label: 'My Batches', to: '/farmer/batches', icon: List },
    { label: 'Sync Status', to: '/farmer/sync', icon: RefreshCw },
    { label: 'Settings', to: '/farmer/settings', icon: Settings },
  ];

  const base64ToBlob = (base64) => {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  };

  const handleSync = async () => {
    if (!isOnline || pendingBatches.length === 0) return;
    setSyncing(true);

    let successCount = 0;
    let failCount = 0;

    for (const batch of pendingBatches) {
        try {
            const body = new FormData();
            const speciesParts = batch.species.split(' (');
            const speciesObj = {
                common: speciesParts[0],
                scientific: speciesParts[1]?.replace(')', '') || ''
            };

            body.append('herbSpecies', JSON.stringify(speciesObj));
            body.append('quantity', batch.quantity);
            body.append('unit', 'kg');
            body.append('collectionDate', batch.date);
            body.append('location', JSON.stringify(batch.location));
            body.append('notes', batch.notes || '');

            // Append photos (handling both File objects and Base64 strings)
            Object.entries(batch.photos || {}).forEach(([key, photo]) => {
                if (photo instanceof File) {
                    body.append(key, photo);
                } else if (typeof photo === 'string' && photo.startsWith('data:image')) {
                    const blob = base64ToBlob(photo);
                    body.append(key, blob, `${key}.jpg`);
                }
            });

            await api.post('/farmer/collection', body, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            removeBatch(batch.id);
            successCount++;
        } catch (err) {
            console.error(`Sync failed for batch ${batch.id}:`, err);
            failCount++;
        }
    }

    setSyncing(false);
    if (successCount > 0) {
        alert(`Successfully synchronized ${successCount} records to the blockchain!`);
    }
    if (failCount > 0) {
        alert(`Failed to sync ${failCount} records. They will remain in your local queue.`);
    }
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar portalName="Farmer Portal" items={sidebarItems} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Sync Status</h1>
          <p className="text-gray-500 font-medium mt-1">Manage offline data and synchronize records with the blockchain.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card className="p-8 border-none shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-xl text-gray-800">Pending Sync Queue</h3>
                        <div className="bg-primary/5 px-4 py-1.5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">
                            {pendingBatches.length} Drafts Local
                        </div>
                    </div>

                    {pendingBatches.length > 0 ? (
                        <div className="space-y-4">
                            {pendingBatches.map((batch, index) => (
                                <div key={index} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-green-900/5 group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                            <Database size={20} />
                                        </div>
                                        <div>
                                            <div className="font-black text-gray-900 text-sm mb-0.5">{batch.species.split(' (')[0]}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                                <Clock size={10} /> Saved: {new Date().toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-xs font-black text-gray-900">{batch.quantity} kg</div>
                                            <div className="text-[9px] font-bold text-gray-400">{batch.zone}</div>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-warning animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState 
                            title="No Items Pending" 
                            description="All your batches have been successfully synchronized to the blockchain. You're fully up to date."
                            icon={CheckCircle}
                        />
                    )}
                </Card>
            </div>

            <div className="space-y-6">
                <Card className={cn(
                    "p-8 border-none shadow-xl relative overflow-hidden text-white transition-all duration-500",
                    isOnline ? "sidebar-gradient shadow-green-900/10" : "bg-gray-800 shadow-none"
                )}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] -mr-16 -mt-16"></div>
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-lg opacity-80">Connection</h4>
                            {isOnline ? <Wifi className="text-secondary" /> : <WifiOff className="text-red-400" />}
                        </div>
                        
                        <div className="text-center py-6">
                            <div className={cn(
                                "text-4xl font-black mb-2 tracking-tight",
                                isOnline ? "text-white" : "text-gray-400"
                            )}>
                                {isOnline ? 'ONLINE' : 'OFFLINE'}
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
                                Global Data Network Status
                            </div>
                        </div>

                        <ul className="space-y-4 text-xs font-bold opacity-80">
                            <li className="flex items-center gap-3">
                                <SignalHigh size={16} className={isOnline ? "text-accent" : "text-gray-500"} />
                                Latency: {isOnline ? '42ms' : '--'}
                            </li>
                            <li className="flex items-center gap-3">
                                <Database size={16} className={isOnline ? "text-accent" : "text-gray-500"} />
                                Queue Priority: High
                            </li>
                        </ul>

                        <button 
                            onClick={handleSync}
                            disabled={!isOnline || pendingBatches.length === 0 || syncing}
                            className={cn(
                                "w-full py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-3 text-sm tracking-widest uppercase",
                                isOnline && pendingBatches.length > 0
                                    ? "bg-accent text-primary hover:bg-white hover:scale-[1.02] shadow-xl shadow-accent/20" 
                                    : "bg-white/10 text-white/30 cursor-not-allowed"
                            )}
                        >
                            {syncing ? (
                                <>
                                    <CloudUpload size={20} className="animate-bounce" />
                                    Pushing to Chain...
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={20} className={cn(syncing && "animate-spin")} />
                                    {pendingBatches.length > 0 ? 'Synchronize Now' : 'Sync Complete'}
                                </>
                            )}
                        </button>
                    </div>
                </Card>

                <Card className="p-8 border-none shadow-sm bg-amber-50/50 border-2 border-amber-100">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-white rounded-xl shadow-sm text-amber-600">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h5 className="font-bold text-amber-900 text-sm mb-1 uppercase tracking-tight">Sync Notice</h5>
                            <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                                Do not refresh the page while synchronization is in progress. Failed syncs will remain in your local queue and retry automatically.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
};

export default SyncStatus;
