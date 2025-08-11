'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import NavbarWithDropdown from '@/components/NavbarWithDropdown';
import Sidebar from '@/components/Sidebar';
import BetSlip from '@/components/BetSlip';

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, toggleSidebar }}>
      <NavbarWithDropdown />
      <div className="flex min-h-screen pt-16">
        <Sidebar />
        <main className={`flex-1 transition-all duration-300 xl:mr-80`}>
          {children}
        </main>
        <BetSlip />
      </div>
    </SidebarContext.Provider>
  );
}