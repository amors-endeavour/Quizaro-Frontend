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
  { href: "/admin-dashboard", label: "Dashboard", icon: <BarChart3 size={20} /> },
  { href: "/admin-dashboard/tests", label: "All Tests", icon: <Library size={20} /> },
  { href: "/admin-dashboard/resources", label: "Resources", icon: <FileText size={20} /> },
  { href: "/admin-dashboard/users", label: "Users", icon: <Users size={20} /> },
  { href: "/admin-dashboard/settings", label: "Settings", icon: <Settings size={20} /> },
];

export default function AdminSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      {/* GLOBAL ADMINISTRATIVE OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-[150] animate-in fade-in duration-700"
          onClick={onClose}
        />
      )}

      {/* SECURE SIDEBAR COMMAND TERMINAL */}
      <div className={`
        fixed top-0 left-0 z-[200]
        w-[360px] min-h-screen bg-[#fbfbfe] border-r-2 border-gray-100
        flex flex-col transition-all duration-1000 ease-[cubic-bezier(0.87,0,0.13,1)]
        ${isOpen ? "translate-x-0 shadow-2xl shadow-gray-900/10" : "-translate-x-full"}
      `}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        {/* GOVERNANCE IDENTITY */}
        <div className="p-14 border-b-2 border-gray-50 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-blue-600 rounded-[1.8rem] flex items-center justify-center shadow-2xl shadow-blue-600/30 border-2 border-white rotate-6">
               <Shield size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 leading-none uppercase tracking-tighter italic">QUIZARO</h1>
              <p className="text-[11px] text-blue-600 mt-2 font-black tracking-[0.5em] uppercase italic">Governance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-gray-50 rounded-2xl text-gray-300 hover:text-blue-600 hover:rotate-90 transition-all duration-700 border border-gray-100">
             <Plus className="rotate-45" size={24} />
          </button>
        </div>
 
        {/* OPERATIONAL NAVIGATION */}
        <nav className="flex-1 p-12 pt-16 overflow-y-auto no-scrollbar relative z-10">
          <div className="mb-12 px-8">
             <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em] italic">Mesh Registry</span>
          </div>
          <ul className="space-y-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin-dashboard" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-10 py-7 rounded-[2.5rem] transition-all duration-700 group relative overflow-hidden border-2 ${
                      isActive
                        ? "bg-gray-900 border-gray-900 text-white shadow-2xl shadow-gray-900/20 translate-x-3 -rotate-1"
                        : "text-gray-400 border-transparent hover:bg-gray-50 hover:border-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-8">
                       <span className={`transition-all duration-700 ${isActive ? "text-white scale-125" : "text-gray-300 group-hover:text-blue-600"}`}>{item.icon}</span>
                       <span className="text-[14px] font-black uppercase tracking-[0.2em] italic leading-none">{item.label}</span>
                    </div>
                    {isActive ? (
                       <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_12px_#3b82f6]" />
                    ) : (
                       <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-24 px-6">
             <div className="bg-white rounded-[3.5rem] p-12 border-2 border-gray-50 relative overflow-hidden group shadow-sm">
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                <div className="flex items-center gap-6 mb-8 relative z-10">
                   <Activity size={20} className="text-blue-600" />
                   <span className="text-[12px] font-black text-gray-900 uppercase tracking-[0.4em] italic">Mesh Status</span>
                </div>
                <div className="h-4 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-1 relative z-10 shadow-inner">
                   <div className="h-full bg-blue-600 w-[64%] rounded-full shadow-[0_0_12px_rgba(37,99,235,0.4)] animate-pulse" />
                </div>
                <div className="flex items-center justify-between mt-6 relative z-10">
                   <span className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] italic">Live Pulse</span>
                   <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest italic tabular-nums">64% Accurate</span>
                </div>
             </div>
          </div>
        </nav>
  
        {/* SUPPORT & LOGOUT SECTION */}
        <div className="p-12 border-t-2 border-gray-50 space-y-4 relative z-10">
          <Link 
            href="/admin-dashboard/help"
            className="w-full flex items-center gap-8 px-10 py-6 text-gray-400 hover:bg-gray-50 hover:text-gray-900 rounded-[2.5rem] transition-all duration-700 text-[13px] font-black uppercase tracking-[0.3em] italic border-2 border-transparent hover:border-gray-100"
          >
            <HelpCircle size={24} className="text-gray-300 group-hover:text-gray-900" />
            Support Hub
          </Link>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-8 px-10 py-6 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-[2.5rem] transition-all duration-700 text-[13px] font-black uppercase tracking-[0.3em] italic border-2 border-transparent hover:border-red-100"
          >
            <LogOut size={24} />
            Expunge Session
          </button>
        </div>
      </div>
  
      {/* ADMIN LOGOUT MODAL ARCHITECTURE */}
      {showLogoutModal && (
         <div className="fixed inset-0 z-[1000] bg-gray-900/30 backdrop-blur-3xl flex items-center justify-center p-8 animate-in fade-in duration-700">
            <div className="bg-white border-2 border-gray-50 rounded-[5rem] p-24 max-w-2xl w-full shadow-2xl text-center space-y-14 animate-in zoom-in-95 duration-700 relative overflow-hidden flex flex-col items-center">
               <div className="absolute top-0 left-0 w-full h-3 bg-red-600" />
               <div className="w-32 h-32 bg-red-50 text-red-600 border-4 border-white rounded-[3.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-red-900/10 rotate-6">
                  <LogOut size={56} />
               </div>
               <div className="space-y-8">
                  <h3 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Terminate Protocol</h3>
                  <p className="text-[14px] font-black text-gray-400 leading-relaxed uppercase tracking-widest italic max-w-sm mx-auto opacity-70">
                     Confirm immediate suspension and expunging of authorized administrative access from the mesh.
                  </p>
               </div>
               <div className="flex flex-col gap-6 w-full">
                  <button 
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = "/";
                    }}
                    className="w-full py-9 bg-red-600 hover:bg-gray-900 text-white rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.4em] transition-all duration-700 active:scale-95 shadow-2xl shadow-red-900/30 italic"
                  >
                     Confirm Session Expunge
                  </button>
                  <button 
                    onClick={() => setShowLogoutModal(false)}
                    className="w-full py-8 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] transition-all duration-700 italic active:scale-95 border-2 border-transparent hover:border-gray-100"
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
