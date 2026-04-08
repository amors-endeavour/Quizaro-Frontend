"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Play,
  FileText,
  Info,
  LogOut
} from "lucide-react";
import API from "@/app/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";

interface Option {
  _id?: string;
  text: string;
}

interface Question {
  _id: string;
  questionText: string;
  options: Option[];
}

interface Test {
  _id: string;
  title: string;
  duration: number;
}

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [testRes, questionsRes] = await Promise.all([
          fetch(`${API_URL}/test/${id}`, { credentials: "include" }),
          fetch(`${API_URL}/questions/${id}`, { credentials: "include" }),
        ]);

        if (!testRes.ok || !questionsRes.ok) {
          throw new Error("Failed to load clinical quiz data");
        }

        const testData = await testRes.json();
        const questionsData = await questionsRes.json();

        setTest(testData);
        setQuestions(questionsData);
        setTimeLeft((testData.duration || 30) * 60);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0 && !loading && questions.length > 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, questions.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const answersArray = questions.map((q) => ({
        questionId: q._id,
        selectedOption: answers[q._id] ?? -1,
      }));

      const res = await fetch(`${API_URL}/test/submit/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ answers: answersArray }),
      });

      if (res.ok) {
        const data = await res.json();
        const attemptId = data?.attemptId || data?.result?.attemptId || data?._id || "";
        router.push(`/result?attemptId=${attemptId}`);
      } else {
        const data = await res.json();
        alert(data.message || "Final Submission failed");
        setSubmitting(false);
      }
    } catch {
      alert("Platform connection error. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white flex flex-col items-center justify-center font-black text-blue-600 animate-pulse tracking-widest uppercase">Initializing Secure Environment...</div>;

  if (error) return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-8">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-gray-200 text-center max-w-lg border border-gray-100">
         <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-50">
           <AlertCircle size={32} />
         </div>
         <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Access Error</h2>
         <p className="text-gray-500 font-bold mb-8 italic">{error}</p>
         <button onClick={() => router.push("/user-dashboard")} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition">Return Dashboard</button>
      </div>
    </div>
  );

  const question = questions[currentQuestion];
  const progress = ((Object.keys(answers).length) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-gray-900 font-sans flex flex-col overflow-hidden selection:bg-blue-500/30">
      
      {/* PROFESSIONAL EXAMINATION HEADER */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 z-30 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-6">
           <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-black text-xl">Q</div>
           <div>
              <h1 className="text-xs font-black text-gray-900 uppercase tracking-widest">{test?.title}</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Institutional Paper-01</p>
           </div>
        </div>

        <div className="flex items-center gap-10">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Answered Progress</span>
              <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
           </div>

           <div className={`px-8 py-3 rounded-2xl border-2 flex items-center gap-4 transition-all duration-500 ${timeLeft < 300 ? "bg-red-50 border-red-100 text-red-600 animate-pulse" : "bg-gray-50 border-gray-100 text-gray-700"}`}>
              <Clock size={20} className={timeLeft < 300 ? "text-red-500" : "text-blue-600"} />
              <div className="flex flex-col">
                 <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Time Remaining</span>
                 <span className="text-lg font-mono font-black tracking-tighter leading-none">{formatTime(timeLeft)}</span>
              </div>
           </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT NAVIGATOR (SIDEBAR STYLE IMAGE #3) */}
        <aside className="w-80 bg-white border-r border-gray-100 overflow-y-auto hidden lg:block p-8">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Question Palette</h3>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black">{questions.length} Items</span>
           </div>

           <div className="grid grid-cols-4 gap-3">
              {questions.map((q, idx) => (
                <button
                  key={q._id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-full aspect-square rounded-2xl font-black text-xs transition-all duration-300 flex items-center justify-center border-2 ${
                    idx === currentQuestion 
                      ? "bg-blue-600 text-white border-blue-100 shadow-xl shadow-blue-100 scale-110 z-10" 
                      : answers[q._id] !== undefined
                      ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
                      : "bg-gray-50 text-gray-400 border-gray-50 hover:bg-gray-100"
                  }`}
                >
                  {(idx + 1).toString().padStart(2, "0")}
                </button>
              ))}
           </div>

           <div className="mt-12 p-6 bg-blue-50/50 rounded-[2.5rem] border border-blue-50 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-[11px] font-bold text-gray-600">Answered: {Object.keys(answers).length}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                <span className="text-[11px] font-bold text-gray-600">Unanswered: {questions.length - Object.keys(answers).length}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="text-[11px] font-bold text-gray-600 font-black uppercase tracking-widest">Active Question</span>
              </div>
           </div>

           <div className="mt-auto pt-10">
              <button 
                onClick={() => { if(confirm("End current session and return dashboard?")) router.push("/user-dashboard"); }}
                className="w-full flex items-center gap-4 px-6 py-4 text-red-400 hover:bg-red-50 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest"
              >
                 <LogOut size={18} />
                 Terminate Session
              </button>
           </div>
        </aside>

        {/* MAIN EXAMINATION AREA */}
        <section className="flex-1 overflow-y-auto p-12 lg:px-24 scroll-smooth">
           <div className="max-w-4xl mx-auto space-y-12">
              
              <div className="bg-white rounded-[3rem] border border-gray-100 shadow-[0_30px_70px_rgba(0,0,0,0.03)] overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-700">
                 {/* Question Header */}
                 <div className="px-12 py-8 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl">Question {currentQuestion + 1}</span>
                       <div className="w-px h-6 bg-gray-200" />
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Multiple Choice Question</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <CheckCircle2 size={18} className={answers[question?._id] !== undefined ? "text-green-500" : "text-gray-200"} />
                    </div>
                 </div>

                 {/* Question Body */}
                 <div className="p-12 lg:p-16">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-[1.2] mb-14 selection:bg-blue-500 selection:text-white">
                       {question?.questionText}
                    </h2>

                    <div className="space-y-4">
                       {question?.options.map((opt, i) => (
                         <button
                           key={i}
                           onClick={() => handleAnswerSelect(question._id, i)}
                           className={`w-full group flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all duration-300 transform-gpu active:scale-[0.98] ${
                             answers[question._id] === i
                               ? "bg-blue-600 border-blue-100 text-white shadow-2xl shadow-blue-200 translate-x-3"
                               : "bg-white border-gray-50 text-gray-600 hover:border-blue-200 hover:bg-gray-50"
                           }`}
                         >
                           <div className="flex items-center gap-6">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300 ${
                                answers[question._id] === i
                                  ? "bg-white/20 text-white"
                                  : "bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600"
                              }`}>
                                {String.fromCharCode(65 + i)}
                              </div>
                              <span className="text-base font-black uppercase tracking-tight italic line-clamp-2 md:line-clamp-none">
                                {opt.text}
                              </span>
                           </div>
                           <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                             answers[question._id] === i ? "border-white bg-white text-blue-600" : "border-gray-100 group-hover:border-blue-200"
                           }`}>
                             {answers[question._id] === i && <CheckCircle2 size={14} strokeWidth={4} />}
                           </div>
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between px-4">
                 <button
                   onClick={() => setCurrentQuestion((p) => Math.max(0, p - 1))}
                   disabled={currentQuestion === 0}
                   className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-gray-100 rounded-[2rem] text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-blue-200 hover:text-blue-600 disabled:opacity-0 transition-all active:scale-95"
                 >
                   <ChevronLeft size={16} />
                   Previous Question
                 </button>

                 {currentQuestion < questions.length - 1 ? (
                   <button
                     onClick={() => setCurrentQuestion((p) => p + 1)}
                     className="group flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2rem] text-[10px] font-black text-white uppercase tracking-widest shadow-2xl shadow-blue-100 hover:scale-105 transition-all active:scale-95"
                   >
                     Next Question
                     <ChevronRight size={16} />
                   </button>
                 ) : (
                   <button
                     onClick={handleSubmit}
                     disabled={submitting}
                     className="px-12 py-5 bg-green-600 text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-green-100 animate-bounce hover:animate-none hover:bg-green-700 transition-all"
                   >
                     {submitting ? "Processing Final Submission..." : "Complete & Close Test"}
                   </button>
                 )}
              </div>
           </div>
        </section>
      </div>

    </div>
  );
}
