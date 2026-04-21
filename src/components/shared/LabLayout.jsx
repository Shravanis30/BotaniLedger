import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { LayoutDashboard, FlaskConical, BarChart3, Settings } from 'lucide-react';

const LabLayout = ({ children, portalName = "Lab Analytics Node" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarItems = [
    { label: 'Dashboard', to: '/lab', icon: LayoutDashboard, end: true },
    { label: 'Certificates', to: '/lab/certificates', icon: FlaskConical },
    { label: 'Analytics', to: '/lab/analytics', icon: BarChart3 },
    { label: 'Settings', to: '/lab/settings', icon: Settings },
  ];

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen relative overflow-x-hidden">
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

        <main className="flex-1 lg:ml-72 mt-20 p-6 md:p-8 lg:p-12 transition-all duration-300">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LabLayout;
