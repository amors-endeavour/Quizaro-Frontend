"use client";

import { useState, useEffect } from "react";
import { Bell, HelpCircle, ChevronRight, LayoutGrid, Calendar, X, Sparkles, AlertCircle, User, Settings, LogOut } from "lucide-react";
import { getInitials } from "@/app/lib/utils";
import API from "@/app/lib/api";

interface UserHeaderProps {
  title: string;
  breadcrumbs: string[];
}

export default function UserHeader({ title, breadcrumbs }: UserHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/');

  useEffect(() => {
    API.get("/user/profile").then(res => setUser(res.data.user || res.data)).catch(() => {});
  }, []);

  const notifications = [
    { id: 1, title: "New Test Series Live", description: "Advanced Matrix Intelligence papers are now live.", type: "new" },
    { id: 2, title: "System Maintenance", description: "Scheduled sync at 04:00 UTC tomorrow.", type: "alert" },
    { id: 3, title: "Level Up Reward", description: "You've unlocked the 'Scholar' badge.", type: "new" },
    { id: 4, title: "Performance Insight", description: "Your velocity in Maths increased by 15%.", type: "new" },
    { id: 5, title: "Policy Update", description: "Revised institutional data governance rules.", type: "alert" }
  ];

  return (
    <div className="bg-white border-b border-gray-100 flex flex-col sticky top-0 z-[120] shadow-sm">
      {/* Upper Utility Navbar */}
      <div className="pl-40 pr-8 h-18 flex items-center justify-between border-b border-gray-50 bg-gray-50/50 backdrop-blur-md relative">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2 py-5 border-b-2 border-blue-600 text-blue-600 font-black text-[11px] uppercase tracking-widest cursor-default">
            <LayoutGrid size={14} />
            My Dashboard
          </div>
          <div 
            onClick={() => window.location.href = "/contact"}
            className="text-gray-400 font-bold text-[11px] uppercase tracking-widest hover:text-gray-900 transition-all cursor-pointer"
          >
            Support Center
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div 
             onClick={() => setShowNotifications(!showNotifications)}
             className={`flex items-center gap-3 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest group cursor-pointer transition-all duration-300 ${showNotifications ? "bg-red-500 text-white shadow-lg shadow-red-500/20 scale-105" : "text-red-500 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10"}`}
           >
               <Bell size={14} className={showNotifications ? "animate-bounce" : "group-hover:rotate-12 transition-transform"} />
               New Updates (5)
           </div>
           <div className="w-px h-6 bg-gray-200" />
           <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-gray-400 tracking-tighter">
              <Calendar size={14} className="text-blue-600" />
              {dateStr}
           </div>
        </div>

        {/* NOTIFICATION POPUP 🔥 */}
        {showNotifications && (
           <div className="absolute top-full right-8 mt-4 w-[350px] bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300 z-[200]">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                 <div className="flex items-center gap-3">
                    <Sparkles size={16} className="text-amber-500" />
                    <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Neural Notifications</h3>
                 </div>
                 <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-900 transition"><X size={16} /></button>
              </div>
              <div className="max-h-[400px] overflow-y-auto scrollbar-hide py-2">
                 {notifications.map((n) => (
                    <div key={n.id} className="p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors group">
                       <div className="flex gap-4">
                          <div className={`mt-1 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'alert' ? "bg-red-500/5 text-red-500" : "bg-blue-500/5 text-blue-600"}`}>
                             {n.type === 'alert' ? <AlertCircle size={14} /> : <Sparkles size={14} />}
                          </div>
                          <div>
                             <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-tighter mb-1 group-hover:text-blue-600 transition-colors">{n.title}</h4>
                             <p className="text-[10px] text-gray-500 font-bold leading-relaxed">{n.description}</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                 <button className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition">Mark All as Read</button>
              </div>
           </div>
        )}
      </div>

      {/* Main Breadcrumb & Branding Header */}
      <div className="pl-40 pr-8 py-6 flex items-center justify-between bg-white w-full">
         <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] font-sans">
               {breadcrumbs.map((crumb, idx) => (
                 <div key={idx} className="flex items-center gap-2.5">
                    <span className={idx === breadcrumbs.length - 1 ? "text-gray-900" : "hover:text-blue-600 cursor-pointer transition-colors"}>
                       {crumb}
                    </span>
                    {idx < breadcrumbs.length - 1 && <ChevronRight size={10} className="text-gray-200" strokeWidth={3} />}
                 </div>
               ))}
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter leading-none">{title}</h2>
         </div>

         <div className="flex items-center gap-3 relative">
            <div 
              onClick={() => window.location.href = "/contact"}
              className="p-3 bg-gray-50 text-gray-400 border border-gray-100 rounded-2xl shadow-sm hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
            >
               <HelpCircle size={20} />
            </div>

            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-sm hover:scale-105 transition-transform shadow-lg shadow-blue-500/20 uppercase"
            >
              {user ? getInitials(user.name) : "??"}
            </button>

            {showMenu && (
              <div className="absolute top-full right-0 mt-4 w-64 bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl p-8 animate-in slide-in-from-top-2 duration-300 z-[200]">
                 <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-50">
                    <div className="w-14 h-14 rounded-3xl bg-gray-900 text-white flex items-center justify-center font-black text-sm uppercase">
                       {user ? getInitials(user.name) : "??"}
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-sm font-black text-gray-900 uppercase truncate leading-none">{user?.name}</h4>
                       <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest truncate mt-2">Scholar Entity</p>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <button 
                      onClick={() => window.location.href = "/user-dashboard/settings"}
                      className="w-full flex items-center gap-4 p-4 text-[11px] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all"
                    >
                       <User size={16} /> Profile
                    </button>
                    <button 
                      onClick={() => window.location.href = "/user-dashboard/settings"}
                      className="w-full flex items-center gap-4 p-4 text-[11px] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all"
                    >
                       <Settings size={16} /> Settings
                    </button>
                    <button 
                      onClick={() => { localStorage.clear(); window.location.href = "/"; }}
                      className="w-full flex items-center gap-4 p-4 text-[11px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-all"
                    >
                       <LogOut size={16} /> Logout
                    </button>
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
