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
  LogOut,
  Zap
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
  questionTimer?: number;
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
  const [isExiting, setIsExiting] = useState(false);

  const [questionTimeLeft, setQuestionTimeLeft] = useState<number | null>(null);

  const handleQuestionChange = (nextIndex: number) => {
    setIsExiting(true);
    setTimeout(() => {
      setCurrentQuestion(nextIndex);
      setIsExiting(false);
      
      // RESET QUESTION TIMER 🔥
      if (test?.questionTimer && test.questionTimer > 0) {
        setQuestionTimeLeft(test.questionTimer);
      }
    }, 200);
  };

  useEffect(() => {
    if (test?.questionTimer && questionTimeLeft === null) {
      setQuestionTimeLeft(test.questionTimer);
    }
  }, [test, questionTimeLeft]);

  useEffect(() => {
    if (questionTimeLeft === null || questionTimeLeft <= 0 || loading) return;

    const qTimer = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev && prev > 0) return prev - 1;
        
        // AUTO ADVANCE ON TIMEOUT 🔥
        if (prev === 1) {
          if (currentQuestion < questions.length - 1) {
            handleQuestionChange(currentQuestion + 1);
          } else {
            handleSubmit();
          }
        }
        return 0;
      });
    }, 1000);

    return () => clearInterval(qTimer);
  }, [questionTimeLeft, loading, currentQuestion, questions.length]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [testRes, questionsRes, statusRes] = await Promise.all([
          API.get(`/test/${id}`),
          API.get(`/questions/${id}`),
          API.get(`/user/test/status/${id}`)
        ]);

        const testData = testRes.data;
        const questionsData = questionsRes.data;
        const statusData = statusRes.data;

        setTest(testData);
        setQuestions(questionsData);

        // PERSISTENCE LOGIC 🔥
        if (statusData.purchased) {
          if (statusData.timeRemaining !== null) {
            setTimeLeft(statusData.timeRemaining);
          } else {
            setTimeLeft((testData.duration || 30) * 60);
          }

          if (statusData.draftAnswers?.length > 0) {
            const restoredAnswers: Record<string, number> = {};
            statusData.draftAnswers.forEach((ans: any) => {
              restoredAnswers[ans.questionId] = ans.selectedOption;
            });
            setAnswers(restoredAnswers);
          }
        }
      } catch (err: any) {
        console.error("Quiz load failed:", err);
        const msg = err?.response?.data?.message || err.message || "Failed to load clinical quiz data";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // PERIODIC PROGRESS SYNC 🔥
  useEffect(() => {
    if (loading || submitting || timeLeft <= 0) return;

    const syncInterval = setInterval(async () => {
      try {
        const answersArray = questions.map((q) => ({
          questionId: q._id,
          selectedOption: answers[q._id] ?? -1,
        }));

        await API.post(`/user/test/sync/${id}`, {
          testId: id,
          timeRemaining: timeLeft,
          draftAnswers: answersArray
        });
      } catch (err) {
        console.error("Progress sync failed:", err);
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(syncInterval);
  }, [id, timeLeft, answers, questions, loading, submitting]);

  // FIGMA ALIGNMENT: Proctoring & Anti-Cheating
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleCopyPaste = (e: ClipboardEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ["c", "v", "x", "s", "p"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if (e.key === "F12") e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 && !loading && questions.length > 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
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
      const answersArray = questions.map((q) => {
        const localIndex = answers[q._id];
        // If localIndex exists, find originalIndex from the options array
        const selectedOption = localIndex !== undefined 
          ? (q.options[localIndex] as any)?.originalIndex ?? localIndex 
          : -1;

        return {
          questionId: q._id,
          selectedOption: selectedOption,
        };
      });

      const { data } = await API.post(`/test/submit/${id}`, {
        answers: answersArray,
      });

      const attemptId = data?.attemptId || data?.result?.attemptId || data?._id || data?.data?.attemptId || "";
      router.push(`/result?attemptId=${attemptId}`);
    } catch (err: any) {
      console.error("Quiz submission failed:", err);
      const msg = err?.response?.data?.message || err.message || "Platform connection error. Please try again.";
      alert(msg);
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
                  onClick={() => handleQuestionChange(idx)}
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
              
              <div 
                key={currentQuestion}
                className={`bg-white rounded-[3rem] border border-gray-100 shadow-[0_30px_70px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 ${isExiting ? "opacity-0 translate-x-10 scale-95" : "animate-in fade-in slide-in-from-left-10 duration-700"}`}
              >
                 {/* Question Header */}
                 <div className="px-12 py-8 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl">Question {currentQuestion + 1}</span>
                       <div className="w-px h-6 bg-gray-200" />
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Multiple Choice Question</span>
                    </div>
                    <div className="flex items-center gap-3">
                       {questionTimeLeft !== null && test?.questionTimer && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-100 mr-4">
                             <Zap size={14} className="text-amber-600 animate-pulse" />
                             <span className="text-[10px] font-black text-amber-600 uppercase tabular-nums">{questionTimeLeft}s Left</span>
                          </div>
                       )}
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
                   onClick={() => handleQuestionChange(Math.max(0, currentQuestion - 1))}
                   disabled={currentQuestion === 0}
                   className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-gray-100 rounded-[2rem] text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-blue-200 hover:text-blue-600 disabled:opacity-0 transition-all active:scale-95"
                 >
                   <ChevronLeft size={16} />
                   Previous Question
                 </button>

                 {currentQuestion < questions.length - 1 ? (
                   <button
                     onClick={() => handleQuestionChange(currentQuestion + 1)}
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

      {/* FIGMA STYLE #2: Persistent Support HUD */}
      <div className="fixed bottom-8 right-8 z-[100]">
         <button className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 hover:bg-gray-50 transition-all group">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
               <Info size={16} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-900 transition-colors">Report Technical Issue</span>
         </button>
      </div>

    </div>
  );
}
