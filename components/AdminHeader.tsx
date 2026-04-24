"use client";

import { Search, Settings, Filter, Plus, Bell, ChevronRight, LayoutGrid, List, BarChart3 } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  path: { label: string; href?: string }[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  tabs?: { id: string; label: string; icon?: React.ReactNode }[];
  onNew?: () => void;
  onSettings?: () => void;
  onFilter?: () => void;
  onSearchChange?: (val: string) => void;
}

export default function AdminHeader({ 
  title, 
  path, 
  activeTab, 
  onTabChange, 
  tabs,
  onNew, 
  onSettings, 
  onFilter, 
  onSearchChange 
}: AdminHeaderProps) {
  const displayTabs = tabs || [
    { id: 'intelligence', label: 'Papers', icon: <LayoutGrid size={14} /> },
    { id: 'analysis', label: 'Analysis', icon: <BarChart3 size={14} /> }
  ];

  return (
    <div className="bg-[#050816] border-b border-white/10 flex flex-col sticky top-0 z-[110] transition-all duration-500">
      {/* Top Navbar */}
      <div className="px-4 lg:px-8 h-16 flex items-center justify-between border-b border-white/5 bg-white/5 backdrop-blur-3xl">
        <div className="flex items-center gap-4 lg:gap-12 overflow-x-auto no-scrollbar h-full">
          {displayTabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`flex items-center gap-2.5 h-full border-b-2 transition-all duration-300 font-black text-[10px] uppercase tracking-[0.2em] px-2 ${activeTab === tab.id ? "border-cyan-400 text-cyan-400" : "border-transparent text-gray-500 hover:text-white"}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 lg:gap-6">
          {/* Integrated Search Box */}
          <div className="relative hidden md:block w-64 lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input 
              type="text"
              placeholder="Search Identity..."
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-1.5 text-xs font-medium focus:bg-white/10 focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500/50 outline-none transition-all text-white placeholder:text-gray-600"
            />
          </div>

          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xs group-hover:scale-105 transition-transform">
              MA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
