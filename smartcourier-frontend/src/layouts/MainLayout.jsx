import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../shared/components/Navbar';
import Sidebar from '../shared/components/Sidebar';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="authenticated-layout min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-col min-h-screen">
        <Navbar 
          variant="authenticated" 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        
        <main className="main-content">
          <div className="container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
