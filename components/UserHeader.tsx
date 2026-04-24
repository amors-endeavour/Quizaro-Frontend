"use client";

import { useState } from "react";
import { Bell, HelpCircle, ChevronRight, LayoutGrid, Calendar, X, Sparkles, AlertCircle } from "lucide-react";

interface UserHeaderProps {
  title: string;
  breadcrumbs: string[];
}

export default function UserHeader({ title, breadcrumbs }: UserHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/');

  const notifications = [
    { id: 1, title: "New Test Series Live", description: "Advanced Matrix Intelligence papers are now live.", type: "new" },
    { id: 2, title: "System Maintenance", description: "Scheduled sync at 04:00 UTC tomorrow.", type: "alert" },
    { id: 3, title: "Level Up Reward", description: "You've unlocked the 'Scholar' badge.", type: "new" },
    { id: 4, title: "Performance Insight", description: "Your velocity in Maths increased by 15%.", type: "new" },
    { id: 5, title: "Policy Update", description: "Revised institutional data governance rules.", type: "alert" }
  ];

  return (
    <div className="bg-[#050816] border-b border-white/10 flex flex-col sticky top-0 z-[120] shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
      {/* Upper Utility Navbar */}
      <div className="px-8 h-18 flex items-center justify-between border-b border-white/5 bg-white/5 backdrop-blur-md relative">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2 py-5 border-b-2 border-cyan-500 text-cyan-400 font-black text-[11px] uppercase tracking-widest cursor-default">
            <LayoutGrid size={14} />
            My Dashboard
          </div>
          <div 
            onClick={() => window.location.href = "/contact"}
            className="text-gray-500 font-bold text-[11px] uppercase tracking-widest hover:text-white transition-all cursor-pointer"
          >
            Support Center
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div 
             onClick={() => setShowNotifications(!showNotifications)}
             className={`flex items-center gap-3 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest group cursor-pointer transition-all duration-300 ${showNotifications ? "bg-red-500 text-white shadow-lg shadow-red-500/20 scale-105" : "text-red-400 bg-red-400/10 border border-red-400/20 hover:bg-red-400/20 animate-in fade-in zoom-in duration-700"}`}
           >
               <Bell size={14} className={showNotifications ? "animate-bounce" : "group-hover:rotate-12 transition-transform"} />
               New Updates (5)
           </div>
           <div className="w-px h-6 bg-white/10" />
           <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-gray-500 tracking-tighter">
              <Calendar size={14} className="text-cyan-500" />
              {dateStr}
           </div>
        </div>

        {/* NOTIFICATION POPUP 🔥 */}
        {showNotifications && (
           <div className="absolute top-full right-8 mt-4 w-[350px] bg-[#0b0f2a] border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in slide-in-from-top-2 duration-300 z-[200] backdrop-blur-3xl">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                 <div className="flex items-center gap-3">
                    <Sparkles size={16} className="text-amber-500" />
                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Neural Notifications</h3>
                 </div>
                 <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-white transition"><X size={16} /></button>
              </div>
              <div className="max-h-[400px] overflow-y-auto scrollbar-hide py-2">
                 {notifications.map((n) => (
                    <div key={n.id} className="p-5 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors group">
                       <div className="flex gap-4">
                          <div className={`mt-1 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'alert' ? "bg-red-500/10 text-red-500" : "bg-cyan-500/10 text-cyan-400"}`}>
                             {n.type === 'alert' ? <AlertCircle size={14} /> : <Sparkles size={14} />}
                          </div>
                          <div>
                             <h4 className="text-[11px] font-black text-white uppercase tracking-tighter mb-1 group-hover:text-cyan-400 transition-colors">{n.title}</h4>
                             <p className="text-[10px] text-gray-500 font-bold leading-relaxed">{n.description}</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
              <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                 <button className="text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition">Mark All as Read</button>
              </div>
           </div>
        )}
      </div>

      {/* Main Breadcrumb & Branding Header */}
      <div className="px-8 py-6 flex items-center justify-between bg-[#050816] w-full">
         <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] font-sans">
               {breadcrumbs.map((crumb, idx) => (
                 <div key={idx} className="flex items-center gap-2.5">
                    <span className={idx === breadcrumbs.length - 1 ? "text-white" : "hover:text-cyan-400 cursor-pointer transition-colors"}>
                       {crumb}
                    </span>
                    {idx < breadcrumbs.length - 1 && <ChevronRight size={10} className="text-white/20" strokeWidth={3} />}
                 </div>
               ))}
            </div>
            <h2 className="text-2xl font-black text-white tracking-tighter leading-none">{title}</h2>
         </div>

         <div className="flex items-center gap-3">
            <div 
              onClick={() => window.location.href = "/contact"}
              className="p-3 bg-white/5 text-gray-400 border border-white/10 rounded-2xl shadow-sm hover:bg-cyan-500 hover:text-white transition-all cursor-pointer"
            >
               <HelpCircle size={20} />
            </div>
         </div>
      </div>
    </div>
  );
}
