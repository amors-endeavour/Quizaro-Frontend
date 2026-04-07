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
      <div className="px-8 h-16 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-1.5 py-4 border-b-2 border-blue-600 text-blue-600 font-bold text-sm">
            <LayoutGrid size={16} />
            My Library
          </div>
          <div className="text-gray-400 font-medium text-sm hover:text-gray-600 transition cursor-not-allowed">
            Recent Analysis
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-red-500 bg-red-50 px-3 py-1.5 rounded-full text-xs font-bold animate-pulse cursor-pointer">
            <Bell size={14} />
            Report Dashboard (17)
          </div>
          <div className="w-px h-6 bg-gray-100" />
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs group-hover:scale-105 transition-transform">
              MA
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb & Action Bar */}
      <div className="px-8 py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium tracking-wide font-mono">
            {path.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span 
                  className={`hover:text-gray-900 transition underline-offset-4 ${item.href ? "cursor-pointer" : ""}`}
                >
                  {item.label}
                </span>
                {idx < path.length - 1 && <ChevronRight size={12} className="text-gray-300" />}
              </div>
            ))}
          </div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">{title}</h2>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Search Box - Matches Image Theme */}
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name (Minimum 3 characters)"
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-2.5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
            />
          </div>

          <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm bg-white">
            <Settings size={18} className="text-gray-500" />
          </button>

          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm bg-white font-bold text-sm text-gray-600">
            <Filter size={16} />
            Sort/Filters
          </button>

          <button 
            onClick={onNew}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#2563eb] text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-black text-sm"
          >
            <Plus size={18} />
            NEW
          </button>
        </div>
      </div>
    </div>
  );
}
