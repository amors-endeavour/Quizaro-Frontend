"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

import API from "@/app/lib/api";

interface Test {
  _id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  totalQuestions: number;
}

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.get("/user/profile");
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const { data } = await API.get("/tests");
        setTests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch tests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const filteredTests = tests.filter((test) =>
    test.title.toLowerCase().includes(search.toLowerCase()) ||
    test.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-3">Practice Tests</h1>
        <p className="text-gray-400 mb-8">
          Attempt mock tests and track your performance.
        </p>

        <div className="mb-12 flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500">
          <input
            type="text"
            placeholder="Search tests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent text-white placeholder-gray-500"
          />
        </div>

        {filteredTests.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📝</p>
            <p className="text-gray-400 text-lg">No tests available yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <div
                key={test._id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition duration-300"
              >
                <h3 className="text-xl font-semibold mb-3">{test.title}</h3>
                {test.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{test.description}</p>
                )}
                <div className="space-y-2 text-gray-400 text-sm mb-6">
                  <p>{test.totalQuestions || 0} Questions</p>
                  <p>{test.duration || 30} minutes</p>
                </div>
                <Link
                  href={isAuthenticated ? `/quiz/${test._id}` : "/login"}
                  className="block text-center bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-3 rounded-xl hover:opacity-90 transition font-medium"
                >
                  {isAuthenticated ? "Start Test" : "Login to Attempt"}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
