"use client";

import { useEffect, useState } from "react";
import API from "@/app/lib/api";

interface Attempt {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  testId: {
    _id: string;
    title: string;
  };
  score: number;
  totalMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  submittedAt: string;
}

export default function AttemptsPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [testFilter, setTestFilter] = useState("all");

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const { data } = await API.get("/admin/attempts");
        setAttempts(data);
      } catch (err) {
        console.error("Failed to fetch attempts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  const uniqueTests = [...new Set(attempts.map((a) => a.testId?._id))].filter(Boolean);

  const filteredAttempts = attempts.filter((attempt) => {
    const matchesSearch = 
      attempt.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      attempt.userId?.email?.toLowerCase().includes(search.toLowerCase());
    const matchesTest = testFilter === "all" || attempt.testId?._id === testFilter;
    return matchesSearch && matchesTest;
  });

  const getPercentage = (score: number, total: number) => {
    if (!total) return 0;
    return Math.round((score / total) * 100);
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 80) return { label: "Excellent", color: "text-green-600", bg: "bg-green-100" };
    if (percentage >= 60) return { label: "Good", color: "text-blue-600", bg: "bg-blue-100" };
    if (percentage >= 40) return { label: "Average", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { label: "Poor", color: "text-red-600", bg: "bg-red-100" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading attempts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attempts</h1>
          <p className="text-gray-500 mt-1">View all test attempt history</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
          <span className="text-gray-500">Total: </span>
          <span className="font-bold text-gray-900">{attempts.length}</span>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by user name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={testFilter}
          onChange={(e) => setTestFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Tests</option>
          {uniqueTests.map((testId) => {
            const test = attempts.find((a) => a.testId?._id === testId);
            return (
              <option key={testId} value={testId}>
                {test?.testId?.title || "Unknown Test"}
              </option>
            );
          })}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredAttempts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-4">📋</p>
            <p>No attempts found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Test</th>
                <th className="px-6 py-4 font-medium">Score</th>
                <th className="px-6 py-4 font-medium">Result</th>
                <th className="px-6 py-4 font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAttempts.map((attempt) => {
                const percentage = getPercentage(attempt.score, attempt.totalMarks);
                const grade = getGrade(percentage);
                return (
                  <tr key={attempt._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{attempt.userId?.name || "N/A"}</p>
                        <p className="text-sm text-gray-500">{attempt.userId?.email || "N/A"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {attempt.testId?.title || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {attempt.score}/{attempt.totalMarks}
                        </p>
                        <p className="text-xs text-gray-500">
                          {attempt.correctAnswers} correct, {attempt.wrongAnswers} wrong
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${grade.bg} ${grade.color}`}>
                          {percentage}%
                        </span>
                        <span className={`text-xs font-medium ${grade.color}`}>
                          {grade.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(attempt.submittedAt).toLocaleDateString()}
                      <br />
                      <span className="text-xs">
                        {new Date(attempt.submittedAt).toLocaleTimeString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
