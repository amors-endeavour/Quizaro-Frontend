"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, HelpCircle, ChevronRight, LayoutGrid, Calendar, X, Sparkles, AlertCircle, User, Settings, LogOut, Sun, Moon, Monitor, Activity, Shield, Command, Terminal } from "lucide-react";
import { getInitials } from "@/app/lib/utils";
import API from "@/app/lib/api";
import { useTheme } from "next-themes";

interface UserHeaderProps {
  title: string;
  breadcrumbs: string[];
}

export default function UserHeader({ title, breadcrumbs }: UserHeaderProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/');

  useEffect(() => {
    setMounted(true);
    API.get("/user/profile").then(res => setUser(res.data.user || res.data)).catch(() => {});
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  const notifications = [
    { id: 1, title: "New Intelligence Packet", description: "Advanced Matrix Theory papers have been synchronized.", type: "new" },
    { id: 2, title: "Registry Update", description: "Scheduled system maintenance at 04:00 UTC.", type: "alert" },
    { id: 3, title: "Level Up Decrypted", description: "You've unlocked the 'Elite Scholar' neural badge.", type: "new" },
    { id: 4, title: "Velocity Alert", description: "Your logical reasoning accuracy increased by 22%.", type: "new" },
    { id: 5, title: "Security Protocol", description: "Institutional data governance rules updated.", type: "alert" }
  ];

  return (
    <div className="bg-white/90 dark:bg-[#050816]/90 backdrop-blur-2xl border-b-2 border-gray-100 dark:border-gray-800 flex flex-col sticky top-0 z-[120] shadow-sm transition-all duration-500">
      {/* INSTITUTIONAL UTILITY HUD */}
      <div className="pl-40 pr-10 h-20 flex items-center justify-between border-b border-gray-50 dark:border-gray-900 bg-gray-50/30 dark:bg-[#0a0f29]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-blue-600/5 rotate-12 pointer-events-none" />
        
        <div className="flex items-center gap-12 relative z-10">
          <div className="flex items-center gap-4 py-6 border-b-4 border-blue-600 text-blue-600 dark:text-blue-500 font-black text-[11px] uppercase tracking-[0.3em] cursor-default italic">
            <Command size={16} />
            Active Node Dashboard
          </div>
          <button 
            onClick={() => window.location.href = "/contact"}
            className="text-gray-300 dark:text-gray-800 font-black text-[11px] uppercase tracking-[0.3em] hover:text-blue-600 dark:hover:text-blue-500 transition-all italic flex items-center gap-3 group"
          >
            <HelpCircle size={16} className="group-hover:rotate-12 transition-transform" />
            Support Nexus
          </button>
        </div>

        <div className="flex items-center gap-10 relative z-10">
           <div 
             onClick={() => setShowNotifications(!showNotifications)}
             className={`flex items-center gap-4 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] group cursor-pointer transition-all duration-700 italic border-2 ${showNotifications ? "bg-red-600 border-red-600 text-white shadow-2xl shadow-red-900/40 scale-105" : "text-red-600 dark:text-red-500 bg-red-500/5 border-red-100 dark:border-red-900/30 hover:bg-red-500/10"}`}
           >
               <Bell size={16} className={showNotifications ? "animate-bounce" : "group-hover:rotate-12 transition-transform"} />
               Neural Feed (5)
           </div>
           <div className="w-px h-8 bg-gray-100 dark:bg-gray-800" />
           <div className="flex items-center gap-4 font-mono text-[11px] font-black text-gray-300 dark:text-gray-800 tracking-tighter italic">
              <Calendar size={16} className="text-blue-600 dark:text-blue-500" />
              {dateStr}
           </div>
        </div>

        {/* NEURAL NOTIFICATION OVERLAY */}
        {showNotifications && (
           <div className="absolute top-full right-10 mt-6 w-[400px] bg-white/95 dark:bg-[#0a0f29]/95 backdrop-blur-3xl border-2 border-gray-100 dark:border-gray-800 rounded-[3.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-top-6 duration-700 z-[200]">
              <div className="p-8 border-b-2 border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30 relative">
                 <div className="absolute top-0 right-0 w-24 h-full bg-amber-500/5 rotate-12" />
                 <div className="flex items-center gap-4 relative z-10">
                    <Sparkles size={20} className="text-amber-500 animate-pulse" />
                    <h3 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em] italic leading-none">Neural Notifications</h3>
                 </div>
                 <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-red-600 transition-all active:scale-75"><X size={20} /></button>
              </div>
              <div className="max-h-[450px] overflow-y-auto no-scrollbar py-4 px-4">
                 {notifications.map((n) => (
                    <div key={n.id} className="p-6 rounded-[2rem] mb-2 hover:bg-gray-50 dark:hover:bg-blue-900/10 transition-all duration-500 group relative overflow-hidden border-2 border-transparent hover:border-gray-100 dark:hover:border-blue-900/20">
                       <div className="flex gap-6 relative z-10">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 ${n.type === 'alert' ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500 border-red-100 dark:border-red-900/30" : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 border-blue-100 dark:border-blue-900/30"}`}>
                             {n.type === 'alert' ? <AlertCircle size={20} /> : <Terminal size={20} />}
                          </div>
                          <div className="flex flex-col gap-2">
                             <h4 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-blue-600 transition-colors italic leading-none">{n.title}</h4>
                             <p className="text-[11px] text-gray-400 dark:text-gray-700 font-bold leading-relaxed italic">{n.description}</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
              <div className="p-6 bg-gray-50/50 dark:bg-gray-800/20 border-t-2 border-gray-100 dark:border-gray-800 text-center">
                 <button className="text-[10px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-[0.4em] hover:text-blue-600 dark:hover:text-blue-500 transition-all italic">Expunge All Signals</button>
              </div>
           </div>
        )}
      </div>

      {/* CORE IDENTITY HEADER */}
      <div className="pl-40 pr-10 py-10 flex items-center justify-between bg-white dark:bg-[#050816] w-full transition-all duration-500 relative">
         <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 text-[11px] text-gray-300 dark:text-gray-800 font-black uppercase tracking-[0.3em] italic leading-none">
               {breadcrumbs.map((crumb, idx) => (
                 <div key={idx} className="flex items-center gap-4">
                    <span className={idx === breadcrumbs.length - 1 ? "text-gray-900 dark:text-white" : "hover:text-blue-600 dark:hover:text-blue-500 cursor-pointer transition-all"}>
                       {crumb}
                    </span>
                    {idx < breadcrumbs.length - 1 && <ChevronRight size={14} className="text-gray-100 dark:text-gray-900" strokeWidth={4} />}
                 </div>
               ))}
            </div>
            <div className="flex items-center gap-6">
               <div className="w-2 h-10 bg-blue-600 rounded-full shadow-[0_0_12px_#2563eb]" />
               <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter leading-none italic uppercase">{title}</h2>
            </div>
         </div>

         <div className="flex items-center gap-6 relative">
            <div className="flex items-center gap-3 p-2 bg-gray-50/50 dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-inner">
                {mounted && (
                  <button 
                    onClick={toggleTheme}
                    className="w-12 h-12 flex items-center justify-center text-gray-400 dark:text-gray-800 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-white dark:hover:bg-[#050816] rounded-2xl transition-all duration-500 border border-transparent hover:border-gray-100 dark:hover:border-gray-800 active:scale-95"
                    title={`Switch Theme Protocol`}
                  >
                    {theme === 'dark' ? <Moon size={20} /> : theme === 'light' ? <Sun size={20} /> : <Monitor size={20} />}
                  </button>
                )}
                <div 
                  onClick={() => window.location.href = "/contact"}
                  className="w-12 h-12 flex items-center justify-center text-gray-400 dark:text-gray-800 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-white dark:hover:bg-[#050816] rounded-2xl transition-all duration-500 border border-transparent hover:border-gray-100 dark:hover:border-gray-800 cursor-pointer active:scale-95"
                  title="Direct Support Line"
                >
                   <HelpCircle size={20} />
                </div>
            </div>

            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="w-14 h-14 rounded-[1.5rem] bg-blue-600 text-white flex items-center justify-center font-black text-lg hover:scale-105 transition-all duration-500 shadow-2xl shadow-blue-500/30 uppercase italic border-2 border-white dark:border-[#0a0f29] relative group/user"
            >
              {user ? getInitials(user.name) : "??"}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-[#050816] shadow-sm animate-pulse" />
            </button>

            {showMenu && (
              <div className="absolute top-[120%] right-0 w-80 bg-white/95 dark:bg-[#0a0f29]/95 backdrop-blur-3xl border-2 border-gray-100 dark:border-gray-800 rounded-[3.5rem] shadow-2xl p-10 animate-in slide-in-from-top-6 duration-700 z-[200] overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
                 
                 <div className="flex items-center gap-6 mb-10 pb-10 border-b-2 border-gray-50 dark:border-gray-800 relative z-10">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-gray-900 dark:bg-gray-800 text-white flex items-center justify-center font-black text-lg uppercase italic border-2 border-gray-100 dark:border-gray-700 rotate-3 group-hover:rotate-0 transition-transform">
                       {user ? getInitials(user.name) : "??"}
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase truncate leading-none italic tracking-tighter">{user?.name}</h4>
                       <div className="flex items-center gap-2 mt-2">
                          <Activity size={12} className="text-blue-600" />
                          <p className="text-[10px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-[0.3em] truncate italic">Scholar Entity</p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4 relative z-10">
                    {[
                      { icon: <User size={18} />, label: "My Identity", path: "/user-dashboard/profile" },
                      { icon: <Settings size={18} />, label: "Neural Config", path: "/user-dashboard/profile" },
                    ].map((item, i) => (
                      <button 
                        key={i}
                        onClick={() => router.push(item.path)}
                        className="w-full flex items-center justify-between px-6 py-5 text-[11px] font-black text-gray-400 dark:text-gray-800 hover:bg-gray-50 dark:hover:bg-blue-900/10 hover:text-blue-600 dark:hover:text-blue-500 rounded-2xl transition-all duration-500 uppercase tracking-widest italic group/item border-2 border-transparent hover:border-gray-100 dark:hover:border-blue-900/30"
                      >
                         <div className="flex items-center gap-4">
                            {item.icon} {item.label}
                         </div>
                         <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 transition-all translate-x-[-10px] group-hover/item:translate-x-0" />
                      </button>
                    ))}
                    <button 
                      onClick={() => { localStorage.clear(); window.location.href = "/"; }}
                      className="w-full flex items-center justify-between px-6 py-5 text-[11px] font-black text-red-500 dark:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-500 rounded-2xl transition-all duration-500 uppercase tracking-widest italic group/item border-2 border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                    >
                       <div className="flex items-center gap-4">
                          <LogOut size={18} className="group-hover/item:-translate-x-1 transition-transform" /> Terminate Session
                       </div>
                       <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 transition-all translate-x-[-10px] group-hover/item:translate-x-0" />
                    </button>
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
