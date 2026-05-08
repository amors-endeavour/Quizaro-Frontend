"use client";

import { Search, Settings, Filter, Plus, Bell, ChevronRight, LayoutGrid, List, BarChart3, LogOut, Home, User, Sun, Moon, Monitor, ArrowLeft, Terminal, Shield } from "lucide-react";
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
  onNewBtnLabel?: string;
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
  onNewBtnLabel,
  onSettings, 
  onFilter, 
  onSearchChange 
}: AdminHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    API.get("/user/profile").then(res => setUser(res.data.user || res.data)).catch(() => {});
  }, []);

  const displayTabs = tabs || [
    { id: 'intelligence', label: 'Paper Registry', icon: <LayoutGrid size={14} /> },
    { id: 'analysis', label: 'Clinical Analysis', icon: <BarChart3 size={14} /> }
  ];

  return (
    <div className="bg-white border-b border-gray-100 flex flex-col sticky top-0 z-[110] transition-all duration-500 shadow-sm">
      <div className="px-8 h-20 flex items-center justify-between gap-12">
        
        {/* SEARCH BAR (Matching Image 1) */}
        <div className="relative flex-1 max-w-xl group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search quizzes, users, payments..."
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-16 pr-8 py-3.5 text-sm focus:border-blue-600 focus:bg-white outline-none transition-all placeholder:text-gray-400"
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>

        {/* UTILITIES & PROFILE (Matching Image 1) */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
              <Moon size={20} />
            </button>
            <div className="relative">
              <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
                <Bell size={20} />
              </button>
              <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">3</div>
            </div>
          </div>

          <div className="h-8 w-px bg-gray-100" />

          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-2xl transition-all group"
            >
              <div className="text-right hidden sm:block">
                <h4 className="text-sm font-bold text-gray-900 leading-none">Admin</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Super Admin</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 border-2 border-white shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                {user ? getInitials(user.name) : <User size={22} />}
              </div>
            </button>
            
            {showMenu && (
              <div className="absolute top-[120%] right-0 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl p-6 animate-in slide-in-from-top-6 duration-700 z-[200]">
                 <div className="space-y-2">
                    <button 
                      onClick={() => { setShowMenu(false); router.push("/admin-dashboard/settings"); }}
                      className="w-full flex items-center justify-between px-4 py-3 text-[11px] font-bold text-gray-500 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition-all duration-500 uppercase tracking-widest border border-transparent"
                    >
                       <div className="flex items-center gap-3">
                          <Settings size={16} /> Admin Settings
                       </div>
                    </button>
                    <button 
                      onClick={() => { localStorage.clear(); window.location.href = "/"; }}
                      className="w-full flex items-center justify-between px-4 py-3 text-[11px] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-500 uppercase tracking-widest border border-transparent"
                    >
                       <div className="flex items-center gap-3">
                          <LogOut size={16} /> Log out
                       </div>
                    </button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* COGNITIVE NAVIGATION TABS */}
      {onTabChange && (
        <div className="px-10 flex items-center gap-12 overflow-x-auto no-scrollbar relative">
          <div className="absolute left-0 bottom-0 h-px w-full bg-gray-50" />
          {displayTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-4 py-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 border-b-4 whitespace-nowrap italic relative group ${
                activeTab === tab.id 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-gray-400 hover:text-gray-900"
              }`}
            >
              <span className={`transition-all duration-500 ${activeTab === tab.id ? "scale-110 rotate-3" : "group-hover:scale-110"}`}>
                 {tab.icon}
              </span>
              {tab.label}
              {activeTab === tab.id && (
                 <div className="absolute -bottom-1 left-0 w-full h-1 bg-blue-600 rounded-full shadow-[0_0_12px_#2563eb]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
