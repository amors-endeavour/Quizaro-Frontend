"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

import API from "@/app/lib/api";
import { AlertCircle, CheckCircle2 } from "lucide-react";

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
    <div className="min-h-screen bg-[#050816] text-white font-sans selection:bg-cyan-500/30">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 animate-in fade-in slide-in-from-top-10 duration-700">
           <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase italic">
                {seriesTitle || "Intelligence Registry"}
              </h1>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.4em] italic mb-2">
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
                  className="mt-6 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-[0_15px_40px_rgba(37,99,235,0.3)] flex items-center gap-4 w-fit border border-white/10"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center shadow-lg">✓</div>
                  Enroll in Intelligence Sequence
                </button>
              )}
           </div>
           
           <div className="w-full md:w-96 relative group">
              <input
                type="text"
                placeholder="Locate intelligence nodes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 outline-none focus:border-cyan-400/50 focus:bg-white/10 focus:shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-all font-bold text-sm text-white placeholder:text-gray-600 shadow-2xl shadow-black/20"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-cyan-400 transition-colors">
                <AlertCircle size={18} />
              </div>
           </div>
        </div>

        {filteredTests.length === 0 ? (
          <div className="text-center py-40 bg-white/5 rounded-[4rem] border border-dashed border-white/10 animate-pulse">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">No matching intellectual assets found in registry.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {filteredTests.map((test) => (
              <div
                key={test._id}
                className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/5 p-10 hover:border-cyan-400/30 hover:shadow-[0_30px_70px_rgba(0,0,0,0.5)] transition-all duration-500 group flex flex-col relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex items-center gap-5 mb-8 relative z-10">
                   <div className="w-14 h-14 bg-white/5 border border-white/5 text-gray-500 rounded-2xl flex items-center justify-center font-black text-xs font-mono group-hover:bg-cyan-600 group-hover:text-white group-hover:border-cyan-400 transition-all shadow-xl group-hover:shadow-cyan-900/40">
                      {test.paperNumber ? `P${test.paperNumber}` : "★"}
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-white tracking-tight leading-none group-hover:text-cyan-400 transition-colors uppercase italic">{test.title}</h3>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2 italic">{test.duration || 30} Min Assessment</p>
                   </div>
                </div>

                {test.description && (
                  <p className="text-gray-400 font-bold text-[11px] mb-8 line-clamp-2 leading-relaxed italic relative z-10">{test.description}</p>
                )}

                <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Nodes</span>
                      <span className="text-lg font-black text-white tracking-tighter">{test.totalQuestions || 0}</span>
                   </div>

                   {/* PRICE BADGE 🔥 */}
                   {test.price > 0 && (
                      <div className="flex flex-col items-end">
                         <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Registry Fee</span>
                         <span className="text-lg font-black text-amber-500 tracking-tighter drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">₹{test.price}</span>
                      </div>
                   )}
                   
                   <button
                    onClick={() => handleLaunchPaper(test._id)}
                    className={`px-10 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95 border border-white/10 ${test.price > 0 ? "bg-amber-600 text-white hover:bg-amber-700 shadow-amber-950/20" : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:scale-105 shadow-blue-900/20"}`}
                   >
                    {!isAuthenticated ? "Authenticate" : test.price > 0 ? `Unlock Paper` : "Initialize Paper"}
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* INSTITUTIONAL STATUS HUD 🔥 */}
      {statusMsg && (
        <div className={`fixed bottom-10 left-10 z-[300] px-8 py-5 rounded-[2rem] border shadow-2xl animate-in slide-in-from-left-10 duration-500 flex items-center gap-4 backdrop-blur-xl ${statusMsg.type === 'success' ? "bg-white/5 border-cyan-400/20 text-cyan-400" : statusMsg.type === 'alert' ? "bg-white/5 border-amber-400/20 text-amber-400" : "bg-white/5 border-red-400/20 text-red-500"}`}>
           <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${statusMsg.type === 'success' ? "bg-cyan-400/10" : statusMsg.type === 'alert' ? "bg-amber-400/10" : "bg-red-400/10"}`}>
              {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest leading-none italic">{statusMsg.text}</p>
        </div>
      )}
    </div>
  );
}
