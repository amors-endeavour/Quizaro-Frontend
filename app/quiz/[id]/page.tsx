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
  Zap,
  Bookmark,
  Flag,
  Lightbulb,
  Eye,
  EyeOff,
  Star,
  X,
  Activity,
  Shield,
  Layers,
  Award
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
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [questionTimeLeft, setQuestionTimeLeft] = useState<number | null>(null);

  // Guest Mode State
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guestScore, setGuestScore] = useState(0);

  // Engagement States
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0);
  const [showAntiCheatHUD, setShowAntiCheatHUD] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleQuestionChange = (nextIndex: number) => {
    setIsExiting(true);
    setTimeout(() => {
      setCurrentQuestion(nextIndex);
      setIsExiting(false);
      
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
        let questionsData = questionsRes.data;
        const statusData = statusRes.data;

        if (testData.shuffleQuestions) {
           for (let i = questionsData.length - 1; i > 0; i--) {
               const j = Math.floor(Math.random() * (i + 1));
               [questionsData[i], questionsData[j]] = [questionsData[j], questionsData[i]];
           }
        }

        setTest(testData);
        setQuestions(questionsData);

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
        const msg = err?.response?.data?.message || err.message || "Failed to load institutional quiz data";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

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
    }, 10000);

    return () => clearInterval(syncInterval);
  }, [id, timeLeft, answers, questions, loading, submitting]);

  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.error("Fullscreen denial:", err);
      }
    };
    enterFullscreen();

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
    const handleVisibilityChange = () => {
      if (document.hidden && !loading && !submitting) {
        setTabSwitchWarnings(prev => {
          const next = prev + 1;
          setShowAntiCheatHUD(true);
          setTimeout(() => setShowAntiCheatHUD(false), 4000);
          if (next >= 3) {
            setSubmitting(true);
            handleSubmit();
          }
          return next;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [loading, submitting]);

  const toggleBookmark = (questionId: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      next.has(questionId) ? next.delete(questionId) : next.add(questionId);
      return next;
    });
  };

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
        const selectedOption = localIndex !== undefined 
          ? (q.options[localIndex] as any)?.originalIndex ?? localIndex 
          : -1;

        return {
          questionId: q._id,
          selectedOption: selectedOption,
        };
      });

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token === "guest_session") {
        let correctAnswers = 0;
        answersArray.forEach(ans => {
           const question = questions.find(q => q._id === ans.questionId);
           if (question) {
              const selectedOriginal = ans.selectedOption;
              const isCorrectFlag = (question.options as any).find((o: any) => o.originalIndex === selectedOriginal && o.isCorrect === true);
              if (selectedOriginal !== -1 && isCorrectFlag) {
                 correctAnswers++;
              }
           }
        });
        
        const finalScore = correctAnswers * 4;
        
        sessionStorage.setItem('guestAttempt', JSON.stringify({
           testId: id,
           answers: answersArray,
           score: finalScore,
           totalMarks: questions.length * 4
        }));
        setGuestScore(finalScore);
        setShowGuestModal(true);
        setSubmitting(false);
        return;
      }

      const { data } = await API.post(`/test/submit/${id}`, {
        answers: answersArray,
      });

      const attemptId = data?.attemptId || data?.result?.attemptId || data?._id || data?.data?.attemptId || "";
      router.push(`/result?attemptId=${attemptId}`);
    } catch (err: any) {
      console.error("Quiz submission failed:", err);
      const msg = err?.response?.data?.message || err.message || "Institutional network error. Please try again.";
      setSubmitError(msg);
      setTimeout(() => setSubmitError(null), 5000);
      setSubmitting(false);
    }
  };

  if (loading && questions.length === 0) return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex flex-col items-center justify-center space-y-8 transition-colors duration-300">
      <div className="w-20 h-20 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin shadow-sm" />
      <p className="font-black animate-pulse text-blue-600 dark:text-blue-400 uppercase tracking-[0.5em] text-[10px] italic leading-none text-center">
        Initializing Secure Intelligence <br/> Examination Environment...
      </p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex items-center justify-center p-12 transition-colors duration-300">
      <div className="bg-white dark:bg-[#0a0f29] p-16 rounded-[4.5rem] shadow-sm text-center max-w-2xl border-2 border-red-100 dark:border-red-900/30 space-y-12 animate-in zoom-in-95 duration-700 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
         <div className="w-28 h-28 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-xl border-4 border-white dark:border-[#0a0f29]">
           <Shield size={48} />
         </div>
         <div className="space-y-4">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic leading-none">Security Override Denial</h2>
            <p className="text-gray-400 dark:text-gray-700 font-black uppercase tracking-[0.3em] italic text-[11px] leading-relaxed max-w-sm mx-auto">{error}</p>
         </div>
         <button onClick={() => router.push("/user-dashboard")} className="w-full py-8 bg-red-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest hover:bg-red-700 transition shadow-2xl shadow-red-900/20 active:scale-[0.98] italic">Exit Command Protocol</button>
      </div>
    </div>
  );

  const question = questions[currentQuestion];
  const isBookmarked = bookmarks.has(question?._id);
  const bookmarkCount = bookmarks.size;
  const progress = ((Object.keys(answers).length) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] text-gray-900 dark:text-gray-100 font-sans flex flex-col overflow-hidden transition-colors duration-500">
      
      {/* INSTITUTIONAL EXAMINATION HEADER */}
      <header className="h-28 bg-white dark:bg-[#0a0f29] border-b-2 border-gray-100 dark:border-gray-800 flex items-center justify-between px-12 lg:px-16 shrink-0 z-50 shadow-sm transition-all duration-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-blue-600/5 blur-3xl pointer-events-none" />
        <div className="flex items-center gap-10">
           <div className="w-16 h-16 bg-blue-600 rounded-[1.8rem] flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-blue-900/40 rotate-6 border-4 border-white dark:border-[#0a0f29] transition-transform">Q</div>
           <div className="space-y-2">
              <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none italic">{test?.title}</h1>
              <div className="flex items-center gap-4">
                 <p className="text-[10px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-[0.4em] leading-none italic">Intelligence Matrix Node // ACTIVE</p>
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
              </div>
           </div>
        </div>

        <div className="flex items-center gap-20">
           <div className="hidden xl:flex flex-col items-end gap-4">
              <div className="flex items-center justify-between w-72">
                 <span className="text-[10px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-widest leading-none italic">Completion Vector</span>
                 <span className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest leading-none italic tabular-nums">{Math.round(progress)}% Sync</span>
              </div>
              <div className="w-72 h-2.5 bg-gray-50 dark:bg-[#050816] rounded-full overflow-hidden shadow-inner border border-gray-100 dark:border-gray-800">
                 <div className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(37,99,235,0.6)]" style={{ width: `${progress}%` }} />
              </div>
           </div>

           <div className={`px-12 py-5 rounded-[2.5rem] border-2 flex items-center gap-8 transition-all duration-500 shadow-xl relative overflow-hidden group ${timeLeft < 300 ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-900 text-red-600 dark:text-red-500 animate-pulse" : "bg-white dark:bg-[#050816] border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white"}`}>
              <div className={`absolute top-0 right-0 w-24 h-full bg-current opacity-5 pointer-events-none group-hover:scale-150 transition-transform duration-700`} />
              <Clock size={32} className={timeLeft < 300 ? "text-red-600" : "text-blue-600 dark:text-blue-500"} />
              <div className="flex flex-col relative z-10">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic leading-none mb-2">Temporal Reserve</span>
                 <span className="text-3xl font-mono font-black tracking-tighter leading-none italic tabular-nums">{formatTime(timeLeft)}</span>
              </div>
           </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* NODE NAVIGATOR BAR */}
        <aside className="w-[420px] bg-white dark:bg-[#0a0f29] border-r-2 border-gray-100 dark:border-gray-800 overflow-y-auto hidden lg:flex flex-col p-14 transition-all duration-700 relative">
           <div className="flex items-center justify-between mb-16 px-4">
              <div className="space-y-2">
                 <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-gray-700 italic leading-none">Grid Navigator</h3>
                 <p className="text-[10px] text-gray-300 dark:text-gray-800 font-black uppercase tracking-widest italic leading-none">Spectral Node Synchronization</p>
              </div>
              <div className="px-6 py-2.5 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-100 dark:border-blue-800/30 rounded-full text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest italic leading-none tabular-nums shadow-sm">{questions.length} Units</div>
           </div>

           <div className="grid grid-cols-5 gap-4 px-2">
              {questions.map((q, idx) => (
                <button
                  key={q._id}
                  onClick={() => handleQuestionChange(idx)}
                  className={`w-full aspect-square rounded-[1.8rem] font-black text-[13px] transition-all duration-700 flex items-center justify-center border-2 relative italic active:scale-90 transform-gpu ${
                    idx === currentQuestion 
                      ? "bg-blue-600 text-white border-blue-600 shadow-2xl shadow-blue-900/40 scale-110 z-10 -rotate-3" 
                      : answers[q._id] !== undefined
                      ? "bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-500 border-blue-200 dark:border-blue-800/50 shadow-inner"
                      : bookmarks.has(q._id)
                      ? "bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-800/50 shadow-inner"
                      : "bg-gray-50 dark:bg-[#050816] text-gray-300 dark:text-gray-800 border-gray-100 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-white dark:hover:bg-gray-900"
                  }`}
                >
                  {(idx + 1).toString().padStart(2, "0")}
                  {bookmarks.has(q._id) && (
                    <span className={`absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 rounded-full border-3 border-white dark:border-[#0a0f29] shadow-xl transition-all duration-700 ${idx === currentQuestion ? "opacity-0 scale-0" : "opacity-100 scale-100"}`} />
                  )}
                </button>
              ))}
           </div>

           <div className="mt-20 p-12 bg-gray-50/50 dark:bg-[#050816] rounded-[4rem] border-2 border-gray-100 dark:border-gray-800 space-y-10 shadow-inner transition-all duration-700 relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center gap-8 group">
                <div className="w-5 h-5 rounded-[0.8rem] bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.6)] group-hover:rotate-12 transition-transform" />
                <span className="text-[12px] font-black text-gray-500 dark:text-gray-600 uppercase tracking-widest italic leading-none tabular-nums">Sync Commits: {Object.keys(answers).length}</span>
              </div>
              <div className="flex items-center gap-8 group">
                <div className="w-5 h-5 rounded-[0.8rem] bg-gray-200 dark:bg-gray-800 group-hover:rotate-12 transition-transform" />
                <span className="text-[12px] font-black text-gray-400 dark:text-gray-800 uppercase tracking-widest italic leading-none tabular-nums">Pending Units: {questions.length - Object.keys(answers).length}</span>
              </div>
              <div className="flex items-center gap-8 group">
                <div className="w-5 h-5 rounded-[0.8rem] bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)] group-hover:rotate-12 transition-transform" />
                <span className="text-[12px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest italic leading-none tabular-nums">Preserved Nodes: {bookmarkCount}</span>
              </div>
           </div>

           <div className="mt-auto pt-16">
              <button 
                onClick={() => setShowExitModal(true)}
                className="w-full flex items-center justify-center gap-6 px-10 py-7 text-red-500 dark:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[2.5rem] transition-all duration-700 text-[12px] font-black uppercase tracking-[0.3em] border-2 border-transparent hover:border-red-100 dark:hover:border-red-900/30 italic active:scale-95 group/exit"
              >
                 <LogOut size={24} className="group-hover:-translate-x-2 transition-transform" />
                 Terminate Session
              </button>
           </div>
        </aside>

        {/* SECURE EXAMINATION VORTEX */}
        <section className="flex-1 overflow-y-auto p-12 lg:px-24 xl:px-48 scroll-smooth relative">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.03),transparent)] pointer-events-none" />
           
           <div className="max-w-6xl mx-auto space-y-20 py-16">
              
              <div 
                key={currentQuestion}
                className={`bg-white dark:bg-[#0a0f29] rounded-[5.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-all duration-700 relative ${isExiting ? "opacity-0 translate-x-40 scale-90 blur-xl" : "animate-in fade-in slide-in-from-left-40 duration-1000"}`}
              >
                 <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                 
                 {/* Question Identification Bar */}
                 <div className="px-16 py-12 bg-gray-50/50 dark:bg-[#050816]/50 border-b-2 border-gray-50 dark:border-gray-800 flex items-center justify-between transition-all duration-700">
                    <div className="flex items-center gap-10">
                       <span className="text-[12px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.4em] bg-white dark:bg-gray-800 border-2 border-blue-50 dark:border-blue-900/30 px-10 py-4 rounded-[1.5rem] shadow-sm italic leading-none">Node: {(currentQuestion + 1).toString().padStart(2, "0")}</span>
                       <div className="hidden md:block w-px h-10 bg-gray-200 dark:bg-gray-800" />
                       <div className="hidden md:flex items-center gap-6 text-[12px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-[0.5em] italic leading-none">
                          <Layers size={18} /> Institutional Logic Mesh
                       </div>
                    </div>
                    <div className="flex items-center gap-8">
                       {questionTimeLeft !== null && test?.questionTimer && (
                          <div className="flex items-center gap-6 px-10 py-4 bg-amber-50 dark:bg-amber-900/20 rounded-[1.5rem] border-2 border-amber-100 dark:border-amber-800/30 transition-all duration-700 group shadow-sm">
                             <Zap size={22} className="text-amber-500 animate-pulse" />
                             <span className="text-[12px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest tabular-nums italic leading-none">{questionTimeLeft}s Remaining</span>
                          </div>
                       )}
                       <button 
                        onClick={() => toggleBookmark(question?._id)}
                        className={`p-5 rounded-[1.5rem] border-2 transition-all duration-700 active:scale-[0.8] shadow-sm ${isBookmarked ? "bg-amber-500 text-white border-amber-600 shadow-2xl shadow-amber-900/30 rotate-12" : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-200 dark:text-gray-800 hover:border-amber-400 hover:text-amber-600"}`}
                       >
                         <Bookmark size={26} fill={isBookmarked ? "white" : "none"} />
                       </button>
                    </div>
                 </div>

                 {/* Neural Input Interface */}
                 <div className="p-16 lg:p-28 space-y-24">
                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-[1.2] selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-600 tracking-tighter italic group">
                       <span className="opacity-10 dark:opacity-5 group-hover:opacity-30 transition-opacity mr-6">/</span>
                       {question?.questionText}
                    </h2>

                    <div className="grid grid-cols-1 gap-10">
                       {question?.options.map((opt, i) => (
                         <button
                           key={i}
                           onClick={() => handleAnswerSelect(question._id, i)}
                           className={`w-full group flex items-center justify-between p-10 lg:p-12 rounded-[4rem] border-2 transition-all duration-700 transform-gpu active:scale-[0.98] relative overflow-hidden text-left ${
                             answers[question._id] === i
                               ? "bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-900/40 translate-x-6 rotate-1"
                               : "bg-gray-50/50 dark:bg-[#050816] border-gray-50 dark:border-gray-800 text-gray-400 dark:text-gray-700 hover:border-blue-500 hover:bg-white dark:hover:bg-gray-900"
                           }`}
                         >
                           {answers[question._id] === i && (
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
                           )}
                           <div className="flex items-center gap-12 relative z-10">
                              <div className={`w-18 h-18 rounded-[1.8rem] flex items-center justify-center font-black text-xl transition-all duration-700 shadow-sm border-2 ${
                                answers[question._id] === i
                                  ? "bg-white/10 border-white/20 text-white rotate-12"
                                  : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-300 dark:text-gray-800 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12 group-hover:border-blue-600"
                              }`}>
                                {String.fromCharCode(65 + i)}
                              </div>
                              <span className="text-2xl font-black uppercase tracking-tight italic leading-none">
                                {opt.text}
                              </span>
                           </div>
                           <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-700 relative z-10 ${
                             answers[question._id] === i ? "border-white bg-white text-blue-600 shadow-2xl scale-110" : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 group-hover:border-blue-500 group-hover:scale-110"
                           }`}>
                             {answers[question._id] === i ? <CheckCircle2 size={24} strokeWidth={4} /> : <div className="w-3 h-3 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-500 transition-colors" />}
                           </div>
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              {/* PROTOCOL NAVIGATION */}
              <div className="flex flex-col sm:flex-row items-center justify-between px-12 gap-12 pb-32">
                 <button
                   onClick={() => handleQuestionChange(Math.max(0, currentQuestion - 1))}
                   disabled={currentQuestion === 0}
                   className="w-full sm:w-auto flex items-center justify-center gap-10 px-16 py-9 bg-white dark:bg-[#0a0f29] border-2 border-gray-50 dark:border-gray-800 rounded-[3rem] text-[13px] font-black text-gray-400 dark:text-gray-800 uppercase tracking-[0.3em] hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-500 disabled:opacity-0 transition-all duration-700 active:scale-95 shadow-xl shadow-blue-900/5 italic"
                 >
                   <ChevronLeft size={28} />
                   Retrace Logic unit
                 </button>

                 <div className="hidden xl:block flex-1 h-px bg-gray-100 dark:bg-gray-900 mx-12 shadow-sm" />

                 {currentQuestion < questions.length - 1 ? (
                   <button
                     onClick={() => handleQuestionChange(currentQuestion + 1)}
                     className="w-full sm:w-auto group flex items-center justify-center gap-10 px-20 py-9 bg-blue-600 rounded-[3rem] text-[13px] font-black text-white uppercase tracking-[0.3em] shadow-2xl shadow-blue-900/40 hover:bg-blue-700 transition-all duration-700 active:scale-95 italic group/next"
                   >
                     Advance unit
                     <ChevronRight size={28} className="group-hover/next:translate-x-4 transition-transform duration-700" />
                   </button>
                 ) : (
                   <button
                     onClick={() => setShowSubmitModal(true)}
                     disabled={submitting}
                     className="w-full sm:w-auto px-24 py-10 bg-blue-600 text-white rounded-[3rem] text-[14px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-blue-900/50 hover:bg-blue-700 transition-all duration-700 italic active:scale-[0.98] flex items-center gap-8 group/submit"
                   >
                     {submitting ? "Codifying Registry..." : "Finalize Protocol"}
                     <Award size={28} className="group-hover/submit:scale-125 transition-transform" />
                   </button>
                 )}
              </div>
           </div>
        </section>
      </div>

      {/* MODAL ARCHITECTURE */}
      {(showExitModal || showSubmitModal) && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 bg-gray-950/95 backdrop-blur-3xl animate-in fade-in duration-700">
           <div className="bg-white dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 rounded-[6rem] p-24 max-w-2xl w-full shadow-2xl space-y-16 animate-in zoom-in-95 duration-700 flex flex-col items-center relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-2 ${showExitModal ? "bg-red-600" : "bg-blue-600"}`} />
              <div className={`w-40 h-40 rounded-[3.5rem] flex items-center justify-center shadow-2xl border-6 border-white dark:border-[#0a0f29] ${showExitModal ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500 shadow-red-900/20" : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 shadow-blue-900/20"}`}>
                 {showExitModal ? <LogOut size={72} /> : <CheckCircle2 size={72} />}
              </div>
              <div className="text-center space-y-8">
                 <h3 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic leading-none">{showExitModal ? "Terminate session" : "Finalize Logic loop"}</h3>
                 <p className="text-[16px] font-black text-gray-400 dark:text-gray-700 leading-relaxed italic uppercase tracking-widest max-w-md mx-auto">
                    {showExitModal 
                      ? "Terminate current intelligence session? Active progress vectors will be preserved in buffer, but registry re-entry may be restricted." 
                      : `Evaluation comprehensive. ${Object.keys(answers).length}/${questions.length} cognitive nodes processed. Initiate analytical report synchronization?`}
                 </p>
              </div>
              <div className="flex flex-col gap-6 w-full">
                 <button 
                   onClick={showExitModal ? () => router.push("/user-dashboard") : handleSubmit}
                   className={`w-full py-10 rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.3em] text-white shadow-2xl transition-all duration-700 active:scale-[0.98] italic ${showExitModal ? "bg-red-600 hover:bg-red-700 shadow-red-900/30" : "bg-blue-600 hover:bg-blue-700 shadow-blue-900/30"}`}
                 >
                    {showExitModal ? "Terminate Active Protocol" : "Initiate Analytical Report Sync"}
                 </button>
                 <button 
                    onClick={() => { setShowExitModal(false); setShowSubmitModal(false); }}
                    className="w-full py-8 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-700 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-700 italic active:scale-[0.98]"
                 >
                    Abort, Resume Loop
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* SECURITY HUD OVERLAY */}
      {showAntiCheatHUD && (
        <div className="fixed top-40 left-1/2 -translate-x-1/2 z-[1100] bg-red-600 text-white px-20 py-10 rounded-[4rem] shadow-2xl animate-in slide-in-from-top-20 duration-700 flex items-center gap-10 border-6 border-white/20 backdrop-blur-3xl">
          <Shield size={48} className="animate-pulse" />
          <div className="space-y-3">
            <p className="text-[16px] font-black uppercase tracking-[0.4em] leading-none">Security Violation // Warning {Math.min(tabSwitchWarnings, 3)}/2</p>
            <p className="text-[12px] font-black uppercase tracking-widest opacity-80 leading-none italic">{tabSwitchWarnings >= 3 ? "AUTO-SUBMITTING NODE PROTOCOL..." : "Grid anomaly detected. Further violations will result in immediate session termination."}</p>
          </div>
        </div>
      )}

      {/* GUEST CAPTURE MODAL */}
      {showGuestModal && (
        <div className="fixed inset-0 bg-white/95 dark:bg-[#050816]/98 backdrop-blur-3xl z-[1200] flex items-center justify-center p-12 animate-in fade-in zoom-in duration-1000">
           <div className="bg-white dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 rounded-[6rem] p-28 max-w-3xl w-full text-center shadow-2xl shadow-blue-900/20 flex flex-col items-center space-y-16">
              <div className="w-40 h-40 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 rounded-[4rem] flex items-center justify-center shadow-2xl rotate-12 border-4 border-white dark:border-[#0a0f29]"><Star size={72} fill="currentColor" /></div>
              
              <div className="space-y-8">
                 <h3 className="text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Proficiency Threshold: <span className="text-blue-600 dark:text-blue-500">{guestScore}</span></h3>
                 <p className="text-[18px] font-black text-gray-400 dark:text-gray-700 max-w-lg mx-auto leading-relaxed uppercase tracking-widest italic">Performance captured in volatile registry buffer. To synchronize your trajectory and unlock institutional analytics, initialize scholar enrollment.</p>
              </div>
              
              <div className="flex flex-col gap-8 w-full">
                 <button onClick={() => router.push("/register")} className="w-full py-10 bg-blue-600 text-white rounded-[2.5rem] font-black text-[14px] uppercase tracking-[0.3em] shadow-2xl shadow-blue-900/40 hover:scale-[1.02] transition-all duration-700 flex items-center justify-center gap-8 italic">
                    <Zap size={32} /> Initialize Scholar Enrollment
                 </button>
                 <button onClick={() => { localStorage.clear(); router.push("/"); }} className="w-full py-7 text-gray-300 dark:text-gray-800 hover:text-red-600 dark:hover:text-red-500 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] transition-all duration-700 italic active:scale-95">
                    Discard unit & Terminate Node
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* NETWORK ERROR TOAST */}
      {submitError && (
        <div className="fixed bottom-16 right-16 z-[1000] bg-red-600 text-white px-12 py-8 rounded-[3rem] shadow-2xl animate-in slide-in-from-right-20 duration-1000 flex items-center gap-10 border-4 border-white/20 backdrop-blur-2xl">
           <AlertCircle size={32} />
           <p className="text-[13px] font-black uppercase tracking-widest italic leading-none">{submitError}</p>
        </div>
      )}

    </div>
  );
}
