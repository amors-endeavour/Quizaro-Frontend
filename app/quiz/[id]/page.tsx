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
  Star
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

  // Phase 3.3 — Engagement States 🔥
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [hint, setHint] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0);
  const [showAntiCheatHUD, setShowAntiCheatHUD] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
        let questionsData = questionsRes.data;
        const statusData = statusRes.data;

        // FISHER YATES SHUFFLE 🔥
        if (testData.shuffleQuestions) {
           for (let i = questionsData.length - 1; i > 0; i--) {
               const j = Math.floor(Math.random() * (i + 1));
               [questionsData[i], questionsData[j]] = [questionsData[j], questionsData[i]];
           }
        }

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
    // ENFORCE FULLSCREEN 🔥
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

  // TAB-SWITCH ANTI-CHEAT MONITOR 🔥
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !loading && !submitting) {
        setTabSwitchWarnings(prev => {
          const next = prev + 1;
          setShowAntiCheatHUD(true);
          setTimeout(() => setShowAntiCheatHUD(false), 4000);
          if (next >= 3) {
            setSubmitting(true); // Immediate lock 🔥
            handleSubmit(); // Force submit on 3rd violation
          }
          return next;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [loading, submitting]);

  // HINT FETCHER 🔥
  const fetchHint = async (questionId: string) => {
    setHintLoading(true);
    setShowHint(true);
    setHint(null);
    try {
      const { data } = await API.get(`/question/hint/${questionId}`);
      setHint(data.hint || data.message);
    } catch {
      setHint("Hint unavailable for this question.");
    } finally {
      setHintLoading(false);
    }
  };

  // BOOKMARK TOGGLE 🔥
  const toggleBookmark = (questionId: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      next.has(questionId) ? next.delete(questionId) : next.add(questionId);
      return next;
    });
  };

  // FLAG QUESTION 🔥
  const submitFlag = async (questionId: string) => {
    try {
      await API.post(`/question/flag/${questionId}`);
      setFlaggedQuestions(prev => new Set([...prev, questionId]));
    } catch { /* silent fail */ } finally {
      setShowFlagModal(false);
    }
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
        // If localIndex exists, find originalIndex from the options array
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
        // Evaluate score locally
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
        
        const finalScore = correctAnswers * 4; // Arbitrary 4 points per correct answer
        
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
      const msg = err?.response?.data?.message || err.message || "Platform connection error. Please try again.";
      setSubmitError(msg);
      setTimeout(() => setSubmitError(null), 5000);
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center font-black text-cyan-400 animate-pulse tracking-widest uppercase">Initializing Secure Environment...</div>;

  if (error) return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center p-8">
      <div className="bg-white/5 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl text-center max-w-lg border border-white/10">
         <div className="w-20 h-20 bg-red-400/10 text-red-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-950/20">
           <AlertCircle size={32} />
         </div>
         <h2 className="text-2xl font-black text-white mb-4 tracking-tight uppercase italic">Access Violation</h2>
         <p className="text-gray-500 font-bold mb-8 italic">{error}</p>
         <button onClick={() => router.push("/user-dashboard")} className="w-full py-4 bg-cyan-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-700 transition shadow-xl shadow-cyan-900/20">Return Dashboard</button>
      </div>
    </div>
  );

  const question = questions[currentQuestion];
  const isBookmarked = bookmarks.has(question?._id);
  const isFlagged = flaggedQuestions.has(question?._id);
  const bookmarkCount = bookmarks.size;
  const progress = ((Object.keys(answers).length) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#050816] text-white font-sans flex flex-col overflow-hidden selection:bg-cyan-500/30">
      
      {/* PROFESSIONAL EXAMINATION HEADER */}
      <header className="h-20 bg-[#050816]/60 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8 shrink-0 z-30 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-6">
           <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-900/20">Q</div>
           <div>
              <h1 className="text-xs font-black text-white uppercase tracking-widest">{test?.title}</h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Institutional Intelligence Paper</p>
           </div>
        </div>

        <div className="flex items-center gap-10">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Intelligence Threshold</span>
              <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-cyan-500 transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${progress}%` }} />
              </div>
           </div>

           <div className={`px-8 py-3 rounded-2xl border-2 flex items-center gap-4 transition-all duration-500 backdrop-blur-md ${timeLeft < 300 ? "bg-red-400/10 border-red-400/20 text-red-400 animate-pulse" : "bg-white/5 border-white/10 text-gray-300"}`}>
              <Clock size={20} className={timeLeft < 300 ? "text-red-400" : "text-cyan-400"} />
              <div className="flex flex-col">
                 <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Grid Time Leak</span>
                 <span className="text-lg font-mono font-black tracking-tighter leading-none">{formatTime(timeLeft)}</span>
              </div>
           </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT NAVIGATOR (SIDEBAR STYLE IMAGE #3) */}
        <aside className="w-80 bg-[#050816] border-r border-white/10 overflow-y-auto hidden lg:block p-8">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-500">Grid Navigator</h3>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-cyan-400">{questions.length} Nodes</span>
           </div>

           <div className="grid grid-cols-4 gap-3">
              {questions.map((q, idx) => (
                <button
                  key={q._id}
                  onClick={() => handleQuestionChange(idx)}
                  className={`w-full aspect-square rounded-2xl font-black text-xs transition-all duration-300 flex items-center justify-center border-2 relative ${
                    idx === currentQuestion 
                      ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-white/20 shadow-xl shadow-blue-900/30 scale-110 z-10" 
                      : answers[q._id] !== undefined
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20"
                      : bookmarks.has(q._id)
                      ? "bg-amber-400/10 text-amber-500 border-amber-400/20"
                      : "bg-white/5 text-gray-600 border-white/5 hover:border-white/10 hover:text-gray-400"
                  }`}
                >
                  {(idx + 1).toString().padStart(2, "0")}
                  {bookmarks.has(q._id) && idx !== currentQuestion && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                  )}
                </button>
              ))}
           </div>

           <div className="mt-12 p-6 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-4 backdrop-blur-md shadow-xl shadow-black/20">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                <span className="text-[11px] font-black text-gray-300 uppercase">Answered: {Object.keys(answers).length}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="text-[11px] font-black text-gray-500 uppercase">Unanswered: {questions.length - Object.keys(answers).length}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                <span className="text-[11px] font-black text-amber-500 uppercase">Bookmarked: {bookmarkCount}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Active Question</span>
              </div>
           </div>

           <div className="mt-auto pt-10">
              <button 
                onClick={() => setShowExitModal(true)}
                className="w-full flex items-center gap-4 px-6 py-4 text-red-400 hover:bg-red-400/10 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-red-400/20"
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
                className={`bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300 ${isExiting ? "opacity-0 translate-x-10 scale-95" : "animate-in fade-in slide-in-from-left-10 duration-700"}`}
              >
                 {/* Question Header */}
                 <div className="px-12 py-8 bg-white/5 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-400/10 border border-cyan-400/20 px-4 py-2 rounded-xl shadow-lg shadow-cyan-900/10">Active Node {currentQuestion + 1}</span>
                       <div className="w-px h-6 bg-white/10" />
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Institutional Multiple Choice Matrix</span>
                    </div>
                    <div className="flex items-center gap-3">
                       {questionTimeLeft !== null && test?.questionTimer && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-amber-400/10 rounded-xl border border-amber-400/20 mr-4">
                             <Zap size={14} className="text-amber-500 animate-pulse" />
                             <span className="text-[10px] font-black text-amber-500 uppercase tabular-nums">{questionTimeLeft}s Left</span>
                          </div>
                       )}
                       <CheckCircle2 size={18} className={answers[question?._id] !== undefined ? "text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" : "text-white/5"} />
                    </div>
                 </div>

                 {/* Question Body */}
                 <div className="p-12 lg:p-16">
                    <h2 className="text-2xl md:text-3xl font-black text-white leading-[1.2] mb-14 selection:bg-cyan-500 selection:text-white tracking-tight">
                       {question?.questionText}
                    </h2>

                    <div className="space-y-4">
                       {question?.options.map((opt, i) => (
                         <button
                           key={i}
                           onClick={() => handleAnswerSelect(question._id, i)}
                           className={`w-full group flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all duration-300 transform-gpu active:scale-[0.98] ${
                             answers[question._id] === i
                               ? "bg-cyan-600 border-cyan-400 text-white shadow-2xl shadow-cyan-900/20 translate-x-3"
                               : "bg-white/5 border-white/5 text-gray-400 hover:border-cyan-400/30 hover:bg-white/10"
                           }`}
                         >
                           <div className="flex items-center gap-6">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300 ${
                                answers[question._id] === i
                                  ? "bg-white/20 text-white"
                                  : "bg-white/5 border border-white/5 text-gray-500 group-hover:bg-cyan-400 group-hover:text-white group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                              }`}>
                                {String.fromCharCode(65 + i)}
                              </div>
                              <span className="text-base font-black uppercase tracking-tight italic line-clamp-2 md:line-clamp-none">
                                {opt.text}
                              </span>
                           </div>
                           <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                             answers[question._id] === i ? "border-white bg-white text-cyan-800" : "border-white/5 group-hover:border-cyan-400/50"
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
                   className="flex items-center gap-3 px-8 py-4 bg-white/5 border-2 border-white/10 rounded-[2rem] text-[10px] font-black text-gray-500 uppercase tracking-widest hover:border-cyan-400/30 hover:text-cyan-400 disabled:opacity-0 transition-all active:scale-95 shadow-xl shadow-black/20"
                 >
                   <ChevronLeft size={16} />
                   Retrace Logic
                 </button>

                 {currentQuestion < questions.length - 1 ? (
                   <button
                     onClick={() => handleQuestionChange(currentQuestion + 1)}
                     className="group flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2rem] text-[10px] font-black text-white uppercase tracking-widest shadow-[0_15px_40px_rgba(37,99,235,0.4)] hover:scale-105 transition-all active:scale-95 border border-white/10"
                   >
                     Advance Sequence
                     <ChevronRight size={16} />
                   </button>
                 ) : (
                   <button
                     onClick={handleSubmit}
                     disabled={submitting}
                     className="px-12 py-5 bg-cyan-600 text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-widest shadow-[0_15px_50px_rgba(8,145,178,0.5)] animate-pulse hover:animate-none hover:bg-cyan-700 transition-all"
                   >
                     {submitting ? "Codifying Results..." : "Complete Intelligence Loop"}
                   </button>
                 )}
              </div>
           </div>
        </section>
      </div>

      {/* MODALS: EXIT & SUBMIT 🔥 */}
      {(showExitModal || showSubmitModal) && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#02040a]/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-[#050816] border border-white/10 rounded-[3.5rem] p-12 max-w-lg w-full shadow-[0_0_100px_rgba(37,99,235,0.2)] space-y-8 animate-in zoom-in-95 duration-300">
              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl ${showExitModal ? "bg-red-400/10 text-red-500 shadow-red-950/20" : "bg-cyan-400/10 text-cyan-400 shadow-cyan-950/20"}`}>
                 {showExitModal ? <LogOut size={32} /> : <CheckCircle2 size={32} />}
              </div>
              <div className="text-center space-y-4">
                 <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">{showExitModal ? "Confirm Termination" : "Submit Intelligence"}</h3>
                 <p className="text-sm font-bold text-gray-400 leading-relaxed italic">
                    {showExitModal 
                      ? "Are you sure you want to end this performance session? Progress will be saved, but active timer parameters may be restricted upon re-entry." 
                      : `You have answered ${Object.keys(answers).length} out of ${questions.length} nodes. Finalize and generate your institutional scorecard?`}
                 </p>
              </div>
              <div className="flex flex-col gap-4">
                 <button 
                   onClick={showExitModal ? () => router.push("/user-dashboard") : handleSubmit}
                   className={`w-full py-5 rounded-3xl font-black text-xs uppercase tracking-widest text-white shadow-2xl transition-all ${showExitModal ? "bg-red-600 hover:bg-red-700 shadow-red-900/40" : "bg-cyan-600 hover:bg-cyan-700 shadow-cyan-900/40"}`}
                 >
                    {showExitModal ? "Confirm Termination" : "Finalize Submission"}
                 </button>
                 <button 
                    onClick={() => { setShowExitModal(false); setShowSubmitModal(false); }}
                    className="w-full py-5 bg-white/5 border border-white/5 text-gray-500 rounded-3xl font-black text-xs uppercase tracking-widest hover:border-white/10 hover:text-white transition-all"
                 >
                    Abort, Resume Loop
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* FIGMA STYLE #2: Persistent Support HUD */}
      <div className="fixed bottom-8 right-8 z-[100]">
         <button className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl hover:bg-white/10 transition-all group">
            <div className="w-8 h-8 bg-white/10 text-cyan-400 rounded-xl flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-all">
               <Info size={16} />
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">Emergency Protocol</span>
         </button>
      </div>

      {/* ANTI-CHEAT TAB WARNING 🔥 */}
      {showAntiCheatHUD && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[400] bg-red-600 text-white px-10 py-5 rounded-[2rem] shadow-2xl animate-in slide-in-from-top-4 duration-300 flex items-center gap-4">
          <AlertCircle size={20} />
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest">Tab Switch Detected — Warning {Math.min(tabSwitchWarnings, 3)}/2</p>
            <p className="text-[10px] opacity-70 mt-0.5">{tabSwitchWarnings >= 3 ? "Auto-submitting..." : "Next violation will auto-submit your paper."}</p>
          </div>
        </div>
      )}

      {/* SUBMIT ERROR HUD 🔥 */}
      {submitError && (
        <div className="fixed bottom-10 left-10 z-[400] bg-[#050816] border border-red-400/20 text-red-500 px-8 py-5 rounded-[2rem] shadow-2xl animate-in slide-in-from-left-10 duration-500 flex items-center gap-4 backdrop-blur-xl">
          <div className="w-8 h-8 bg-red-400/10 rounded-xl flex items-center justify-center"><AlertCircle size={16} /></div>
          <p className="text-[10px] font-black uppercase tracking-widest">{submitError}</p>
        </div>
      )}

      {/* FLAG CONFIRMATION MODAL 🔥 */}
      {showFlagModal && (
        <div className="fixed inset-0 z-[500] bg-[#02040a]/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#050816] border border-white/10 rounded-[3.5rem] p-12 max-w-sm w-full shadow-2xl text-center space-y-8 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-red-400/10 text-red-400 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl border border-red-400/20"><Flag size={32} /></div>
            <div className="space-y-4">
              <h3 className="text-xl font-black text-white tracking-tighter uppercase">Report Anomaly</h3>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Flag this node for administrative audit? This helps us maintain content integrity.</p>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => submitFlag(question._id)} className="w-full py-5 bg-cyan-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-700 transition-all active:scale-95 shadow-xl shadow-cyan-900/20">
                Initiate Report
              </button>
              <button onClick={() => setShowFlagModal(false)} className="w-full py-5 bg-white/5 text-gray-500 border border-white/5 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GUEST MODE CTA MODAL */}
      {showGuestModal && (
        <div className="fixed inset-0 bg-[#02040a]/95 backdrop-blur-2xl z-[500] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
           <div className="bg-[#050816] border border-white/10 rounded-[4rem] p-16 max-w-lg w-full text-center shadow-[0_0_150px_rgba(37,99,235,0.3)] flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-900/40 relative z-10 rotate-3 border border-white/20"><Star size={40} fill="currentColor" /></div>
              
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 relative z-10 italic">Intelligence Milestone Reach: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{guestScore}</span></h3>
              <p className="text-xs font-bold text-gray-500 mb-10 max-w-[300px] leading-relaxed relative z-10 uppercase tracking-widest">Performance captured. To synchronize your intelligence trajectory and unlock neural analytics, initialize registration.</p>
              
              <div className="flex flex-col gap-4 w-full relative z-10">
                 <button onClick={() => router.push("/register")} className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2 border border-white/10">
                    <Zap size={16} className="text-cyan-400" /> Initialize Account Enrollment
                 </button>
                 <button onClick={() => { localStorage.clear(); router.push("/"); }} className="w-full py-4 text-gray-600 hover:text-white rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all">
                    Discard Intelligence & Terminate
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
