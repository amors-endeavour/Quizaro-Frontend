"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";

interface Result {
  _id: string;
  score: number;
  totalMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattempted: number;
  testId: {
    _id: string;
    title: string;
  };
  submittedAt: string;
}

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");

  const [result, setResult] = useState<Result | null>(null);
  const [allResults, setAllResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`${API_URL}/user/attempts`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch results");
        }

        const data = await res.json();
        const resultsArray = Array.isArray(data) ? data : [];
        setAllResults(resultsArray);

        if (attemptId) {
          const specificResult = resultsArray.find((r: Result) => r._id === attemptId);
          if (specificResult) {
            setResult(specificResult);
          } else if (resultsArray.length > 0) {
            setResult(resultsArray[0]);
          }
        } else if (resultsArray.length > 0) {
          setResult(resultsArray[0]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [attemptId]);

  const getPercentage = (score: number, total: number) => {
    if (!total) return 0;
    return Math.round((score / total) * 100);
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { label: "Excellent!", color: "text-green-400", bg: "bg-green-500/10 border-green-500/30", emoji: "🏆" };
    if (percentage >= 75) return { label: "Great Job!", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30", emoji: "🎉" };
    if (percentage >= 60) return { label: "Good", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", emoji: "👍" };
    if (percentage >= 40) return { label: "Average", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30", emoji: "📚" };
    return { label: "Keep Learning", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", emoji: "💪" };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-4xl mb-4">⚠️</p>
            <h2 className="text-xl font-bold mb-2">Unable to Load Results</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => router.push("/user-dashboard")}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg hover:opacity-90 transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayResult = result;

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {displayResult ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">{displayResult.testId?.title || "Test Result"}</h1>
              <p className="text-gray-400">
                {displayResult.submittedAt ? new Date(displayResult.submittedAt).toLocaleDateString() : "Completed"}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <p className="text-3xl font-bold text-blue-400">{displayResult.score}</p>
                      <p className="text-xs text-gray-400 mt-1">Score</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <p className="text-3xl font-bold text-green-400">{displayResult.correctAnswers}</p>
                      <p className="text-xs text-gray-400 mt-1">Correct</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <p className="text-3xl font-bold text-red-400">{displayResult.wrongAnswers}</p>
                      <p className="text-xs text-gray-400 mt-1">Wrong</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <p className="text-3xl font-bold text-gray-400">{displayResult.unattempted}</p>
                      <p className="text-xs text-gray-400 mt-1">Skipped</p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  {(() => {
                    const percentage = getPercentage(displayResult.score, displayResult.totalMarks);
                    const grade = getGrade(percentage);
                    return (
                      <>
                        <div className={`w-28 h-28 rounded-full ${grade.bg} border flex flex-col items-center justify-center`}>
                          <span className="text-3xl">{grade.emoji}</span>
                          <span className={`text-xl font-bold ${grade.color}`}>{percentage}%</span>
                        </div>
                        <p className={`mt-3 font-medium ${grade.color}`}>{grade.label}</p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Link
                href="/user-dashboard"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl font-medium hover:opacity-90 transition"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={() => router.push("/tests")}
                className="px-6 py-3 border border-white/20 rounded-xl font-medium hover:bg-white/5 transition"
              >
                Take Another Test
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📋</p>
            <h2 className="text-xl font-bold mb-2">No Results Yet</h2>
            <p className="text-gray-400 mb-6">You haven&apos;t completed any tests yet.</p>
            <button
              onClick={() => router.push("/user-dashboard")}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg hover:opacity-90 transition"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {allResults.length > 1 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Previous Results</h2>
            <div className="space-y-3">
              {allResults
                .filter((r) => r._id !== displayResult?._id)
                .map((r) => {
                  const percentage = getPercentage(r.score, r.totalMarks);
                  const grade = getGrade(percentage);
                  return (
                    <div
                      key={r._id}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{r.testId?.title || "Test"}</p>
                        <p className="text-sm text-gray-400">
                          {r.correctAnswers} correct, {r.wrongAnswers} wrong
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${grade.color}`}>{percentage}%</p>
                        <p className="text-xs text-gray-400">
                          {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#050816]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
