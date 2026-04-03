"use client";

import { BookOpen, Target, Trophy } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-6">About StudyWeb</h1>
        <p className="max-w-2xl mx-auto text-lg">
          StudyWeb is a smart online platform designed to help students prepare
          for competitive exams through unlimited practice tests, performance
          analysis, and real-time rankings.
        </p>
      </section>

      {/* MISSION */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg">
          Our mission is to make exam preparation smarter, faster, and more
          effective. We provide thousands of practice questions, detailed
          explanations, and performance analytics to help aspirants achieve
          their goals.
        </p>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          What We Offer
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

          <FeatureCard
            icon={<BookOpen size={32} />}
            title="Unlimited Practice"
            desc="Access thousands of MCQs across multiple competitive exams."
          />

          <FeatureCard
            icon={<Target size={32} />}
            title="Smart Analytics"
            desc="Track your performance with detailed insights and accuracy reports."
          />

          <FeatureCard
            icon={<Trophy size={32} />}
            title="Live Rankings"
            desc="Compete with real aspirants and improve your exam performance."
          />

        </div>
      </section>

      {/* STATS */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">

          <Stat number="50K+" label="Students Joined" />
          <Stat number="10K+" label="Practice Questions" />
          <Stat number="1K+" label="Tests Conducted" />

        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white text-center py-20 px-6">
        <h2 className="text-4xl font-bold mb-6">
          Start Your Preparation Today
        </h2>

        <p className="mb-8 text-lg">
          Join thousands of students preparing smarter with StudyWeb.
        </p>

        <Link
          href="/register"
          className="bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
        >
          Get Started
        </Link>
      </section>

    </div>
  );
}

/* Reusable Components */

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
    <div className="bg-gray-100 p-8 rounded-2xl shadow hover:shadow-xl transition text-center">
      <div className="text-blue-600 mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <h3 className="text-4xl font-bold text-blue-600">{number}</h3>
      <p className="text-gray-600 mt-2">{label}</p>
    </div>
  );
}