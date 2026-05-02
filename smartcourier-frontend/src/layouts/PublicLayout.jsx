import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../shared/components/Navbar';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar variant="public" />
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="py-8 text-center bg-white border-t border-gray-100 mt-auto">
        <p className="text-gray-400 text-xs">
          &copy; {new Date().getFullYear()} SmartCourier. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default PublicLayout;
