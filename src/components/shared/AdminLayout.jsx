import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Activity, Shield, Database, Users, AlertCircle } from 'lucide-react';

const AdminLayout = ({ children, portalName = "Admin Portal" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarItems = [
    { label: 'Network Overview', to: '/admin', icon: Activity, end: true },
    { label: 'Access Control', to: '/admin/approvals', icon: Shield },
    { label: 'Certificates', to: '/lab/certificates', icon: Database },
    { label: 'Batch Explorer', to: '/admin/batches', icon: Database },
    { label: 'Farmer Registry', to: '/admin/farmers', icon: Users },
    { label: 'Anomaly Alerts', to: '/admin/alerts', icon: AlertCircle },
  ];

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar 
        portalName={portalName} 
        items={sidebarItems} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)} 
          portalName={portalName}
        />

        <main className="flex-1 lg:ml-72 mt-20 p-6 md:p-10 lg:p-12 transition-all duration-300">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
