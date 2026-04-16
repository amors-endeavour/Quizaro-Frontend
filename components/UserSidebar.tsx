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
    <div className="w-72 min-h-screen bg-white border-r border-gray-100 flex flex-col sticky top-0 animate-in slide-in-from-left-4 duration-500">
      {/* Student Branding */}
      <div className="p-8 border-b border-gray-50 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-100">
          Q
        </div>
        <div>
          <h1 className="text-sm font-black text-gray-900 tracking-tight leading-none uppercase">Quizaro</h1>
          <p className="text-[10px] text-gray-400 mt-1 font-bold tracking-widest uppercase">Student Portal</p>
        </div>
      </div>

      {/* User Hello Card */}
      <div className="p-6">
        <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 flex flex-col items-center text-center">
           <div className="w-20 h-20 bg-blue-100/50 rounded-3xl flex items-center justify-center mb-4 text-blue-600 shadow-inner">
             {gamification?.avatarUrl ? (
               <img src={gamification.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-3xl" />
             ) : (
               <User size={32} />
             )}
           </div>
           <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-md shadow-green-200" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Online</span>
           </div>
           <h2 className="text-xl font-black text-gray-900 capitalize tracking-tight leading-none mb-4">{userName}</h2>
           
           {/* Phase 3.5 Points & Level Display */}
           {gamification && (
             <div className="flex w-full divide-x border-t border-gray-200 pt-4">
               <div className="flex-1 flex flex-col items-center">
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Level</span>
                 <span className="text-sm font-black text-indigo-600">{gamification.level || 1}</span>
               </div>
               <div className="flex-1 flex flex-col items-center">
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">XP points</span>
                 <span className="text-sm font-black text-blue-600">{gamification.points || 0}</span>
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
                      ? "bg-blue-600 text-white shadow-xl shadow-blue-100 font-bold"
                      : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
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
      <div className="p-6 border-t border-gray-50 mt-auto">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all text-xs font-black uppercase tracking-widest"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      {/* INSTITUTIONAL LOGOUT MODAL 🔥 */}
      {showLogoutModal && (
         <div className="fixed inset-0 z-[500] bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-[3.5rem] p-12 max-w-sm w-full shadow-2xl text-center space-y-8 animate-in zoom-in-95 duration-300 border border-gray-100">
               <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-red-50/50">
                  <LogOut size={32} />
               </div>
               <div className="space-y-4">
                  <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">Terminate Session</h3>
                  <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase tracking-widest">
                     Are you certain you want to sign out? Your current session intelligence will be banked and cleared.
                  </p>
               </div>
               <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = "/user-login";
                    }}
                    className="w-full py-5 bg-gray-900 border border-gray-900 hover:bg-red-600 hover:border-red-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl"
                  >
                     Confirm Sign Out
                  </button>
                  <button 
                    onClick={() => setShowLogoutModal(false)}
                    className="w-full py-5 bg-gray-50 text-gray-400 hover:bg-gray-100 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] transition-all"
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
