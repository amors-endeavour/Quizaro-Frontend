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
    { name: "Tests", href: "/tests" },
    { name: "Resources", href: "/resources" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`w-full sticky top-0 z-[100] bg-background border-b transition-all duration-300 ${
        scrolled ? "border-border" : "border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-9 h-9 bg-foreground rounded-md flex items-center justify-center text-background font-bold text-base shadow-sm group-hover:opacity-80 transition-all">
            Q
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-foreground tracking-tight">QUIZARO</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-xs font-medium text-gray hover:text-foreground uppercase tracking-widest transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent rounded-full transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {checkingAuth ? (
            <div className="w-20 h-9 bg-gray-800 rounded-md animate-pulse" />
          ) : isAuthenticated ? (
            <>
              <button
                onClick={handleDashboardRedirect}
                className="flex items-center gap-2 px-5 py-2.5 bg-accent text-background rounded-md text-xs font-semibold uppercase tracking-wide hover:opacity-90 transition-all"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                title="Log out"
                className="p-2.5 text-gray hover:text-error border border-gray-800 hover:border-error rounded-md transition-all"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-gray hover:text-foreground uppercase tracking-wide transition-colors"
              >
                <LogIn size={15} />
                Login
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 px-5 py-2.5 bg-accent text-background rounded-md text-xs font-semibold uppercase tracking-wide hover:opacity-90 transition-all"
              >
                <UserPlus size={15} />
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2.5 text-gray hover:text-foreground border border-gray-800 rounded-md transition-all"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="lg:hidden bg-background border-t border-gray-800 px-6 py-6 space-y-4">
          <div className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-medium text-gray hover:text-foreground hover:bg-gray-900 rounded-md transition-all uppercase tracking-wide"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-800 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => { handleDashboardRedirect(); setOpen(false); }}
                  className="w-full py-3 bg-accent text-background rounded-md font-semibold text-sm uppercase tracking-wide flex items-center justify-center gap-2"
                >
                  <LayoutDashboard size={16} /> Dashboard
                </button>
                <button
                  onClick={() => { handleLogout(); setOpen(false); }}
                  className="w-full py-3 text-error border border-gray-800 rounded-md font-semibold text-sm uppercase tracking-wide hover:bg-error/10 transition-all"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}
                  className="w-full py-3 text-center text-gray border border-gray-800 rounded-md font-semibold text-sm uppercase tracking-wide hover:text-foreground transition-all"
                >
                  Login
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}
                  className="w-full py-3 text-center bg-accent text-background rounded-md font-semibold text-sm uppercase tracking-wide hover:opacity-90 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
