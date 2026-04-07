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
  CheckCircle2
} from "lucide-react";

export default function UserSidebar({ userName = "Student" }: { userName: string }) {
  const pathname = usePathname();

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
        <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
           <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-md shadow-green-100" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Online Now</span>
           </div>
           <h2 className="text-base font-black text-gray-900 capitalize truncate">Hello, {userName}!</h2>
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
          onClick={() => {
            if (typeof window !== "undefined") {
              const confirmLogout = confirm("Confirm Logout?");
              if (!confirmLogout) return;
              localStorage.clear();
              window.location.href = "/user-login";
            }
          }}
          className="w-full flex items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all text-xs font-black uppercase tracking-widest"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
