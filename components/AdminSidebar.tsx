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
  Bell,
  Plus
} from "lucide-react";

const navItems = [
  { href: "/admin-dashboard", label: "Dashboard", icon: <BarChart3 size={20} /> },
  { href: "/admin-dashboard/tests", label: "My Library", icon: <Library size={20} /> },
  { href: "/admin-dashboard/users", label: "Students", icon: <Users size={20} /> },
  { href: "/admin-dashboard/settings", label: "Settings", icon: <Settings size={20} /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col sticky top-0 animate-in slide-in-from-left duration-700">
      {/* Brand Section */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#2563eb] rounded-lg flex items-center justify-center text-white font-bold text-xl">
          Q
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-900 leading-none">QUIZARO</h1>
          <p className="text-[10px] text-gray-400 mt-1 font-bold tracking-widest uppercase">Admin Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 mt-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin-dashboard" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className={`${isActive ? "text-blue-600" : "text-gray-400"}`}>{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-100">
        <Link 
          href="/admin-dashboard/help"
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition-all text-sm mb-2"
        >
          <HelpCircle size={18} className="text-gray-400" />
          Help & Support
        </Link>
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.clear();
              window.location.href = "/admin-login";
            }
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-semibold"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
