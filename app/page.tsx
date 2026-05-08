"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight, CheckCircle, Play, Shield, Users, Activity, 
  Sparkles, BookOpen, Target, Globe, Star, Trophy, Clock, 
  Zap, Flame, Award, HelpCircle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-600">
      <Navbar />
      <main>
        <HeroSection />
        <TrustedBySection />
        <StatsSection />
        <FeaturesSection />
        <ExamCategoriesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

/* ── HERO ─────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(50%_50%_at_50%_0%,_rgba(37,99,235,0.05)_0%,_transparent_100%)] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black uppercase tracking-widest text-blue-600 mb-10">
          <Sparkles size={12} /> Simplify by Umar — Let&apos;s Learn Simply
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[0.9] mb-8">
          Crack Any Exam<br />
          <span className="text-blue-600">With Confidence</span>
        </h1>

        <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
          India&apos;s smartest quiz platform. Adaptive tests, real-time analytics, live 
          leaderboards — everything you need to outperform 50,000+ aspirants.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/register" className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95">
            <Users size={18} /> I am a Student
          </Link>
          <Link href="/admin-login" className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-gray-100 text-gray-600 rounded-2xl font-bold text-sm uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95">
            <Shield size={18} /> I am an Admin
          </Link>
        </div>

        {/* Social Proof */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center -space-x-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-sm">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shadow-sm">
              +50K
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-full shadow-sm text-sm font-bold text-gray-700">
            <div className="flex items-center gap-0.5 text-amber-400">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <span>4.9 / 5 — Trusted by 50,000+ students</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── TRUSTED BY (MARQUEE) ─────────────────────────── */
function TrustedBySection() {
  const partners = [
    "JKBOSE", "JKBOPEE", "IIT Delhi", "NIT Srinagar", "SKAUST Kashmir", 
    "Kashmir University", "Cluster University", "Central University", "IGNOU"
  ];
  return (
    <section className="py-12 border-y border-gray-50 bg-gray-50/30 overflow-hidden">
      <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-10 italic">
        Institutional Partners & Strategic Affiliations
      </p>
      <div className="flex gap-16 animate-marquee whitespace-nowrap px-10">
        {[...partners, ...partners].map((p, i) => (
          <span key={i} className="text-sm font-black text-gray-300 uppercase tracking-widest hover:text-blue-600 transition-colors cursor-default">
            {p}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ── STATS ────────────────────────────────────────── */
function StatsSection() {
  const stats = [
    { label: "Active Students", value: "50K+", icon: <Users size={20} className="text-blue-600" /> },
    { label: "Questions Attempted", value: "2M+", icon: <BookOpen size={20} className="text-blue-600" /> },
    { label: "Success Rate", value: "98%", icon: <Activity size={20} className="text-blue-600" /> },
    { label: "Exam Categories", value: "200+", icon: <Award size={20} className="text-blue-600" /> },
  ];
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-3xl p-8 text-center hover:shadow-xl hover:shadow-blue-900/5 transition-all">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              {s.icon}
            </div>
            <div className="text-4xl font-black text-gray-900 tracking-tighter mb-2">{s.value}</div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── FEATURES ─────────────────────────────────────── */
function FeaturesSection() {
  const features = [
    {
      title: "AI-Powered Learning",
      desc: "Our AI maps your strengths and weaknesses to generate personalized study paths.",
      icon: <Activity size={24} />,
      tag: "AI"
    },
    {
      title: "Deep Analytics",
      desc: "Track speed, accuracy, topic-wise performance with comprehensive breakdowns.",
      icon: <Activity size={24} />,
      tag: "PREMIUM"
    },
    {
      title: "Live Leaderboards",
      desc: "Compete in real-time with thousands of aspirants on national rankings.",
      icon: <Trophy size={24} />,
      tag: "LIVE"
    },
    {
      title: "Timed Mock Tests",
      desc: "Exam-accurate simulations with millisecond-precision timers.",
      icon: <Clock size={24} />,
      tag: "REAL-TIME"
    },
    {
      title: "Daily Streaks",
      desc: "Build consistent habits through streak tracking and reward systems.",
      icon: <Flame size={24} />,
      tag: "HABITS"
    },
    {
      title: "Expert Content",
      desc: "All questions curated by senior educators and subject matter experts.",
      icon: <Shield size={24} />,
      tag: "VERIFIED"
    }
  ];
  return (
    <section className="py-24 px-6 bg-gray-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="section-label mb-6"><span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" /> Platform Features</span>
          <h2 className="section-title mb-6">Built for <span className="text-blue-600">Serious Learners</span></h2>
          <p className="section-sub">
            Everything you need to study smarter, track progress, and beat the competition.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white border border-gray-100 p-8 rounded-[2.5rem] group hover:shadow-2xl hover:shadow-blue-900/5 transition-all">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">{f.tag}</span>
              <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── EXAM CATEGORIES ──────────────────────────────── */
function ExamCategoriesSection() {
  const exams = [
    { title: "JEE / NEET", count: "8,400+ Questions", subtitle: "Engineering & Medical", icon: "🔬" },
    { title: "UPSC / IAS", count: "3,200+ Questions", subtitle: "Civil Services", icon: "📜" },
    { title: "Banking", count: "5,100+ Questions", subtitle: "SBI, IBPS, RBI", icon: "🏦" },
    { title: "Defence", count: "2,700+ Questions", subtitle: "CDS, NDA, AFCAT", icon: "⚔️" },
    { title: "SSC / Railway", count: "6,300+ Questions", subtitle: "CGL, CHSL, RRB", icon: "📊" },
    { title: "CAT / MBA", count: "1,900+ Questions", subtitle: "IIM Entrance", icon: "🎓" },
  ];
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="section-label mb-6"><span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" /> Exam Categories</span>
          <h2 className="section-title mb-6">Complete <span className="text-blue-600">Exam Coverage</span></h2>
          <p className="section-sub">
            Over 200 high-stakes exams covered with expert-verified questions.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {exams.map((e) => (
            <div key={e.title} className="flex items-center gap-6 p-8 bg-white border border-gray-100 rounded-3xl hover:border-blue-600 transition-all group">
              <div className="text-4xl w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">{e.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-lg font-black text-gray-900 tracking-tight">{e.title}</h4>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-gray-400 mb-2">{e.subtitle}</p>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">{e.count}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/tests" className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-100 rounded-xl font-bold text-sm text-blue-600 hover:border-blue-600 transition-all">
            View All 200+ Exams <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── HOW IT WORKS ─────────────────────────────────── */
function HowItWorksSection() {
  const steps = [
    { title: "Create Account", desc: "Sign up in 30 seconds — no credit card required.", icon: <Users size={24} /> },
    { title: "Pick Your Exam", desc: "Choose from 200+ exam categories and set your target.", icon: <BookOpen size={24} /> },
    { title: "Take Mock Tests", desc: "Practice with adaptive tests that mirror the real exam.", icon: <Target size={24} /> },
    { title: "Analyze & Improve", desc: "Get AI-powered insights and fix your weak spots.", icon: <Activity size={24} /> },
  ];
  return (
    <section className="py-24 px-6 bg-gray-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="section-label mb-6"><span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" /> How it Works</span>
          <h2 className="section-title mb-6">Start in <span className="text-blue-600">4 Simple Steps</span></h2>
          <p className="section-sub">
            From registration to exam readiness in four clear phases.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-12 relative">
          <div className="hidden lg:block absolute top-12 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gray-100 z-0" />
          {steps.map((s, i) => (
            <div key={s.title} className="relative z-10 text-center">
              <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-8 text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-4">0{i+1}</span>
              <h4 className="text-lg font-black text-gray-900 mb-2">{s.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



/* ── TESTIMONIALS ─────────────────────────────────── */
function TestimonialsSection() {
  const testimonials = [
    { name: "Sankalp Swaroop", role: "AIR 47, JEE Advanced", exam: "Engineering", text: "The adaptive tests are incredible. It pinpointed my weak areas in week 1 and my score jumped 40 marks in two months.", avatar: "SS" },
    { name: "Priya Soni", role: "Bank PO — SBI", exam: "Banking", text: "Cracked it in my first attempt. The timed mock tests and section-wise analytics gave me a huge competitive edge.", avatar: "PS" },
  ];
  return (
    <section className="py-24 px-6 bg-gray-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="section-label mb-6"><span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" /> Testimonials</span>
          <h2 className="section-title mb-6">Students <span className="text-blue-600">Love Quizaro</span></h2>
          <p className="section-sub">Real results from real students across India.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm relative">
              <div className="flex items-center gap-1 text-amber-400 mb-6">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-8 italic">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-4 pt-8 border-t border-gray-50">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-sm">{t.avatar}</div>
                <div>
                  <h5 className="font-black text-gray-900 tracking-tight">{t.name}</h5>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t.role}</p>
                </div>
                <div className="ml-auto">
                   <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">{t.exam}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ──────────────────────────────────────────── */
function FaqSection() {
  const faqs = [
    { q: "Is the free plan actually free?", a: "Yes, you can practice unlimited public mock tests and access basic analytics for free." },
    { q: "How does the AI learning work?", a: "Our AI analyzes your response patterns and difficulty thresholds to curate tests that target your specific weak areas." },
    { q: "Can I switch plans anytime?", a: "Yes, you can upgrade, downgrade, or cancel your subscription at any time from your dashboard." }
  ];
  return (
    <section className="py-24 px-6 bg-[#fbfbfe]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-20">
          <span className="section-label mb-6"><span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" /> Common Queries</span>
          <h2 className="section-title mb-6">Frequently Asked <span className="text-blue-600">Questions</span></h2>
        </div>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white border border-gray-50 rounded-[2rem] p-8 group hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 cursor-pointer">
              <div className="flex items-center justify-between gap-6">
                <h4 className="text-sm font-black text-gray-900 tracking-widest uppercase italic">{f.q}</h4>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ArrowRight size={16} className="group-hover:rotate-90 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ──────────────────────────────────────────── */
function CtaSection() {
  return (
    <section className="py-48 px-6 relative overflow-hidden bg-[#fbfbfe]">
      {/* Ultra-Premium Mesh Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,245,220,0.4),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(37,99,235,0.03),transparent)] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h2 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 drop-shadow-[0_2px_10px_rgba(37,99,235,0.1)] mb-12 tracking-tighter leading-none italic">
          Your Success Story<br />Starts Today
        </h2>
        <p className="text-gray-400 text-sm md:text-lg mb-16 max-w-xl mx-auto font-black uppercase tracking-[0.4em] italic opacity-60 leading-relaxed">
          Free plan. No credit card. Start in 30 seconds.
        </p>
        <div className="flex justify-center">
          <Link href="/register" className="px-16 py-6 bg-white text-gray-900 border border-gray-100 rounded-full font-black text-xs uppercase tracking-[0.3em] italic shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95 transition-all flex items-center gap-6 group">
            Create Free Account <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
