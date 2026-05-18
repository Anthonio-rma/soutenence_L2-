import React, { useState } from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans antialiased text-gray-800 transition-colors duration-300">
      {/* Sidebar connectée à l'état local */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Contenu principal adaptatif avec transition fluide */}
      <div 
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{ paddingLeft: isCollapsed ? '76px' : '260px' }}
      >
        <Outlet />
      </div>
    </div>
  );
}