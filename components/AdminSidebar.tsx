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
  ChevronRight,
  X
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
  ];

  const bottomItems = [
    { href: "/admin-dashboard/settings", label: "SETTINGS", icon: <Settings size={18} /> },
    { href: "/admin-dashboard/help", label: "SUPPORT", icon: <HelpCircle size={18} /> },
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[250] md:hidden transition-all duration-500"
          onClick={onClose}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen z-[300]
        w-64 bg-white border-r border-gray-100
        flex flex-col transition-transform duration-500 shadow-xl md:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        
        {/* LOGO SECTION */}
        <div className="p-8 mb-4 flex items-center justify-between">
          <Link href="/admin-dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#7C3AED] rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/20">
               <span className="text-white font-black text-xl italic leading-none">Q</span>
            </div>
            <span className="text-lg font-black text-gray-900 tracking-tighter italic">Quizaro</span>
          </Link>
          
          {/* MOBILE CLOSE BUTTON */}
          <button 
            onClick={onClose}
            className="md:hidden p-2 text-gray-400 hover:text-gray-900 transition-all"
          >
             <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-[11px] font-black uppercase tracking-widest italic ${
                pathname === item.href ? "bg-purple-50 text-purple-600 shadow-sm shadow-purple-600/5" : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className={pathname === item.href ? "scale-110" : ""}>{item.icon}</span>
              {item.label}
            </Link>
          ))}

          {/* QUIZZES SECTION WITH SUB-ITEMS */}
          <div className="space-y-1">
            <button
              onClick={() => setQuizzesOpen(!quizzesOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-[11px] font-black uppercase tracking-widest italic ${
                pathname.includes("/quizzes") ? "bg-purple-50 text-purple-600" : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-4">
                <BookOpen size={18} />
                QUIZZES
              </div>
              {quizzesOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            
            {quizzesOpen && (
              <div className="ml-8 space-y-1 animate-in slide-in-from-top-2 duration-300">
                {quizSubItems.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={`block px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest italic transition-all ${
                      pathname === sub.href ? "text-purple-600 bg-purple-50/50" : "text-gray-400 hover:text-gray-900"
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
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-[11px] font-black uppercase tracking-widest italic ${
                pathname === item.href ? "bg-purple-50 text-purple-600 shadow-sm shadow-purple-600/5" : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className={pathname === item.href ? "scale-110" : ""}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* BOTTOM UTILITY GROUP */}
        <div className="p-4 border-t border-gray-100 space-y-1 mt-auto">
           {bottomItems.map((item) => (
             <Link
               key={item.href}
               href={item.href}
               className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-[11px] font-black uppercase tracking-widest italic ${
                 pathname === item.href ? "bg-purple-50 text-purple-600 shadow-sm shadow-purple-600/5" : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
               }`}
             >
               <span className={pathname === item.href ? "scale-110" : ""}>{item.icon}</span>
               {item.label}
             </Link>
           ))}
           
           <button
             onClick={() => setShowLogoutModal(true)}
             className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all text-[11px] font-black uppercase tracking-widest italic"
           >
             <LogOut size={18} />
             LOGOUT
           </button>
        </div>
      </aside>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
         <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-500">
            <div className="bg-white border border-gray-100 rounded-[3rem] p-16 max-w-md w-full shadow-2xl text-center space-y-10 animate-in zoom-in duration-500">
               <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-900/10">
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
                    className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl shadow-red-900/20 active:scale-95 transition-all"
                  >
                     Log out
                  </button>
                  <button 
                    onClick={() => setShowLogoutModal(false)}
                    className="w-full py-5 bg-gray-50 text-gray-400 rounded-2xl font-black text-[12px] uppercase tracking-widest active:scale-95 transition-all"
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
