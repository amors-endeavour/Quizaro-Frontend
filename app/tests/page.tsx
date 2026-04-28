"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

import API from "@/app/lib/api";
import { AlertCircle, CheckCircle2, BookOpen, Search, ArrowRight, Clock } from "lucide-react";

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
        <div className="text-center font-black text-cyan-400 tracking-widest uppercase animate-pulse leading-none text-xs">
           Initializing Intelligence Registry...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-600">
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-8 py-20 lg:py-32">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24 animate-in fade-in slide-in-from-top-10 duration-700">
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/20">
                    <BookOpen size={24} />
                 </div>
                 <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 uppercase italic">
                   {seriesTitle || "Intelligence Registry"}
                 </h1>
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] ml-1">
                {seriesId ? "Institutional Series Sequence" : "Complete Platform Assessment Catalog"}
              </p>
              {seriesId && isAuthenticated && (
                <button 
                  onClick={async () => {
                    try {
                      setLoading(true);
                      // Series enrollment logic here
                    } catch (err: any) {
                      setStatusMsg({ text: err?.response?.data?.message || "Series enrollment failed.", type: 'error' });
                      setTimeout(() => setStatusMsg(null), 3000);
                      setLoading(false);
                    }
                  }}
                  className="mt-10 px-12 py-5 bg-blue-600 text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/20 flex items-center gap-5 w-fit active:scale-95"
                >
                  Enroll in Intelligence Sequence
                  <ArrowRight size={18} />
                </button>
              )}
           </div>
           
           <div className="w-full md:w-[450px] relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Locate intelligence nodes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-[2.5rem] pl-16 pr-8 py-5 outline-none focus:border-blue-400 focus:bg-white transition-all font-bold text-sm text-gray-900 placeholder:text-gray-300 shadow-xl shadow-blue-900/5"
              />
           </div>
        </div>

        {filteredTests.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[4rem] border border-dashed border-gray-200 animate-pulse">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">No matching intellectual assets found in registry.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {filteredTests.map((test, idx) => (
              <div
                key={test._id}
                className="bg-white rounded-[3.5rem] border border-gray-100 p-12 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 group flex flex-col relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-100 transition-colors" />
                
                <div className="flex items-center gap-6 mb-10 relative z-10">
                   <div className="w-16 h-16 bg-gray-50 border border-gray-100 text-gray-400 rounded-3xl flex items-center justify-center font-black text-sm italic group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm">
                      {test.paperNumber ? `P${test.paperNumber}` : "★"}
                   </div>
                   <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors uppercase italic truncate">{test.title}</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-3 flex items-center gap-2">
                        <Clock size={12} className="text-blue-600" /> {test.duration || 30} Min Assessment
                      </p>
                   </div>
                </div>

                {test.description && (
                  <p className="text-gray-500 font-bold text-[12px] mb-10 line-clamp-2 leading-relaxed italic relative z-10">{test.description}</p>
                )}

                <div className="mt-auto pt-10 border-t border-gray-50 flex items-center justify-between relative z-10">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Nodes</span>
                      <span className="text-2xl font-black text-gray-900 tracking-tighter">{test.totalQuestions || 0}</span>
                   </div>

                   {test.price > 0 && (
                      <div className="flex flex-col items-end mr-4">
                         <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest leading-none mb-1">Registry Fee</span>
                         <span className="text-2xl font-black text-amber-600 tracking-tighter">₹{test.price}</span>
                      </div>
                   )}
                   
                   <button
                    onClick={() => handleLaunchPaper(test._id)}
                    className={`px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${test.price > 0 ? "bg-amber-600 text-white hover:bg-amber-700 shadow-amber-900/20" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-900/20"}`}
                   >
                    {!isAuthenticated ? "Authenticate" : test.price > 0 ? `Unlock Paper` : "Initialize Paper"}
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {statusMsg && (
        <div className={`fixed bottom-12 left-12 z-[300] px-10 py-6 rounded-[2.5rem] border shadow-2xl animate-in slide-in-from-left-10 duration-500 flex items-center gap-6 bg-white ${statusMsg.type === 'success' ? "border-green-100 text-green-600" : statusMsg.type === 'alert' ? "border-amber-100 text-amber-600" : "border-red-100 text-red-600"}`}>
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${statusMsg.type === 'success' ? "bg-green-50" : statusMsg.type === 'alert' ? "bg-amber-50" : "bg-red-50"}`}>
              {statusMsg.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
           </div>
           <p className="text-[11px] font-black uppercase tracking-widest leading-none italic">{statusMsg.text}</p>
        </div>
      )}
    </div>
  );
}
