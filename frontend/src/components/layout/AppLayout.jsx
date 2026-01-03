import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-close sidebar on mobile
  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
    else setIsSidebarOpen(true);
  }, [isMobile]);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} showHamburger={isMobile} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
