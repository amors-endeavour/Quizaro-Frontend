"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";

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
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/user/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userRole");
          router.replace("/login");
          return;
        }

        const data = await res.json();
        
        const role = (data?.role)?.toString().toLowerCase();

        if (role === "admin") {
          router.replace("/admin-dashboard");
          return;
        }

        setUser(data);
        setIsAuthChecked(true);
      } catch (err) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!isAuthChecked) return;
    
    const token = localStorage.getItem("authToken");
    const authHeaders = {
      headers: { "Authorization": `Bearer ${token || ""}` }
    };

    const loadData = async () => {
      try {
        const [availableRes, purchasedRes] = await Promise.all([
          fetch(`${API_URL}/user/tests/available`, authHeaders),
          fetch(`${API_URL}/user/tests/purchased`, authHeaders),
        ]);

        if (!availableRes.ok || !purchasedRes.ok) {
          throw new Error("Failed to load data");
        }

        const availableData = await availableRes.json();
        const purchasedData = await purchasedRes.json();

        setAvailableTests(Array.isArray(availableData) ? availableData : []);
        setPurchasedTests(Array.isArray(purchasedData) ? purchasedData : []);
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
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/test/purchase/${testId}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token || ""}` },
      });

      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.message || "Purchase failed");
      }
    } catch {
      alert("Purchase failed. Please try again.");
    } finally {
      setPurchasing(null);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    router.replace("/login");
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-blue-600">
              Welcome, {user?.name || user?.user?.name || "User"}!
            </h1>
          </div>
          
          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/user-dashboard" className="text-blue-600 font-medium hover:text-blue-700">
              Dashboard
            </Link>
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link href="/tests" className="text-gray-600 hover:text-blue-600 font-medium">
              Tests
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 font-medium">
              Contact
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <span className="text-gray-600 hidden sm:block">
              {user?.email || user?.user?.email || ""}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 px-4 py-3 bg-white">
            <div className="flex flex-col gap-3">
              <Link href="/user-dashboard" className="text-blue-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
              <Link href="/" className="text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/tests" className="text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                Tests
              </Link>
              <Link href="/about" className="text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <Link href="/contact" className="text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">Available Tests</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{availableTests.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">My Tests</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{purchasedTests.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {purchasedTests.filter((t) => t.isCompleted).length}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Tests</h2>
            {availableTests.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
                <p className="text-4xl mb-2">🎉</p>
                <p>You&apos;ve purchased all available tests!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableTests.map((test) => (
                  <div key={test._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
                    <h3 className="font-semibold text-gray-900 mb-2">{test.title}</h3>
                    {test.description && (
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{test.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{test.totalQuestions || 0} Questions</span>
                      <span>{test.duration || 30} min</span>
                    </div>
                    <button
                      onClick={() => handlePurchase(test._id)}
                      disabled={purchasing === test._id}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
                    >
                      {purchasing === test._id ? "Purchasing..." : test.price === 0 ? "Start Free" : `Buy ₹${test.price}`}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Tests</h2>
            {purchasedTests.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
                <p className="text-4xl mb-2">📚</p>
                <p>No tests purchased yet</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr className="text-left text-sm text-gray-500">
                      <th className="px-6 py-4 font-medium">Test</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Expires</th>
                      <th className="px-6 py-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {purchasedTests.map((item) => {
                      const test = item.testId;
                      const expired = isExpired(item.expiresAt);
                      return (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">{test?.title || "Unknown"}</p>
                            <p className="text-sm text-gray-500">{test?.totalQuestions || 0} Questions</p>
                          </td>
                          <td className="px-6 py-4">
                            {item.isCompleted ? (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                Completed
                              </span>
                            ) : expired ? (
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                Expired
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                Available
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-sm">
                            {new Date(item.expiresAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {!item.isCompleted && !expired && (
                              <Link
                                href={`/quiz/${test?._id}`}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
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
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
