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
    <div className="bg-white border-b border-gray-100 flex flex-col sticky top-0 z-[110] transition-all duration-300 shadow-sm">
      {/* Top Navbar */}
      <div className="px-8 h-20 flex items-center justify-between gap-8">
        {/* Breadcrumbs / Back */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-gray-100"
          >
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <div className="flex items-center gap-2 text-sm font-bold text-gray-500 truncate">
             {path.map((p, i) => (
               <div key={i} className="flex items-center gap-2 truncate">
                 {i > 0 && <span className="text-gray-200"> / </span>}
                 {p.href ? (
                   <button onClick={() => router.push(p.href!)} className="hover:text-blue-600 transition-colors truncate">{p.label}</button>
                 ) : (
                   <span className="text-gray-900 truncate">{p.label}</span>
                 )}
               </div>
             ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative hidden lg:block flex-1 max-w-2xl group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search Intelligence System..."
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-16 pr-6 py-3.5 text-sm outline-none focus:border-blue-400 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 shadow-inner"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
            <button 
              onClick={onSettings}
              className="p-3 text-gray-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all"
              title="Settings"
            >
              <Settings size={20} />
            </button>
            <button 
              onClick={onFilter}
              className="p-3 text-gray-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all"
              title="Filter"
            >
              <Filter size={20} />
            </button>
          </div>

          {onNew && (
            <button 
              onClick={onNew}
              className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 flex items-center gap-3 transition-all shadow-lg shadow-blue-900/10 active:scale-95"
            >
              <Plus size={18} /> Create New
            </button>
          )}
          
          <div className="relative ml-2">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-blue-600 font-black text-sm hover:border-blue-200 transition-all shadow-sm hover:shadow-md"
            >
              {user ? getInitials(user.name) : "??"}
            </button>
            {showMenu && (
              <div className="absolute top-full right-0 mt-4 w-72 bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl p-8 animate-in slide-in-from-top-4 duration-300 z-[200]">
                 <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-50">
                    <div className="w-14 h-14 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm uppercase border border-blue-100">
                       {user ? getInitials(user.name) : "??"}
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-sm font-black text-gray-900 truncate leading-none uppercase tracking-tight">{user?.name}</h4>
                       <p className="text-[10px] text-gray-400 font-bold truncate mt-2 uppercase tracking-widest">{user?.role} Access</p>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <button 
                      onClick={() => { setShowMenu(false); router.push("/admin-dashboard/profile"); }}
                      className="w-full flex items-center gap-4 p-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-50 hover:text-blue-600 rounded-2xl transition-all"
                    >
                       <User size={18} /> My Account
                    </button>
                    <button 
                      onClick={() => { localStorage.clear(); window.location.href = "/"; }}
                      className="w-full flex items-center gap-4 p-4 text-[11px] font-bold text-red-500 uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-all"
                    >
                       <LogOut size={18} /> Terminate Session
                    </button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Optional) */}
      {onTabChange && (
        <div className="px-8 flex items-center gap-10">
          {displayTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-3 py-5 text-[11px] font-black uppercase tracking-widest transition-all border-b-2 ${
                activeTab === tab.id 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-gray-400 hover:text-gray-900"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
