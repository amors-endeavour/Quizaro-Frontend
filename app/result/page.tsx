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

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col items-center justify-center font-black text-gray-400 animate-pulse tracking-widest uppercase text-[10px]">
      <div className="w-12 h-12 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin mb-6"></div>
      Synthesizing Institutional <br/> Intelligence Report...
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8f9fc] text-gray-900 font-sans overflow-hidden selection:bg-blue-100 selection:text-blue-600">
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} userName={user?.name || "Student"} />

      <main className="flex-1 overflow-y-auto">
        <UserHeader 
          title="Performance Analysis" 
          breadcrumbs={["Intelligence", "Analysis", result?.testId?.title || "Report"]} 
        />

        <div className="p-10 lg:p-14 max-w-[1500px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
           
           {/* PERFORMANCE HUD */}
           <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-blue-900/5 p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50" />
              
              <div className="flex-1 space-y-10 z-10 w-full md:w-auto">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl flex items-center justify-center shadow-sm">
                       <Trophy size={32} />
                    </div>
                    <div>
                       <h2 className="text-3xl font-black text-gray-900 leading-none tracking-tighter capitalize italic">{result?.testId?.title}</h2>
                       <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-3 italic">Institutional Intelligence Report</p>
                    </div>
                 </div>

                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-10">
                     <div className="space-y-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aggregate Score</span>
                        <p className="text-3xl font-black text-gray-900 leading-none">{result?.score}<span className="text-sm text-gray-300 ml-2">/ {result?.totalMarks}</span></p>
                     </div>
                     <div className="space-y-2 group">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Accuracy Level</span>
                        <p className="text-3xl font-black text-blue-600 leading-none group-hover:scale-105 transition-transform origin-left">{percentage}%</p>
                     </div>
                     <div className="space-y-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Temporal Usage</span>
                        <p className="text-3xl font-black text-gray-900 leading-none">
                           {result?.timeTaken ? Math.floor(result.timeTaken / 60) : "0"}
                           <span className="text-sm text-gray-300 ml-2 italic lowercase font-black">mins</span>
                        </p>
                     </div>
                      <div className="space-y-2">
                         <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Merit Grade</span>
                         <p className="text-3xl font-black text-blue-600 leading-none">
                            {percentage >= 90 ? "S" : 
                             percentage >= 80 ? "A+" : 
                             percentage >= 70 ? "A" : 
                             percentage >= 55 ? "B" : 
                             percentage >= 40 ? "C" : "F"}
                         </p>
                      </div>
                      <div className="space-y-2 group">
                         <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Global Stand</span>
                         <p className="text-4xl font-black text-amber-600 leading-none group-hover:scale-105 transition-transform origin-left">#{result?.rank || "N/A"}</p>
                      </div>
                  </div>
              </div>

               <div className="relative flex-shrink-0">
                  <div className="w-60 h-60 rounded-full border-[14px] border-gray-50 flex items-center justify-center relative shadow-inner">
                     <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                           cx="120"
                           cy="120"
                           r="106"
                           fill="none"
                           stroke="#2563eb"
                           strokeWidth="14"
                           strokeDasharray={2 * Math.PI * 106}
                           strokeDashoffset={2 * Math.PI * 106 * (1 - percentage / 100)}
                           strokeLinecap="round"
                           className="transition-all duration-1000 ease-out"
                        />
                     </svg>
                     <div className="flex flex-col items-center">
                        <span className="text-6xl font-black tracking-tighter text-gray-900 leading-none">{percentage}%</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-3 italic">{percentage >= 60 ? "Threshold Satisfied" : "Revision Advised"}</span>
                     </div>
                  </div>
               </div>
            </div>

           {/* STATS BREAKDOWN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-blue-900/5 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 border border-blue-100 rounded-[1.5rem] flex items-center justify-center mb-10 transition-transform group-hover:rotate-12 group-hover:scale-110">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                     <h3 className="text-4xl font-black text-gray-900 leading-none tracking-tighter italic">{result?.correctAnswers}</h3>
                     <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-4 leading-relaxed">Precision Verifications</p>
                  </div>
               </div>

               <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-blue-900/5 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500">
                  <div className="w-16 h-16 bg-red-50 text-red-600 border border-red-100 rounded-[1.5rem] flex items-center justify-center mb-10 transition-transform group-hover:rotate-12 group-hover:scale-110">
                    <AlertCircle size={28} />
                  </div>
                  <div>
                     <h3 className="text-4xl font-black text-gray-900 leading-none tracking-tighter italic">{result?.wrongAnswers}</h3>
                     <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-4 leading-relaxed">Divergent Solutions</p>
                  </div>
               </div>

               <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-blue-900/5 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500">
                  <div className="w-16 h-16 bg-gray-50 text-gray-400 border border-gray-100 rounded-[1.5rem] flex items-center justify-center mb-10 transition-transform group-hover:rotate-12 group-hover:scale-110">
                    <BarChart3 size={28} />
                  </div>
                  <div>
                     <h3 className="text-4xl font-black text-gray-900 leading-none tracking-tighter italic">{result?.unattempted}</h3>
                     <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-4 leading-relaxed">Incomplete Sequences</p>
                  </div>
               </div>
            </div>

            {/* ACTION HUB */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
               <button 
                 onClick={() => router.push("/user-dashboard")}
                 className="group flex items-center gap-5 px-12 py-6 bg-blue-600 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-blue-900/10 hover:bg-blue-700 transition-all active:scale-95"
               >
                  Return Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </button>
               <button 
                 onClick={() => setShowReview(!showReview)}
                 className={`flex items-center gap-5 px-12 py-6 rounded-3xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 border-2 ${
                   showReview 
                     ? "bg-blue-50 border-blue-600 text-blue-600" 
                     : "bg-white border-gray-100 text-gray-400 hover:border-blue-600 hover:text-blue-600"
                 }`}
               >
                  {showReview ? "Condense Review" : "Analytical Review"}
                  <ChevronRight size={18} className={showReview ? "rotate-90 transition-transform" : "transition-transform"} />
               </button>
               <button 
                 onClick={handleDownloadPDF}
                 className="group flex items-center gap-4 px-12 py-6 bg-white border-2 border-gray-100 text-amber-600 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:border-amber-600 transition-all active:scale-95"
               >
                  Export Report <Download size={18} className="group-hover:-translate-y-1 transition-transform" />
               </button>
             </div>

            {/* Detailed Answer Analysis Section */}
            {showReview && result?.answers && (
              <div className="space-y-10 animate-in fade-in slide-in-from-top-10 duration-700">
                <div className="flex items-center justify-between px-8 pt-12">
                   <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Clinical Node Breakdown</h3>
                   <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded-full bg-blue-600" />
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Correct Protocol</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded-full bg-red-500" />
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Logic Variance</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-8">
                  {result.answers.map((ans, idx) => (
                    <div key={idx} className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-blue-900/5 overflow-hidden">
                      <div className="px-12 py-8 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Intelligence Node {idx + 1}</span>
                        {ans.isCorrect ? (
                          <div className="flex items-center gap-2 px-5 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <CheckCircle2 size={16} /> Pattern Match
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-5 py-2 bg-red-50 text-red-600 border border-red-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <AlertCircle size={16} /> Divergent Logic
                          </div>
                        )}
                      </div>
                      <div className="p-12 lg:p-16 space-y-10">
                        <h4 className="text-2xl font-black text-gray-900 leading-tight italic">{ans.questionText}</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {ans.options.map((opt, optIdx) => {
                            const isUserSelected = ans.selectedOption === optIdx;
                            const isCorrect = ans.correctOption === optIdx;
                            
                            return (
                              <div 
                                key={optIdx}
                                className={`p-7 rounded-[2rem] border-2 transition-all ${
                                  isCorrect 
                                    ? "bg-blue-50 border-blue-200 text-blue-900" 
                                    : isUserSelected 
                                    ? "bg-red-50 border-red-200 text-red-900"
                                    : "bg-gray-50 border-gray-50 text-gray-400"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-6">
                                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                                      isCorrect ? "bg-blue-600 text-white" : isUserSelected ? "bg-red-600 text-white" : "bg-white border border-gray-100 text-gray-400"
                                    }`}>
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span className="text-base font-black uppercase tracking-tight italic">{opt.text}</span>
                                  </div>
                                  {isCorrect && <CheckCircle2 size={18} className="text-blue-600" />}
                                  {isUserSelected && !isCorrect && <AlertCircle size={18} className="text-red-600" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {ans.explanation && (
                          <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-3">
                               <Zap size={16} /> Intelligence Insight
                            </p>
                            <p className="text-sm text-blue-900 font-bold leading-relaxed italic">
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
           
           <div className="text-center py-20 opacity-20 flex flex-col items-center gap-4">
              <div className="w-16 h-1 bg-gray-300 rounded-full" />
              <p className="text-[10px] font-black uppercase tracking-widest">End of Intelligence Scorecard</p>
           </div>
        </div>
      </main>

      <LeaderboardSidebar />
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center font-black text-gray-400 uppercase tracking-widest animate-pulse leading-none text-center text-[10px]">
        Accessing Institutional <br/> Intelligence Vault...
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
