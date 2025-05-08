import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useState, useEffect } from "react";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Check if window is available (for SSR compatibility) and if screen is medium or larger
    if (typeof window !== "undefined") {
      return window.matchMedia("(min-width: 768px)").matches;
    }
    return false; // Default to closed for server-side rendering or small screens
  });

  return (
    <div className="h-screen flex flex-col">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-64 bg-background border-r border-border transition-transform duration-300 ease-in-out md:w-auto md:flex-shrink-0`}
        >
          <Sidebar open={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Backdrop for small screens */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 transition-all">
          <div className="fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;