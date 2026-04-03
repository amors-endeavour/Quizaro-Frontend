"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import API from "@/app/lib/api";

const navItems = [
  { href: "/admin-dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin-dashboard/tests", label: "Tests", icon: "📝" },
  { href: "/admin-dashboard/users", label: "Users", icon: "👥" },
  { href: "/admin-dashboard/attempts", label: "Attempts", icon: "📋" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    router.replace("/login");
  };

  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-blue-400">Quizaro Admin</h1>
        <p className="text-xs text-slate-400 mt-1">Management Panel</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/30 hover:text-red-300 transition"
        >
          <span>🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
