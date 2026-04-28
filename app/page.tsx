"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, Zap, Play, Star, Users, Brain, BookOpen, Target, Award, 
  BarChart3, Trophy, Clock, Flame, Shield, ArrowRight, TrendingUp, 
  CheckCircle, ChevronDown, Activity, Layers, Rocket
} from "lucide-react";
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

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] text-gray-900 dark:text-gray-100 font-sans overflow-x-hidden transition-colors duration-500">
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

/* HERO SECTION */
function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-40 overflow-hidden bg-[#f8f9fc] dark:bg-[#050816] transition-colors duration-500">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[1000px] h-[1000px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full -top-96 -left-96 blur-[150px] animate-pulse" />
        <div className="absolute w-[800px] h-[800px] bg-purple-600/5 dark:bg-purple-600/10 rounded-full -bottom-48 -right-48 blur-[150px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-7xl mx-auto flex flex-col items-center">
        {/* Institutional Status Badge */}
        <div className="inline-flex items-center gap-4 px-8 py-3 rounded-full bg-white dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 text-[11px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-500 mb-16 shadow-2xl shadow-blue-900/5 animate-in fade-in slide-in-from-bottom-8 duration-1000 italic">
          <Sparkles size={16} className="text-blue-500" />
          Neural Adaptive Intelligence • Simplified with Umar
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        </div>

        {/* Master Visionary Heading */}
        <h1 className="text-6xl sm:text-8xl md:text-[9rem] font-black leading-[0.95] mb-12 tracking-tighter text-gray-900 dark:text-white animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-100 italic selection:bg-blue-600 selection:text-white">
          Crack Any Exam <br />
          <span className="text-blue-600 dark:text-blue-500 drop-shadow-[0_0_30px_rgba(37,99,235,0.2)]">With Confidence</span>
        </h1>

        <p className="max-w-4xl text-xl sm:text-2xl text-gray-400 dark:text-gray-700 font-black leading-relaxed mb-20 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-200 tracking-tight italic">
          India&apos;s smartest quiz platform. Adaptive test, real time analytics, live leaderboards - everything you need to outperform 50,000+ aspirants.
        </p>

        {/* Strategic Action Command Hub */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 mb-32 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-300">
          <button 
            onClick={() => router.push("/login")}
            className="group relative flex items-center gap-6 px-16 py-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-gray-900/40 hover:scale-105 transition-all active:scale-95 italic"
          >
            <div className="bg-white/10 dark:bg-gray-100 p-3 rounded-2xl group-hover:rotate-12 transition-transform shadow-inner"><Users size={24} /></div>
            I AM A STUDENT
          </button>

          <button 
            onClick={() => router.push("/admin-login")}
            className="group flex items-center gap-6 px-16 py-8 bg-white dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gray-900/5 italic"
          >
            <div className="bg-gray-50 dark:bg-[#050816] p-3 rounded-2xl text-gray-300 dark:text-gray-800 group-hover:text-blue-600 transition-colors shadow-inner"><Shield size={24} /></div>
            I AM AN ADMIN
          </button>
        </div>

        {/* Global Merit Validation */}
        <div className="flex flex-col items-center gap-10 animate-in fade-in slide-in-from-bottom-24 duration-1000 delay-500">
          <div className="flex items-center -space-x-6">
             {[1,2,3,4,5].map(i => (
               <div key={i} className="w-18 h-18 rounded-full border-4 border-white dark:border-[#050816] bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-2xl relative group/avatar">
                 <div className="absolute inset-0 bg-blue-600/0 group-hover/avatar:bg-blue-600/20 transition-all duration-500" />
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 888}`} alt="Verified Aspirant" className="w-full h-full object-cover" />
               </div>
             ))}
             <div className="w-18 h-18 rounded-full border-4 border-white dark:border-[#050816] bg-blue-600 flex items-center justify-center text-[12px] font-black text-white shadow-2xl relative z-10 italic">+50K</div>
          </div>
          <div className="flex flex-col items-center gap-4">
             <span className="text-[12px] text-gray-300 dark:text-gray-800 font-black uppercase tracking-[0.5em] italic">Validated by 50,000+ Institutional Top Achievers</span>
             <div className="flex items-center gap-6 bg-white dark:bg-[#0a0f29] px-8 py-3 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-2">
                   {[1,2,3,4,5].map(i => <Star key={i} size={18} className="text-amber-500" fill="currentColor" />)}
                </div>
                <div className="w-px h-6 bg-gray-100 dark:bg-gray-800" />
                <span className="text-sm text-gray-900 dark:text-white font-black italic tracking-tighter tabular-nums">4.9/5 PLATFORM GRADE</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustedBySection() {
  const brands = ["SKAUST Kashmir", "Kashmir University", "Cluster University", "JKBOSE", "JKBOPEE", "IIT Delhi", "NIT Srinagar"];
  return (
    <section className="py-20 bg-white dark:bg-[#0a0f29] border-y-2 border-gray-50 dark:border-gray-800 overflow-hidden transition-all duration-500">
      <p className="text-center text-[11px] text-gray-300 dark:text-gray-800 font-black uppercase tracking-[0.8em] mb-12 italic">
        Institutional Partners & Strategic Affiliations
      </p>
      <div className="flex gap-24 animate-marquee whitespace-nowrap items-center py-4">
        {[...brands, ...brands, ...brands].map((b, i) => (
          <span key={i} className="text-gray-200 dark:text-gray-900 font-black text-2xl hover:text-blue-600 dark:hover:text-blue-500 transition-all cursor-default uppercase tracking-[0.3em] italic grayscale hover:grayscale-0 active:scale-110">
            {b}
          </span>
        ))}
      </div>
    </section>
  );
}

function StatsSection() {
  const stats: StatProps[] = [
    { value: "50K+", label: "Synchronized Nodes", icon: <Users size={32} /> },
    { value: "2M+", label: "Clinical Inquiries", icon: <BookOpen size={32} /> },
    { value: "98%", label: "Proficiency Success", icon: <Target size={32} /> },
    { value: "200+", label: "Neural Domains", icon: <Award size={32} /> },
  ];
  return (
    <section className="py-40 px-6 bg-white dark:bg-[#050816] transition-all duration-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {stats.map((s) => (
          <div
            key={s.label}
            className="relative p-12 rounded-[4rem] bg-gray-50/50 dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 text-center group hover:border-blue-600 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-[#050816] hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 active:scale-95"
          >
            <div className="flex justify-center mb-10 text-gray-200 dark:text-gray-800 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
              {s.icon}
            </div>
            <div className="text-6xl font-black text-gray-900 dark:text-white mb-4 italic tracking-tighter tabular-nums">
              {s.value}
            </div>
            <div className="text-gray-400 dark:text-gray-700 text-[11px] font-black uppercase tracking-[0.4em] italic">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features: FeatureCardProps[] = [
    {
      icon: <Brain size={32} />,
      title: "Cognitive Neural Core",
      desc: "Our neural architecture maps your intellectual trajectory and synthesizes personalized mastery pathways.",
      tag: "AI NATIVE",
    },
    {
      icon: <Activity size={32} />,
      title: "Institutional Telemetry",
      desc: "Comprehensive breakdown covering speed vectors, accuracy trends, and cross-domain proficiency matrices.",
      tag: "PREMIUM",
    },
    {
      icon: <Trophy size={32} />,
      title: "Global Benchmarking",
      desc: "Synchronous competition with the top 1% across national and institutional leaderboard clusters.",
    },
    {
      icon: <Clock size={32} />,
      title: "Precision Simulation",
      desc: "High-fidelity mock environments replicating national test patterns with millisecond clock precision.",
    },
    {
      icon: <Flame size={32} />,
      title: "Behavioral Protocols",
      desc: "Engineering persistence through daily streak modules and incremental performance reward nodes.",
    },
    {
      icon: <Shield size={32} />,
      title: "Verified Repositories",
      desc: "Curated intelligence pool from senior subject matter experts and institutional research labs.",
      tag: "VALIDATED",
    },
  ];

  return (
    <section className="py-40 px-6 bg-[#f8f9fc] dark:bg-[#0a0f29] transition-all duration-500" id="features">
      <div className="max-w-7xl mx-auto">
        <SectionLabel text="System Architecture" />
        <h2 className="section-title italic dark:text-white mb-10">
          Architected for <br className="hidden md:block" />
          <span className="text-blue-600 dark:text-blue-500">Institutional Mastery</span>
        </h2>
        <p className="section-sub font-black text-gray-300 dark:text-gray-800 mt-8 uppercase text-[12px] tracking-[0.5em] italic">
          The ultimate analytical framework for peak intellectual performance.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mt-32">
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
    <div className="group relative p-12 rounded-[4.5rem] bg-white dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 hover:border-blue-600 dark:hover:border-blue-500 hover:shadow-2xl transition-all duration-700 overflow-hidden active:scale-[0.98]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
      <div className="relative z-10">
        <div className="w-20 h-20 rounded-[2rem] bg-gray-50 dark:bg-gray-900 text-gray-300 dark:text-gray-800 flex items-center justify-center mb-10 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12 transition-all duration-700 shadow-inner group-hover:border-blue-500">
          {icon}
        </div>

        {tag && (
          <span className="absolute top-0 right-0 text-[10px] font-black px-6 py-2.5 rounded-full bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] italic">
            {tag}
          </span>
        )}

        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tighter italic leading-none">{title}</h3>
        <p className="text-gray-400 dark:text-gray-700 text-[14px] font-black leading-relaxed italic uppercase tracking-tight">{desc}</p>
      </div>
    </div>
  );
}

function ExamCategoriesSection() {
  const exams: ExamCardProps[] = [
    { emoji: "🔬", title: "JEE / NEET", subtitle: "Engineering & Medical", count: "8,400+ UNITS", color: "border-blue-100 dark:border-blue-900/30 bg-white dark:bg-[#0a0f29]" },
    { emoji: "📜", title: "UPSC / IAS", subtitle: "Civil Services Matrix", count: "3,200+ UNITS", color: "border-amber-100 dark:border-amber-900/30 bg-white dark:bg-[#0a0f29]" },
    { emoji: "🏦", title: "Banking Sector", subtitle: "SBI, IBPS, RBI Clusters", count: "5,100+ UNITS", color: "border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-[#0a0f29]" },
    { emoji: "⚔️", title: "Defence Forces", subtitle: "CDS, NDA, AFCAT Nodes", count: "2,700+ UNITS", color: "border-red-100 dark:border-red-900/30 bg-white dark:bg-[#0a0f29]" },
    { emoji: "📊", title: "SSC / Railway", subtitle: "CGL, CHSL, RRB NTPC", count: "6,300+ UNITS", color: "border-violet-100 dark:border-violet-900/30 bg-white dark:bg-[#0a0f29]" },
    { emoji: "🎓", title: "CAT / MBA", subtitle: "Elite IIM Entrance", count: "1,900+ UNITS", color: "border-pink-100 dark:border-pink-900/30 bg-white dark:bg-[#0a0f29]" },
  ];

  return (
    <section className="py-40 px-6 bg-white dark:bg-[#050816] relative transition-all duration-500" id="exams">
      <div className="max-w-7xl mx-auto relative">
        <SectionLabel text="Domain Spectrum" />
        <h2 className="section-title italic dark:text-white">
          Exhaustive <span className="text-blue-600 dark:text-blue-500">Curriculum Matrix</span>
        </h2>
        <p className="section-sub font-black text-gray-300 dark:text-gray-800 mt-10 uppercase text-[12px] tracking-[0.6em] italic">
          Strategic coverage for over 200 high-stakes intellectual domains.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-32">
          {exams.map((e) => (
            <ExamCard key={e.title} {...e} />
          ))}
        </div>

        <div className="text-center mt-24">
          <Link
            href="/tests"
            className="group inline-flex items-center gap-6 px-14 py-7 bg-blue-50 dark:bg-blue-900/10 text-[12px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.3em] rounded-[2.5rem] border-2 border-blue-100 dark:border-blue-800/30 shadow-xl shadow-blue-900/5 hover:bg-blue-600 hover:text-white transition-all duration-700 italic active:scale-95"
          >
            Synchronize All 200+ Institutional Nodes
            <Rocket size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-700" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ExamCard({ emoji, title, subtitle, count, color }: ExamCardProps) {
  return (
    <Link
      href="/tests"
      className={`group relative p-12 rounded-[4.5rem] border-2 ${color} hover:shadow-2xl hover:border-blue-600 transition-all duration-700 overflow-hidden active:scale-[0.98] flex flex-col justify-between h-full`}
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-1000" />
      <div>
         <div className="flex items-start justify-between mb-10">
           <div className="w-20 h-20 bg-gray-50 dark:bg-[#050816] rounded-[2rem] flex items-center justify-center text-5xl shadow-inner group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 border border-gray-100 dark:border-gray-800">{emoji}</div>
           <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-200 dark:text-gray-700 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-45 transition-all duration-700 shadow-sm border border-gray-50 dark:border-gray-700">
             <ArrowRight size={20} />
           </div>
         </div>
         <h3 className="font-black text-gray-900 dark:text-white text-2xl mb-3 uppercase tracking-tighter italic leading-none group-hover:text-blue-600 transition-colors">{title}</h3>
         <p className="text-gray-400 dark:text-gray-700 text-[11px] font-black mb-10 uppercase tracking-widest italic">{subtitle}</p>
      </div>
      <span className="text-[10px] font-black text-blue-600 dark:text-blue-500 bg-blue-50/50 dark:bg-blue-900/10 px-6 py-3 rounded-full border border-blue-100 dark:border-blue-800/30 uppercase tracking-[0.2em] italic w-fit tabular-nums">{count}</span>
    </Link>
  );
}

function HowItWorksSection() {
  const steps: StepProps[] = [
    { number: "01", title: "Node Registry", desc: "Initialize your institutional identity in 30 seconds.", icon: <Users size={24} /> },
    { number: "02", title: "Domain Selector", desc: "Configure your target curriculum matrix cluster.", icon: <Layers size={24} /> },
    { number: "03", title: "Vortex Session", desc: "Engage with adaptive assessment algorithms.", icon: <Zap size={24} /> },
    { number: "04", title: "Clinical Audit", desc: "Review performance telemetry and AI insights.", icon: <Activity size={24} /> },
  ];

  return (
    <section className="py-40 px-6 bg-[#f8f9fc] dark:bg-[#0a0f29] transition-all duration-500">
      <div className="max-w-7xl mx-auto">
        <SectionLabel text="Deployment Protocol" />
        <h2 className="section-title italic dark:text-white">
          Streamlined <span className="text-blue-600 dark:text-blue-500">Mastery Pipeline</span>
        </h2>
        <p className="section-sub font-black text-gray-300 dark:text-gray-800 mt-10 uppercase text-[12px] tracking-[0.6em] italic">
          From registration to terminal proficiency in four strategic phases.
        </p>

        <div className="grid md:grid-cols-4 gap-12 mt-32 relative">
          <div className="hidden xl:block absolute top-20 left-40 right-40 h-px bg-gray-200 dark:bg-gray-800 opacity-30 shadow-sm" />
          {steps.map((s, i) => (
            <StepCard key={s.number} {...s} delay={i * 200} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({ number, title, desc, icon, delay }: StepProps & { delay: number }) {
  return (
    <div className="relative text-center group animate-in fade-in slide-in-from-bottom-10 duration-1000" style={{ animationDelay: `${delay}ms` }}>
      <div className="relative inline-flex w-40 h-40 rounded-[3.5rem] bg-white dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 items-center justify-center mb-10 mx-auto group-hover:border-blue-600 dark:group-hover:border-blue-500 group-hover:shadow-2xl transition-all duration-700 shadow-xl group-hover:-translate-y-4">
        <span className="text-6xl font-black text-gray-50 dark:text-gray-950 absolute italic tracking-tighter opacity-40 group-hover:opacity-10 transition-opacity select-none">{number}</span>
        <span className="text-blue-600 dark:text-blue-500 relative z-10 group-hover:scale-125 transition-transform duration-700">{icon}</span>
      </div>
      <h3 className="font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter italic text-2xl leading-none">{title}</h3>
      <p className="text-gray-400 dark:text-gray-700 text-[13px] font-black italic uppercase tracking-tight leading-relaxed px-6">{desc}</p>
    </div>
  );
}

function AIShowcaseSection() {
  return (
    <section className="py-40 px-6 bg-white dark:bg-[#050816] relative overflow-hidden transition-all duration-500">
      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-32 items-center">
          <div className="animate-in slide-in-from-left-20 duration-1000">
            <SectionLabel text="Intelligence Core" />
            <h2 className="text-5xl md:text-7xl font-black leading-[0.95] mb-12 italic tracking-tighter dark:text-white">
              Autonomous Neural <br />
              <span className="text-blue-600 dark:text-blue-500 drop-shadow-[0_0_20px_rgba(37,99,235,0.1)]">Optimization Engine</span>
            </h2>
            <p className="text-gray-400 dark:text-gray-700 font-black leading-relaxed mb-16 text-xl italic uppercase tracking-tight">
              Beyond traditional test series, Quizaro utilizes proprietary neural algorithms 
              to synthesize multidimensional performance vectors — establishing a precision 
              roadmap for peak intellectual output.
            </p>
            <ul className="space-y-8 mb-20">
              {[
                "Targeted cognitive gap isolation and correction",
                "Dynamic unit complexity modulation (Real-time)",
                "Predictive score trajectory forecasting (ML)",
                "Optimization of temporal study allocations",
              ].map((item) => (
                <li key={item} className="flex items-start gap-6 text-[12px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-[0.3em] italic group">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-100 dark:border-blue-800/30 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <CheckCircle size={16} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="inline-flex items-center gap-6 px-16 py-8 bg-blue-600 text-white rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.3em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/40 italic active:scale-95"
            >
              Initialize Neural Audit <ArrowRight size={20} />
            </Link>
          </div>

          <div className="relative animate-in slide-in-from-right-20 duration-1000 group/mockup">
            <div className="absolute -inset-20 bg-blue-600/5 dark:bg-blue-600/10 rounded-[6rem] blur-[120px] group-hover/mockup:scale-110 transition-transform duration-1000 pointer-events-none" />
            <div className="relative bg-white dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 rounded-[5rem] p-12 lg:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] group-hover/mockup:-translate-y-4 transition-transform duration-1000">
              <div className="flex items-center justify-between mb-16 px-4">
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-[0.4em] italic leading-none">Telemetry Protocol</h4>
                  <p className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tighter leading-none">Intelligent Neural Visualizer</p>
                </div>
                <div className="flex items-center gap-3 px-6 py-2.5 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-100 dark:border-blue-800/30 rounded-full text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.3em] italic animate-pulse">
                   <Activity size={12} /> Live Sync
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8 mb-16">
                {[
                  { label: "Accuracy", value: "84%", trend: "+12%", color: "text-green-600" },
                  { label: "Velocity", value: "1.4s", trend: "-0.3s", color: "text-blue-600" },
                  { label: "Matrix Rank", value: "#247", trend: "↑128", color: "text-amber-600" },
                ].map((m) => (
                  <div key={m.label} className="bg-gray-50/50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 text-center shadow-inner group/stat hover:border-blue-300 transition-all duration-500">
                    <div className="text-3xl font-black text-gray-900 dark:text-white mb-2 italic tracking-tighter tabular-nums group-hover/stat:scale-110 transition-transform">{m.value}</div>
                    <div className="text-[9px] text-gray-400 dark:text-gray-800 font-black uppercase tracking-[0.3em] mb-3 italic">{m.label}</div>
                    <div className={`text-[11px] ${m.color} font-black italic tracking-widest`}>{m.trend}</div>
                  </div>
                ))}
              </div>

              <div className="mb-16 space-y-8 px-4">
                {[
                  { topic: "Mathematics Grid", pct: 78, color: "bg-blue-600" },
                  { topic: "Theoretical Physics Cluster", pct: 91, color: "bg-indigo-600" },
                  { topic: "Inorganic Chemical Nodes", pct: 63, color: "bg-amber-600" },
                ].map(({ topic, pct, color }) => (
                  <div key={topic} className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[11px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-[0.4em] italic leading-none">{topic}</span>
                       <span className="text-[12px] font-black text-gray-900 dark:text-white tabular-nums italic">{pct}% SYNC</span>
                    </div>
                    <div className="w-full h-3 bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-full overflow-hidden shadow-inner p-0.5">
                      <div className={`h-full ${color} rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(37,99,235,0.4)]`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-blue-50/50 dark:bg-blue-900/10 border-2 border-dashed border-blue-100 dark:border-blue-800/30 rounded-[3rem] shadow-sm relative overflow-hidden group/tip">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
                <p className="text-[13px] text-blue-900 dark:text-blue-300 font-black leading-relaxed italic tracking-tight">
                  🤖 <span className="font-black uppercase not-italic mr-4 text-blue-600 text-[11px] tracking-[0.4em]">Neural insight:</span> focus on organic synthesis clusters this week — incremental 15% optimization will yield ~4.2 aggregate score variance.
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
      plan: "Institutional Foundation", price: "₹0", period: "forever", desc: "Global Entry Protocol",
      features: ["10 Sessions/Month", "Basic Telemetry", "5 Domain Categories", "Community Grid Access"],
      cta: "Initialize Free Node",
    },
    {
      plan: "SaaS Professional", price: "₹299", period: "/mo", desc: "High-Density Performance",
      features: ["Unlimited Sessions", "Full AI Cognitive Audit", "200+ Domain Categories", "Global Cluster Leaderboards", "Institutional Support"],
      cta: "Upgrade to Professional", highlighted: true, badge: "NEURAL STANDARD",
    },
    {
      plan: "Enterprise Elite", price: "₹699", period: "/mo", desc: "Peak Optimization Tier",
      features: ["Everything in Pro", "1-on-1 Strategic Mentorship", "Legacy Performance Archives", "Priority Neural Support", "Guaranteed Trajectory*"],
      cta: "Configure Elite Node",
    },
  ];

  return (
    <section className="py-40 px-6 bg-[#f8f9fc] dark:bg-[#0a0f29] transition-all duration-500" id="pricing">
      <div className="max-w-7xl mx-auto relative">
        <SectionLabel text="Pricing Architecture" />
        <h2 className="section-title italic dark:text-white">Transparent <span className="text-blue-600 dark:text-blue-500">Growth Models</span></h2>
        <p className="section-sub font-black text-gray-300 dark:text-gray-800 mt-10 uppercase text-[12px] tracking-[0.7em] italic">Scalable intelligence resources for every intellectual phase.</p>
        <div className="grid md:grid-cols-3 gap-12 mt-32">
          {plans.map((p) => (<PricingCard key={p.plan} {...p} />))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ plan, price, period, desc, features, cta, highlighted, badge }: PricingCardProps) {
  return (
    <div className={`relative p-14 rounded-[5rem] border-2 transition-all duration-700 flex flex-col active:scale-[0.98] ${highlighted ? "bg-white dark:bg-[#050816] border-blue-600 dark:border-blue-500 shadow-2xl scale-110 z-20" : "bg-white dark:bg-[#050816] border-gray-100 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-xl"}`}>
      {badge && <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-black px-10 py-3 rounded-full bg-blue-600 text-white uppercase tracking-[0.3em] shadow-2xl shadow-blue-900/40 italic">{badge}</span>}
      <div className="mb-14 text-center">
        <h3 className="text-[12px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-[0.4em] mb-10 italic">{plan}</h3>
        <div className="flex items-baseline justify-center gap-4">
          <span className="text-7xl font-black text-gray-900 dark:text-white italic tracking-tighter tabular-nums leading-none">{price}</span>
          <span className="text-gray-400 dark:text-gray-700 text-sm font-black uppercase tracking-widest">{period}</span>
        </div>
        <p className="text-gray-400 dark:text-gray-700 text-[12px] font-black mt-6 uppercase tracking-[0.2em] italic">{desc}</p>
      </div>
      <div className="w-full h-px bg-gray-50 dark:bg-gray-900 mb-14 shadow-sm" />
      <ul className="space-y-8 mb-16 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-4 text-[13px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-tight italic leading-relaxed group/feature">
            <CheckCircle size={20} className="text-blue-600 dark:text-blue-500 mt-0.5 flex-shrink-0 group-hover/feature:scale-125 transition-transform" />
            {f}
          </li>
        ))}
      </ul>
      <Link href="/register" className={`w-full text-center py-8 rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.3em] transition-all duration-700 italic shadow-xl ${highlighted ? "bg-blue-600 text-white shadow-blue-900/40 hover:bg-blue-700" : "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-100 dark:border-gray-800 hover:bg-white dark:hover:bg-[#050816] hover:border-blue-600"}`}>{cta}</Link>
    </div>
  );
}

function TestimonialsSection() {
  const testimonials: TestimonialProps[] = [
    { name: "Sankalp Swaroop", role: "AIR 47, JEE Advanced", exam: "Engineering Domain", text: "The adaptive assessment protocols are unparalleled. It isolated my cognitive gaps in the first week and optimized my trajectory significantly.", avatar: "SS", rating: 5 },
    { name: "Priya Soni", role: "Institutional Merit Recipient", exam: "Banking Sector", text: "Cracked the entrance on my first attempt. The timed sectional telemetry and analytics dashboard provided a decisive competitive edge.", avatar: "PS", rating: 5 },
  ];
  return (
    <section className="py-40 px-6 bg-white dark:bg-[#050816] transition-all duration-500">
      <div className="max-w-7xl mx-auto">
        <SectionLabel text="Merit Validation" />
        <h2 className="section-title italic dark:text-white">Scholar <span className="text-blue-600 dark:text-blue-500">Success Trajectories</span></h2>
        <p className="section-sub font-black text-gray-300 dark:text-gray-800 mt-10 uppercase text-[12px] tracking-[0.6em] italic">Real-world impact verified by elite platform achievers.</p>
        <div className="grid md:grid-cols-2 gap-12 mt-32">
          {testimonials.map((t) => (<TestimonialCard key={t.name} {...t} />))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ name, role, text, avatar, rating, exam }: TestimonialProps) {
  return (
    <div className="p-14 rounded-[5rem] bg-gray-50/50 dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 relative group hover:bg-white dark:hover:bg-[#050816] hover:border-blue-600 hover:shadow-2xl transition-all duration-700 active:scale-[0.98]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000 pointer-events-none" />
      <div className="flex items-start justify-between mb-12 relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[2rem] bg-blue-600 text-white flex items-center justify-center font-black text-2xl italic shadow-2xl shadow-blue-900/40 border-4 border-white dark:border-[#0a0f29] group-hover:rotate-6 transition-transform">{avatar}</div>
          <div className="space-y-1">
            <div className="font-black text-gray-900 dark:text-white text-xl uppercase tracking-tighter italic leading-none">{name}</div>
            <div className="text-gray-400 dark:text-gray-700 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">{role}</div>
          </div>
        </div>
        {exam && <span className="text-[10px] font-black text-blue-600 dark:text-blue-500 bg-blue-50/50 dark:bg-blue-900/10 px-6 py-3 rounded-full border border-blue-100 dark:border-blue-800/30 uppercase tracking-[0.2em] italic">{exam}</span>}
      </div>
      <div className="flex gap-2 mb-10 relative z-10">
        {Array.from({ length: rating }).map((_, i) => (<Star key={i} size={20} className="text-amber-500" fill="currentColor" />))}
      </div>
      <p className="text-gray-500 dark:text-gray-400 font-black leading-relaxed italic text-lg uppercase tracking-tight relative z-10">"{text}"</p>
    </div>
  );
}

function FaqSection() {
  const faqs = [
    { question: "Is the institutional baseline genuinely free?", answer: "Correct. The Foundation plan provides 10 assessment sessions per month across 5 domain categories with zero capital commitment for the first 30 days." },
    { question: "How does the AI cognitive audit function?", answer: "Following each session, our neural model maps your response vectors to a high-dimensional skill matrix, modulating subsequent unit complexity to optimize learning velocity." },
    { question: "Can I migrate between performance tiers?", answer: "Seamlessly. You can scale your infrastructure requirements or down-throttle at any point within the institutional command dashboard." },
  ];
  return (
    <section className="py-40 px-6 bg-[#f8f9fc] dark:bg-[#0a0f29] transition-all duration-500">
      <div className="max-w-4xl mx-auto">
        <SectionLabel text="Audit FAQ" />
        <h2 className="section-title italic dark:text-white">Frequently Asked <span className="text-blue-600 dark:text-blue-500">Inquiries</span></h2>
        <div className="mt-24 space-y-6">
          {faqs.map((f) => (<FaqItem key={f.question} {...f} />))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, answer }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-2 rounded-[3.5rem] overflow-hidden transition-all duration-700 ${open ? "border-blue-600 bg-white dark:bg-[#050816] shadow-2xl shadow-blue-900/10" : "border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/30"}`}>
      <button className="w-full flex items-center justify-between px-12 py-10 text-left group" onClick={() => setOpen(!open)}>
        <span className={`font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none transition-colors duration-500 ${open ? "text-blue-600 dark:text-blue-500" : ""}`}>{question}</span>
        <div className={`w-12 h-12 rounded-[1.2rem] bg-gray-50 dark:bg-gray-800 flex items-center justify-center transition-all duration-700 ${open ? "rotate-180 bg-blue-600 text-white shadow-lg" : "text-gray-300 dark:text-gray-700 group-hover:text-blue-600"}`}>
           <ChevronDown size={28} />
        </div>
      </button>
      {open && <div className="px-12 pb-12 text-lg font-black text-gray-400 dark:text-gray-700 leading-relaxed italic uppercase tracking-tight animate-in fade-in slide-in-from-top-4 duration-500">{answer}</div>}
    </div>
  );
}

function CtaSection() {
  return (
    <section className="py-60 px-6 text-center bg-white dark:bg-[#050816] border-t-2 border-gray-50 dark:border-gray-800 relative overflow-hidden transition-all duration-500">
      <div className="absolute w-[1000px] h-[1000px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full -bottom-96 left-1/2 -translate-x-1/2 blur-[150px] pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="text-6xl md:text-[8rem] font-black mb-12 italic tracking-tighter leading-none dark:text-white selection:bg-blue-600 selection:text-white">Your Professional <br/><span className="text-blue-600 dark:text-blue-500">Success Matrix Starts Now</span></h2>
        <p className="text-gray-400 dark:text-gray-700 font-black text-2xl mb-24 uppercase tracking-[0.5em] italic">Free institutional baseline access. No capital required.</p>
        <Link href="/register" className="group relative px-20 py-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[3rem] font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-gray-900/40 hover:scale-105 transition-all duration-500 italic inline-flex items-center gap-8">
           Initialize Free Registry 
           <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform duration-500" />
        </Link>
      </div>
    </section>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex justify-center mb-12">
      <span className="inline-flex items-center gap-4 text-[11px] font-black uppercase text-blue-600 dark:text-blue-500 px-10 py-4 rounded-full bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-100 dark:border-blue-800/30 tracking-[0.5em] shadow-xl shadow-blue-900/5 italic active:scale-95 transition-transform">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse shadow-[0_0_10px_#3b82f6]" />{text}
      </span>
    </div>
  );
}

function GlobalStyles() {
  return (
    <style jsx global>{`
      .section-title { font-size: clamp(3.5rem, 8vw, 7rem); font-weight: 900; text-align: center; line-height: 0.95; letter-spacing: -0.06em; }
      .section-sub { text-align: center; }
      @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      .animate-marquee { animation: marquee 40s linear infinite; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      
      /* Custom Horizontal Scrollbar for Categories */
      .custom-scrollbar-horizontal::-webkit-scrollbar { height: 4px; }
      .custom-scrollbar-horizontal::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar-horizontal::-webkit-scrollbar-thumb { background: rgba(37,99,235,0.1); border-radius: 10px; }
      .custom-scrollbar-horizontal:hover::-webkit-scrollbar-thumb { background: rgba(37,99,235,0.3); }
    `}</style>
  );
}
