"use client";

import React from "react";
import Link from "next/link";
import { 
  Twitter, Linkedin, Youtube, Instagram, Globe, 
  ArrowUpRight, Heart, Cpu 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#050810] pt-24 pb-12 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-24">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-900/20">
                Q
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black text-white tracking-tighter uppercase">Quizaro</span>
                <span className="text-[8px] font-bold text-blue-500 uppercase tracking-widest mt-1">Intelligence Core</span>
              </div>
            </Link>
            <p className="text-[9px] text-gray-600 font-black leading-relaxed mb-10 uppercase tracking-[0.15em]">
              INDIA&apos;S MOST SOPHISTICATED ADAPTIVE ASSESSMENT PLATFORM — SYNTHESIZED TO TRANSFORM 
              ASPIRANTS INTO INSTITUTIONAL ACHIEVERS THROUGH NEURAL PRACTICE AND DEEP CLINICAL ANALYTICS.
            </p>
            <div className="flex gap-3">
              {[Twitter, Linkedin, Youtube, Instagram].map((Icon, i) => (
                <Link key={i} href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white transition-all border border-white/5">
                  <Icon size={14} />
                </Link>
              ))}
            </div>
          </div>

          {/* Matrix Column */}
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-8 italic">Platform Matrix</h4>
            <ul className="space-y-4">
              {[
                { name: "Mock Test Registry", href: "/tests" },
                { name: "Leaderboard Cluster", href: "/leaderboard" },
                { name: "Clinical Analytics", href: "/analytics" },
                { name: "Knowledge Mesh", href: "/resources" },
                { name: "Support Protocol", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[9px] font-black text-gray-600 hover:text-blue-500 uppercase tracking-widest transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sectors Column */}
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-8 italic">Domain Sectors</h4>
            <ul className="space-y-4">
              {[
                "JEE / NEET Cluster", "UPSC / Civil Nodes", "Banking Sector PO", 
                "SSC / Railway Matrix", "CAT / MBA Elite"
              ].map((name) => (
                <li key={name}>
                  <Link href="/tests" className="text-[9px] font-black text-gray-600 hover:text-blue-500 uppercase tracking-widest transition-colors">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional Column */}
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-8 italic">Institutional</h4>
            <ul className="space-y-4">
              {[
                "Mission About", "Insight Blog", "Career Registry", 
                "Privacy Protocol", "Terms of Engagement"
              ].map((name) => (
                <li key={name}>
                  <Link href="#" className="text-[9px] font-black text-gray-600 hover:text-blue-500 uppercase tracking-widest transition-colors">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Operational Column */}
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-8 italic">Operational</h4>
            <ul className="space-y-4">
              {[
                "System Health", "Security Audit", "API Documentation", 
                "Scholar Registry", "Admin Governance"
              ].map((name) => (
                <li key={name}>
                  <Link href="#" className="text-[9px] font-black text-gray-600 hover:text-blue-500 uppercase tracking-widest transition-colors">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Cpu size={14} className="text-blue-600" />
            <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.2em]">
              © 2026 Quizaro Intelligence Core Pvt. Ltd. • All Nodes Synchronized
            </p>
          </div>
          
          <div className="flex items-center gap-8">
            <Link href="#" className="text-[9px] font-black text-gray-700 hover:text-white uppercase tracking-widest">Privacy Protocol</Link>
            <Link href="#" className="text-[9px] font-black text-gray-700 hover:text-white uppercase tracking-widest">Terms of Service</Link>
            <div className="flex items-center gap-2 text-[9px] font-black text-gray-700 uppercase tracking-widest">
              <Globe size={12} className="text-gray-800" />
              Regional: Asia/South
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}