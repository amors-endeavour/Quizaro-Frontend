"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import useSWR from "swr";
import API from "@/app/lib/api";
import { 
  BookOpen, 
  Clock, 
  Target, 
  ChevronLeft, 
  Loader2,
  CheckCircle2,
  XCircle
} from "lucide-react";

interface MCQ {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
}

interface QuizDetails {
  id: string;
  name: string;
  subject: string;
  duration: number;
  questions: MCQ[];
}

export default function UnpaidMCQView() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId;

  const { data: quiz, error } = useSWR<QuizDetails | null>(`/admin/quizzes/unpaid/${quizId}`, async (url: string) => {
    try {
      const res = await API.get(url);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch assessment details:", err);
      return null;
    }
  });

  if (!quiz && !error) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={48} />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <AdminHeader title="Quiz Not Found" path={[{ label: "Unpaid Quizzes", href: "/admin-dashboard/quizzes/unpaid" }, { label: "View" }]} />
        <main className="p-12 text-center space-y-6">
           <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
              <XCircle size={48} />
           </div>
           <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Assessment Not Found</h2>
           <button onClick={() => router.back()} className="px-8 py-3 bg-gray-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest italic">Go Back</button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <AdminHeader 
        title={quiz.name} 
        path={[{ label: "Unpaid Quizzes", href: "/admin-dashboard/quizzes/unpaid" }, { label: "MCQ View" }]} 
      />

      <main className="p-8 lg:p-12 max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* QUIZ INFO BAR */}
        <div className="bg-[#111827] rounded-[2.5rem] p-10 flex flex-wrap items-center justify-between gap-8 text-white shadow-2xl">
           <div className="space-y-1">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic">Assessment Title</p>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">{quiz.name}</h1>
           </div>
           <div className="flex items-center gap-12">
              <div className="space-y-1 text-center">
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic">Subject</p>
                 <p className="text-sm font-black uppercase italic text-purple-400">{quiz.subject}</p>
              </div>
              <div className="w-px h-10 bg-gray-800" />
              <div className="space-y-1 text-center">
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic">Duration</p>
                 <p className="text-sm font-black uppercase italic">{quiz.duration} Min</p>
              </div>
           </div>
        </div>

        {/* QUESTIONS LIST */}
        <section className="space-y-8">
           {quiz.questions.map((q, index) => (
             <div key={q.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-10 space-y-8 hover:shadow-md transition-all">
                <div className="flex items-start gap-6">
                   <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-black text-sm italic border border-purple-100">
                      {index + 1}
                   </div>
                   <div className="flex-1 space-y-8">
                      <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight italic leading-snug">{q.text}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {q.options.map((opt) => (
                           <div 
                             key={opt.id} 
                             className={`p-6 rounded-2xl border flex items-center gap-4 transition-all ${
                               q.correctAnswer === opt.id 
                                 ? "bg-green-50 border-green-200" 
                                 : "bg-gray-50 border-gray-50"
                             }`}
                           >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[12px] italic ${
                                q.correctAnswer === opt.id ? "bg-green-500 text-white" : "bg-white text-gray-400 border border-gray-100"
                              }`}>
                                 {opt.id}
                              </div>
                              <p className={`text-[13px] font-bold italic ${q.correctAnswer === opt.id ? "text-green-700" : "text-gray-600"}`}>
                                 {opt.text}
                              </p>
                              {q.correctAnswer === opt.id && <CheckCircle2 className="ml-auto text-green-500" size={18} />}
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
           ))}
        </section>

        <div className="flex justify-center pt-8">
           <button onClick={() => router.back()} className="px-12 py-5 bg-white border border-gray-100 rounded-2xl text-[11px] font-black text-gray-500 uppercase tracking-widest italic hover:bg-gray-50 transition-all flex items-center gap-3 shadow-sm">
              <ChevronLeft size={16} /> Return to Registry
           </button>
        </div>
      </main>
    </div>
  );
}
