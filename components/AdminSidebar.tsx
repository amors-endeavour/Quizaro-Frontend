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
  FileText
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin-dashboard", label: "Dashboard", icon: <BarChart3 size={20} /> },
  { href: "/admin-dashboard/tests", label: "Papers", icon: <Library size={20} /> },
  { href: "/admin-dashboard/resources", label: "Resources", icon: <FileText size={20} /> },
  { href: "/admin-dashboard/users", label: "Students", icon: <Users size={20} /> },
  { href: "/admin-dashboard/settings", label: "Settings", icon: <Settings size={20} /> },
];

export default function AdminSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
        {/* Brand Section */}
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/logo.png" 
              alt="Quizaro" 
              className="w-12 h-12 object-contain rounded-xl shadow-sm border border-gray-100 p-2" 
            />
            <div>
              <h1 className="text-sm font-black text-gray-900 leading-none uppercase tracking-tight">QUIZARO</h1>
              <p className="text-[10px] text-gray-400 mt-1 font-bold tracking-widest uppercase">Admin Matrix</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-900 hover:rotate-90 transition-all duration-300">
             <Plus className="rotate-45" size={24} />
          </button>
        </div>
 
        {/* Navigation */}
        <nav className="flex-1 p-6 pt-8">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin-dashboard" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-blue-50 text-blue-700 shadow-sm font-bold border-l-4 border-blue-600"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className={`${isActive ? "text-blue-600" : "text-gray-400"}`}>{item.icon}</span>
                    <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
 
        {/* Footer Info */}
        <div className="p-6 border-t border-gray-50 space-y-2">
          <Link 
            href="/admin-dashboard/help"
            className="flex items-center gap-4 px-6 py-4 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all text-[11px] font-bold uppercase tracking-widest"
          >
            <HelpCircle size={18} className="text-gray-400" />
            Support
          </Link>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-50 rounded-xl transition-all text-[11px] font-bold uppercase tracking-widest"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
 
      {/* ADMIN LOGOUT MODAL 🔥 */}
      {showLogoutModal && (
         <div className="fixed inset-0 z-[500] bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-12 max-w-sm w-full shadow-2xl text-center space-y-10 animate-in zoom-in-95 duration-300">
               <div className="w-24 h-24 bg-red-50 text-red-500 border border-red-100 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl">
                  <LogOut size={40} />
               </div>
               <div className="space-y-4">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Logout</h3>
                  <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase tracking-[0.2em]">
                     Authorized Administrator, confirm immediate session suspension.
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
                     Confirm Logout
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
