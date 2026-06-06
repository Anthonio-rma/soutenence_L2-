import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const contentPaddingLeft = isMobile ? 0 : (isCollapsed ? 76 : 260);

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans antialiased text-gray-800 transition-colors duration-300">
      {/* Sidebar connectée à l'état local */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Contenu principal adaptatif avec transition fluide */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{ paddingLeft: contentPaddingLeft }}
      >
        <Outlet />
      </div>
    </div>
  );
}