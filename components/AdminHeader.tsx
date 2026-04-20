"use client";

import { Search, Settings, Filter, Plus, Bell, ChevronRight, LayoutGrid, List } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  path: { label: string; href?: string }[];
  activeTab?: 'intelligence' | 'analysis';
  onTabChange?: (tab: 'intelligence' | 'analysis') => void;
  onNew?: () => void;
  onSettings?: () => void;
  onFilter?: () => void;
  onSearchChange?: (val: string) => void;
}

export default function AdminHeader({ title, path, onNew, onSearchChange }: AdminHeaderProps) {
  return (
  return (
    <div className="bg-[#050816] border-b border-white/10 flex flex-col sticky top-0 z-[110] transition-all duration-500">
      {/* Top Navbar */}
      <div className="px-4 lg:px-8 h-16 flex items-center justify-between border-b border-white/5 bg-white/5 backdrop-blur-3xl">
        <div className="flex items-center gap-4 lg:gap-12 overflow-x-auto no-scrollbar h-full">
          <button 
            onClick={() => onTabChange?.('intelligence')}
            className={`flex items-center gap-2.5 h-full border-b-2 transition-all duration-300 font-black text-[10px] uppercase tracking-[0.2em] px-2 ${activeTab === 'intelligence' ? "border-cyan-400 text-cyan-400" : "border-transparent text-gray-500 hover:text-white"}`}
          >
            <LayoutGrid size={14} />
            Intelligence Suite
          </button>
          <button 
            onClick={() => onTabChange?.('analysis')}
            className={`flex items-center gap-2.5 h-full border-b-2 transition-all duration-300 font-black text-[10px] uppercase tracking-[0.2em] px-2 ${activeTab === 'analysis' ? "border-cyan-400 text-cyan-400" : "border-transparent text-gray-500 hover:text-white"}`}
          >
            <BarChart3 size={14} />
            Recent Analysis
          </button>
        </div>

        <div className="flex items-center gap-3 lg:gap-6">
          <div className="hidden sm:flex items-center gap-3 text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-1.5 rounded-full text-[10px] lg:text-xs font-bold animate-pulse cursor-pointer">
            <Bell size={14} />
            <span className="hidden lg:inline">Report Dashboard (17)</span>
            <span className="lg:hidden">(17)</span>
          </div>
          <div className="w-px h-6 bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xs group-hover:scale-105 transition-transform">
              MA
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb & Action Bar */}
      <div className="px-4 lg:px-8 py-4 flex flex-col items-start justify-between gap-4 bg-[#050816]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium tracking-wide font-mono">
            {path.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span 
                  className={`hover:text-white transition underline-offset-4 ${item.href ? "cursor-pointer" : ""}`}
                >
                  {item.label}
                </span>
                {idx < path.length - 1 && <ChevronRight size={10} className="text-white/10" />}
              </div>
            ))}
          </div>
          <h2 className="text-lg lg:text-xl font-black text-white tracking-tight">{title}</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-xs lg:text-sm font-medium focus:bg-white/10 focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500/50 outline-none transition-all text-white placeholder:text-gray-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={onSettings}
              className="p-3 border border-white/10 rounded-xl hover:bg-white/10 transition shadow-sm bg-white/5 group"
            >
              <Settings size={18} className="text-gray-500 group-hover:text-cyan-400 transition-colors" />
            </button>

            <button 
              onClick={onFilter}
              className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-2.5 border border-white/10 rounded-xl hover:bg-white/10 transition shadow-sm bg-white/5 font-black text-[9px] uppercase tracking-widest text-gray-400 hover:text-white"
            >
              <Filter size={14} />
              Filters
            </button>

            <button 
              onClick={onNew}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition shadow-[0_10px_20px_rgba(8,145,178,0.2)] font-black text-xs uppercase"
            >
              <Plus size={18} />
              NEW PAPER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
