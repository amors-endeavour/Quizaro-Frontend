"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, Zap, Star, Users, Brain, BookOpen, Target, Award, 
  BarChart3, Trophy, Clock, Flame, Shield, ArrowRight, TrendingUp, 
  CheckCircle, ChevronDown, Activity, Layers, Rocket, Play
} from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ======================================================
   QUIZARO — WHITE MINIMALIST HOMEPAGE
   Colors: #FFFFFF bg, #111827 text, #2563EB accent
====================================================== */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <TrustedBySection />
      <StatsSection />
      <FeaturesSection />
      <ExamCategoriesSection />
      <HowItWorksSection />
      <AIShowcaseSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
}

/* ── HERO ─────────────────────────────────────────── */
function HeroSection() {
  const router = useRouter();
  return (
    <section className="relative bg-white pt-28 pb-24 px-6 overflow-hidden">
      {/* very subtle blue tint top-right blob */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-10 shadow-sm">
          <Sparkles size={14} className="text-blue-500" />
          Simplify by Umar — Let&apos;s Learn Simply
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-gray-900 leading-tight tracking-tight mb-6">
          Crack Any Exam<br />
          <span className="text-blue-600">With Confidence</span>
        </h1>

        <p className="max-w-2xl text-lg sm:text-xl text-gray-500 font-medium leading-relaxed mb-10">
          India&apos;s smartest quiz platform. Adaptive tests, real-time analytics, live leaderboards — 
          everything you need to outperform 50,000+ aspirants.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm uppercase tracking-wide shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-95"
          >
            <Users size={18} /> I Am A Student
          </button>
          <button
            onClick={() => router.push("/admin-login")}
            className="flex items-center gap-3 px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-bold text-sm uppercase tracking-wide hover:border-blue-300 hover:text-blue-700 transition-all active:scale-95 shadow-sm"
          >
            <Shield size={18} /> I Am An Admin
          </button>
        </div>

        {/* Social proof */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center -space-x-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 888}`} alt="Student" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shadow-sm">+50K</div>
          </div>
          <div className="flex items-center gap-3 bg-white border border-gray-200 px-5 py-2 rounded-full shadow-sm">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-amber-400" fill="currentColor" />)}
            </div>
            <span className="text-sm text-gray-700 font-semibold">4.9 / 5 — Trusted by 50,000+ students</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── TRUSTED BY ───────────────────────────────────── */
function TrustedBySection() {
  const brands = ["SKAUST Kashmir", "Kashmir University", "Cluster University", "JKBOSE", "JKBOPEE", "IIT Delhi", "NIT Srinagar"];
  return (
    <section className="py-12 bg-gray-50 border-y border-gray-200 overflow-hidden">
      <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">
        Institutional Partners &amp; Strategic Affiliations
      </p>
      <div className="flex gap-16 animate-marquee whitespace-nowrap items-center">
        {[...brands, ...brands, ...brands].map((b, i) => (
          <span key={i} className="text-gray-400 font-bold text-sm uppercase tracking-widest hover:text-blue-600 transition-colors cursor-default">
            {b}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ── STATS ────────────────────────────────────────── */
function StatsSection() {
  const stats = [
    { value: "50K+", label: "Active Students", icon: <Users size={24} /> },
    { value: "2M+", label: "Questions Attempted", icon: <BookOpen size={24} /> },
    { value: "98%", label: "Success Rate", icon: <Target size={24} /> },
    { value: "200+", label: "Exam Categories", icon: <Award size={24} /> },
  ];
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <div className="flex justify-center mb-3 text-blue-600">{s.icon}</div>
            <div className="text-3xl font-black text-gray-900 mb-1">{s.value}</div>
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── FEATURES ─────────────────────────────────────── */
function FeaturesSection() {
  const features = [
    { icon: <Brain size={24} />, title: "AI-Powered Learning", desc: "Our AI maps your strengths and weaknesses to generate personalized study paths.", tag: "AI" },
    { icon: <Activity size={24} />, title: "Deep Analytics", desc: "Track speed, accuracy, topic-wise performance with comprehensive breakdowns.", tag: "Premium" },
    { icon: <Trophy size={24} />, title: "Live Leaderboards", desc: "Compete in real-time with thousands of aspirants on national rankings." },
    { icon: <Clock size={24} />, title: "Timed Mock Tests", desc: "Exam-accurate simulations with millisecond-precision timers." },
    { icon: <Flame size={24} />, title: "Daily Streaks", desc: "Build consistent habits through streak tracking and reward systems." },
    { icon: <Shield size={24} />, title: "Expert Content", desc: "All questions curated by senior educators and subject matter experts.", tag: "Verified" },
  ];

  return (
    <section className="py-24 px-6 bg-gray-50" id="features">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-label mb-4 inline-flex"><span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" /> Platform Features</span>
          <h2 className="section-title mt-4">Built for <span className="text-blue-600">Serious Learners</span></h2>
          <p className="section-sub mt-4 max-w-xl mx-auto">Everything you need to study smarter, track progress, and beat the competition.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all">
                {f.icon}
              </div>
              {f.tag && (
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-widest mr-2">{f.tag}</span>
              )}
              <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2">{f.title}</h3>
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
    { emoji: "🔬", title: "JEE / NEET", subtitle: "Engineering & Medical", count: "8,400+ Questions", color: "border-blue-100 hover:border-blue-400" },
    { emoji: "📜", title: "UPSC / IAS", subtitle: "Civil Services", count: "3,200+ Questions", color: "border-amber-100 hover:border-amber-400" },
    { emoji: "🏦", title: "Banking", subtitle: "SBI, IBPS, RBI", count: "5,100+ Questions", color: "border-emerald-100 hover:border-emerald-400" },
    { emoji: "⚔️", title: "Defence", subtitle: "CDS, NDA, AFCAT", count: "2,700+ Questions", color: "border-red-100 hover:border-red-400" },
    { emoji: "📊", title: "SSC / Railway", subtitle: "CGL, CHSL, RRB", count: "6,300+ Questions", color: "border-violet-100 hover:border-violet-400" },
    { emoji: "🎓", title: "CAT / MBA", subtitle: "IIM Entrance", count: "1,900+ Questions", color: "border-pink-100 hover:border-pink-400" },
  ];
  return (
    <section className="py-24 px-6 bg-white" id="exams">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-label mb-4 inline-flex"><span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" /> Exam Categories</span>
          <h2 className="section-title mt-4">Complete <span className="text-blue-600">Exam Coverage</span></h2>
          <p className="section-sub mt-4 max-w-xl mx-auto">Over 200 high-stakes exams covered with expert-verified questions.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {exams.map((e) => (
            <Link
              key={e.title}
              href="/tests"
              className={`group bg-white border-2 ${e.color} rounded-2xl p-7 flex items-start gap-5 transition-all hover:shadow-md`}
            >
              <div className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                {e.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-base mb-0.5">{e.title}</h3>
                <p className="text-gray-500 text-sm mb-2">{e.subtitle}</p>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{e.count}</span>
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all mt-1 flex-shrink-0" />
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/tests" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-200 text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
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
    { number: "01", title: "Create Account", desc: "Sign up in 30 seconds — no credit card required.", icon: <Users size={20} /> },
    { number: "02", title: "Pick Your Exam", desc: "Choose from 200+ exam categories and set your target.", icon: <Layers size={20} /> },
    { number: "03", title: "Take Mock Tests", desc: "Practice with adaptive tests that mirror the real exam.", icon: <Zap size={20} /> },
    { number: "04", title: "Analyze & Improve", desc: "Get AI-powered insights and fix your weak spots.", icon: <Activity size={20} /> },
  ];
  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-label mb-4 inline-flex"><span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" /> How It Works</span>
          <h2 className="section-title mt-4">Start in <span className="text-blue-600">4 Simple Steps</span></h2>
          <p className="section-sub mt-4 max-w-xl mx-auto">From registration to exam readiness in four clear phases.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.number} className="relative text-center group">
              {/* connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gray-200 z-0" style={{ width: '100%', left: '50%' }} />
              )}
              <div className="relative z-10 w-16 h-16 mx-auto mb-5 rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center text-blue-600 group-hover:border-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                {s.icon}
              </div>
              <div className="text-xs font-black text-gray-300 uppercase tracking-widest mb-2">{s.number}</div>
              <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── AI SHOWCASE ──────────────────────────────────── */
function AIShowcaseSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <span className="section-label mb-6 inline-flex"><span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" /> AI Engine</span>
            <h2 className="section-title mt-4 mb-6">
              Intelligent Learning,<br />
              <span className="text-blue-600">Personalized for You</span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Quizaro&apos;s AI continuously maps your performance patterns and adapts question difficulty,
              topic focus, and revision schedules in real-time — so every minute you study counts.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                "Targeted weak-area identification",
                "Dynamic difficulty adjustment (real-time)",
                "Predictive score forecasting (ML)",
                "Smart study time allocation",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-700 text-sm font-medium">
                  <CheckCircle size={18} className="text-blue-600 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-7 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              Try AI Analytics Free <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right — mock analytics card */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg shadow-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1">Performance Dashboard</p>
                <h4 className="text-lg font-black text-gray-900">AI Analytics</h4>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-xs font-bold text-green-700">
                <Activity size={12} /> Live Sync
              </div>
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Accuracy", value: "84%", trend: "+12%", color: "text-green-600" },
                { label: "Avg Speed", value: "1.4s", trend: "−0.3s", color: "text-blue-600" },
                { label: "Rank", value: "#247", trend: "↑128", color: "text-amber-600" },
              ].map((m) => (
                <div key={m.label} className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                  <div className="text-xl font-black text-gray-900">{m.value}</div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mt-0.5">{m.label}</div>
                  <div className={`text-xs font-bold mt-1 ${m.color}`}>{m.trend}</div>
                </div>
              ))}
            </div>

            {/* Progress bars */}
            <div className="space-y-5 mb-8">
              {[
                { topic: "Mathematics", pct: 78, color: "bg-blue-600" },
                { topic: "Physics", pct: 91, color: "bg-indigo-500" },
                { topic: "Chemistry", pct: 63, color: "bg-amber-500" },
              ].map(({ topic, pct, color }) => (
                <div key={topic}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-700">{topic}</span>
                    <span className="text-xs font-bold text-gray-900">{pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* AI tip */}
            <div className="flex items-start gap-3 px-5 py-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <span className="text-lg">🤖</span>
              <p className="text-sm text-blue-800 font-medium leading-relaxed">
                <strong>AI Insight:</strong> Focus on organic chemistry this week — a 15% improvement will boost your overall score by ~4 marks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── TESTIMONIALS ─────────────────────────────────── */
function TestimonialsSection() {
  const testimonials = [
    { name: "Sankalp Swaroop", role: "AIR 47, JEE Advanced", exam: "Engineering", text: "The adaptive tests are incredible. It pinpointed my weak areas in week 1 and my score jumped 40 marks in two months.", avatar: "SS", rating: 5 },
    { name: "Priya Soni", role: "Bank PO — SBI", exam: "Banking", text: "Cracked it in my first attempt. The timed mock tests and section-wise analytics gave me a huge competitive edge.", avatar: "PS", rating: 5 },
  ];
  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-label mb-4 inline-flex"><span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" /> Testimonials</span>
          <h2 className="section-title mt-4">Students <span className="text-blue-600">Love Quizaro</span></h2>
          <p className="section-sub mt-4 max-w-lg mx-auto">Real results from real students across India.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-amber-400" fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-700 text-base leading-relaxed mb-6">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.role}</div>
                </div>
                <span className="ml-auto text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">{t.exam}</span>
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
    { question: "Is the free plan actually free?", answer: "Yes — the Foundation plan gives you 10 mock tests per month across 5 exam categories with zero cost, forever." },
    { question: "How does the AI learning work?", answer: "After each test, our AI analyzes your response patterns and adjusts the next questions to focus on weak topics, helping you improve faster." },
    { question: "Can I switch plans anytime?", answer: "Absolutely. You can upgrade, downgrade, or cancel your plan at any time from your dashboard — no lock-in." },
  ];
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-label mb-4 inline-flex"><span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" /> FAQ</span>
          <h2 className="section-title mt-4">Common <span className="text-blue-600">Questions</span></h2>
        </div>
        <div className="space-y-4">
          {faqs.map((f) => <FaqItem key={f.question} {...f} />)}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${open ? "border-blue-300 shadow-md" : "border-gray-200"}`}>
      <button
        className="w-full flex items-center justify-between px-7 py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className={`font-semibold text-base transition-colors ${open ? "text-blue-700" : "text-gray-900"}`}>{question}</span>
        <div className={`w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center flex-shrink-0 transition-all ${open ? "rotate-180 bg-blue-600 border-blue-600 text-white" : "text-gray-400"}`}>
          <ChevronDown size={18} />
        </div>
      </button>
      {open && (
        <div className="px-7 pb-6 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
}

/* ── CTA ──────────────────────────────────────────── */
function CtaSection() {
  return (
    <section className="py-24 px-6 bg-blue-600">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-black text-white mb-5 tracking-tight">
          Your Success Story<br />Starts Today
        </h2>
        <p className="text-blue-100 text-lg mb-10 font-medium">Free plan. No credit card. Start in 30 seconds.</p>
        <Link
          href="/register"
          className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-700 rounded-2xl font-black text-sm uppercase tracking-wide shadow-xl hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
        >
          Create Free Account <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
