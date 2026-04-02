"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";

interface Result {
  _id: string;
  score: number;
  totalMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattempted: number;
  testId: {
    title: string;
  };
}

export default function ResultPage() {
  const router = useRouter();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`${API_URL}/user/attempts`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setResults(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const getPercentage = (score: number, total: number) => {
    if (!total) return 0;
    return Math.round((score / total) * 100);
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { label: "Excellent!", color: "text-green-600", bg: "bg-green-100", emoji: "🏆" };
    if (percentage >= 75) return { label: "Great Job!", color: "text-blue-600", bg: "bg-blue-100", emoji: "🎉" };
    if (percentage >= 60) return { label: "Good", color: "text-yellow-600", bg: "bg-yellow-100", emoji: "👍" };
    if (percentage >= 40) return { label: "Average", color: "text-orange-600", bg: "bg-orange-100", emoji: "📚" };
    return { label: "Keep Learning", color: "text-red-600", bg: "bg-red-100", emoji: "💪" };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-blue-600">Quizaro</h1>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Results</h1>

        {results.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <p className="text-4xl mb-4">📋</p>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Results Yet</h2>
            <p className="text-gray-500 mb-6">You haven&apos;t completed any tests yet.</p>
            <button
              onClick={() => router.push("/user-dashboard")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => {
              const percentage = getPercentage(result.score, result.totalMarks);
              const grade = getGrade(percentage);

              return (
                <div key={result._id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{result.testId?.title || "Test"}</h3>
                      <p className="text-sm text-gray-500 mt-1">Completed</p>

                      <div className="grid grid-cols-4 gap-4 mt-6">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{result.score}</p>
                          <p className="text-xs text-gray-500 mt-1">Score</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{result.correctAnswers}</p>
                          <p className="text-xs text-gray-500 mt-1">Correct</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-red-600">{result.wrongAnswers}</p>
                          <p className="text-xs text-gray-500 mt-1">Wrong</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-gray-600">{result.unattempted}</p>
                          <p className="text-xs text-gray-500 mt-1">Skipped</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center ml-6">
                      <div className={`w-24 h-24 rounded-full ${grade.bg} flex flex-col items-center justify-center`}>
                        <span className="text-2xl">{grade.emoji}</span>
                        <span className={`text-lg font-bold ${grade.color}`}>{percentage}%</span>
                      </div>
                      <p className={`mt-2 font-medium ${grade.color}`}>{grade.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/user-dashboard")}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
