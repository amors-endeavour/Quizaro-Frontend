"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import UserSidebar from "@/components/UserSidebar";
import UserHeader from "@/components/UserHeader";
import { 
  Trophy, 
  Target, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  BarChart3,
  Calendar,
  Clock,
  Download
} from "lucide-react";
import API from "@/app/lib/api";
import LeaderboardSidebar from "@/components/LeaderboardSidebar";

interface Result {
  _id: string;
  score: number;
  totalMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattempted: number;
  timeTaken?: number;
  percentage?: number;
  rank?: number;
  testId: {
    _id: string;
    title: string;
  };
  submittedAt: string;
  answers?: Array<{
    questionId: string;
    questionText: string;
    options: Array<{ text: string }>;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
    explanation?: string;
  }>;
}

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");

  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [showReview, setShowReview] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await API.get("/user/profile");
        setUser(data?.user || data);
      } catch {
        router.replace("/user-login");
      }
    };
    loadProfile();
  }, [router]);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        if (attemptId) {
          // FIGMA: Get detailed result including answers and rank
          const { data } = await API.get(`/result/${attemptId}`);
          setResult(data);
        } else {
          // Fallback to latest attempt
          const res = await API.get("/user/attempts");
          const resultsArray = Array.isArray(res.data) ? res.data : [];
          if (resultsArray.length > 0) {
            setResult(resultsArray[0]);
          }
        }
      } catch (err: any) {
        console.error("Result fetch error:", err);
        setError("Clinical analysis unavailable at this time.");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [attemptId]);

  const percentage = result?.totalMarks ? Math.round((result.score / result.totalMarks) * 100) : 0;

  const handleDownloadPDF = async () => {
    if (!result?._id) return;
    try {
      const response = await API.get(`/result/${result._id}/export`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Scorecard_${result?.testId?.title || "Test"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      alert("Failed to download PDF scorecard.");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050816] flex items-center justify-center font-black text-cyan-400 animate-pulse tracking-widest uppercase text-center">Synthesizing Institutional <br/> Intelligence Report...</div>;

  return (
    <div className="flex h-screen bg-[#050816] text-white font-sans overflow-hidden selection:bg-cyan-500/30">
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} userName={user?.name || "Student"} />

      {/* Floating Logo Trigger */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-6 left-6 z-[100] group transition-all duration-500 active:scale-95"
      >
        <div className="bg-white rounded-2xl p-2 shadow-2xl border border-gray-100 flex items-center justify-center group-hover:shadow-blue-500/20 group-hover:border-blue-500/50 transition-all">
          <img src="/logo.png" alt="Quizaro" className="w-10 h-10 object-contain" />
        </div>
      </button>

      <main className="flex-1 overflow-y-auto">
        <UserHeader 
          title="Intelligence Scorecard" 
          breadcrumbs={["Intelligence", "Analysis", result?.testId?.title || "Report"]} 
        />

        <div className="p-8 lg:p-14 max-w-[1500px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
           
           {/* PERFORMANCE HUD (IMAGE #1 Style) */}
           <div className="bg-white/5 rounded-[3rem] border border-white/10 shadow-2xl p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden backdrop-blur-3xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50" />
              
              <div className="flex-1 space-y-8 z-10 w-full md:w-auto">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-cyan-400 border border-cyan-400/20 rounded-2xl flex items-center justify-center shadow-lg shadow-black/20">
                       <Trophy size={28} />
                    </div>
                    <div>
                       <h2 className="text-3xl font-black text-white leading-none tracking-tighter capitalize italic">{result?.testId?.title}</h2>
                       <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-2 italic">Institutional Intelligence Report</p>
                    </div>
                 </div>

                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
                     <div className="space-y-1">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Secure Score</span>
                        <p className="text-3xl font-black text-white leading-none">{result?.score}<span className="text-sm text-gray-600 ml-1">/ {result?.totalMarks}</span></p>
                     </div>
                     <div className="space-y-1 group">
                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Accuracy Level</span>
                        <p className="text-3xl font-black text-cyan-400 leading-none group-hover:scale-110 transition-transform origin-left drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">{percentage}%</p>
                     </div>
                     <div className="space-y-1">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Time Taken</span>
                        <p className="text-3xl font-black text-white leading-none">
                           {result?.timeTaken ? Math.floor(result.timeTaken / 60) : "0"}
                           <span className="text-sm text-gray-600 ml-1 italic lowercase">mins</span>
                        </p>
                     </div>
                      <div className="space-y-1">
                         <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Performance Grade</span>
                         <p className="text-3xl font-black text-blue-400 leading-none">
                            {percentage >= 90 ? "S" : 
                             percentage >= 80 ? "A+" : 
                             percentage >= 70 ? "A" : 
                             percentage >= 55 ? "B" : 
                             percentage >= 40 ? "C" : "F"}
                         </p>
                      </div>
                      <div className="space-y-1 group">
                         <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Global Rank</span>
                         <p className="text-4xl font-black text-amber-500 leading-none group-hover:scale-110 transition-transform origin-left drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">#{result?.rank || "N/A"}</p>
                      </div>
                  </div>
              </div>

               <div className="relative flex-shrink-0">
                  <div className="w-56 h-56 rounded-full border-[12px] border-white/5 flex items-center justify-center relative shadow-2xl shadow-black/40">
                     <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                           cx="112"
                           cy="112"
                           r="100"
                           fill="none"
                           stroke="url(#blue_grad)"
                           strokeWidth="12"
                           strokeDasharray={2 * Math.PI * 100}
                           strokeDashoffset={2 * Math.PI * 100 * (1 - percentage / 100)}
                           strokeLinecap="round"
                           className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                           <linearGradient id="blue_grad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#2563eb" />
                              <stop offset="100%" stopColor="#06b6d4" />
                           </linearGradient>
                        </defs>
                     </svg>
                     <div className="flex flex-col items-center">
                        <span className="text-5xl font-black tracking-tighter text-white leading-none drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">{percentage}%</span>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2 italic">{percentage >= 60 ? "Threshold Met" : "Revision Required"}</span>
                     </div>
                  </div>
               </div>
            </div>

           {/* STATS BREAKDOWN (IMAGE #1 Style Analytics) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500 backdrop-blur-md">
                  <div className="w-16 h-16 bg-cyan-600/10 text-cyan-400 border border-cyan-400/20 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-cyan-950/20 mb-8 transition-transform group-hover:rotate-12 group-hover:scale-110">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                     <h3 className="text-4xl font-black text-white leading-none tracking-tighter italic">{result?.correctAnswers}</h3>
                     <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-3">Correct Verifications</p>
                  </div>
               </div>

               <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500 backdrop-blur-md">
                  <div className="w-16 h-16 bg-red-400/10 text-red-400 border border-red-400/20 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-red-950/20 mb-8 transition-transform group-hover:rotate-12 group-hover:scale-110">
                    <AlertCircle size={28} />
                  </div>
                  <div>
                     <h3 className="text-4xl font-black text-white leading-none tracking-tighter italic">{result?.wrongAnswers}</h3>
                     <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-3">Incorrect Divergences</p>
                  </div>
               </div>

               <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500 backdrop-blur-md">
                  <div className="w-16 h-16 bg-white/5 text-gray-500 border border-white/5 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-black/20 mb-8 transition-transform group-hover:rotate-12 group-hover:scale-110">
                    <BarChart3 size={28} />
                  </div>
                  <div>
                     <h3 className="text-4xl font-black text-white leading-none tracking-tighter italic">{result?.unattempted}</h3>
                     <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-3">Unmapped Nodes</p>
                  </div>
               </div>
            </div>

            {/* ACTION HUB */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
               <button 
                 onClick={() => router.push("/user-dashboard")}
                 className="group flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-[0_15px_40px_rgba(37,99,235,0.4)] hover:scale-105 transition-all active:scale-95 border border-white/10"
               >
                  <ArrowRight size={18} className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  Neural Dashboard
               </button>
               <button 
                 onClick={() => setShowReview(!showReview)}
                 className={`flex items-center gap-4 px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 border-2 ${
                   showReview 
                     ? "bg-cyan-600 border-cyan-400 text-white shadow-xl shadow-cyan-900/40" 
                     : "bg-white/5 border-white/10 text-gray-500 hover:border-cyan-400/30 hover:text-white"
                 }`}
               >
                  {showReview ? "Collapse Breakdown" : "Analytical Review"}
                  <ChevronRight size={18} className={showReview ? "rotate-90 transition-transform" : "transition-transform"} />
               </button>
               <button 
                 onClick={handleDownloadPDF}
                 className="group flex items-center gap-3 px-10 py-5 bg-white/5 text-amber-500 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-amber-500/10 rotate-0 hover:-rotate-1 transition-all active:scale-95 border border-amber-500/20 shadow-2xl shadow-black/20"
               >
                  <Download size={18} className="group-hover:-translate-y-1 transition-transform" />
                  Export Intelligence
               </button>
             </div>

            {/* FIGMA: Detailed Answer Analysis Section */}
            {showReview && result?.answers && (
              <div className="space-y-8 animate-in fade-in slide-in-from-top-10 duration-700">
                <div className="flex items-center justify-between px-6 pt-10">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Clinical Node Breakdown</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Correct Node</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Logic Gap</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {result.answers.map((ans, idx) => (
                    <div key={idx} className="bg-white/5 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-md">
                      <div className="px-10 py-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Intelligence Node {idx + 1}</span>
                        {ans.isCorrect ? (
                          <div className="flex items-center gap-2 px-4 py-1.5 bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                            <CheckCircle2 size={14} /> Pattern Match
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-4 py-1.5 bg-red-400/10 text-red-400 border border-red-400/20 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                            <AlertCircle size={14} /> Divergent Logic
                          </div>
                        )}
                      </div>
                      <div className="p-10 space-y-8">
                        <h4 className="text-xl font-black text-white leading-tight italic">{ans.questionText}</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {ans.options.map((opt, optIdx) => {
                            const isUserSelected = ans.selectedOption === optIdx;
                            const isCorrect = ans.correctOption === optIdx;
                            
                            return (
                              <div 
                                key={optIdx}
                                className={`p-5 rounded-2xl border-2 transition-all ${
                                  isCorrect 
                                    ? "bg-cyan-600/10 border-cyan-400/30 text-cyan-100" 
                                    : isUserSelected 
                                    ? "bg-red-400/10 border-red-400/30 text-red-100"
                                    : "bg-white/5 border-white/5 text-gray-500"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                                      isCorrect ? "bg-cyan-600 text-white" : isUserSelected ? "bg-red-600 text-white" : "bg-white/5 text-gray-600"
                                    }`}>
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span className="text-sm font-bold uppercase tracking-tight italic">{opt.text}</span>
                                  </div>
                                  {isCorrect && <CheckCircle2 size={16} className="text-cyan-400" />}
                                  {isUserSelected && !isCorrect && <AlertCircle size={16} className="text-red-400" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {ans.explanation && (
                          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                               <Zap size={14} className="animate-pulse" /> Intelligence Insight
                            </p>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed italic">
                              {ans.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
           
           <div className="text-center py-10 opacity-30 flex flex-col items-center gap-2">
              <div className="w-12 h-1 bg-gray-200 rounded-full" />
              <p className="text-[10px] font-black uppercase tracking-widest">End of Scorecard Report</p>
           </div>
        </div>
      </main>

      {/* FIGMA IMAGE #1: Competitive Social Layer */}
      <LeaderboardSidebar />
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050816] flex items-center justify-center font-black text-cyan-400 uppercase tracking-widest animate-pulse leading-none text-center">Accessing Institutional <br/> Intelligence Vault...</div>}>
      <ResultContent />
    </Suspense>
  );
}
