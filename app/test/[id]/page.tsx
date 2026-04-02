"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";

interface Test {
  _id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  totalQuestions: number;
}

export default function TestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [testRes, profileRes] = await Promise.all([
          fetch(`${API_URL}/test/${id}`),
          fetch(`${API_URL}/user/profile`, { credentials: "include" }),
        ]);

        if (testRes.ok) {
          setTest(await testRes.json());
        }

        if (profileRes.ok) {
          const data = await profileRes.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to load:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handlePurchase = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setPurchasing(true);
    try {
      const res = await fetch(`${API_URL}/test/purchase/${id}`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        router.push(`/quiz/${id}`);
      } else {
        const data = await res.json();
        alert(data.message || "Purchase failed");
      }
    } catch {
      alert("Purchase failed");
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-500 mb-4">Test not found</p>
          <Link href="/tests" className="text-blue-600 hover:underline">
            Back to Tests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">Quizaro</Link>
          <div className="flex gap-4">
            <Link href="/tests" className="text-gray-600 hover:text-blue-600 font-medium">All Tests</Link>
            {user ? (
              <Link href="/user-dashboard" className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>
            ) : (
              <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium">Login</Link>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{test.title}</h1>
          {test.description && <p className="text-gray-600 mb-6">{test.description}</p>}

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{test.totalQuestions || 0}</p>
              <p className="text-sm text-gray-500">Questions</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{test.duration || 30}</p>
              <p className="text-sm text-gray-500">Minutes</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{test.price === 0 ? "Free" : `₹${test.price}`}</p>
              <p className="text-sm text-gray-500">Price</p>
            </div>
          </div>

          <button
            onClick={handlePurchase}
            disabled={purchasing}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg disabled:opacity-50"
          >
            {purchasing ? "Processing..." : user ? (test.price === 0 ? "Start Test" : `Buy for ₹${test.price}`) : "Login to Start"}
          </button>
        </div>
      </main>
    </div>
  );
}
