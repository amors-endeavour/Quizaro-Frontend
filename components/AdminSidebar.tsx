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
  LayoutGrid
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin-dashboard", label: "Neural Overview", icon: <BarChart3 size={20} /> },
  { href: "/admin-dashboard/tests", label: "Intelligence Library", icon: <Library size={20} /> },
  { href: "/admin-dashboard/users", label: "Student Nodes", icon: <Users size={20} /> },
  { href: "/admin-dashboard/settings", label: "Core Settings", icon: <Settings size={20} /> },
];

export default function AdminSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#050816]/70 backdrop-blur-md z-40 lg:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed lg:sticky top-0 left-0 z-50
        w-72 min-h-screen bg-[#050816] border-r border-white/10
        flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        lg:flex animate-in slide-in-from-left-4
      `}>
        {/* Brand Section */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-[0_10px_20px_rgba(124,58,237,0.2)]">
              Q
            </div>
            <div>
              <h1 className="text-sm font-black text-white leading-none uppercase tracking-tight">QUIZARO</h1>
              <p className="text-[10px] text-gray-500 mt-1 font-black tracking-widest uppercase">Admin Matrix</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-white transition-colors">
             <Plus className="rotate-45" size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 pt-8">
          <ul className="space-y-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin-dashboard" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-[0_15px_30px_rgba(124,58,237,0.2)] font-bold italic"
                        : "text-gray-500 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className={`${isActive ? "text-white" : "text-gray-400 opacity-60"}`}>{item.icon}</span>
                    <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Info */}
        <div className="p-6 border-t border-white/5 space-y-3">
          <Link 
            href="/admin-dashboard/help"
            className="flex items-center gap-4 px-6 py-4 text-gray-500 hover:bg-white/5 hover:text-white rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest"
          >
            <HelpCircle size={18} className="opacity-60" />
            Support Core
          </Link>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest"
          >
            <LogOut size={18} />
            Halt Session
          </button>
        </div>
      </div>

      {/* ADMIN LOGOUT MODAL 🔥 */}
      {showLogoutModal && (
         <div className="fixed inset-0 z-[500] bg-[#050816]/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="bg-[#0b0f2a] border border-white/10 rounded-[3.5rem] p-12 max-w-sm w-full shadow-2xl text-center space-y-10 animate-in zoom-in-95 duration-300">
               <div className="w-24 h-24 bg-red-500/10 text-red-500 border border-red-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-red-500/10">
                  <LogOut size={40} />
               </div>
               <div className="space-y-4">
                  <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Terminate Matrix</h3>
                  <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase tracking-[0.2em]">
                     Authorized Administrator, confirm immediate session suspension. All local caches will be purged.
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
                     Confirm Shutdown
                  </button>
                  <button 
                    onClick={() => setShowLogoutModal(false)}
                    className="w-full py-5 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] transition-all"
                  >
                     Maintain Access
                  </button>
               </div>
            </div>
         </div>
      )}
    </>
  );
}
