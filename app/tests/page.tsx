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
  seriesId?: string;
  paperNumber?: number;
}

export default function TestsPage() {
  const router = useRouter();
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const seriesId = searchParams?.get("seriesId");
  
  const [tests, setTests] = useState<Test[]>([]);
  const [seriesTitle, setSeriesTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        if (seriesId) {
          const { data } = await API.get(`/series/${seriesId}`);
          setSeriesTitle(data.series.title);
          setTests(data.papers);
        } else {
          const { data } = await API.get("/tests");
          setTests(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch library context:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContext();
  }, [seriesId]);

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

  const filteredTests = tests.filter((test) =>
    test.title.toLowerCase().includes(search.toLowerCase()) ||
    test.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="text-center font-black text-blue-500 tracking-widest uppercase animate-pulse">
           Initializing Intelligence Registry...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-gray-900 font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
           <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tighter text-gray-900 uppercase">
                {seriesTitle || "Global Paper Registry"}
              </h1>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em]">
                {seriesId ? "Institutional Series Sequence" : "Complete Platform Assessment Catalog"}
              </p>
           </div>
           
           <div className="w-full md:w-96 relative">
              <input
                type="text"
                placeholder="Locate specific papers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-3xl px-8 py-5 outline-none focus:border-blue-400 focus:shadow-2xl focus:shadow-blue-50/50 transition-all font-bold text-sm"
              />
           </div>
        </div>

        {filteredTests.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <p className="text-xs font-black text-gray-300 uppercase tracking-widest">No matching assessment items found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredTests.map((test) => (
              <div
                key={test._id}
                className="bg-white rounded-[2.5rem] border border-gray-100 p-10 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500 group flex flex-col"
              >
                <div className="flex items-center gap-5 mb-8">
                   <div className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center font-black text-xs font-mono group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                      {test.paperNumber ? `P${test.paperNumber}` : "★"}
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-gray-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors uppercase">{test.title}</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 italic">{test.duration || 30} Min Assessment</p>
                   </div>
                </div>

                {test.description && (
                  <p className="text-gray-500 font-bold text-[11px] mb-8 line-clamp-2 leading-relaxed italic">{test.description}</p>
                )}

                <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Questions</span>
                      <span className="text-lg font-black text-gray-900 tracking-tighter">{test.totalQuestions || 0}</span>
                   </div>
                   
                   <button
                    onClick={() => router.push(isAuthenticated ? `/quiz/${test._id}` : "/user-login")}
                    className="px-10 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                   >
                    {isAuthenticated ? "Launch Paper" : "Authenticate to Begin"}
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
