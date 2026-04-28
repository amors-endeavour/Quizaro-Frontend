"use client";

import Link from "next/link";
import { Twitter, Linkedin, Youtube, Instagram, Mail, Shield, Activity, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0a0f29] border-t-2 border-gray-100 dark:border-gray-800 px-8 md:px-16 py-20 transition-colors duration-500 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid md:grid-cols-6 gap-16 relative z-10">

        {/* Global Institutional Brand */}
        <div className="md:col-span-2 space-y-10">
          <div className="flex flex-col gap-6">
              <Link href="/" className="flex items-center gap-5 group">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-900/30 group-hover:rotate-12 transition-transform duration-500 border-2 border-white dark:border-[#0a0f29]">Q</div>
                <div className="flex flex-col">
                   <span className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Quizaro</span>
                   <span className="text-[10px] text-blue-600 dark:text-blue-500 font-black uppercase tracking-[0.4em] leading-none mt-2 italic">Intelligence Core</span>
                </div>
              </Link>
              <p className="text-[13px] font-black leading-relaxed text-gray-400 dark:text-gray-800 uppercase tracking-tight italic max-w-sm">
                India's most sophisticated adaptive assessment platform — synthesized to transform aspirants into institutional achievers through neural practice and deep clinical analytics.
              </p>
          </div>

          {/* Social Synchronization Nodes */}
          <div className="flex gap-4">
            {[
              { icon: <Twitter size={18} />, href: "#" },
              { icon: <Linkedin size={18} />, href: "#" },
              { icon: <Youtube size={18} />, href: "#" },
              { icon: <Instagram size={18} />, href: "#" },
            ].map((node, i) => (
              <Link
                key={i}
                href={node.href}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-[#050816] text-gray-400 dark:text-gray-800 border border-gray-100 dark:border-gray-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white hover:border-blue-600 transition-all duration-500 shadow-sm"
              >
                {node.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Intelligence Grids */}
        <FooterColumn
          title="Platform Matrix"
          links={[
            { name: "Mock Test Registry", href: "/tests" },
            { name: "Leaderboard Cluster", href: "/leaderboard" },
            { name: "Clinical Analytics", href: "/result" },
            { name: "Knowledge Mesh", href: "/resources" },
            { name: "Support Protocol", href: "/contact" },
          ]}
        />

        <FooterColumn
          title="Domain Sectors"
          links={[
            { name: "JEE / NEET Cluster", href: "/tests" },
            { name: "UPSC / Civil Nodes", href: "/tests" },
            { name: "Banking Sector PO", href: "/tests" },
            { name: "SSC / Railway Matrix", href: "/tests" },
            { name: "CAT / MBA Elite", href: "/tests" },
          ]}
        />

        <FooterColumn
          title="Institutional"
          links={[
            { name: "Mission About", href: "/about" },
            { name: "Insight Blog", href: "/blog" },
            { name: "Career Registry", href: "/careers" },
            { name: "Privacy Protocol", href: "/privacy" },
            { name: "Terms of Engagement", href: "/terms" },
          ]}
        />

        <FooterColumn
          title="Operational"
          links={[
            { name: "System Health", href: "#" },
            { name: "Security Audit", href: "#" },
            { name: "API Documentation", href: "#" },
            { name: "Scholar Registry", href: "/register" },
            { name: "Admin Governance", href: "/admin-login" },
          ]}
        />
      </div>

      {/* Terminal Footer */}
      <div className="border-t-2 border-gray-50 dark:border-gray-800 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-300 dark:text-gray-900 italic">
        <div className="flex items-center gap-6">
           <Activity size={18} className="text-blue-600 dark:text-blue-500" />
           <span>© 2026 Quizaro Intelligence Core Pvt. Ltd. • All Nodes Synchronized.</span>
        </div>

        <div className="flex gap-8 items-center">
          <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">Privacy protocol</Link>
          <div className="w-1 h-1 rounded-full bg-current opacity-20" />
          <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">Terms of service</Link>
          <div className="w-1 h-1 rounded-full bg-current opacity-20" />
          <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-3">
             <Globe size={14} /> Regional: Asia/South
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* Reusable Column Component */
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) {
  return (
    <div className="space-y-8">
      <h5 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-[0.4em] italic leading-none">{title}</h5>
      <ul className="space-y-4">
        {links.map((link, i) => (
          <li key={i}>
            <Link
              href={link.href}
              className="text-[11px] font-black text-gray-400 dark:text-gray-800 hover:text-blue-600 dark:hover:text-blue-500 transition-all uppercase tracking-tight italic"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}