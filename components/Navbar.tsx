"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, UserPlus, LogIn, Menu, X } from "lucide-react";
import API from "@/app/lib/api";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (token) { setIsAuthenticated(true); setUserRole(role); }
      setCheckingAuth(false);
    }
    const verifyAuth = async () => {
      try {
        const { data } = await API.get("/user/profile");
        const role = (data?.role || data?.user?.role)?.toLowerCase();
        setIsAuthenticated(!!data);
        setUserRole(role);
        if (typeof window !== "undefined") localStorage.setItem("role", role);
      } catch {
        setIsAuthenticated(false);
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }
      } finally {
        setCheckingAuth(false);
      }
    };
    verifyAuth();
  }, []);

  const handleDashboardRedirect = () => {
    router.push(userRole === "admin" ? "/admin-dashboard" : "/user-dashboard");
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") localStorage.clear();
    setTimeout(() => { window.location.href = "/"; }, 200);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Test Papers", href: "/tests" },
    { name: "Intel Mesh", href: "/resources" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`w-full sticky top-0 z-[100] bg-white border-b transition-all duration-300 ${
        scrolled ? "border-gray-200 shadow-sm" : "border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-base shadow-md group-hover:scale-105 transition-transform">
            Q
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-black text-gray-900 tracking-tight">QUIZARO</span>
            <span className="text-[9px] text-blue-600 font-bold uppercase tracking-widest">Intelligence Core</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-xs font-semibold text-gray-500 hover:text-gray-900 uppercase tracking-widest transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 rounded-full transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {checkingAuth ? (
            <div className="w-28 h-9 bg-gray-100 rounded-xl animate-pulse" />
          ) : isAuthenticated ? (
            <>
              <button
                onClick={handleDashboardRedirect}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 active:scale-95"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                title="Log out"
                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl transition-all"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-blue-700 uppercase tracking-wide transition-colors"
              >
                <LogIn size={15} />
                Login
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-blue-600 transition-all active:scale-95 shadow-sm"
              >
                <UserPlus size={15} />
                Enroll Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2.5 text-gray-500 hover:text-gray-900 border border-gray-200 rounded-xl transition-all"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-6 space-y-4 shadow-lg">
          <div className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-semibold text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all uppercase tracking-wide"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => { handleDashboardRedirect(); setOpen(false); }}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2"
                >
                  <LayoutDashboard size={16} /> Dashboard
                </button>
                <button
                  onClick={() => { handleLogout(); setOpen(false); }}
                  className="w-full py-3 text-red-500 border border-red-200 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-red-50 transition-all"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}
                  className="w-full py-3 text-center text-gray-700 border border-gray-200 rounded-xl font-bold text-sm uppercase tracking-wide hover:border-blue-300 hover:text-blue-700 transition-all"
                >
                  Login
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}
                  className="w-full py-3 text-center bg-gray-900 text-white rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-blue-600 transition-all"
                >
                  Enroll Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
