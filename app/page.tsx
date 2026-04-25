"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, Zap, Play, Star, Users, Brain, BookOpen, Target, Award, 
  BarChart3, Trophy, Clock, Flame, Shield, ArrowRight, TrendingUp, 
  CheckCircle, ChevronDown 
} from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/app/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* Interfaces */
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tag?: string;
}

interface ExamCardProps {
  emoji: string;
  title: string;
  subtitle: string;
  count: string;
  color: string;
}

interface StepProps {
  number: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

interface PricingCardProps {
  plan: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
}

interface TestimonialProps {
  name: string;
  role: string;
  exam?: string;
  text: string;
  avatar: string;
  rating: number;
}

interface StatProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface FaqItemProps {
  question: string;
  answer: string;
}

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // We remove the automatic redirect to ensure the landing page is always the first entry point
    // as per the requirement: "Whenever a user/admin opens the link, this should appear."
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050816] text-white font-sans overflow-x-hidden">
      <Navbar />
      
      <HeroSection />
      <TrustedBySection />
      <StatsSection />
      <FeaturesSection />
      <ExamCategoriesSection />
      <HowItWorksSection />
      <AIShowcaseSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      
      <Footer />
      <GlobalStyles />
    </div>
  );
}

/* HERO */
function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-12 pb-20 overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0">
        {/* Main Center Glow */}
        <div className="absolute w-[1200px] h-[800px] bg-[radial-gradient(circle,_#6d28d920_0%,_transparent_70%)] rounded-full top-[-150px] left-1/2 -translate-x-1/2 blur-[80px]" />
        {/* Side Accents */}
        <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,_#0ea5e915_0%,_transparent_70%)] rounded-full -bottom-20 left-0 blur-[60px]" />
        <div className="absolute w-[400px] h-[400px] bg-[radial-gradient(circle,_#7c3aed10_0%,_transparent_70%)] rounded-full bottom-20 right-0 translate-x-1/4 blur-[40px]" />
      </div>

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto flex flex-col items-center">
        {/* Institutional Badge */}
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-12 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-1000">
          <Sparkles size={14} className="text-yellow-400 animate-pulse" />
          Simplified With Umar - Let's Learn Simply
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>

        {/* Master Heading */}
        <h1 className="text-5xl sm:text-7xl md:text-[6.5rem] font-black leading-[1] mb-10 tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100 selection:bg-cyan-500/30">
          Crack Any Exam <br />
          <span className="bg-gradient-to-r from-[#22d3ee] via-[#60a5fa] to-[#6366f1] bg-clip-text text-transparent drop-shadow-[0_10px_30px_rgba(34,211,238,0.2)]">
            With Confidence
          </span>
        </h1>

        <p className="max-w-2xl text-base sm:text-lg text-gray-300 font-medium leading-relaxed mb-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          India's smartest quiz platform. Adaptive tests, real-time analytics, live 
          leaderboards — everything you need to outperform 50,000+ aspirants.
        </p>

        {/* Action Hub */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-20 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <button 
            onClick={() => router.push("/login")}
            className="group relative flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl font-black text-sm uppercase tracking-widest shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:shadow-[0_25px_60px_rgba(37,99,235,0.5)] hover:scale-105 transition-all active:scale-95 overflow-hidden"
          >
            <div className="bg-white/10 p-2.5 rounded-xl group-hover:rotate-12 transition-transform"><Users size={20} /></div>
            I am a Student
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 rounded-full scale-x-0 group-hover:scale-x-90 transition-transform origin-center" />
          </button>

          <button 
            onClick={() => router.push("/admin-login")}
            className="group flex items-center gap-4 px-12 py-6 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-white/10 hover:border-white/30 transition-all hover:scale-105 active:scale-95 shadow-2xl"
          >
            <div className="bg-white/5 p-2.5 rounded-xl text-gray-400 group-hover:text-cyan-400 transition-colors"><Shield size={20} /></div>
            I am an Admin
          </button>
        </div>

        {/* Trust Metrics */}
        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <div className="flex items-center -space-x-4">
             {[1,2,3,4,5].map(i => (
               <div key={i} className="w-12 h-12 rounded-full border-4 border-[#050816] bg-gray-800 overflow-hidden shadow-xl ring-1 ring-white/10">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 777}`} alt="user" className="w-full h-full object-cover" />
               </div>
             ))}
             <div className="w-12 h-12 rounded-full border-4 border-[#050816] bg-blue-600 flex items-center justify-center text-[10px] font-black shadow-xl ring-1 ring-blue-400/30">+50k</div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
             <span className="text-[11px] text-gray-500 font-black uppercase tracking-widest">50,000+ students enrolled</span>
             <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                   {[1,2,3,4,5].map(i => <Star key={i} size={14} className={i === 5 ? "text-yellow-500/40" : "text-yellow-500"} fill="currentColor" />)}
                </div>
                <span className="text-xs text-gray-400 font-bold font-mono tracking-tighter">4.9/5 rating</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustedBySection() {
  const brands = ["SKAUST Kashmir", "Kashmir University University", "Cluster University Kashmir",  "JKBOSE", "JKBOPEE"];
  return (
    <section className="py-12 border-y border-white/[0.05] overflow-hidden">
      <p className="text-center text-sm text-gray-600 uppercase tracking-[0.2em] mb-8">
        Trusted by students from
      </p>
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {[...brands, ...brands].map((b, i) => (
          <span key={i} className="text-gray-500 font-semibold text-sm hover:text-gray-300 transition-colors cursor-default">
            {b}
          </span>
        ))}
      </div>
    </section>
  );
}

function StatsSection() {
  const stats: StatProps[] = [
    { value: "50K+", label: "Active Students", icon: <Users size={20} /> },
    { value: "2M+", label: "Questions Solved", icon: <BookOpen size={20} /> },
    { value: "98%", label: "Success Rate", icon: <Target size={20} /> },
    { value: "200+", label: "Exam Categories", icon: <Award size={20} /> },
  ];
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-center group hover:border-purple-500/30 hover:bg-white/[0.05] transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition" />
            <div className="flex justify-center mb-3 text-purple-400">{s.icon}</div>
            <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-1">
              {s.value}
            </div>
            <div className="text-gray-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features: FeatureCardProps[] = [
    {
      icon: <Brain size={28} />,
      title: "Adaptive AI Engine",
      desc: "Our ML model analyses your weak spots and dynamically adjusts question difficulty for maximum improvement.",
      tag: "AI-Powered",
    },
    {
      icon: <BarChart3 size={28} />,
      title: "Deep Analytics",
      desc: "Visualise accuracy, speed, topic-wise performance and improvement trends over time.",
      tag: "Pro",
    },
    {
      icon: <Trophy size={28} />,
      title: "Live Leaderboards",
      desc: "Compete with thousands of students in real-time tests and climb national rankings.",
    },
    {
      icon: <Clock size={28} />,
      title: "Timed Mock Tests",
      desc: "Simulate real exam conditions with auto-scored, NTA-pattern mock papers.",
    },
    {
      icon: <Flame size={28} />,
      title: "Daily Streaks",
      desc: "Build consistent habits with daily challenges, streak rewards, and personal bests.",
    },
    {
      icon: <Shield size={28} />,
      title: "Exam-Pattern Accurate",
      desc: "Questions curated by IITians and subject-matter experts aligned to the latest syllabus.",
      tag: "Expert Verified",
    },
  ];

  return (
    <section className="py-28 px-6" id="features">
      <div className="max-w-6xl mx-auto">
        <SectionLabel text="Features" />
        <h2 className="section-title">
          Everything You Need to <br className="hidden md:block" />
          <span className="gradient-text">Score Higher</span>
        </h2>
        <p className="section-sub">
          From adaptive quizzes to in-depth analysis — Quizaro gives you an
          unfair advantage over other aspirants.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, tag }: FeatureCardProps) {
  return (
    <div className="group relative p-7 rounded-3xl bg-white/[0.03] border border-white/[0.08] hover:border-purple-500/40 transition-all duration-400 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/8 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl translate-x-8 translate-y-8 group-hover:opacity-60 transition" />

      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
          {icon}
        </div>

        {tag && (
          <span className="absolute top-0 right-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-purple-500/30 text-purple-300">
            {tag}
          </span>
        )}

        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ExamCategoriesSection() {
  const exams: ExamCardProps[] = [
    { emoji: "🔬", title: "JEE / NEET", subtitle: "Engineering & Medical", count: "8,400+ tests", color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30" },
    { emoji: "📜", title: "UPSC / IAS", subtitle: "Civil Services", count: "3,200+ tests", color: "from-amber-500/20 to-orange-500/20 border-amber-500/30" },
    { emoji: "🏦", title: "Banking PO/Clerk", subtitle: "SBI, IBPS, RBI", count: "5,100+ tests", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30" },
    { emoji: "⚔️", title: "Defence", subtitle: "CDS, NDA, AFCAT", count: "2,700+ tests", color: "from-red-500/20 to-pink-500/20 border-red-500/30" },
    { emoji: "📊", title: "SSC / Railway", subtitle: "CGL, CHSL, RRB NTPC", count: "6,300+ tests", color: "from-violet-500/20 to-purple-500/20 border-violet-500/30" },
    { emoji: "🎓", title: "CAT / MBA", subtitle: "IIM Entrance", count: "1,900+ tests", color: "from-pink-500/20 to-rose-500/20 border-pink-500/30" },
  ];

  return (
    <section className="py-28 px-6 relative" id="exams">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1e1b4b30_0%,_transparent_70%)]" />
      <div className="max-w-6xl mx-auto relative">
        <SectionLabel text="Exam Categories" />
        <h2 className="section-title">
          Prepare for <span className="gradient-text">Any Exam</span> You Target
        </h2>
        <p className="section-sub">
          Over 200 exam categories with 1M+ questions updated daily by domain experts.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-16">
          {exams.map((e) => (
            <ExamCard key={e.title} {...e} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/exams"
            className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors group"
          >
            View all 200+ exam categories
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ExamCard({ emoji, title, subtitle, count, color }: ExamCardProps) {
  return (
    <Link
      href="/exams"
      className={`group relative p-6 rounded-2xl bg-gradient-to-br ${color} border hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/[0.03]" />
      <div className="flex items-start justify-between mb-4">
        <span className="text-3xl">{emoji}</span>
        <ArrowRight size={16} className="text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
      </div>
      <h3 className="font-bold text-white text-base mb-1">{title}</h3>
      <p className="text-gray-400 text-sm mb-3">{subtitle}</p>
      <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">{count}</span>
    </Link>
  );
}

function HowItWorksSection() {
  const steps: StepProps[] = [
    { number: "01", title: "Create Free Account", desc: "Sign up in 30 seconds for free.", icon: <Users size={20} /> },
    { number: "02", title: "Choose Your Exam", desc: "Select from 100+ categories.", icon: <BookOpen size={20} /> },
    { number: "03", title: "Take Tests", desc: "Adaptive questions that focus on your weak areas.", icon: <Brain size={20} /> },
    { number: "04", title: "Track & Improve", desc: "Detailed analysis and AI insights after every test.", icon: <TrendingUp size={20} /> },
  ];

  return (
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionLabel text="How It Works" />
        <h2 className="section-title">
          Go From Zero to <span className="gradient-text">Exam Ready</span>
        </h2>
        <p className="section-sub">
          Start improving in minutes — not months. Our streamlined flow gets you practising fast.
        </p>

        <div className="relative mt-20">
          <div className="hidden md:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <StepCard key={s.number} {...s} delay={i * 100} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ number, title, desc, icon, delay }: StepProps & { delay: number }) {
  return (
    <div className="relative text-center group" style={{ animationDelay: `${delay}ms` }}>
      <div className="relative inline-flex w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-white/10 items-center justify-center mb-6 mx-auto group-hover:border-purple-500/50 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-400">
        <span className="text-2xl font-black text-white/20 absolute">{number}</span>
        <span className="text-purple-400 relative z-10">{icon}</span>
      </div>
      <h3 className="font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function AIShowcaseSection() {
  return (
    <section className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent" />
      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel text="AI Intelligence" />
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
              Your Personal AI <br />
              <span className="gradient-text">Study Coach</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8">
              Unlike static test series, Quizaro&apos;s AI analyses thousands of data
              points from your sessions — accuracy patterns, response speed, topic
              confidence — to build a personalised preparation roadmap unique to you.
            </p>
            <ul className="space-y-4">
              {[
                "Identifies and targets your weakest topics automatically",
                "Adjusts question difficulty in real-time",
                "Predicts your score range before the actual exam",
                "Suggests optimal daily study schedule",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-400">
                  <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold text-sm hover:opacity-90 transition"
            >
              Try AI Analysis Free <ArrowRight size={14} />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-3xl blur-3xl" />
            <div className="relative bg-[#0a0d25]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-semibold text-gray-300">AI Performance Report</h4>
                <span className="text-xs text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full">Live</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Accuracy", value: "84%", trend: "+12%" },
                  { label: "Speed", value: "1.4s", trend: "-0.3s" },
                  { label: "Rank", value: "#247", trend: "↑128" },
                ].map((m) => (
                  <div key={m.label} className="bg-white/5 rounded-2xl p-4 text-center">
                    <div className="text-xl font-black text-white">{m.value}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{m.label}</div>
                    <div className="text-[10px] text-emerald-400 mt-1">{m.trend}</div>
                  </div>
                ))}
              </div>

              <div className="mb-5">
                <p className="text-xs text-gray-600 mb-3">Topic-wise strength</p>
                {[
                  { topic: "Maths", pct: 78, color: "from-cyan-500 to-blue-500" },
                  { topic: "Physics", pct: 91, color: "from-blue-500 to-purple-500" },
                  { topic: "Chemistry", pct: 63, color: "from-purple-500 to-pink-500" },
                  { topic: "Biology", pct: 55, color: "from-pink-500 to-rose-500" },
                ].map(({ topic, pct, color }) => (
                  <div key={topic} className="flex items-center gap-3 mb-2.5">
                    <span className="text-xs text-gray-500 w-20">{topic}</span>
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 w-8">{pct}%</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <p className="text-xs text-purple-300">
                  🤖 <strong>AI Insight:</strong> Focus on Organic Chemistry this week — improving by just 15% will boost your overall score by ~4 marks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const plans: PricingCardProps[] = [
    {
      plan: "Free", price: "₹0", period: "forever", desc: "Perfect for getting started",
      features: ["10 tests/month", "Basic analytics", "5 exam categories", "Community support"],
      cta: "Start Free",
    },
    {
      plan: "Pro", price: "₹299", period: "/month", desc: "For serious aspirants",
      features: ["Unlimited tests", "Full AI analytics", "All 200+ categories", "Live leaderboard", "Priority support", "Offline downloads"],
      cta: "Get Pro", highlighted: true, badge: "Most Popular",
    },
    {
      plan: "Elite", price: "₹699", period: "/month", desc: "For top rankers",
      features: ["Everything in Pro", "1-on-1 mentor sessions", "Previous year papers", "Doubt clearing chat", "Score guarantee*", "Early feature access"],
      cta: "Go Elite",
    },
  ];

  return (
    <section className="py-28 px-6 relative" id="pricing">
      <div className="max-w-5xl mx-auto relative">
        <SectionLabel text="Pricing" />
        <h2 className="section-title">Simple, <span className="gradient-text">Transparent Pricing</span></h2>
        <p className="section-sub">No hidden fees. No contracts. Upgrade or cancel anytime.</p>
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {plans.map((p) => (<PricingCard key={p.plan} {...p} />))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ plan, price, period, desc, features, cta, highlighted, badge }: PricingCardProps) {
  return (
    <div className={`relative p-7 rounded-3xl border transition-all duration-300 flex flex-col ${highlighted ? "bg-gradient-to-b from-purple-900/40 to-blue-900/30 border-purple-500/50 shadow-[0_0_50px_rgba(139,92,246,0.3)] scale-105" : "bg-white/[0.03] border-white/[0.08] hover:border-white/20"}`}>
      {badge && <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600">{badge}</span>}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">{plan}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-white">{price}</span>
          <span className="text-gray-500 text-sm">{period}</span>
        </div>
        <p className="text-gray-500 text-sm mt-2">{desc}</p>
      </div>
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-gray-400">
            <CheckCircle size={15} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Link href="/register" className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${highlighted ? "bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg" : "border border-white/15 hover:bg-white/5"}`}>{cta}</Link>
    </div>
  );
}

function TestimonialsSection() {
  const testimonials: TestimonialProps[] = [
    { name: "Arjun Mehta", role: "AIR 47, JEE Advanced 2024", exam: "JEE Advanced", text: "Quizaro's adaptive tests are insane. It identified my weak chapters in Week 1 and improved my score by 40 marks.", avatar: "AM", rating: 5 },
    { name: "Priya Soni", role: "Selected in SBI PO 2024", exam: "Banking PO", text: "I cracked SBI PO in my first attempt, largely because of the timed sectional tests here. The analytics dashboard is gold.", avatar: "PS", rating: 5 },
  ];
  return (
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionLabel text="Success Stories" />
        <h2 className="section-title">Real Results from <span className="gradient-text">Real Students</span></h2>
        <div className="grid md:grid-cols-2 gap-6 mt-16">
          {testimonials.map((t) => (<TestimonialCard key={t.name} {...t} />))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ name, role, text, avatar, rating, exam }: TestimonialProps) {
  return (
    <div className="p-7 rounded-3xl bg-white/[0.03] border border-white/[0.07] relative overflow-hidden">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-sm">{avatar}</div>
          <div>
            <div className="font-bold text-white text-sm">{name}</div>
            <div className="text-gray-500 text-xs">{role}</div>
          </div>
        </div>
        {exam && <span className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2.5 py-1 rounded-full">{exam}</span>}
      </div>
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (<Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />))}
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">"{text}"</p>
    </div>
  );
}

function FaqSection() {
  const faqs = [
    { question: "Is Quizaro really free to start?", answer: "Yes! The Free plan gives you 10 tests per month across 5 exam categories with no credit card required." },
    { question: "How does the AI adaptive engine work?", answer: "After each test, our ML model maps your response patterns to a skill graph. It then selects questions from topics where your accuracy is below threshold." },
  ];
  return (
    <section className="py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <SectionLabel text="FAQ" />
        <h2 className="section-title">Frequently Asked <span className="gradient-text">Questions</span></h2>
        <div className="mt-12 space-y-3">
          {faqs.map((f) => (<FaqItem key={f.question} {...f} />))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, answer }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl overflow-hidden ${open ? "border-purple-500/40 bg-white/[0.04]" : "border-white/[0.07] bg-white/[0.02]"}`}>
      <button className="w-full flex items-center justify-between px-6 py-5" onClick={() => setOpen(!open)}>
        <span className="font-semibold text-sm text-white">{question}</span>
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180 text-purple-400" : ""}`} />
      </button>
      {open && <div className="px-6 pb-5 text-sm text-gray-400">{answer}</div>}
    </div>
  );
}

function CtaSection() {
  return (
    <section className="py-28 px-6 text-center bg-gradient-to-r from-cyan-950/20 via-purple-950/20 to-blue-950/20">
      <h2 className="text-4xl md:text-6xl font-black mb-6">Your Exam Success <br/><span className="gradient-text">Starts Today</span></h2>
      <p className="text-gray-400 text-lg mb-10">Free forever. No credit card. Start your first test in 60 seconds.</p>
      <Link href="/register" className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl font-bold shadow-2xl hover:scale-105 transition-all">Create Free Account</Link>
    </section>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex justify-center mb-5">
      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase text-purple-400 px-4 py-2 rounded-full bg-purple-400/10 border border-purple-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />{text}
      </span>
    </div>
  );
}

function GlobalStyles() {
  return (
    <style jsx global>{`
      .section-title { font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; text-align: center; line-height: 1.1; margin-bottom: 20px; }
      .section-sub { text-align: center; color: #6b7280; max-width: 600px; margin: 0 auto; }
      .gradient-text { background: linear-gradient(135deg, #22d3ee, #3b82f6, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      .animate-marquee { animation: marquee 20s linear infinite; }
      @keyframes shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
      .animate-shimmer { animation: shimmer 5s linear infinite; }
    `}</style>
  );
}
