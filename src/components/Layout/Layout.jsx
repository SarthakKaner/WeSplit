import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Navigation */}
      <MobileNav 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* Main Content - Full height on mobile, no top bar space */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="py-3 sm:py-4 lg:py-6">
            {/* Add extra top padding on mobile to account for floating button */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-12 lg:pt-0">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}