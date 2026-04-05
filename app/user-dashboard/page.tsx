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

interface PurchasedTest {
  _id: string;
  testId: Test;
  purchasedAt: string;
  expiresAt: string;
  isCompleted: boolean;
}

export default function UserDashboard() {
  const router = useRouter();
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  const [purchasedTests, setPurchasedTests] = useState<PurchasedTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await API.get("/user/profile");

        const role = (data?.role || data?.user?.role)?.toString().toLowerCase();

        if (role === "admin") {
          router.replace("/admin-dashboard");
          return;
        }

        setUser(data);
        setIsAuthChecked(true);
      } catch (err) {
        console.error("User auth error:", err);
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!isAuthChecked) return;
    
    const loadData = async () => {
      try {
        const [availableRes, purchasedRes] = await Promise.all([
          API.get("/user/tests/available"),
          API.get("/user/tests/purchased"),
        ]);

        setAvailableTests(Array.isArray(availableRes.data) ? availableRes.data : []);
        setPurchasedTests(Array.isArray(purchasedRes.data) ? purchasedRes.data : []);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthChecked]);

  const handlePurchase = async (testId: string) => {
    setPurchasing(testId);
    try {
      await API.post(`/test/purchase/${testId}`);
      window.location.reload();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Purchase failed. Please try again.");
    } finally {
      setPurchasing(null);
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/user/logout");
    } finally {
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      router.replace("/login");
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome, {user?.name || user?.user?.name || "User"}!
          </h1>
          <p className="text-gray-400 mt-1">{user?.email || user?.user?.email || ""}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-sm text-gray-400">Available Tests</p>
            <p className="text-3xl font-bold mt-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{availableTests.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-sm text-gray-400">My Tests</p>
            <p className="text-3xl font-bold mt-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{purchasedTests.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-sm text-gray-400">Completed</p>
            <p className="text-3xl font-bold mt-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              {purchasedTests.filter((t) => t.isCompleted).length}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Available Tests</h2>
            {availableTests.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-gray-400">
                <p className="text-4xl mb-2">🎉</p>
                <p>You&apos;ve purchased all available tests!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableTests.map((test) => (
                  <div key={test._id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/40 transition">
                    <h3 className="font-semibold mb-2">{test.title}</h3>
                    {test.description && (
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{test.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>{test.totalQuestions || 0} Questions</span>
                      <span>{test.duration || 30} min</span>
                    </div>
                    <button
                      onClick={() => handlePurchase(test._id)}
                      disabled={purchasing === test._id}
                      className="w-full py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 font-medium"
                    >
                      {purchasing === test._id ? "Purchasing..." : test.price === 0 ? "Start Free" : `Buy ₹${test.price}`}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">My Tests</h2>
            {purchasedTests.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-gray-400">
                <p className="text-4xl mb-2">📚</p>
                <p>No tests purchased yet</p>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr className="text-left text-sm text-gray-400">
                        <th className="px-6 py-4 font-medium">Test</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Expires</th>
                        <th className="px-6 py-4 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {purchasedTests.map((item) => {
                        const test = item.testId;
                        const expired = isExpired(item.expiresAt);
                        return (
                          <tr key={item._id} className="hover:bg-white/5 transition">
                            <td className="px-6 py-4">
                              <p className="font-medium">{test?.title || "Unknown"}</p>
                              <p className="text-sm text-gray-400">{test?.totalQuestions || 0} Questions</p>
                            </td>
                            <td className="px-6 py-4">
                              {item.isCompleted ? (
                                <span className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/30 rounded-full text-xs font-medium">
                                  Completed
                                </span>
                              ) : expired ? (
                                <span className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-full text-xs font-medium">
                                  Expired
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full text-xs font-medium">
                                  Available
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-gray-400 text-sm">
                              {new Date(item.expiresAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {!item.isCompleted && !expired && (
                                <Link
                                  href={`/quiz/${test?._id}`}
                                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:opacity-90 transition text-sm font-medium"
                                >
                                  Start Quiz
                                </Link>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
