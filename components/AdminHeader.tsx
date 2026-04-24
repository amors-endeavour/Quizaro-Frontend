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
    <div className="bg-white border-b border-gray-100 flex flex-col sticky top-0 z-[110] transition-all duration-500 shadow-sm">
      {/* Top Navbar */}
      <div className="pl-24 pr-4 lg:pl-32 lg:pr-8 h-16 flex items-center justify-between border-b border-gray-50 bg-white">
        <div className="flex items-center gap-4 lg:gap-12 overflow-x-auto no-scrollbar h-full">
          {displayTabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`flex items-center gap-2.5 h-full border-b-2 transition-all duration-300 font-black text-[10px] uppercase tracking-[0.2em] px-2 ${activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-900"}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 lg:gap-6">
          {/* Integrated Search Box */}
          <div className="relative hidden md:block w-64 lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text"
              placeholder="Search Identity..."
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-lg pl-10 pr-4 py-1.5 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 outline-none transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xs group-hover:scale-105 transition-transform shadow-lg shadow-blue-500/20">
              MA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
