"use client";

import { Search, Settings, Filter, Plus, Bell, ChevronRight, LayoutGrid, List } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  path: { label: string; href?: string }[];
  onNew?: () => void;
  onSearchChange?: (val: string) => void;
}

export default function AdminHeader({ title, path, onNew, onSearchChange }: AdminHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-100 flex flex-col sticky top-0 z-20">
      {/* Top Navbar */}
      <div className="px-4 lg:px-8 h-16 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-4 lg:gap-8 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 py-4 border-b-2 border-blue-600 text-blue-600 font-bold text-xs lg:text-sm shrink-0">
            <LayoutGrid size={16} />
            My Library
          </div>
          <div className="hidden md:block text-gray-400 font-medium text-sm hover:text-gray-600 transition cursor-not-allowed shrink-0">
            Recent Analysis
          </div>
        </div>

        <div className="flex items-center gap-3 lg:gap-6">
          <div className="hidden sm:flex items-center gap-3 text-red-500 bg-red-50 px-3 py-1.5 rounded-full text-[10px] lg:text-xs font-bold animate-pulse cursor-pointer">
            <Bell size={14} />
            <span className="hidden lg:inline">Report Dashboard (17)</span>
            <span className="lg:hidden">(17)</span>
          </div>
          <div className="w-px h-6 bg-gray-100 hidden sm:block" />
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs group-hover:scale-105 transition-transform">
              MA
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb & Action Bar */}
      <div className="px-4 lg:px-8 py-4 flex flex-col items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium tracking-wide font-mono">
            {path.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span 
                  className={`hover:text-gray-900 transition underline-offset-4 ${item.href ? "cursor-pointer" : ""}`}
                >
                  {item.label}
                </span>
                {idx < path.length - 1 && <ChevronRight size={10} className="text-gray-300" />}
              </div>
            ))}
          </div>
          <h2 className="text-lg lg:text-xl font-black text-gray-900 tracking-tight">{title}</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-2.5 text-xs lg:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm bg-white">
              <Settings size={18} className="text-gray-500" />
            </button>

            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm bg-white font-bold text-xs text-gray-600">
              <Filter size={16} />
              <span className="hidden lg:inline">Sort/Filters</span>
            </button>

            <button 
              onClick={onNew}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#2563eb] text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-black text-xs uppercase"
            >
              <Plus size={18} />
              NEW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
