"use client";

import { Search, Settings, Filter, Plus, Bell, ChevronRight, LayoutGrid, List, BarChart3, LogOut, Home, User, Sun, Moon, Monitor, ArrowLeft, Terminal, Shield } from "lucide-react";
import { getInitials } from "@/app/lib/utils";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/app/lib/api";
import { useTheme } from "next-themes";

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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    API.get("/user/profile").then(res => setUser(res.data.user || res.data)).catch(() => {});
  }, []);

  const displayTabs = tabs || [
    { id: 'intelligence', label: 'Paper Registry', icon: <LayoutGrid size={14} /> },
    { id: 'analysis', label: 'Clinical Analysis', icon: <BarChart3 size={14} /> }
  ];

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  return (
    <div className="bg-white/90 dark:bg-[#050816]/90 backdrop-blur-2xl border-b-2 border-gray-100 dark:border-gray-800 flex flex-col sticky top-0 z-[110] transition-all duration-500 shadow-sm">
      {/* GLOBAL GOVERNANCE BAR */}
      <div className="px-10 h-24 flex items-center justify-between gap-12">
        {/* BREADCRUMB NAVIGATION PROTOCOL */}
        <div className="flex items-center gap-6 min-w-0 flex-1">
          <button 
            onClick={() => router.back()}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-[#0a0f29] text-gray-400 dark:text-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-500 transition-all duration-500 border-2 border-gray-100 dark:border-gray-800 active:scale-95 shadow-sm"
          >
            <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-3 text-[11px] font-black text-gray-300 dark:text-gray-800 truncate uppercase tracking-[0.2em] italic">
             {path.map((p, i) => (
               <div key={i} className="flex items-center gap-3 truncate">
                 {i > 0 && <span className="opacity-30"> / </span>}
                 {p.href ? (
                   <button onClick={() => router.push(p.href!)} className="hover:text-blue-600 dark:hover:text-blue-500 transition-all truncate hover:translate-x-1">{p.label}</button>
                 ) : (
                   <span className="text-gray-900 dark:text-white truncate font-black">{p.label}</span>
                 )}
               </div>
             ))}
          </div>
        </div>

        {/* SYSTEM SEARCH INTERFACE */}
        <div className="relative hidden lg:block flex-1 max-w-2xl group/search">
          <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-4 text-gray-300 dark:text-gray-800 group-focus-within/search:text-blue-600 dark:group-focus-within/search:text-blue-500 transition-colors duration-500">
             <Terminal size={18} />
             <div className="w-px h-6 bg-current opacity-20" />
          </div>
          <input 
            type="text"
            placeholder="Search Governance Systems..."
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] pl-20 pr-8 py-5 text-[12px] font-black uppercase tracking-widest outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-[#050816] transition-all duration-700 text-gray-900 dark:text-white placeholder:text-gray-200 dark:placeholder:text-gray-900 shadow-inner italic"
          />
        </div>

        {/* GOVERNANCE ACTIONS HUB */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 p-2 bg-gray-50/50 dark:bg-[#0a0f29] rounded-[1.5rem] border-2 border-gray-100 dark:border-gray-800 shadow-inner">
            {mounted && (
              <button 
                onClick={toggleTheme}
                className="w-12 h-12 flex items-center justify-center text-gray-400 dark:text-gray-800 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-white dark:hover:bg-[#050816] rounded-2xl transition-all duration-500 border border-transparent hover:border-gray-100 dark:hover:border-gray-800 active:scale-95"
                title={`Switch Theme protocol`}
              >
                {theme === 'dark' ? <Moon size={20} /> : theme === 'light' ? <Sun size={20} /> : <Monitor size={20} />}
              </button>
            )}
            <button 
              onClick={onSettings}
              className="w-12 h-12 flex items-center justify-center text-gray-400 dark:text-gray-800 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-white dark:hover:bg-[#050816] rounded-2xl transition-all duration-500 border border-transparent hover:border-gray-100 dark:hover:border-gray-800 active:scale-95"
              title="System Configuration"
            >
              <Settings size={20} />
            </button>
          </div>

          {onNew && (
            <button 
              onClick={onNew}
              className="px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white flex items-center gap-4 transition-all duration-700 shadow-2xl shadow-gray-900/20 active:scale-95 italic group/new"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
              Deploy New Node
            </button>
          )}
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="w-14 h-14 rounded-[1.5rem] bg-white dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 flex items-center justify-center text-blue-600 dark:text-blue-500 font-black text-sm uppercase tracking-tighter hover:border-blue-600 transition-all duration-500 shadow-xl active:scale-95 group/user"
            >
              {user ? getInitials(user.name) : <User size={24} />}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-white dark:border-[#0a0f29] shadow-sm animate-pulse" />
            </button>
            
            {showMenu && (
              <div className="absolute top-[120%] right-0 w-80 bg-white/95 dark:bg-[#0a0f29]/95 backdrop-blur-3xl border-2 border-gray-100 dark:border-gray-800 rounded-[3rem] shadow-2xl p-10 animate-in slide-in-from-top-6 duration-700 z-[200] overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
                 
                 <div className="flex items-center gap-6 mb-10 pb-10 border-b-2 border-gray-50 dark:border-gray-800 relative z-10">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 flex items-center justify-center font-black text-lg uppercase border-2 border-blue-100 dark:border-blue-900/30 rotate-3 group-hover:rotate-0 transition-transform">
                       {user ? getInitials(user.name) : <User size={24} />}
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-sm font-black text-gray-900 dark:text-white truncate leading-none uppercase tracking-tighter italic">{user?.name}</h4>
                       <div className="flex items-center gap-2 mt-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                          <p className="text-[10px] text-gray-400 dark:text-gray-700 font-black truncate uppercase tracking-[0.3em] italic">{user?.role} CLEARANCE</p>
                       </div>
                    </div>
                 </div>
                 
                 <div className="space-y-4 relative z-10">
                    <button 
                      onClick={() => { setShowMenu(false); router.push("/admin-dashboard/profile"); }}
                      className="w-full flex items-center justify-between px-6 py-5 text-[11px] font-black text-gray-400 dark:text-gray-800 hover:bg-gray-50 dark:hover:bg-blue-900/10 hover:text-blue-600 dark:hover:text-blue-500 rounded-2xl transition-all duration-500 uppercase tracking-widest italic group/item border-2 border-transparent hover:border-gray-100 dark:hover:border-blue-900/30"
                    >
                       <div className="flex items-center gap-4">
                          <User size={18} className="group-hover/item:scale-110 transition-transform" /> Governance Identity
                       </div>
                       <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 transition-all translate-x-[-10px] group-hover/item:translate-x-0" />
                    </button>
                    <button 
                      onClick={() => { localStorage.clear(); window.location.href = "/"; }}
                      className="w-full flex items-center justify-between px-6 py-5 text-[11px] font-black text-red-500 dark:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-500 rounded-2xl transition-all duration-500 uppercase tracking-widest italic group/item border-2 border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                    >
                       <div className="flex items-center gap-4">
                          <LogOut size={18} className="group-hover/item:-translate-x-1 transition-transform" /> Terminate Access
                       </div>
                       <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 transition-all translate-x-[-10px] group-hover/item:translate-x-0" />
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
          <div className="absolute left-0 bottom-0 h-px w-full bg-gray-50 dark:bg-gray-900" />
          {displayTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-4 py-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 border-b-4 whitespace-nowrap italic relative group ${
                activeTab === tab.id 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-gray-300 dark:text-gray-800 hover:text-gray-900 dark:hover:text-white"
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
