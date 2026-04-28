"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Library, 
  Users, 
  Settings, 
  LogOut,
  HelpCircle,
  Plus,
  LayoutGrid,
  FileText,
  Shield,
  Activity,
  ChevronRight,
  Database,
  Lock,
  Cpu
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin-dashboard", label: "Intelligence Hub", icon: <BarChart3 size={20} /> },
  { href: "/admin-dashboard/tests", label: "Paper Registry", icon: <Library size={20} /> },
  { href: "/admin-dashboard/resources", label: "Knowledge Mesh", icon: <FileText size={20} /> },
  { href: "/admin-dashboard/users", label: "Scholar Base", icon: <Users size={20} /> },
  { href: "/admin-dashboard/settings", label: "Core Config", icon: <Settings size={20} /> },
];

export default function AdminSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      {/* GLOBAL ADMINISTRATIVE OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-950/80 backdrop-blur-md z-[150] animate-in fade-in duration-700"
          onClick={onClose}
        />
      )}

      {/* SECURE SIDEBAR COMMAND TERMINAL */}
      <div className={`
        fixed top-0 left-0 z-[200]
        w-[340px] min-h-screen bg-white dark:bg-[#050816] border-r-2 border-gray-100 dark:border-gray-800
        flex flex-col transition-all duration-1000 ease-[cubic-bezier(0.87,0,0.13,1)]
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        {/* GOVERNANCE IDENTITY */}
        <div className="p-12 border-b-2 border-gray-100 dark:border-gray-800 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-14 h-14 bg-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-blue-900/40 border-2 border-white dark:border-[#0a0f29] rotate-6">
               <Shield size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white leading-none uppercase tracking-tighter italic">QUIZARO</h1>
              <p className="text-[10px] text-blue-600 dark:text-blue-500 mt-2 font-black tracking-[0.4em] uppercase italic">Admin Matrix</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-300 dark:text-gray-700 hover:text-blue-600 dark:hover:text-blue-500 hover:rotate-90 transition-all duration-700 border border-gray-100 dark:border-gray-700">
             <Plus className="rotate-45" size={24} />
          </button>
        </div>
 
        {/* OPERATIONAL NAVIGATION */}
        <nav className="flex-1 p-10 pt-16 overflow-y-auto no-scrollbar relative z-10">
          <div className="mb-10 px-6">
             <span className="text-[10px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-[0.5em] italic">Main Protocol Chain</span>
          </div>
          <ul className="space-y-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin-dashboard" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-8 py-6 rounded-[2rem] transition-all duration-700 group relative overflow-hidden border-2 ${
                      isActive
                        ? "bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-900/40 translate-x-2 -rotate-1"
                        : "text-gray-400 dark:text-gray-800 border-transparent hover:bg-gray-50 dark:hover:bg-blue-900/10 hover:border-blue-100 dark:hover:border-blue-900/30 hover:text-gray-900 dark:hover:text-blue-500"
                    }`}
                  >
                    <div className="flex items-center gap-6">
                       <span className={`transition-all duration-700 ${isActive ? "text-white scale-125" : "text-gray-300 dark:text-gray-800 group-hover:text-blue-600 dark:group-hover:text-blue-500"}`}>{item.icon}</span>
                       <span className="text-[13px] font-black uppercase tracking-[0.2em] italic">{item.label}</span>
                    </div>
                    {isActive ? (
                       <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_#ffffff]" />
                    ) : (
                       <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-20 px-4">
             <div className="bg-gray-50 dark:bg-blue-900/5 rounded-[3rem] p-10 border-2 border-gray-100 dark:border-blue-900/20 relative overflow-hidden group">
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                <div className="flex items-center gap-4 mb-6 relative z-10">
                   <Activity size={18} className="text-blue-600 dark:text-blue-500" />
                   <span className="text-[11px] font-black text-gray-500 dark:text-gray-600 uppercase tracking-[0.3em] italic">System Telemetry</span>
                </div>
                <div className="h-3 w-full bg-white dark:bg-gray-800 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700 p-0.5 relative z-10 shadow-inner">
                   <div className="h-full bg-blue-600 dark:bg-blue-500 w-[64%] rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)] animate-pulse" />
                </div>
                <div className="flex items-center justify-between mt-4 relative z-10">
                   <span className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.2em] italic">Active Pulse</span>
                   <span className="text-[10px] font-black text-gray-400 dark:text-gray-800 uppercase tracking-widest italic tabular-nums">Load: 64%</span>
                </div>
             </div>
          </div>
        </nav>
  
        {/* GOVERNANCE FOOTER */}
        <div className="p-10 border-t-2 border-gray-100 dark:border-gray-800 space-y-4 relative z-10">
          <Link 
            href="/admin-dashboard/help"
            className="w-full flex items-center gap-6 px-8 py-5 text-gray-400 dark:text-gray-800 hover:bg-gray-50 dark:hover:bg-blue-900/10 hover:text-gray-900 dark:hover:text-blue-500 rounded-[2rem] transition-all duration-700 text-[12px] font-black uppercase tracking-[0.2em] italic border-2 border-transparent hover:border-gray-100 dark:hover:border-blue-900/30"
          >
            <HelpCircle size={22} className="text-gray-300 dark:text-gray-800" />
            Core Support
          </Link>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-6 px-8 py-5 text-red-500 dark:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-500 rounded-[2rem] transition-all duration-700 text-[12px] font-black uppercase tracking-[0.2em] italic border-2 border-transparent hover:border-red-100 dark:hover:border-red-900/30"
          >
            <LogOut size={22} />
            Expunge Session
          </button>
        </div>
      </div>
  
      {/* ADMIN LOGOUT MODAL ARCHITECTURE */}
      {showLogoutModal && (
         <div className="fixed inset-0 z-[1000] bg-gray-950/95 backdrop-blur-3xl flex items-center justify-center p-8 animate-in fade-in duration-700">
            <div className="bg-white dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 rounded-[5rem] p-20 max-w-xl w-full shadow-2xl text-center space-y-12 animate-in zoom-in-95 duration-700 relative overflow-hidden flex flex-col items-center">
               <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />
               <div className="w-28 h-28 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500 border-4 border-white dark:border-[#0a0f29] rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl shadow-red-900/20 rotate-6">
                  <LogOut size={48} />
               </div>
               <div className="space-y-6">
                  <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic leading-none">Terminate Protocol</h3>
                  <p className="text-[14px] font-black text-gray-400 dark:text-gray-700 leading-relaxed uppercase tracking-widest italic max-w-xs mx-auto">
                     Confirm immediate suspension and expunging of authorized administrative access.
                  </p>
               </div>
               <div className="flex flex-col gap-6 w-full">
                  <button 
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = "/";
                    }}
                    className="w-full py-8 bg-red-600 hover:bg-red-700 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.3em] transition-all duration-700 active:scale-95 shadow-2xl shadow-red-900/40 italic"
                  >
                     Confirm Session Expunge
                  </button>
                  <button 
                    onClick={() => setShowLogoutModal(false)}
                    className="w-full py-7 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-800 hover:text-gray-900 dark:hover:text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all duration-700 italic active:scale-95 border-2 border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                  >
                     Maintain Access Protocol
                  </button>
               </div>
            </div>
         </div>
      )}
    </>
  );
}
