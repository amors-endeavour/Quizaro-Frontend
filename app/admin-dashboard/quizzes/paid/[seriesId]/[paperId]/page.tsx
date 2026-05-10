"use client";

import { useParams, useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import useSWR from "swr";
import API from "@/app/lib/api";
import { 
  Loader2, 
  ChevronLeft, 
  ChevronRight,
  BookOpen, 
  CheckCircle2, 
  XCircle,
  Clock,
  Target,
  Trophy
} from "lucide-react";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  marks: number;
}

interface PaperDetails {
  id: string;
  title: string;
  subject: string;
  totalQuestions: number;
  duration: number;
  totalMarks: number;
  questions: Question[];
  status: string;
  seriesId: string;
}

export default function PaidPaperMCQView() {
  const params = useParams();
  const router = useRouter();
  const seriesId = params.seriesId as string;
  const paperId = params.paperId as string;

  const { data: paper, error } = useSWR<PaperDetails | null>(`/admin/quizzes/paid/${seriesId}/papers/${paperId}`, async (url: string) => {
    try {
      const res = await API.get(url);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch paper details:", err);
      return null;
    }
  });

  if (!paper && !error) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
        <AdminHeader title="Loading Paper..." path={[{ label: "Paid Quizzes" }, { label: "Series" }, { label: "Paper View" }]} />
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
           <Loader2 size={48} className="animate-spin text-purple-600" />
           <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic">Syncing with Governance Database...</p>
        </div>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
        <AdminHeader title="Error" path={[{ label: "Paid Quizzes" }, { label: "Series" }, { label: "Paper View" }]} />
        <div className="flex-1 flex flex-col items-center justify-center gap-8 p-12 text-center">
           <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center shadow-inner">
              <XCircle size={48} />
           </div>
           <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Assessment Not Found</h2>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic max-w-md">The requested paper record could not be retrieved from the central registry. It may have been purged or relocated.</p>
           </div>
           <button 
             onClick={() => router.back()}
             className="px-10 py-4 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest italic hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center gap-3"
           >
              <ChevronLeft size={16} /> Return to Series
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <AdminHeader 
        title={paper.title} 
        path={[
          { label: "Paid Quizzes", href: "/admin-dashboard/quizzes/paid" }, 
          { label: "Series Papers", href: `/admin-dashboard/quizzes/paid/${seriesId}` }, 
          { label: "Live View" }
        ]} 
      />

      <main className="p-8 lg:p-12 max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* PAPER HEADER STATS */}
        <section className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-10 flex flex-wrap items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-[1.5rem] flex items-center justify-center shadow-inner border border-purple-100">
                 <BookOpen size={32} />
              </div>
              <div className="space-y-1">
                 <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">{paper.title}</h1>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Governance ID: {paper.id} • Series: {seriesId}</p>
              </div>
           </div>
           
           <div className="flex items-center gap-12 bg-gray-50 px-10 py-6 rounded-3xl border border-gray-100 shadow-inner">
              <div className="text-center space-y-1">
                 <div className="flex items-center justify-center gap-2 text-gray-400 mb-1">
                    <Target size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest italic">MCQs</span>
                 </div>
                 <p className="text-xl font-black text-gray-900 italic leading-none">{paper.totalQuestions}</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center space-y-1">
                 <div className="flex items-center justify-center gap-2 text-gray-400 mb-1">
                    <Clock size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest italic">Mins</span>
                 </div>
                 <p className="text-xl font-black text-gray-900 italic leading-none">{paper.duration}</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center space-y-1">
                 <div className="flex items-center justify-center gap-2 text-gray-400 mb-1">
                    <Trophy size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest italic">Marks</span>
                 </div>
                 <p className="text-xl font-black text-gray-900 italic leading-none">{paper.totalMarks}</p>
              </div>
           </div>
        </section>

        {/* QUESTIONS LIST */}
        <section className="space-y-8">
           <div className="flex items-center justify-between px-4">
              <h2 className="text-[12px] font-black text-gray-400 uppercase tracking-widest italic">Question Bank Audit</h2>
              <div className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                paper.status === 'Published' ? "bg-green-50 text-green-600 border border-green-100" : "bg-yellow-50 text-yellow-600 border border-yellow-100"
              }`}>
                 <CheckCircle2 size={12} /> {paper.status}
              </div>
           </div>

           <div className="space-y-8">
              {paper.questions?.map((q, idx) => (
                <div key={q.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                   <div className="p-10 space-y-8">
                      <div className="flex items-start gap-8">
                         <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-black text-sm italic shadow-xl">
                            {idx + 1}
                         </div>
                         <div className="flex-1 space-y-8">
                            <div className="flex items-center justify-between">
                               <p className="text-lg font-black text-gray-900 uppercase tracking-tight italic leading-relaxed">{q.text}</p>
                               <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-4 py-2 rounded-xl italic">+{q.marks} Marks</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               {q.options.map((opt, i) => {
                                 const label = String.fromCharCode(65 + i);
                                 const isCorrect = label === q.correctAnswer;
                                 return (
                                   <div 
                                     key={i}
                                     className={`p-6 rounded-2xl border flex items-center gap-4 transition-all ${
                                       isCorrect ? "bg-green-50 border-green-200 shadow-sm" : "bg-gray-50/50 border-gray-100"
                                     }`}
                                   >
                                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black italic ${
                                        isCorrect ? "bg-green-500 text-white" : "bg-white text-gray-400 shadow-sm"
                                      }`}>
                                         {label}
                                      </span>
                                      <span className={`text-[13px] font-bold italic ${isCorrect ? "text-green-700" : "text-gray-600"}`}>
                                         {opt}
                                      </span>
                                   </div>
                                 );
                               })}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-center pt-12 pb-20 border-t border-gray-100">
           <button 
             onClick={() => router.push(`/admin-dashboard/quizzes/create-paper?id=${paperId}&seriesId=${seriesId}`)}
             className="px-12 py-5 bg-purple-600 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest italic shadow-xl shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
           >
              Enter Builder Mode <ChevronRight size={18} />
           </button>
        </div>
      </main>
    </div>
  );
}
