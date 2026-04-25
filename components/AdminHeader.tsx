"use client";

import { Search, Settings, Filter, Plus, Bell, ChevronRight, LayoutGrid, List, BarChart3, LogOut, Home, User } from "lucide-react";
import { getInitials } from "@/app/lib/utils";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/app/lib/api";

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
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    API.get("/user/profile").then(res => setUser(res.data.user || res.data)).catch(() => {});
  }, []);

  const displayTabs = tabs || [
    { id: 'intelligence', label: 'Papers', icon: <LayoutGrid size={14} /> },
    { id: 'analysis', label: 'Analysis', icon: <BarChart3 size={14} /> }
  ];

  return (
    <div className="bg-white border-b border-gray-100 flex flex-col sticky top-0 z-[110] transition-all duration-500 shadow-sm">
      {/* Top Navbar */}
      <div className="pl-40 pr-4 lg:pl-48 lg:pr-8 h-16 flex items-center justify-between border-b border-gray-50 bg-white">
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

          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xs hover:scale-105 transition-transform shadow-lg shadow-blue-500/20 uppercase"
            >
              {user ? getInitials(user.name) : "??"}
            </button>

            {showMenu && (
              <div className="absolute top-full right-0 mt-3 w-64 bg-white border border-gray-100 rounded-3xl shadow-2xl p-6 animate-in slide-in-from-top-2 duration-300 z-[200]">
                 <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                    <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black text-sm uppercase">
                       {user ? getInitials(user.name) : "??"}
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-xs font-black text-gray-900 uppercase truncate">{user?.name}</h4>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate">{user?.role}</p>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <button 
                      onClick={() => router.push("/admin-dashboard/settings")}
                      className="w-full flex items-center gap-3 p-3 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-50 rounded-xl transition-all"
                    >
                       <User size={14} /> Profile
                    </button>
                    <button 
                      onClick={() => router.push("/admin-dashboard/settings")}
                      className="w-full flex items-center gap-3 p-3 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-50 rounded-xl transition-all"
                    >
                       <Settings size={14} /> Settings
                    </button>
                    <button 
                      onClick={() => { localStorage.clear(); window.location.href = "/"; }}
                      className="w-full flex items-center gap-3 p-3 text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 rounded-xl transition-all"
                    >
                       <LogOut size={14} /> Logout
                    </button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
