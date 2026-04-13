"use client";

import React, { useEffect, useState } from "react";
import { X, BarChart3, Users, AlertTriangle, CheckCircle2, TrendingDown } from "lucide-react";
import API from "@/app/lib/api";

interface QuestionStat {
  questionId: string;
  questionText: string;
  errorRate: number;
  totalAttempts: number;
  mostFrequentError: string;
}

interface AnalyticsModalProps {
  testId: string;
  testTitle: string;
  onClose: () => void;
}

export default function AnalyticsModal({ testId, testTitle, onClose }: AnalyticsModalProps) {
  const [stats, setStats] = useState<QuestionStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await API.get(`/admin/analytics/${testId}`);
        if (data.stats) {
          setStats(data.stats);
        } else if (Array.isArray(data)) {
          setStats(data);
        }
      } catch (err: any) {
        setError("Failed to load analytics engine data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [testId]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[3.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-500">
        
        {/* HEADER */}
        <div className="px-12 py-10 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                 <BarChart3 size={28} />
              </div>
              <div>
                 <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Institutional Intelligence</h3>
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                   Distractor Analysis & Error Rates: <span className="text-blue-600">{testTitle}</span>
                 </p>
              </div>
           </div>
           <button 
             onClick={onClose}
             className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 hover:shadow-lg transition-all"
           >
             <X size={24} />
           </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-6 opacity-30">
               <TrendingDown size={64} className="text-blue-600 animate-bounce" />
               <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Processing Performance Grid...</p>
            </div>
          ) : error ? (
            <div className="h-96 flex flex-col items-center justify-center gap-4 text-red-500">
               <AlertTriangle size={48} />
               <p className="font-black uppercase text-xs tracking-widest">{error}</p>
            </div>
          ) : stats.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center gap-6 opacity-40">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                  <BarChart3 size={40} />
               </div>
               <div className="text-center">
                  <p className="text-sm font-black text-gray-900 uppercase tracking-widest">No Intelligence Data</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">Requires completed student attempts to generate analysis</p>
               </div>
            </div>
          ) : (
            <div className="space-y-12">
               {/* OVERVIEW CARDS */}
               <div className="grid grid-cols-3 gap-8">
                  <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100/50">
                     <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Total Questions</p>
                     <h4 className="text-4xl font-black text-blue-900 tracking-tighter">{stats.length}</h4>
                  </div>
                  <div className="bg-red-50/50 p-8 rounded-[2.5rem] border border-red-100/50">
                     <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-2">Critical Failures</p>
                     <h4 className="text-4xl font-black text-red-900 tracking-tighter">
                        {stats.filter(s => s.errorRate > 50).length}
                     </h4>
                  </div>
                  <div className="bg-green-50/50 p-8 rounded-[2.5rem] border border-green-100/50">
                     <p className="text-[10px] font-black uppercase tracking-widest text-green-400 mb-2">Stable Content</p>
                     <h4 className="text-4xl font-black text-green-900 tracking-tighter">
                        {stats.filter(s => s.errorRate < 20).length}
                     </h4>
                  </div>
               </div>

               {/* DETAILED GRID */}
               <div className="space-y-6">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Question Performance Ledger</h3>
                  {stats.map((q, i) => (
                    <div key={q.questionId} className="group bg-gray-50/30 hover:bg-white border border-transparent hover:border-gray-100 p-8 rounded-[2.5rem] transition-all duration-500">
                       <div className="flex items-start justify-between gap-10">
                          <div className="flex-1 space-y-4">
                             <div className="flex items-center gap-3">
                                <span className="bg-gray-900 text-white text-[9px] font-black w-8 h-8 rounded-lg flex items-center justify-center">{i + 1}</span>
                                <h5 className="text-sm font-black text-gray-900 line-clamp-2 uppercase tracking-tight">{q.questionText}</h5>
                             </div>
                             
                             <div className="flex items-center gap-10 pt-2">
                                <div className="flex-1 space-y-3">
                                   <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                      <span className="text-gray-400">Failure Density</span>
                                      <span className={q.errorRate > 50 ? "text-red-500" : q.errorRate > 20 ? "text-orange-500" : "text-green-600"}>{q.errorRate}%</span>
                                   </div>
                                   <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full transition-all duration-1000 ${q.errorRate > 50 ? "bg-red-500" : q.errorRate > 20 ? "bg-orange-500" : "bg-green-600"}`}
                                        style={{ width: `${q.errorRate}%` }}
                                      />
                                   </div>
                                </div>
                                <div className="w-px h-10 bg-gray-100" />
                                <div className="space-y-1">
                                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Most Frequent Error</p>
                                   <p className={`text-[11px] font-black uppercase ${q.mostFrequentError !== "None" ? "text-red-600" : "text-gray-300"}`}>
                                      {q.mostFrequentError}
                                   </p>
                                </div>
                                <div className="w-px h-10 bg-gray-100" />
                                <div className="space-y-1">
                                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sampling Size</p>
                                   <div className="flex items-center gap-2 text-gray-900">
                                      <Users size={12} className="opacity-30" />
                                      <span className="text-[11px] font-black">{q.totalAttempts} Scouts</span>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-12 py-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end">
           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mr-auto">System Analysis Engine v4.0.1</p>
           <button 
             onClick={onClose}
             className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl active:scale-95"
           >
             Dismiss Analysis
           </button>
        </div>
      </div>
    </div>
  );
}
