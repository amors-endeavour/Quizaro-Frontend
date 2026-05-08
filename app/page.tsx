"use client";

import React from "react";
import Link from "next/link";
import {
  Zap, Trophy, Flame, Star, Target, BarChart3, ArrowRight, Play,
  Sparkles, Users, BookOpen, Award
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ======================================================
   QUIZARO — QUIZFORGE DESIGN SYSTEM
   Playful, competitive, gamified with yellow/purple/cyan
   ====================================================== */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surfaceBase">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <ExamCategoriesSection />
        <HowItWorksSection />
        <LeaderboardPreview />
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
      {/* Decorative glowing orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border-2 border-primary text-xs font-bold uppercase tracking-widest mb-10">
          <Sparkles size={14} className="text-primary" />
          Gamified Learning Platform
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-righteous), cursive' }}>
          Learn. Compete.<br />
          <span className="text-primary">Level Up.</span>
        </h1>

        <p className="text-lg text-ink/70 max-w-2xl mx-auto mb-12 leading-relaxed font-body">
          Turn exam prep into an adventure. Earn XP, build streaks, climb leaderboards.
          The more you practice, the faster you rise.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="flex items-center gap-3 px-8 py-4 bg-primary text-ink rounded-xl font-bold text-sm uppercase tracking-wide shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
          >
            <Play size={18} /> Start Quiz Adventure
          </Link>
          <Link
            href="/tests"
            className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-secondary text-secondary rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-secondary hover:text-white transition-all"
          >
            Browse Tests
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex flex-col items-center gap-6 mt-16">
          <div className="flex items-center -space-x-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-3 border-white bg-surfaceCard overflow-hidden shadow-md">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 999}`} alt="Student" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-3 border-white bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[10px] font-black text-ink shadow-md">
              +50K
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white border border-gray-200 px-5 py-2.5 rounded-full shadow-md">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="text-amber-400" fill="currentColor" />)}
            </div>
            <span className="text-sm text-ink/80 font-semibold">4.9 / 5 — 50,000+ active learners</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── STATS BAR ────────────────────────────────────── */
function StatsSection() {
  return (
    <section className="py-8 bg-white border-y border-gray-200 relative -mt-8 z-20 mx-6 rounded-2xl shadow-xl max-w-4xl mx-auto mb-16">
      <div className="grid grid-cols-3 gap-4 px-6">
        <div className="text-center py-4">
          <div className="text-2xl md:text-3xl font-black text-primary mb-1" style={{ fontFamily: 'var(--font-mono), monospace' }}>
            2.5M+
          </div>
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Questions Answered</div>
        </div>
        <div className="text-center py-4 border-l border-gray-200">
          <div className="text-2xl md:text-3xl font-black text-secondary mb-1 flex items-center justify-center gap-2">
            <Flame size={24} className="text-warning animate-flame" />
            <span style={{ fontFamily: 'var(--font-mono), monospace' }}>42</span>
          </div>
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Current Streak</div>
        </div>
        <div className="text-center py-4 border-l border-gray-200">
          <div className="text-2xl md:text-3xl font-black text-success mb-1" style={{ fontFamily: 'var(--font-mono), monospace' }}>
            98%
          </div>
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Accuracy</div>
        </div>
      </div>
    </section>
  );
}

/* ── FEATURES ─────────────────────────────────────── */
function FeaturesSection() {
  const features = [
    {
      icon: <Trophy size={28} />,
      title: "Compete & Climb",
      desc: "Live leaderboards, rank tiers, and national percentiles. Every correct answer moves you up.",
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      icon: <Flame size={28} />,
      title: "Build Streaks",
      desc: "Daily practice fires up your streak meter. Miss a day and watch it reset. Can you hit 100?",
      color: "text-error",
      bg: "bg-error/10",
    },
    {
      icon: <BarChart3 size={28} />,
      title: "Smart Analytics",
      desc: "Topic-wise performance, speed graphs, and weak-spot detection powered by AI.",
      color: "text-tertiary",
      bg: "bg-tertiary/10",
    },
  ];

  return (
    <section className="py-24 px-6 bg-surfaceCard">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="section-label mb-4 inline-flex justify-center">
            <Sparkles size={14} /> Features
          </div>
          <h2 className="section-title mt-4">Game-Changing Tools</h2>
          <p className="section-sub mt-4 max-w-xl mx-auto">
            Every feature built to make studying feel like playing — and winning.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="card group hover:scale-105"
            >
              <div className={`w-14 h-14 rounded-xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <span className={f.color}>{f.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-ink" style={{ fontFamily: 'var(--font-righteous), cursive' }}>{f.title}</h3>
              <p className="text-ink/70 leading-relaxed">{f.desc}</p>
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
    { emoji: "🔬", title: "JEE / NEET", subtitle: "Engineering & Medical", color: "from-primary to-yellow-500" },
    { emoji: "📜", title: "UPSC / IAS", subtitle: "Civil Services", color: "from-secondary to-purple-600" },
    { emoji: "🏦", title: "Banking", subtitle: "SBI, IBPS, RBI", color: "from-tertiary to-cyan-500" },
    { emoji: "⚔️", title: "Defence", subtitle: "CDS, NDA, AFCAT", color: "from-error to-red-500" },
  ];
  return (
    <section className="py-24 px-6 bg-surfaceBase">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="section-label mb-4 inline-flex justify-center">
            <BookOpen size={14} /> Categories
          </div>
          <h2 className="section-title mt-4">Pick Your <span className="text-primary">Battle</span></h2>
          <p className="section-sub mt-4 max-w-xl mx-auto">
            200+ exam categories. Expert-curated questions. Adaptive difficulty.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {exams.map((e) => (
            <Link
              key={e.title}
              href="/tests"
              className="group card p-6 text-center hover:shadow-correct transition-all hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{e.emoji}</div>
              <h3 className="text-lg font-bold mb-1 text-ink">{e.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{e.subtitle}</p>
              <div className={`h-1 rounded-full bg-gradient-to-r ${e.color}`} />
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/tests" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-ink rounded-full font-bold text-sm uppercase tracking-wider hover:bg-primary-hover transition-all shadow-md">
            Explore All Exams <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── HOW IT WORKS ─────────────────────────────────── */
function HowItWorksSection() {
  const steps = [
    { number: "01", title: "Create Account", desc: "Sign up free in 30 seconds" },
    { number: "02", title: "Pick Your Exam", desc: "Choose from 200+ categories" },
    { number: "03", title: "Take Quizzes", desc: "Adaptive tests that learn with you" },
    { number: "04", title: "Level Up", desc: "Earn XP, build streaks, dominate leaderboard" },
  ];
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="section-label mb-4 inline-flex justify-center">
            <Target size={14} /> How It Works
          </div>
          <h2 className="section-title mt-4">Start in <span className="text-success">4 Simple Steps</span></h2>
          <p className="section-sub mt-4 max-w-xl mx-auto">
            From zero to hero in four phases. No fluff, just progression.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={s.number} className="relative text-center group">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent z-0" style={{ left: '70%', width: '60%' }} />
              )}
              <div className="relative z-10 w-16 h-16 mx-auto mb-5 rounded-full bg-primary text-ink font-bold text-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                {i + 1}
              </div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{s.number}</div>
              <h3 className="font-bold text-lg mb-1 text-ink">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── LEADERBOARD PREVIEW ──────────────────────────── */
function LeaderboardPreview() {
  const leaders = [
    { name: "Sankalp S.", score: "48.2K", avatar: "SS", change: "+2" },
    { name: "Priya Soni", score: "45.7K", avatar: "PS", change: "+5" },
    { name: "Rajesh K.", score: "42.1K", avatar: "RK", change: "+1" },
  ];
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-surfaceCard to-surfaceBase">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="section-label mb-4 inline-flex justify-center">
            <Users size={14} /> Community
          </div>
          <h2 className="section-title mt-4">Top <span className="text-secondary">Performers</span></h2>
          <p className="section-sub mt-4 max-w-xl mx-auto">
            This week&apos;s highest-ranked quiz warriors. Will you dethrone them?
          </p>
        </div>

        <div className="space-y-4">
          {leaders.map((l, idx) => (
            <div
              key={l.name}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${idx === 0 ? "bg-gradient-to-r from-primary/10 to-transparent border-primary/30 shadow-correct" : "bg-white border-gray-200 hover:border-secondary"}`}
            >
              <div className="text-2xl font-black text-gray-300 w-8">#{idx + 1}</div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold text-sm shadow-md">
                {l.avatar}
              </div>
              <div className="flex-1">
                <div className="font-bold text-ink">{l.name}</div>
                <div className="text-sm text-gray-500">Score: <span className="font-mono font-bold text-secondary">{l.score}</span></div>
              </div>
              <div className="px-3 py-1 rounded-full bg-success/10 text-success font-bold text-xs">
                ▲ {l.change}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/leaderboard" className="inline-flex items-center gap-2 text-secondary font-bold hover:underline">
            View Full Leaderboard <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── CTA ──────────────────────────────────────────── */
function CtaSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Celebration background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-tertiary opacity-90" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Ready to start your quest?
        </h2>
        <p className="text-white/90 text-lg mb-10 max-w-xl mx-auto font-body">
          Join 50,000+ learners. Free forever. No credit card required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="flex items-center gap-3 px-10 py-4 bg-white text-ink rounded-xl font-bold text-sm uppercase tracking-wide shadow-xl hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
          >
            <Play size={18} /> Start Learning Free
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-3 px-10 py-4 bg-transparent border-2 border-white/40 text-white rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-white/10 transition-all"
          >
            Sign In
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-8 mt-12 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-primary" />
            <span>50K+ Active</span>
          </div>
          <div className="flex items-center gap-2">
            <Star size={18} className="text-primary" />
            <span>4.9 Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={18} className="text-primary" />
            <span>Certificates</span>
          </div>
        </div>
      </div>
    </section>
  );
}



