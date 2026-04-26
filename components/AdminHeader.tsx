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
    <div className="bg-[#050816] border-b border-white/5 flex flex-col sticky top-0 z-[110] transition-all duration-500 shadow-xl">
      {/* Top Navbar */}
      <div className="pl-40 pr-4 lg:pl-48 lg:pr-8 h-16 flex items-center justify-between border-b border-white/5 bg-[#050816]">
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
            <input 
              type="text"
              placeholder="Search Identity..."
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2 text-xs font-medium focus:bg-white/10 focus:border-cyan-400/50 outline-none transition-all text-white placeholder:text-gray-600"
            />
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xs hover:scale-105 transition-transform shadow-2xl shadow-blue-500/20 uppercase"
            >
              {user ? getInitials(user.name) : "??"}
            </button>

            {showMenu && (
              <div className="absolute top-full right-0 mt-4 w-72 bg-[#0b0f2a] border border-white/10 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] p-8 animate-in slide-in-from-top-4 duration-300 z-[200]">
                 <div className="flex items-center gap-5 mb-8 pb-8 border-b border-white/5">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-white flex items-center justify-center font-black text-sm uppercase">
                       {user ? getInitials(user.name) : "??"}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                       <h4 className="text-xs font-black text-white uppercase truncate">{user?.name}</h4>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate">{user?.role}</p>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <button 
                      onClick={() => { setShowMenu(false); router.push("/admin-dashboard/profile"); }}
                      className="w-full flex items-center gap-4 p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-white/5 hover:text-white rounded-2xl transition-all"
                    >
                       <User size={16} /> Profile Matrix
                    </button>
                    <button 
                      onClick={() => { setShowMenu(false); router.push("/admin-dashboard/profile"); }}
                      className="w-full flex items-center gap-4 p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-white/5 hover:text-white rounded-2xl transition-all"
                    >
                       <Settings size={16} /> Core Settings
                    </button>
                    <button 
                      onClick={() => { localStorage.clear(); window.location.href = "/"; }}
                      className="w-full flex items-center gap-4 p-4 text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500/10 rounded-2xl transition-all"
                    >
                       <LogOut size={16} /> Terminate
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
