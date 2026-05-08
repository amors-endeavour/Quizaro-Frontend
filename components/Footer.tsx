"use client";

import React from "react";
import Link from "next/link";
import { 
  Twitter, Linkedin, Youtube, Instagram, Globe, 
  Cpu, Shield, Zap
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#f8f9fa] pt-32 pb-12 px-6 border-t border-gray-100 relative overflow-hidden">
      {/* Subtle Background Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(50%_50%_at_50%_0%,rgba(37,99,235,0.03),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-16 mb-24">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-4 mb-8 group">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-900/20 group-hover:rotate-12 transition-transform">
                Q
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">Quizaro</span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mt-1.5 italic">Intelligence Core</span>
              </div>
            </Link>
            <p className="text-[10px] text-gray-400 font-black leading-relaxed mb-10 uppercase tracking-[0.1em] italic opacity-80 max-w-xs">
              India&apos;s most sophisticated adaptive assessment platform — 
              transforming aspirants into institutional achievers through 
              neural practice and deep clinical analytics.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Youtube, Instagram].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm">
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          {/* Matrix Column (Platform) */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.25em] mb-10 italic">Platform</h4>
            <ul className="space-y-5">
              {[
                { name: "Mock Tests", href: "/tests" },
                { name: "Leaderboard", href: "/leaderboard" },
                { name: "Analytics", href: "/analytics" },
                { name: "Resources", href: "/resources" },
                { name: "Support", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors italic">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sectors Column (Exam Sectors) */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.25em] mb-10 italic">Exam Sectors</h4>
            <ul className="space-y-5">
              {[
                "JEE / NEET", "UPSC / Civil", "Banking PO", 
                "SSC / Railway", "CAT / MBA"
              ].map((name) => (
                <li key={name}>
                  <Link href="/tests" className="text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors italic">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional Column (Company) */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.25em] mb-10 italic">Company</h4>
            <ul className="space-y-5">
              {[
                "About Us", "Blog", "Careers", 
                "Privacy Policy", "Terms of Service"
              ].map((name) => (
                <li key={name}>
                  <Link href="#" className="text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors italic">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Operational Column (More) */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
            <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.25em] mb-10 italic">More</h4>
            <ul className="space-y-5">
              {[
                "System Status", "Security", "API Docs", 
                "Register", "Admin Login"
              ].map((name) => (
                <li key={name}>
                  <Link href={name === "Register" ? "/register" : name === "Admin Login" ? "/admin-login" : "#"} className="text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors italic">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <Zap size={14} className="text-blue-600 animate-pulse" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">
              © 2026 Quizaro Intelligence Core Pvt. Ltd. • All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-10">
            <Link href="#" className="text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors italic">Privacy</Link>
            <Link href="#" className="text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors italic">Terms</Link>
            <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
              <Globe size={14} className="text-gray-300" />
              Patna, Bihar, India
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}