// "use client";

// import { BookOpen, Target, Trophy } from "lucide-react";
// import Link from "next/link";

// export default function AboutPage() {
//   return (
//     <div className="min-h-screen bg-gray-50">

//       {/* HERO */}
//       <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24 px-6 text-center">
//         <h1 className="text-5xl font-bold mb-6">About StudyWeb</h1>
//         <p className="max-w-2xl mx-auto text-lg">
//           StudyWeb is a smart online platform designed to help students prepare
//           for competitive exams through unlimited practice tests, performance
//           analysis, and real-time rankings.
//         </p>
//       </section>

//       {/* MISSION */}
//       <section className="py-20 px-6 max-w-6xl mx-auto text-center">
//         <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
//         <p className="text-gray-600 max-w-3xl mx-auto text-lg">
//           Our mission is to make exam preparation smarter, faster, and more
//           effective. We provide thousands of practice questions, detailed
//           explanations, and performance analytics to help aspirants achieve
//           their goals.
//         </p>
//       </section>

//       {/* FEATURES */}
//       <section className="py-20 bg-white px-6">
//         <h2 className="text-4xl font-bold text-center mb-16">
//           What We Offer
//         </h2>

//         <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

//           <FeatureCard
//             icon={<BookOpen size={32} />}
//             title="Unlimited Practice"
//             desc="Access thousands of MCQs across multiple competitive exams."
//           />

//           <FeatureCard
//             icon={<Target size={32} />}
//             title="Smart Analytics"
//             desc="Track your performance with detailed insights and accuracy reports."
//           />

//           <FeatureCard
//             icon={<Trophy size={32} />}
//             title="Live Rankings"
//             desc="Compete with real aspirants and improve your exam performance."
//           />

//         </div>
//       </section>

//       {/* STATS */}
//       <section className="py-20 px-6 bg-gray-50">
//         <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">

//           <Stat number="50K+" label="Students Joined" />
//           <Stat number="10K+" label="Practice Questions" />
//           <Stat number="1K+" label="Tests Conducted" />

//         </div>
//       </section>

//       {/* CTA */}
//       <section className="bg-blue-600 text-white text-center py-20 px-6">
//         <h2 className="text-4xl font-bold mb-6">
//           Start Your Preparation Today
//         </h2>

//         <p className="mb-8 text-lg">
//           Join thousands of students preparing smarter with StudyWeb.
//         </p>

//         <Link
//           href="/register"
//           className="bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
//         >
//           Get Started
//         </Link>
//       </section>

//     </div>
//   );
// }

// /* Reusable Components */

// function FeatureCard({
//   icon,
//   title,
//   desc,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   desc: string;
// }) {
//   return (
//     <div className="bg-gray-100 p-8 rounded-2xl shadow hover:shadow-xl transition text-center">
//       <div className="text-blue-600 mb-4 flex justify-center">{icon}</div>
//       <h3 className="text-xl font-bold mb-2">{title}</h3>
//       <p className="text-gray-600">{desc}</p>
//     </div>
//   );
// }

// function Stat({ number, label }: { number: string; label: string }) {
//   return (
//     <div>
//       <h3 className="text-4xl font-bold text-blue-600">{number}</h3>
//       <p className="text-gray-600 mt-2">{label}</p>
//     </div>
//   );
// }



"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Target,
  Trophy,
  Brain,
  Users,
  Zap,
  Heart,
  Globe,
  Shield,
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Award,
  Lightbulb,
  Code2,
  BarChart3,
} from "lucide-react";
// import Header from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}

interface StatCardProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  suffix?: string;
}

interface TeamMemberProps {
  name: string;
  role: string;
  initials: string;
  from: string;
  gradient: string;
}

interface TimelineItemProps {
  year: string;
  title: string;
  desc: string;
  side: "left" | "right";
}

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white font-sans overflow-x-hidden">
      {/* <Header /> */}

      <HeroSection />
      <MissionSection />
      <StatsSection />
      <WhatWeOfferSection />
      <TimelineSection />
      <ValuesSection />
      <TeamSection />
      <CtaSection />

      <Footer />
      <GlobalStyles />
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative pt-36 pb-28 px-6 overflow-hidden">
      {/* BG glows */}
      <div className="absolute inset-0">
        <div className="absolute w-[700px] h-[700px] bg-[radial-gradient(circle,_#6d28d940_0%,_transparent_70%)] rounded-full top-[-150px] left-1/2 -translate-x-1/2" />
        <div className="absolute w-[400px] h-[400px] bg-[radial-gradient(circle,_#0891b225_0%,_transparent_70%)] rounded-full bottom-0 right-0" />
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-32 left-16 w-3 h-3 bg-cyan-400/60 rounded-full animate-floatA" />
      <div className="absolute top-48 right-24 w-2 h-2 bg-purple-400/60 rounded-full animate-floatB" />
      <div className="absolute bottom-20 left-1/3 w-4 h-4 bg-blue-400/30 rounded-full animate-floatC" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8">
          <Sparkles size={14} className="text-yellow-400" />
          Our Story &amp; Mission
        </div>

        <h1 className="text-5xl sm:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
          Built for{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
            India&apos;s Aspirants
          </span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Quizaro was born from a simple belief — every student deserves a
          world-class exam preparation tool, regardless of where they come from
          or how much they can afford.
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm">
          {["Founded 2022", "Delhi, India", "IIT Alumni Team", "50K+ Students"].map(
            (badge) => (
              <span
                key={badge}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-400"
              >
                {badge}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MISSION
───────────────────────────────────────────── */
function MissionSection() {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div>
            <SectionLabel text="Our Mission" />
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
              Democratising{" "}
              <span className="gradient-text">Exam Success</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6 text-base">
              Millions of students across India prepare for competitive exams
              every year — JEE, NEET, UPSC, Banking, SSC — often with limited
              access to quality study material and personalised guidance.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8 text-base">
              We built Quizaro to change that. Using AI, adaptive learning, and
              expert-curated content, we give every aspirant the same
              preparation edge once reserved for expensive coaching institutes.
            </p>
            <ul className="space-y-3">
              {[
                "AI-personalised learning paths for every student",
                "Expert-verified questions aligned to latest syllabus",
                "Accessible on any device, anywhere in India",
                "Affordable pricing with a robust free tier",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-gray-400"
                >
                  <CheckCircle
                    size={16}
                    className="text-emerald-400 mt-0.5 flex-shrink-0"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Visual card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 to-purple-600/15 rounded-3xl blur-3xl" />
            <div className="relative bg-[#0a0d25]/70 border border-white/10 rounded-3xl p-8 backdrop-blur-sm space-y-6">
              {/* Quote */}
              <div className="p-5 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                <p className="text-purple-200 text-sm leading-relaxed italic">
                  &ldquo;The best coaching institutes charge ₹2–5 lakhs a year.
                  We asked ourselves — what if we could deliver the same outcome
                  for free?&rdquo;
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-[11px] font-bold">
                    AR
                  </div>
                  <span className="text-xs text-gray-500">
                    Aryan Rao, Co-founder &amp; CEO
                  </span>
                </div>
              </div>

              {/* Mini metrics */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Founded", value: "2022" },
                  { label: "Team Size", value: "32+" },
                  { label: "Cities Reached", value: "400+" },
                  { label: "Exams Covered", value: "200+" },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="bg-white/5 rounded-2xl p-4 text-center"
                  >
                    <div className="text-xl font-black text-white">
                      {m.value}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   STATS
───────────────────────────────────────────── */
function StatsSection() {
  const stats: StatCardProps[] = [
    {
      value: "50",
      suffix: "K+",
      label: "Active Students",
      icon: <Users size={20} />,
    },
    {
      value: "2",
      suffix: "M+",
      label: "Questions Solved",
      icon: <BookOpen size={20} />,
    },
    {
      value: "200",
      suffix: "+",
      label: "Exam Categories",
      icon: <Target size={20} />,
    },
    {
      value: "98",
      suffix: "%",
      label: "Student Satisfaction",
      icon: <Star size={20} />,
    },
    {
      value: "400",
      suffix: "+",
      label: "Cities Covered",
      icon: <Globe size={20} />,
    },
    {
      value: "10",
      suffix: "K+",
      label: "Tests Conducted Daily",
      icon: <TrendingUp size={20} />,
    },
  ];

  return (
    <section className="py-20 px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1e1b4b20_0%,_transparent_70%)]" />
      <div className="max-w-6xl mx-auto relative">
        <SectionLabel text="By the Numbers" />
        <h2 className="section-title mb-14">
          Our Impact <span className="gradient-text">in Numbers</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-center hover:border-purple-500/30 hover:bg-white/[0.05] transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition" />
              <div className="flex justify-center mb-3 text-purple-400">
                {s.icon}
              </div>
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                {s.value}
                {s.suffix}
              </div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   WHAT WE OFFER
───────────────────────────────────────────── */
function WhatWeOfferSection() {
  const offers: FeatureCardProps[] = [
    {
      icon: <Brain size={26} />,
      title: "AI-Adaptive Learning",
      desc: "Our engine studies your patterns and serves targeted questions to close skill gaps faster than any textbook.",
      color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/20",
    },
    {
      icon: <BookOpen size={26} />,
      title: "Unlimited Practice",
      desc: "Access 1M+ MCQs across JEE, NEET, UPSC, Banking, SSC and 200+ more — updated daily by experts.",
      color: "from-blue-500/20 to-purple-500/20 border-blue-500/20",
    },
    {
      icon: <BarChart3 size={26} />,
      title: "Deep Analytics",
      desc: "Topic-wise accuracy, speed trends, percentile rankings and personalised improvement plans after every test.",
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/20",
    },
    {
      icon: <Trophy size={26} />,
      title: "Live Leaderboards",
      desc: "Real-time national rankings, weekly contests, and streak-based rewards to keep you competitively motivated.",
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/20",
    },
    {
      icon: <Shield size={26} />,
      title: "Expert-Verified Content",
      desc: "Every question is crafted and reviewed by IITians and domain specialists with 100% syllabus alignment.",
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/20",
    },
    {
      icon: <Zap size={26} />,
      title: "Instant Explanations",
      desc: "Step-by-step solutions, video walkthroughs and AI-generated hints for every wrong answer.",
      color: "from-rose-500/20 to-pink-500/20 border-rose-500/20",
    },
  ];

  return (
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionLabel text="What We Offer" />
        <h2 className="section-title">
          Everything You Need to <span className="gradient-text">Score Higher</span>
        </h2>
        <p className="section-sub">
          From daily practice to full-length mocks — every tool you need is in
          one place, built with love for Indian exam aspirants.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {offers.map((o) => (
            <OfferCard key={o.title} {...o} />
          ))}
        </div>
      </div>
    </section>
  );
}

function OfferCard({ icon, title, desc, color }: FeatureCardProps) {
  return (
    <div
      className={`group relative p-7 rounded-3xl bg-gradient-to-br ${color} border hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
    >
      <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition" />
      <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-white text-base mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TIMELINE
───────────────────────────────────────────── */
function TimelineSection() {
  const events: TimelineItemProps[] = [
    {
      year: "Jan 2022",
      title: "The Idea",
      desc: "Co-founders Aryan and Meera, both IIT alumni, noticed the massive gap in quality free prep tools for competitive exams.",
      side: "left",
    },
    {
      year: "Jun 2022",
      title: "First Launch",
      desc: "Beta launched with JEE and NEET modules. 2,000 students signed up in the first week through word-of-mouth alone.",
      side: "right",
    },
    {
      year: "Feb 2023",
      title: "Seed Funding",
      desc: "Raised ₹4 Cr seed round. Expanded to UPSC, Banking, and SSC. Team grew to 15 people.",
      side: "left",
    },
    {
      year: "Aug 2023",
      title: "AI Engine v2",
      desc: "Launched our proprietary adaptive AI engine, reducing average improvement time by 40% compared to static tests.",
      side: "right",
    },
    {
      year: "Jan 2024",
      title: "50,000 Students",
      desc: "Hit 50K active users. Expanded to 400+ cities across India, with 10K daily tests being taken on the platform.",
      side: "left",
    },
    {
      year: "Now",
      title: "What's Next",
      desc: "Vernacular language support, offline mobile app, and live doubt-clearing sessions coming in 2025.",
      side: "right",
    },
  ];

  return (
    <section className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/15 to-transparent" />
      <div className="max-w-4xl mx-auto relative">
        <SectionLabel text="Our Journey" />
        <h2 className="section-title mb-16">
          From Idea to <span className="gradient-text">50K Students</span>
        </h2>

        <div className="relative">
          {/* Centre line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/40 to-transparent -translate-x-1/2" />

          <div className="space-y-10">
            {events.map((e, i) => (
              <TimelineItem key={e.year} {...e} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({
  year,
  title,
  desc,
  side,
  index,
}: TimelineItemProps & { index: number }) {
  const isLeft = side === "left";
  return (
    <div
      className={`relative flex flex-col md:flex-row gap-6 items-start ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Card */}
      <div className="flex-1 md:max-w-[calc(50%-2rem)]">
        <div className="group p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-purple-500/30 hover:bg-white/[0.05] transition-all duration-300">
          <span className="inline-block text-xs font-bold text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full mb-3">
            {year}
          </span>
          <h3 className="font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
        </div>
      </div>

      {/* Dot */}
      <div className="hidden md:flex absolute left-1/2 top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 border-2 border-[#050816] z-10 shadow-[0_0_12px_rgba(139,92,246,0.6)]" />

      {/* Spacer */}
      <div className="flex-1 hidden md:block" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   VALUES
───────────────────────────────────────────── */
function ValuesSection() {
  const values: ValueCardProps[] = [
    {
      icon: <Heart size={22} />,
      title: "Student First",
      desc: "Every decision starts with one question: does this make a student's preparation better?",
    },
    {
      icon: <Shield size={22} />,
      title: "Accuracy",
      desc: "We obsess over question quality. Every MCQ is verified at least twice before going live.",
    },
    {
      icon: <Globe size={22} />,
      title: "Accessibility",
      desc: "Great prep tools shouldn't be locked behind expensive paywalls. We fight for that every day.",
    },
    {
      icon: <Lightbulb size={22} />,
      title: "Innovation",
      desc: "We ship new AI features constantly — if it helps students learn faster, we build it.",
    },
    {
      icon: <Code2 size={22} />,
      title: "Transparency",
      desc: "No hidden fees, no dark patterns. Our pricing, data practices, and policies are always clear.",
    },
    {
      icon: <Award size={22} />,
      title: "Excellence",
      desc: "We celebrate top performers and push everyone to reach their personal best.",
    },
  ];

  return (
    <section className="py-28 px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0f172a_0%,_transparent_60%)]" />
      <div className="max-w-6xl mx-auto relative">
        <SectionLabel text="Our Values" />
        <h2 className="section-title">
          What We <span className="gradient-text">Stand For</span>
        </h2>
        <p className="section-sub">
          Values aren&apos;t posters on a wall. They&apos;re the reason we make
          hard calls the right way, every single day.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-16">
          {values.map((v) => (
            <ValueCard key={v.title} {...v} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ValueCard({ icon, title, desc }: ValueCardProps) {
  return (
    <div className="group p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-purple-500/30 hover:bg-white/[0.05] transition-all duration-300">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-white text-sm mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TEAM
───────────────────────────────────────────── */
function TeamSection() {
  const team: TeamMemberProps[] = [
    {
      name: "Aryan Rao",
      role: "Co-founder & CEO",
      initials: "AR",
      from: "IIT Bombay, CS",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      name: "Meera Joshi",
      role: "Co-founder & CTO",
      initials: "MJ",
      from: "IIT Delhi, ML",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      name: "Rohit Sharma",
      role: "Head of Content",
      initials: "RS",
      from: "UPSC AIR 34",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      name: "Anika Singh",
      role: "Lead Designer",
      initials: "AS",
      from: "NID Ahmedabad",
      gradient: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <section className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent" />
      <div className="max-w-5xl mx-auto relative">
        <SectionLabel text="The Team" />
        <h2 className="section-title">
          Built by People Who <span className="gradient-text">Get It</span>
        </h2>
        <p className="section-sub">
          Our team of educators, engineers and designers all share one thing —
          we&apos;ve been exam aspirants ourselves.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {team.map((m) => (
            <TeamCard key={m.name} {...m} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">
            We&apos;re a 32-person team spread across Delhi, Bangalore &amp;
            Mumbai.
          </p>
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors group"
          >
            Join our team — we&apos;re hiring!
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TeamCard({ name, role, initials, from, gradient }: TeamMemberProps) {
  return (
    <div className="group text-center p-6 rounded-3xl bg-white/[0.03] border border-white/[0.07] hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300">
      <div
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-lg font-black mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}
      >
        {initials}
      </div>
      <h3 className="font-bold text-white text-sm mb-1">{name}</h3>
      <p className="text-purple-400 text-xs mb-2">{role}</p>
      <p className="text-gray-600 text-xs">{from}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CTA
───────────────────────────────────────────── */
function CtaSection() {
  return (
    <section className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-purple-950/30 to-blue-950/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#6d28d930_0%,_transparent_70%)]" />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8">
          <Heart size={14} className="text-rose-400" />
          We&apos;re rooting for you
        </div>

        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
          Ready to Write Your <br />
          <span className="gradient-text">Success Story?</span>
        </h2>

        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
          Join 50,000+ aspirants who trusted Quizaro to prepare smarter. It
          starts with a free account — no card, no commitment.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl font-bold text-base shadow-[0_0_50px_rgba(99,102,241,0.5)] hover:shadow-[0_0_70px_rgba(99,102,241,0.8)] hover:scale-105 transition-all duration-300"
          >
            <Zap size={18} />
            Start for Free
          </Link>
          <Link
            href="/#exams"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-white/15 rounded-2xl font-semibold text-base hover:bg-white/5 hover:border-white/30 transition-all"
          >
            Explore Exams <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Shared
───────────────────────────────────────────── */
function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex justify-center mb-5">
      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-400 px-4 py-2 rounded-full bg-purple-400/10 border border-purple-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
        {text}
      </span>
    </div>
  );
}

function GlobalStyles() {
  return (
    <style jsx global>{`
      .section-title {
        font-size: clamp(2rem, 5vw, 3.5rem);
        font-weight: 900;
        text-align: center;
        line-height: 1.1;
        color: white;
        margin-bottom: 1.25rem;
      }
      .section-sub {
        text-align: center;
        color: #6b7280;
        max-width: 40rem;
        margin: 0 auto;
        line-height: 1.7;
        font-size: 1rem;
      }
      .gradient-text {
        background: linear-gradient(135deg, #22d3ee, #3b82f6, #a855f7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      @keyframes shimmer {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }
      .animate-shimmer { animation: shimmer 4s linear infinite; }
      @keyframes floatA {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        50% { transform: translateY(-18px) translateX(8px); }
      }
      @keyframes floatB {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(12px); }
      }
      @keyframes floatC {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        33% { transform: translateY(-10px) translateX(-6px); }
        66% { transform: translateY(6px) translateX(10px); }
      }
      .animate-floatA { animation: floatA 5s ease-in-out infinite; }
      .animate-floatB { animation: floatB 7s ease-in-out infinite; }
      .animate-floatC { animation: floatC 9s ease-in-out infinite; }
    `}</style>
  );
}