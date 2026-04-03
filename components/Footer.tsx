"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300 px-6 md:px-12 py-14">
      <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-10">

        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
              <Link href="/" className="flex items-center gap-5 py-[-10px]">
          <img
            src="/logo.png"
            alt="Quizaro"
            className="h-24 w-auto object-contain cursor-pointer"
          />
        </Link>
           
          </div>

          <p className="text-sm leading-relaxed text-neutral-400 mb-5 max-w-md">
            India's most intelligent quiz platform — built to turn aspirants
            into toppers through AI-driven practice and deep analytics.
          </p>

          {/* Socials */}
          <div className="flex gap-3">
            {["𝕏", "in", "▶", "ig"].map((icon, i) => (
              <Link
                key={i}
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition"
              >
                {icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Columns */}
        <FooterColumn
          title="Platform"
          links={[
            "Mock Tests",
            "Leaderboard",
            "Analytics",
            "AI Tutor",
            "Live Classes",
          ]}
        />

        <FooterColumn
          title="Exams"
          links={[
            "JEE / NEET",
            "UPSC",
            "Banking",
            "SSC",
            "CAT / MBA",
          ]}
        />

        <FooterColumn
          title="Company"
          links={[
            "About Us",
            "Blog",
            "Careers",
            "Privacy Policy",
            "Terms of Use",
          ]}
        />
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
        <span>© 2025 Quizaro Technologies Pvt. Ltd. All rights reserved.</span>

        <div className="flex gap-4">
          <Link href="#" className="hover:text-white transition">Privacy</Link>
          <Link href="#" className="hover:text-white transition">Terms</Link>
          <Link href="#" className="hover:text-white transition">Support</Link>
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
  links: string[];
}) {
  return (
    <div>
      <h5 className="text-white font-semibold mb-4">{title}</h5>
      <ul className="space-y-2">
        {links.map((link, i) => (
          <li key={i}>
            <Link
              href="#"
              className="text-sm text-neutral-400 hover:text-white transition"
            >
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}