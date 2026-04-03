"use client";

import { Search, FileText, Clock, Trophy } from "lucide-react";
import Link from "next/link";

export default function TestsPage() {
  const tests = [
    {
      title: "SSC CGL Mock Test",
      questions: 100,
      duration: "60 mins",
    },
    {
      title: "Bank PO Practice Test",
      questions: 80,
      duration: "45 mins",
    },
    {
      title: "UPSC Prelims Mock",
      questions: 120,
      duration: "2 hours",
    },
    {
      title: "Railway NTPC Test",
      questions: 90,
      duration: "60 mins",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-3">Practice Tests</h1>
        <p className="text-gray-600">
          Attempt mock tests and track your performance.
        </p>

        <div className="mt-6 flex items-center bg-white border rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
          <Search className="text-gray-400 mr-2" size={20} />
          <input
            type="text"
            placeholder="Search tests..."
            className="w-full outline-none"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {tests.map((test, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl border hover:shadow-xl hover:-translate-y-1 transition duration-300"
          >
            <h3 className="text-xl font-semibold mb-4">{test.title}</h3>

            <div className="space-y-3 text-gray-600 mb-6">
              <p className="flex items-center gap-2">
                <FileText size={18} className="text-blue-600" />
                {test.questions} Questions
              </p>

              <p className="flex items-center gap-2">
                <Clock size={18} className="text-blue-600" />
                {test.duration}
              </p>

              <p className="flex items-center gap-2">
                <Trophy size={18} className="text-blue-600" />
                Rank & Analysis
              </p>
            </div>

            <Link
              href="/login"
              className="block text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:opacity-90 transition"
            >
              Attempt Test
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}