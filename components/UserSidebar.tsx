"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home,
  BookOpen, 
  History, 
  User, 
  Settings, 
  LogOut,
  HelpCircle,
  Bell,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import API from "@/app/lib/api";

export default function UserSidebar({ userName = "Student" }: { userName: string }) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [gamification, setGamification] = useState<any>(null);

  useEffect(() => {
    API.get("/user/badges").then(res => setGamification(res.data)).catch(console.error);
  }, []);

  const navItems = [
    { href: "/user-dashboard", label: "My Tests", icon: <BookOpen size={20} /> },
    { href: "/user-dashboard/history", label: "Performance", icon: <History size={20} /> },
    { href: "/user-dashboard/profile", label: "My Profile", icon: <User size={20} /> },
  ];

  return (
    <div className="w-72 min-h-screen bg-[#050816] border-r border-white/10 flex flex-col sticky top-0 animate-in slide-in-from-left-4 duration-500">
      {/* Student Branding */}
      <div className="p-8 border-b border-white/5 flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-[0_10px_20px_rgba(37,99,235,0.2)]">
          Q
        </div>
        <div>
          <h1 className="text-sm font-black text-white tracking-tight leading-none uppercase">Quizaro</h1>
          <p className="text-[10px] text-gray-500 mt-1 font-bold tracking-widest uppercase">Student Portal</p>
        </div>
      </div>

      {/* User Hello Card */}
      <div className="p-6">
        <div className="bg-white/5 rounded-[2.5rem] p-6 border border-white/10 flex flex-col items-center text-center backdrop-blur-md">
           <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center mb-4 text-blue-400 shadow-inner border border-white/5">
              <User size={32} />
           </div>
           <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live Pulse</span>
           </div>
           <h2 className="text-xl font-black text-white capitalize tracking-tight leading-none mb-4">{userName}</h2>
           
           {/* Phase 3.5 Points & Level Display */}
           {gamification && (
             <div className="flex w-full divide-x divide-white/10 border-t border-white/5 pt-4">
               <div className="flex-1 flex flex-col items-center">
                 <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Level</span>
                 <span className="text-sm font-black text-purple-400 font-mono tracking-tighter">{gamification.level || 1}</span>
               </div>
               <div className="flex-1 flex flex-col items-center">
                 <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">XP points</span>
                 <span className="text-sm font-black text-cyan-400 font-mono tracking-tighter">{gamification.points || 0}</span>
               </div>
             </div>
           )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 pt-2">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-[0_15px_30px_rgba(37,99,235,0.2)] font-bold"
                      : "text-gray-500 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={isActive ? "text-white" : "text-gray-400"}>{item.icon}</span>
                    <span className="text-xs font-black uppercase tracking-widest leading-none mt-0.5">{item.label}</span>
                  </div>
                  {isActive && <CheckCircle2 size={14} className="text-white/40" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Support */}
      <div className="p-6 border-t border-white/5 mt-auto">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all text-[11px] font-black uppercase tracking-[0.2em]"
        >
          <LogOut size={18} />
          Sign Out Portal
        </button>
      </div>

      {/* INSTITUTIONAL LOGOUT MODAL 🔥 */}
      {showLogoutModal && (
         <div className="fixed inset-0 z-[500] bg-[#050816]/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="bg-[#0b0f2a] border border-white/10 rounded-[3.5rem] p-12 max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center space-y-10 animate-in zoom-in-95 duration-300">
               <div className="w-24 h-24 bg-red-500/10 text-red-500 border border-red-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-red-500/20 group">
                  <LogOut size={40} className="group-hover:scale-110 transition-transform" />
               </div>
               <div className="space-y-4">
                  <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Terminate Session</h3>
                  <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase tracking-[0.2em]">
                     Are you certain you want to sign out? Your current session intelligence will be banked and cleared.
                  </p>
               </div>
               <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = "/";
                    }}
                    className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-red-900/40"
                  >
                     Confirm Sign Out
                  </button>
                  <button 
                    onClick={() => setShowLogoutModal(false)}
                    className="w-full py-5 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] transition-all"
                  >
                     Stay Signed In
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
