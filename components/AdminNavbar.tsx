"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("Admin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const res = await fetch(`${API_URL}/user/profile`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUserName(data.name || "Admin");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUserName();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    router.replace("/login");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/tests", label: "My Tests" },
    { href: "/about", label: "About" },
    { href: "/admin-dashboard", label: "Dashboard" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="w-full bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/admin-dashboard" className="text-xl font-bold text-blue-400">
          Quizaro Admin
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive(link.href)
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <span className="text-slate-400 text-sm">Hi, {userName}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        <button
          className="md:hidden p-2 text-slate-300 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-700 bg-slate-900 px-4 py-3">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive(link.href)
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="text-slate-400 text-sm py-2">Hi, {userName}</div>
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition text-left"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
