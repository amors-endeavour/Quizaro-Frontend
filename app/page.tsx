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
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">
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
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-32 overflow-hidden bg-[#f8f9fc]">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute w-[800px] h-[800px] bg-blue-50/50 rounded-full -top-96 -left-96 blur-[100px]" />
        <div className="absolute w-[600px] h-[600px] bg-purple-50/50 rounded-full -bottom-48 -right-48 blur-[100px]" />
      </div>

      {/* Dot Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto flex flex-col items-center">
        {/* Institutional Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white border border-gray-100 text-[10px] font-black uppercase tracking-widest text-blue-600 mb-12 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Sparkles size={14} className="text-blue-500" />
          SIMPLIFIED WITH UMAR • THE FUTURE OF LEARNING
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        </div>

        {/* Master Heading */}
        <h1 className="text-5xl sm:text-7xl md:text-[6rem] font-black leading-[1.05] mb-10 tracking-tighter text-gray-900 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 italic">
          Master Any Exam <br />
          <span className="text-blue-600">With Intelligence</span>
        </h1>

        <p className="max-w-2xl text-lg sm:text-xl text-gray-500 font-bold leading-relaxed mb-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          India&apos;s most sophisticated assessment engine. Adaptive protocols, 
          real-time telemetry, and institutional-grade analytics.
        </p>

        {/* Action Hub */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-24 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
          <button 
            onClick={() => router.push("/login")}
            className="group relative flex items-center gap-5 px-14 py-6 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-gray-900/20 hover:scale-105 transition-all active:scale-95"
          >
            <div className="bg-white/10 p-2.5 rounded-xl group-hover:rotate-12 transition-transform"><Users size={20} /></div>
            Student Gateway
          </button>

          <button 
            onClick={() => router.push("/admin-login")}
            className="group flex items-center gap-5 px-14 py-6 bg-white border border-gray-100 rounded-[2rem] font-black text-xs uppercase tracking-widest text-gray-900 hover:bg-gray-50 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gray-900/5"
          >
            <div className="bg-gray-50 p-2.5 rounded-xl text-gray-400 group-hover:text-blue-600 transition-colors"><Shield size={20} /></div>
            Admin Console
          </button>
        </div>

        {/* Trust Metrics */}
        <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-500">
          <div className="flex items-center -space-x-4">
             {[1,2,3,4,5].map(i => (
               <div key={i} className="w-14 h-14 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-lg">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 888}`} alt="user" className="w-full h-full object-cover" />
               </div>
             ))}
             <div className="w-14 h-14 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg">+50k</div>
          </div>
          <div className="flex flex-col items-center gap-2">
             <span className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em]">Validated by 50,000+ top achievers</span>
             <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                   {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-yellow-400" fill="currentColor" />)}
                </div>
                <span className="text-xs text-gray-900 font-black italic tracking-tighter">4.9/5 INSTITUTIONAL RATING</span>
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
    <section className="py-16 bg-white border-y border-gray-50 overflow-hidden">
      <p className="text-center text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mb-10">
        Institutional Partners & Affiliations
      </p>
      <div className="flex gap-20 animate-marquee whitespace-nowrap items-center">
        {[...brands, ...brands].map((b, i) => (
          <span key={i} className="text-gray-300 font-black text-lg hover:text-gray-900 transition-all cursor-default uppercase tracking-widest italic grayscale hover:grayscale-0">
            {b}
          </span>
        ))}
      </div>
    </section>
  );
}

function StatsSection() {
  const stats: StatProps[] = [
    { value: "50K+", label: "Active Nodes", icon: <Users size={24} /> },
    { value: "2M+", label: "Inquiries Processed", icon: <BookOpen size={24} /> },
    { value: "98%", label: "Success Matrix", icon: <Target size={24} /> },
    { value: "200+", label: "Subject Domains", icon: <Award size={24} /> },
  ];
  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="relative p-10 rounded-[3rem] bg-gray-50/50 border border-gray-100 text-center group hover:border-blue-200 hover:bg-white hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500"
          >
            <div className="flex justify-center mb-6 text-gray-300 group-hover:text-blue-600 transition-colors">{s.icon}</div>
            <div className="text-4xl md:text-5xl font-black text-gray-900 mb-2 italic tracking-tighter">
              {s.value}
            </div>
            <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{s.label}</div>
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
      title: "Cognitive AI Core",
      desc: "Our neural architecture maps your intellectual trajectory and synthesizes personalized pathways for optimization.",
      tag: "AI NATIVE",
    },
    {
      icon: <BarChart3 size={28} />,
      title: "Institutional Analytics",
      desc: "Comprehensive telemetry covering speed vectors, accuracy trends, and cross-domain proficiency matrices.",
      tag: "PREMIUM",
    },
    {
      icon: <Trophy size={28} />,
      title: "Global Benchmarking",
      desc: "Synchronous competition with the top 1% across national and institutional leaderboards.",
    },
    {
      icon: <Clock size={28} />,
      title: "Simulation Environment",
      desc: "High-fidelity mock environments replicating national test patterns with millisecond precision.",
    },
    {
      icon: <Flame size={28} />,
      title: "Persistence Modules",
      desc: "Behavioral engineering through daily streak protocols and incremental performance rewards.",
    },
    {
      icon: <Shield size={28} />,
      title: "Verified Repository",
      desc: "Curated content pool from senior subject matter experts and institutional researchers.",
      tag: "VALIDATED",
    },
  ];

  return (
    <section className="py-32 px-6 bg-[#f8f9fc]" id="features">
      <div className="max-w-6xl mx-auto">
        <SectionLabel text="Framework Features" />
        <h2 className="section-title italic">
          Architected for <br className="hidden md:block" />
          <span className="text-blue-600">Peak Performance</span>
        </h2>
        <p className="section-sub font-bold text-gray-400 mt-6 uppercase text-[11px] tracking-widest">
          The ultimate toolkit for institutional-grade preparation.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-24">
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
    <div className="group relative p-10 rounded-[3rem] bg-white border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 overflow-hidden">
      <div className="relative z-10">
        <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 text-blue-600 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
          {icon}
        </div>

        {tag && (
          <span className="absolute top-0 right-0 text-[9px] font-black px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 uppercase tracking-widest">
            {tag}
          </span>
        )}

        <h3 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tighter italic">{title}</h3>
        <p className="text-gray-400 text-sm font-bold leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ExamCategoriesSection() {
  const exams: ExamCardProps[] = [
    { emoji: "🔬", title: "JEE / NEET", subtitle: "Engineering & Medical", count: "8,400+ UNITS", color: "border-blue-100 bg-white" },
    { emoji: "📜", title: "UPSC / IAS", subtitle: "Civil Services", count: "3,200+ UNITS", color: "border-amber-100 bg-white" },
    { emoji: "🏦", title: "Banking PO/Clerk", subtitle: "SBI, IBPS, RBI", count: "5,100+ UNITS", color: "border-emerald-100 bg-white" },
    { emoji: "⚔️", title: "Defence Forces", subtitle: "CDS, NDA, AFCAT", count: "2,700+ UNITS", color: "border-red-100 bg-white" },
    { emoji: "📊", title: "SSC / Railway", subtitle: "CGL, CHSL, RRB NTPC", count: "6,300+ UNITS", color: "border-violet-100 bg-white" },
    { emoji: "🎓", title: "CAT / MBA", subtitle: "IIM Entrance", count: "1,900+ UNITS", color: "border-pink-100 bg-white" },
  ];

  return (
    <section className="py-32 px-6 bg-white relative" id="exams">
      <div className="max-w-6xl mx-auto relative">
        <SectionLabel text="Domain Categories" />
        <h2 className="section-title italic">
          Exhaustive <span className="text-blue-600">Curriculum Matrix</span>
        </h2>
        <p className="section-sub font-bold text-gray-400 mt-6 uppercase text-[11px] tracking-widest">
          Strategic coverage for over 200 high-stakes domains.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-24">
          {exams.map((e) => (
            <ExamCard key={e.title} {...e} />
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/exams"
            className="inline-flex items-center gap-3 text-[10px] font-black text-blue-600 hover:text-blue-700 transition-all group uppercase tracking-[0.2em] bg-blue-50 px-8 py-4 rounded-full border border-blue-100 shadow-sm"
          >
            Explore All 200+ Institutional Domains
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
      className={`group relative p-10 rounded-[3rem] border ${color} hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 overflow-hidden`}
    >
      <div className="flex items-start justify-between mb-8">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl shadow-sm group-hover:scale-110 transition-transform">{emoji}</div>
        <ArrowRight size={20} className="text-gray-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
      </div>
      <h3 className="font-black text-gray-900 text-xl mb-2 uppercase tracking-tighter italic">{title}</h3>
      <p className="text-gray-400 text-xs font-bold mb-6 uppercase tracking-widest">{subtitle}</p>
      <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-5 py-2 rounded-full border border-blue-100 uppercase tracking-widest">{count}</span>
    </Link>
  );
}

function HowItWorksSection() {
  const steps: StepProps[] = [
    { number: "01", title: "Node Registry", desc: "Initialize your institutional identity in 30 seconds.", icon: <Users size={20} /> },
    { number: "02", title: "Domain Selection", desc: "Configure your target curriculum matrix.", icon: <BookOpen size={20} /> },
    { number: "03", title: "Protocol Session", desc: "Engage with adaptive assessment algorithms.", icon: <Brain size={20} /> },
    { number: "04", title: "Telemetry Audit", desc: "Review performance vectors and AI insights.", icon: <TrendingUp size={20} /> },
  ];

  return (
    <section className="py-32 px-6 bg-[#f8f9fc]">
      <div className="max-w-6xl mx-auto">
        <SectionLabel text="Execution Protocol" />
        <h2 className="section-title italic">
          Streamlined <span className="text-blue-600">Onboarding Flow</span>
        </h2>
        <p className="section-sub font-bold text-gray-400 mt-6 uppercase text-[11px] tracking-widest">
          From registration to mastery in four strategic phases.
        </p>

        <div className="grid md:grid-cols-4 gap-12 mt-24 relative">
          <div className="hidden lg:block absolute top-16 left-24 right-24 h-px bg-gray-200" />
          {steps.map((s, i) => (
            <StepCard key={s.number} {...s} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({ number, title, desc, icon, delay }: StepProps & { delay: number }) {
  return (
    <div className="relative text-center group" style={{ animationDelay: `${delay}ms` }}>
      <div className="relative inline-flex w-32 h-32 rounded-[2.5rem] bg-white border border-gray-100 items-center justify-center mb-8 mx-auto group-hover:border-blue-200 group-hover:shadow-2xl group-hover:shadow-blue-900/5 transition-all duration-500 shadow-sm">
        <span className="text-4xl font-black text-gray-50 absolute opacity-10 italic">{number}</span>
        <span className="text-blue-600 relative z-10">{icon}</span>
      </div>
      <h3 className="font-black text-gray-900 mb-4 uppercase tracking-tighter italic text-lg">{title}</h3>
      <p className="text-gray-400 text-xs font-bold leading-relaxed px-4">{desc}</p>
    </div>
  );
}

function AIShowcaseSection() {
  return (
    <section className="py-32 px-6 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="animate-in slide-in-from-left-12 duration-1000">
            <SectionLabel text="Intelligence Core" />
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-10 italic tracking-tighter">
              Autonomous Study <br />
              <span className="text-blue-600">Optimization Coach</span>
            </h2>
            <p className="text-gray-500 font-bold leading-relaxed mb-12 text-lg">
              Beyond traditional test series, Quizaro utilizes proprietary AI to analyze 
              multidimensional performance vectors — establishing a precision roadmap for your 
              intellectual development.
            </p>
            <ul className="space-y-6 mb-12">
              {[
                "Targeted weak-topic isolation and correction",
                "Dynamic question complexity modulation",
                "Predictive score trajectory forecasting",
                "Optimization of study schedule allocations",
              ].map((item) => (
                <li key={item} className="flex items-start gap-4 text-sm font-black text-gray-400 uppercase tracking-widest">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={14} className="text-blue-600" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/20"
            >
              Initialize AI Analysis <ArrowRight size={14} />
            </Link>
          </div>

          <div className="relative animate-in slide-in-from-right-12 duration-1000">
            <div className="absolute -inset-10 bg-blue-50/50 rounded-[4rem] blur-3xl" />
            <div className="relative bg-white border border-gray-100 rounded-[3.5rem] p-10 lg:p-14 shadow-2xl shadow-blue-900/5">
              <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Performance Protocol</h4>
                  <p className="text-lg font-black text-gray-900 italic tracking-tighter">Intelligent Data Visualizer</p>
                </div>
                <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest animate-pulse">Telemetry Live</span>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-12">
                {[
                  { label: "Accuracy", value: "84%", trend: "+12%" },
                  { label: "Velocity", value: "1.4s", trend: "-0.3s" },
                  { label: "Matrix Rank", value: "#247", trend: "↑128" },
                ].map((m) => (
                  <div key={m.label} className="bg-gray-50 border border-gray-100 rounded-3xl p-6 text-center shadow-inner">
                    <div className="text-2xl font-black text-gray-900 mb-1 italic tracking-tighter">{m.value}</div>
                    <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-2">{m.label}</div>
                    <div className="text-[10px] text-green-600 font-black">{m.trend}</div>
                  </div>
                ))}
              </div>

              <div className="mb-10 space-y-6">
                {[
                  { topic: "Mathematics", pct: 78, color: "bg-blue-500" },
                  { topic: "Theoretical Physics", pct: 91, color: "bg-purple-500" },
                  { topic: "Inorganic Chemistry", pct: 63, color: "bg-amber-500" },
                ].map(({ topic, pct, color }) => (
                  <div key={topic} className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{topic}</span>
                       <span className="text-[10px] font-black text-gray-900">{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-50 border border-gray-100 rounded-full overflow-hidden shadow-inner">
                      <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl shadow-sm">
                <p className="text-[11px] text-blue-800 font-bold leading-relaxed italic">
                  🤖 <span className="font-black uppercase not-italic mr-2">Institutional Insight:</span> Focus on Organic Chemistry synthesis protocols this week — incremental 15% optimization will yield ~4.2 aggregate score increase.
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
      plan: "Foundation", price: "₹0", period: "forever", desc: "Institutional entry level",
      features: ["10 Sessions/Month", "Basic Telemetry", "5 Domain Categories", "Community Access"],
      cta: "Initialize Free",
    },
    {
      plan: "SaaS Professional", price: "₹299", period: "/month", desc: "High-density performance",
      features: ["Unlimited Sessions", "Full AI Cognitive Audit", "200+ Domain Categories", "Global Leaderboards", "Institutional Support"],
      cta: "Upgrade to Pro", highlighted: true, badge: "MOST REQUESTED",
    },
    {
      plan: "Enterprise Elite", price: "₹699", period: "/month", desc: "Top-tier optimization",
      features: ["Everything in Pro", "1-on-1 Strategic Mentorship", "Legacy Archive Access", "Priority Neural Support", "Guaranteed Trajectory*"],
      cta: "Configure Elite",
    },
  ];

  return (
    <section className="py-32 px-6 bg-[#f8f9fc]" id="pricing">
      <div className="max-w-6xl mx-auto relative">
        <SectionLabel text="Pricing Infrastructure" />
        <h2 className="section-title italic">Transparent <span className="text-blue-600">Growth Models</span></h2>
        <p className="section-sub font-bold text-gray-400 mt-6 uppercase text-[11px] tracking-widest">Scalable resources for every intellectual phase.</p>
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          {plans.map((p) => (<PricingCard key={p.plan} {...p} />))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ plan, price, period, desc, features, cta, highlighted, badge }: PricingCardProps) {
  return (
    <div className={`relative p-10 rounded-[3.5rem] border transition-all duration-500 flex flex-col ${highlighted ? "bg-white border-blue-200 shadow-2xl shadow-blue-900/10 scale-105 z-20" : "bg-white border-gray-100 hover:border-gray-200"}`}>
      {badge && <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-black px-6 py-2 rounded-full bg-blue-600 text-white uppercase tracking-widest shadow-lg">{badge}</span>}
      <div className="mb-10">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{plan}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black text-gray-900 italic tracking-tighter">{price}</span>
          <span className="text-gray-400 text-sm font-bold">{period}</span>
        </div>
        <p className="text-gray-400 text-xs font-bold mt-4 uppercase tracking-widest">{desc}</p>
      </div>
      <ul className="space-y-5 mb-12 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-xs font-bold text-gray-500">
            <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Link href="/register" className={`w-full text-center py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${highlighted ? "bg-blue-600 text-white shadow-xl shadow-blue-900/20 hover:bg-blue-700" : "bg-gray-50 text-gray-900 border border-gray-100 hover:bg-gray-100"}`}>{cta}</Link>
    </div>
  );
}

function TestimonialsSection() {
  const testimonials: TestimonialProps[] = [
    { name: "Sankalp Swaroop", role: "AIR 47, JEE Advanced", exam: "Engineering Domain", text: "The adaptive assessment protocols are unparalleled. It isolated my cognitive gaps in the first week and optimized my trajectory significantly.", avatar: "SS", rating: 5 },
    { name: "Priya Soni", role: "Institutional Merit Recipient", exam: "Banking Domain", text: "Cracked the entrance on my first attempt. The timed sectional telemetry and analytics dashboard provided a decisive competitive edge.", avatar: "PS", rating: 5 },
  ];
  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionLabel text="Merit Validation" />
        <h2 className="section-title italic">Scholar <span className="text-blue-600">Success Trajectories</span></h2>
        <div className="grid md:grid-cols-2 gap-8 mt-24">
          {testimonials.map((t) => (<TestimonialCard key={t.name} {...t} />))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ name, role, text, avatar, rating, exam }: TestimonialProps) {
  return (
    <div className="p-10 rounded-[3rem] bg-gray-50/50 border border-gray-100 relative group hover:bg-white hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg italic shadow-lg shadow-blue-900/10">{avatar}</div>
          <div>
            <div className="font-black text-gray-900 text-sm uppercase tracking-tighter italic">{name}</div>
            <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">{role}</div>
          </div>
        </div>
        {exam && <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest">{exam}</span>}
      </div>
      <div className="flex gap-1.5 mb-6">
        {Array.from({ length: rating }).map((_, i) => (<Star key={i} size={14} className="text-yellow-400" fill="currentColor" />))}
      </div>
      <p className="text-gray-500 font-bold leading-relaxed italic text-sm">"{text}"</p>
    </div>
  );
}

function FaqSection() {
  const faqs = [
    { question: "Is the institutional baseline genuinely free?", answer: "Correct. The Foundation plan provides 10 assessment sessions per month across 5 domain categories with zero capital commitment." },
    { question: "How does the AI cognitive audit function?", answer: "Following each session, our neural model maps your response vectors to a high-dimensional skill matrix, modulating subsequent questions to optimize learning velocity." },
    { question: "Can I migrate between performance tiers?", answer: "Seamlessly. You can scale your infrastructure requirements or down-throttle at any point within the institutional dashboard." },
  ];
  return (
    <section className="py-32 px-6 bg-[#f8f9fc]">
      <div className="max-w-3xl mx-auto">
        <SectionLabel text="Audit FAQ" />
        <h2 className="section-title italic">Frequently Asked <span className="text-blue-600">Inquiries</span></h2>
        <div className="mt-16 space-y-4">
          {faqs.map((f) => (<FaqItem key={f.question} {...f} />))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, answer }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-[2rem] overflow-hidden transition-all duration-500 ${open ? "border-blue-200 bg-white shadow-xl shadow-blue-900/5" : "border-gray-100 bg-white/50"}`}>
      <button className="w-full flex items-center justify-between px-10 py-6" onClick={() => setOpen(!open)}>
        <span className="font-black text-xs text-gray-900 uppercase tracking-widest italic text-left">{question}</span>
        <div className={`w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center transition-all ${open ? "rotate-180 bg-blue-50 text-blue-600" : "text-gray-300"}`}>
           <ChevronDown size={18} />
        </div>
      </button>
      {open && <div className="px-10 pb-8 text-sm font-bold text-gray-400 leading-relaxed animate-in fade-in slide-in-from-top-2">{answer}</div>}
    </div>
  );
}

function CtaSection() {
  return (
    <section className="py-40 px-6 text-center bg-white border-t border-gray-50 relative overflow-hidden">
      <div className="absolute w-[800px] h-[800px] bg-blue-50/30 rounded-full -bottom-96 left-1/2 -translate-x-1/2 blur-[120px]" />
      <div className="relative z-10 max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-black mb-10 italic tracking-tighter leading-none">Your Professional <br/><span className="text-blue-600">Success Matrix Starts Now</span></h2>
        <p className="text-gray-400 font-bold text-xl mb-16 uppercase tracking-widest">Free institutional baseline. No capital required.</p>
        <Link href="/register" className="px-16 py-7 bg-gray-900 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-gray-900/20 hover:scale-105 transition-all">Initialize Free Registry</Link>
      </div>
    </section>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex justify-center mb-8">
      <span className="inline-flex items-center gap-3 text-[10px] font-black uppercase text-blue-600 px-6 py-2.5 rounded-full bg-blue-50 border border-blue-100 tracking-widest shadow-sm italic">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />{text}
      </span>
    </div>
  );
}

function GlobalStyles() {
  return (
    <style jsx global>{`
      .section-title { font-size: clamp(3rem, 6vw, 4.5rem); font-weight: 900; text-align: center; line-height: 1.05; letter-spacing: -0.05em; }
      .section-sub { text-align: center; }
      @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      .animate-marquee { animation: marquee 30s linear infinite; }
    `}</style>
  );
}
