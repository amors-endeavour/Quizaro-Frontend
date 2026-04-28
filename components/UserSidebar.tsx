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
  AlertCircle,
  Plus,
  Users,
  FileText
} from "lucide-react";
import { useState, useEffect } from "react";
import API from "@/app/lib/api";

export default function UserSidebar({ isOpen, onClose, userName = "Student" }: { isOpen: boolean; onClose: () => void; userName: string }) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [gamification, setGamification] = useState<any>(null);

  useEffect(() => {
    API.get("/user/badges").then(res => setGamification(res.data)).catch(console.error);
  }, []);

  const navItems = [
    { href: "/user-dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { href: "/user-dashboard/papers", label: "Papers", icon: <BookOpen size={20} /> },
    { href: "/user-dashboard/resources", label: "Resources", icon: <FileText size={20} /> },
    { href: "/user-dashboard/students", label: "Students", icon: <Users size={20} /> },
    { href: "/user-dashboard/profile", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Mobile/Global Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#050816]/70 backdrop-blur-md z-[150] animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 z-[200]
        w-80 min-h-screen bg-white border-r border-gray-100
        flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)]
        ${isOpen ? "translate-x-0 shadow-[20px_0_60px_rgba(0,0,0,0.05)]" : "-translate-x-full"}
      `}>
      {/* Student Branding */}
      <div className="p-8 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src="/logo.png" 
            alt="Quizaro" 
            className="w-12 h-12 object-contain rounded-xl shadow-sm border border-gray-100 p-2" 
          />
          <div>
            <h1 className="text-sm font-black text-gray-900 tracking-tight leading-none uppercase">Quizaro</h1>
            <p className="text-[10px] text-gray-400 mt-1 font-bold tracking-widest uppercase">Student Portal</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-300 hover:text-gray-900 hover:rotate-90 transition-all duration-300">
           <Plus className="rotate-45" size={24} />
        </button>
      </div>

      {/* User Hello Card */}
      <div className="p-6">
        <div className="bg-gray-50 rounded-[2.5rem] p-6 border border-gray-100 flex flex-col items-center text-center">
           <div className="w-20 h-20 bg-white border border-gray-100 rounded-3xl flex items-center justify-center mb-4 text-blue-600 shadow-sm">
              <User size={32} />
           </div>
           <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Live Pulse</span>
           </div>
           <h2 className="text-xl font-black text-gray-900 capitalize tracking-tight leading-none mb-4">{userName}</h2>
           
           {/* Gamification Stats */}
           {gamification && (
             <div className="flex w-full divide-x divide-gray-200 border-t border-gray-100 pt-4">
               <div className="flex-1 flex flex-col items-center">
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Level</span>
                 <span className="text-sm font-black text-purple-600 font-mono tracking-tighter">{gamification.level || 1}</span>
               </div>
               <div className="flex-1 flex flex-col items-center">
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">XP Points</span>
                 <span className="text-sm font-black text-blue-600 font-mono tracking-tighter">{gamification.points || 0}</span>
               </div>
             </div>
           )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 pt-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-6 py-4 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm font-bold border-l-4 border-blue-600"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={isActive ? "text-blue-600" : "text-gray-400"}>{item.icon}</span>
                    <span className="text-[11px] font-bold uppercase tracking-widest leading-none mt-0.5">{item.label}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Support */}
      <div className="p-6 border-t border-gray-50 mt-auto space-y-1">
        <button
          onClick={() => window.location.href = "/contact"}
          className="w-full flex items-center gap-4 px-6 py-4 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all text-[11px] font-bold uppercase tracking-widest"
        >
          <HelpCircle size={18} className="text-gray-400" />
          Support
        </button>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-50 rounded-xl transition-all text-[11px] font-bold uppercase tracking-widest"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
      </div>

      {/* USER LOGOUT MODAL 🔥 */}
      {showLogoutModal && (
         <div className="fixed inset-0 z-[500] bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-12 max-w-sm w-full shadow-2xl text-center space-y-10 animate-in zoom-in-95 duration-300">
               <div className="w-24 h-24 bg-red-50 text-red-500 border border-red-100 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl">
                  <LogOut size={40} />
               </div>
               <div className="space-y-4">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Sign Out</h3>
                  <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase tracking-[0.2em]">
                     Confirm session termination. Your academic progress is safely banked.
                  </p>
               </div>
               <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = "/";
                    }}
                    className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-red-900/20"
                  >
                     Confirm Sign Out
                  </button>
                  <button 
                    onClick={() => setShowLogoutModal(false)}
                    className="w-full py-5 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] transition-all"
                  >
                     Cancel
                  </button>
               </div>
            </div>
         </div>
      )}
    </>
  );
}
