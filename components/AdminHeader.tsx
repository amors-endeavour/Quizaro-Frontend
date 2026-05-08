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
      {/* GLOBAL GOVERNANCE BAR */}
      <div className="px-10 h-20 flex items-center justify-between gap-12">
        {/* LEFT SIDE: TITLE ONLY */}
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-gray-900 uppercase tracking-tighter italic">{title}</h1>
        </div>

        {/* GOVERNANCE ACTIONS HUB */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={onSettings}
              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all duration-500 active:scale-95"
              title="System Configuration"
            >
              <Settings size={20} />
            </button>
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-blue-600 font-bold text-xs hover:border-blue-600 transition-all duration-500 active:scale-95 group/user"
            >
              {user ? getInitials(user.name) : <User size={20} />}
            </button>
            
            {showMenu && (
              <div className="absolute top-[120%] right-0 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl p-6 animate-in slide-in-from-top-6 duration-700 z-[200]">
                 <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm uppercase">
                       {user ? getInitials(user.name) : <User size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-xs font-bold text-gray-900 truncate uppercase italic tracking-tighter">Admin User</h4>
                       <p className="text-[9px] text-gray-400 font-bold truncate uppercase tracking-widest italic">{user?.role}</p>
                    </div>
                 </div>
                 
                 <div className="space-y-2 relative z-10">
                    <button 
                      onClick={() => { setShowMenu(false); router.push("/admin-dashboard/settings"); }}
                      className="w-full flex items-center justify-between px-4 py-3 text-[11px] font-bold text-gray-500 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition-all duration-500 uppercase tracking-widest italic border border-transparent"
                    >
                       <div className="flex items-center gap-3">
                          <Settings size={16} /> Add Admin Setting
                       </div>
                       <ChevronRight size={14} />
                    </button>
                    <button 
                      onClick={() => { localStorage.clear(); window.location.href = "/"; }}
                      className="w-full flex items-center justify-between px-4 py-3 text-[11px] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-500 uppercase tracking-widest italic border border-transparent"
                    >
                       <div className="flex items-center gap-3">
                          <LogOut size={16} /> Log out
                       </div>
                       <ChevronRight size={14} />
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
