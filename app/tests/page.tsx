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
  const [statusMsg, setStatusMsg] = useState<{text: string, type: 'success' | 'alert' | 'error'} | null>(null);

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

  const handleLaunchPaper = async (testId: string) => {
    if (!isAuthenticated) {
      router.push("/user-login");
      return;
    }
    try {
      setLoading(true);
      // Attempt auto-registration if it's an institutional/free catalog
      await API.post(`/test/purchase/${testId}`);
      router.push(`/quiz/${testId}`);
    } catch (err: any) {
      if (err.response?.status === 402) {
         setStatusMsg({ text: "Premium Paper: Transaction or manual administrative clearance required.", type: 'alert' });
         setTimeout(() => setStatusMsg(null), 5000);
      } else if (err.response?.status === 400) {
         // Already purchased, just redirect
         router.push(`/quiz/${testId}`);
         return;
      } else {
         setStatusMsg({ text: "System Handshake Failed: Registry access restricted.", type: 'error' });
         setTimeout(() => setStatusMsg(null), 3000);
      }
      setLoading(false);
    }
  }

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
              {seriesId && isAuthenticated && (
                <button 
                  onClick={async () => {
                    try {
                      setLoading(true);
                    } catch (err: any) {
                      setStatusMsg({ text: err?.response?.data?.message || "Series enrollment failed.", type: 'error' });
                      setTimeout(() => setStatusMsg(null), 3000);
                      setLoading(false);
                    }
                  }}
                  className="mt-6 px-10 py-4 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition shadow-2xl shadow-blue-100 flex items-center gap-3 w-fit"
                >
                  <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">✓</div>
                  Enroll in Full Series Sequence
                </button>
              )}
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

                   {/* PRICE BADGE 🔥 */}
                   {test.price > 0 && (
                      <div className="flex flex-col items-end">
                         <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Access Fee</span>
                         <span className="text-lg font-black text-amber-600 tracking-tighter">₹{test.price}</span>
                      </div>
                   )}
                   
                   <button
                    onClick={() => handleLaunchPaper(test._id)}
                    className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${test.price > 0 ? "bg-amber-600 text-white hover:bg-amber-700 shadow-amber-50" : "bg-gray-900 text-white hover:bg-blue-600 shadow-gray-100"}`}
                   >
                    {!isAuthenticated ? "Authenticate to Begin" : test.price > 0 ? `Unlock Paper` : "Launch Paper"}
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* INSTITUTIONAL STATUS HUD 🔥 */}
      {statusMsg && (
        <div className={`fixed bottom-10 left-10 z-[300] px-8 py-5 rounded-[2rem] border shadow-2xl animate-in slide-in-from-left-10 duration-500 flex items-center gap-4 ${statusMsg.type === 'success' ? "bg-white border-green-100 text-green-600" : statusMsg.type === 'alert' ? "bg-white border-amber-100 text-amber-600" : "bg-white border-red-100 text-red-600"}`}>
           <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${statusMsg.type === 'success' ? "bg-green-50" : statusMsg.type === 'alert' ? "bg-amber-50" : "bg-red-50"}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest leading-none">{statusMsg.text}</p>
        </div>
      )}
    </div>
  );
}
