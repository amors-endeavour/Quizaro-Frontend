"use client";

import Link from "next/link";
import { Twitter, Linkedin, Youtube, Instagram, Activity, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden px-8 md:px-16 pt-20 pb-10"
      style={{
        background: "linear-gradient(180deg, #2563EB 0%, #1E40AF 40%, #1E3A8A 100%)",
      }}
    >
      {/* Subtle top blend overlay so it merges with the CTA blue above */}
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #2563EB 0%, transparent 100%)",
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-300/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Main grid */}
        <div className="grid md:grid-cols-6 gap-12 pb-16 border-b border-white/20">

          {/* Brand column */}
          <div className="md:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-4 group w-fit">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-700 font-black text-xl shadow-lg group-hover:scale-105 transition-transform">
                Q
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black text-white tracking-tight">QUIZARO</span>
                <span className="text-[10px] text-blue-200 font-bold uppercase tracking-widest mt-1">Intelligence Core</span>
              </div>
            </Link>

            <p className="text-sm text-blue-100 leading-relaxed max-w-xs font-medium">
              India&apos;s most sophisticated adaptive assessment platform — transforming aspirants into top achievers through personalized practice and deep analytics.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { icon: <Twitter size={16} />, href: "#" },
                { icon: <Linkedin size={16} />, href: "#" },
                { icon: <Youtube size={16} />, href: "#" },
                { icon: <Instagram size={16} />, href: "#" },
              ].map((node, i) => (
                <Link
                  key={i}
                  href={node.href}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 border border-white/20 text-blue-100 hover:bg-white hover:text-blue-700 transition-all"
                >
                  {node.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <FooterColumn
            title="Platform"
            links={[
              { name: "Mock Tests", href: "/tests" },
              { name: "Leaderboard", href: "/leaderboard" },
              { name: "Analytics", href: "/result" },
              { name: "Resources", href: "/resources" },
              { name: "Support", href: "/contact" },
            ]}
          />

          <FooterColumn
            title="Exam Sectors"
            links={[
              { name: "JEE / NEET", href: "/tests" },
              { name: "UPSC / Civil", href: "/tests" },
              { name: "Banking PO", href: "/tests" },
              { name: "SSC / Railway", href: "/tests" },
              { name: "CAT / MBA", href: "/tests" },
            ]}
          />

          <FooterColumn
            title="Company"
            links={[
              { name: "About Us", href: "/about" },
              { name: "Blog", href: "/blog" },
              { name: "Careers", href: "/careers" },
              { name: "Privacy Policy", href: "/privacy" },
              { name: "Terms of Service", href: "/terms" },
            ]}
          />

          <FooterColumn
            title="More"
            links={[
              { name: "System Status", href: "#" },
              { name: "Security", href: "#" },
              { name: "API Docs", href: "#" },
              { name: "Register", href: "/register" },
              { name: "Admin Login", href: "/admin-login" },
            ]}
          />
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-blue-200 font-medium">
          <div className="flex items-center gap-3">
            <Activity size={14} className="text-blue-300" />
            <span>© 2026 Quizaro Intelligence Core Pvt. Ltd. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <div className="w-1 h-1 rounded-full bg-blue-300/50" />
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <div className="w-1 h-1 rounded-full bg-blue-300/50" />
            <div className="flex items-center gap-2">
              <Globe size={13} />
              <span>Asia / South</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) {
  return (
    <div className="space-y-5">
      <h5 className="text-xs font-black text-white uppercase tracking-widest">{title}</h5>
      <ul className="space-y-3">
        {links.map((link, i) => (
          <li key={i}>
            <Link
              href={link.href}
              className="text-sm text-blue-200 hover:text-white transition-colors font-medium"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}