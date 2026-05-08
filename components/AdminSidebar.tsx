"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  LayoutGrid, 
  Users, 
  BookOpen, 
  CreditCard, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronDown,
  ChevronRight
} from "lucide-react";

export default function AdminSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [quizzesOpen, setQuizzesOpen] = useState(true);

  const navItems = [
    { href: "/admin-dashboard", label: "Dashboard", icon: <LayoutGrid size={18} /> },
    { href: "/admin-dashboard/users", label: "Users", icon: <Users size={18} /> },
  ];

  const quizSubItems = [
    { href: "/admin-dashboard/quizzes/paid", label: "Paid" },
    { href: "/admin-dashboard/quizzes/unpaid", label: "Unpaid" },
    { href: "/admin-dashboard/quizzes/pdf", label: "PDF" },
  ];

  const otherItems = [
    { href: "/admin-dashboard/payments", label: "Payments", icon: <CreditCard size={18} /> },
    { href: "/admin-dashboard/analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
    { href: "/admin-dashboard/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[150]"
          onClick={onClose}
        />
      )}

      {/* SIDEBAR */}
      <div className={`
        fixed top-0 left-0 z-[200]
        w-[280px] min-h-screen bg-white border-r border-gray-100
        flex flex-col transition-transform duration-500
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        
        {/* LOGO SECTION */}
        <div className="p-8 mb-4">
          <Link href="/admin-dashboard" className="flex items-center gap-3 group">
            <img src="/quizaro-logo.png" alt="Quizaro" className="h-12 w-auto object-contain" />
          </Link>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-6 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-[13px] font-bold uppercase tracking-widest ${
                pathname === item.href ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          {/* QUIZZES SECTION WITH SUB-ITEMS */}
          <div className="space-y-1">
            <button
              onClick={() => setQuizzesOpen(!quizzesOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-[13px] font-bold uppercase tracking-widest ${
                pathname.includes("/quizzes") ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-4">
                <BookOpen size={18} />
                QUIZZES
              </div>
              {quizzesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            
            {quizzesOpen && (
              <div className="ml-12 space-y-1">
                {quizSubItems.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={`block px-4 py-2 rounded-lg text-[12px] font-bold uppercase tracking-widest transition-all ${
                      pathname === sub.href ? "text-blue-600" : "text-gray-400 hover:text-gray-900"
                    }`}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {otherItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-[13px] font-bold uppercase tracking-widest ${
                pathname === item.href ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* BOTTOM SECTION */}
        <div className="p-6 border-t border-gray-50 space-y-1">
           <Link
             href="/admin-dashboard/help"
             className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all text-[13px] font-bold uppercase tracking-widest"
           >
             <HelpCircle size={18} />
             SUPPORT
           </Link>
           
           <button
             onClick={() => setShowLogoutModal(true)}
             className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all text-[13px] font-bold uppercase tracking-widest"
           >
             <LogOut size={18} />
             LOGOUT
           </button>
        </div>
      </div>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
         <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-md flex items-center justify-center p-8">
            <div className="bg-white border border-gray-100 rounded-[3rem] p-16 max-w-md w-full shadow-2xl text-center space-y-10">
               <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <LogOut size={40} />
               </div>
               <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Are you logging out?</h3>
               <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic">You can always log back in at any time.</p>
               <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = "/";
                    }}
                    className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl shadow-red-900/20"
                  >
                     Log out
                  </button>
                  <button 
                    onClick={() => setShowLogoutModal(false)}
                    className="w-full py-5 bg-gray-50 text-gray-400 rounded-2xl font-black text-[12px] uppercase tracking-widest"
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
