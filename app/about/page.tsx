"use client";

import { BookOpen, Target, Trophy } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fc] text-gray-900 selection:bg-blue-100 selection:text-blue-600">
      <Navbar />

      {/* HERO */}
      <section className="py-32 px-10 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter italic">About Quizaro</h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-400 font-bold leading-relaxed uppercase tracking-wider">
          Quizaro is a precision-engineered online practice ecosystem designed to empower aspirants for competitive excellence through data-driven assessment and real-time competitive analytics.
        </p>
      </section>

      {/* MISSION */}
      <section className="py-24 px-10 max-w-6xl mx-auto text-center">
        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-600 mb-6">Our Foundational Mission</h2>
        <p className="text-gray-900 max-w-4xl mx-auto text-3xl font-black tracking-tight italic leading-snug">
          To accelerate exam proficiency by providing institutional-grade assessment tools, forensic performance analytics, and a global competitive grid for every dedicated student.
        </p>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <FeatureCard
            icon={<BookOpen size={32} />}
            title="Institutional Repository"
            desc="Access a vast catalog of high-fidelity MCQs curated across diverse competitive domains."
          />
          <FeatureCard
            icon={<Target size={32} />}
            title="Forensic Analytics"
            desc="Decode your performance through high-density insight vectors and precision accuracy metrics."
          />
          <FeatureCard
            icon={<Trophy size={32} />}
            title="Competitive Grid"
            desc="Measure your intelligence trajectory against a global student registry in real-time."
          />
        </div>
      </section>

      {/* STATS */}
      <section className="py-24 px-10 bg-white border-y border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16 text-center">
          <Stat number="50K+" label="Active Enrolled Candidates" />
          <Stat number="10K+" label="Verified Intelligence Nodes" />
          <Stat number="1K+" label="Institutional Evaluations" />
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-32 px-10 max-w-4xl mx-auto">
        <h2 className="text-4xl font-black mb-8 tracking-tight italic">
          Initialize Your Trajectory Today
        </h2>
        <p className="mb-12 text-gray-400 font-bold uppercase tracking-widest text-sm">
          Join the elite grid of students preparing with institutional precision.
        </p>
        <Link
          href="/register"
          className="inline-block bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-900/10 hover:bg-blue-700 transition active:scale-95"
        >
          Initialize Registry
        </Link>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white border border-gray-100 p-12 rounded-[2.5rem] hover:shadow-2xl hover:shadow-blue-900/5 transition-all group">
      <div className="text-blue-600 mb-8 bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-black mb-4 uppercase tracking-tight italic">{title}</h3>
      <p className="text-gray-400 text-sm font-bold leading-relaxed">{desc}</p>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="space-y-3">
      <h3 className="text-5xl font-black text-blue-600 tracking-tighter">{number}</h3>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
    </div>
  );
}
