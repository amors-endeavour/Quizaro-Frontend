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
  Clock
} from "lucide-react";
import API from "@/app/lib/api";

interface Result {
  _id: string;
  score: number;
  totalMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattempted: number;
  testId: {
    _id: string;
    title: string;
  };
  submittedAt: string;
}

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");

  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

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
        const res = await API.get("/user/attempts");
        const resultsArray = Array.isArray(res.data) ? res.data : [];

        if (attemptId) {
          const specificResult = resultsArray.find((r: Result) => r._id === attemptId);
          setResult(specificResult || resultsArray[0]);
        } else if (resultsArray.length > 0) {
          setResult(resultsArray[0]);
        }
      } catch (err: any) {
        setError("Failed to load clinical scorecard");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [attemptId]);

  const percentage = result ? Math.round((result.score / result.totalMarks) * 100) : 0;

  if (loading) return <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center font-black text-blue-600 animate-pulse tracking-widest uppercase">Generating Scorecard...</div>;

  return (
    <div className="flex h-screen bg-[#f8f9fc] text-gray-900 font-sans overflow-hidden selection:bg-blue-500/30">
      <UserSidebar userName={user?.name || "Student"} />

      <main className="flex-1 overflow-y-auto">
        <UserHeader 
          title="Examination Performance" 
          breadcrumbs={["Classroom", "Performance", result?.testId?.title || "Scorecard"]} 
        />

        <div className="p-8 lg:p-14 max-w-[1500px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
           
           {/* PERFORMANCE HUD (IMAGE #1 Style) */}
           <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50" />
              
              <div className="flex-1 space-y-8 z-10 w-full md:w-auto">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-100/50 text-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-50">
                       <Trophy size={28} />
                    </div>
                    <div>
                       <h2 className="text-3xl font-black text-gray-900 leading-none tracking-tighter capitalize">{result?.testId?.title}</h2>
                       <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">Institutional Report Scorecard</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-1">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Secure Score</span>
                       <p className="text-3xl font-black text-gray-900 leading-none">{result?.score}<span className="text-sm text-gray-300 ml-1">/ {result?.totalMarks}</span></p>
                    </div>
                    <div className="space-y-1 group">
                       <span className="text-[10px] font-black text-green-500/50 uppercase tracking-widest">Accuracy Level</span>
                       <p className="text-3xl font-black text-green-600 leading-none group-hover:scale-110 transition-transform origin-left">{percentage}%</p>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time Taken</span>
                       <p className="text-3xl font-black text-gray-900 leading-none">12<span className="text-sm text-gray-300 ml-1">mins</span></p>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Performance Grade</span>
                       <p className="text-3xl font-black text-blue-700 leading-none">{percentage >= 80 ? "A+" : percentage >= 60 ? "B" : "C"}</p>
                    </div>
                 </div>
              </div>

              <div className="relative flex-shrink-0">
                 <div className="w-56 h-56 rounded-full border-[12px] border-gray-50 flex items-center justify-center relative shadow-2xl shadow-gray-100">
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
                       <span className="text-5xl font-black tracking-tighter text-gray-900 leading-none">{percentage}%</span>
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{percentage >= 60 ? "Qualified" : "Practice Needed"}</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* STATS BREAKDOWN (IMAGE #1 Style Analytics) */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500">
                 <div className="w-16 h-16 bg-green-50 text-green-600 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-green-50 mb-8 transition-transform group-hover:rotate-12">
                   <CheckCircle2 size={28} />
                 </div>
                 <div>
                    <h3 className="text-4xl font-black text-gray-900 leading-none tracking-tighter">{result?.correctAnswers}</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-3">Correct Responses</p>
                 </div>
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500">
                 <div className="w-16 h-16 bg-red-50 text-red-500 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-red-50 mb-8 transition-transform group-hover:rotate-12">
                   <AlertCircle size={28} />
                 </div>
                 <div>
                    <h3 className="text-4xl font-black text-gray-900 leading-none tracking-tighter">{result?.wrongAnswers}</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-3">Incorrect Responses</p>
                 </div>
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500">
                 <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-gray-50 mb-8 transition-transform group-hover:rotate-12">
                   <BarChart3 size={28} />
                 </div>
                 <div>
                    <h3 className="text-4xl font-black text-gray-900 leading-none tracking-tighter">{result?.unattempted}</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-3">Skipped / Unattempted</p>
                 </div>
              </div>
           </div>

           {/* ACTION HUB */}
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
              <button 
                onClick={() => router.push("/user-dashboard")}
                className="group flex items-center gap-4 px-12 py-5 bg-gray-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-black transition-all active:scale-95"
              >
                 <ArrowRight size={18} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                 Continue Learning
              </button>
              <button 
                onClick={() => router.push("/user-dashboard")}
                className="flex items-center gap-4 px-12 py-5 bg-white border-2 border-gray-100 rounded-3xl font-black text-xs uppercase tracking-widest text-gray-400 hover:border-blue-200 hover:text-blue-600 transition-all active:scale-95"
              >
                 Detailed Answer Analysis
                 <ChevronRight size={18} />
              </button>
           </div>
           
           <div className="text-center py-10 opacity-30 flex flex-col items-center gap-2">
              <div className="w-12 h-1 bg-gray-200 rounded-full" />
              <p className="text-[10px] font-black uppercase tracking-widest">End of Scorecard Report</p>
           </div>
        </div>
      </main>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center font-black text-blue-600 uppercase tracking-widest animate-pulse leading-none">Accessing Clinical Records...</div>}>
      <ResultContent />
    </Suspense>
  );
}
