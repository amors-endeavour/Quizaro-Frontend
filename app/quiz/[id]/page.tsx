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

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col items-center justify-center font-black text-gray-400 animate-pulse tracking-widest uppercase text-[10px]">
      <div className="w-12 h-12 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin mb-6"></div>
      Initializing Secure Environment...
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-8">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-blue-900/5 text-center max-w-lg border border-gray-100">
         <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
           <AlertCircle size={32} />
         </div>
         <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight uppercase italic">Access Violation</h2>
         <p className="text-gray-400 font-bold mb-8 italic text-sm">{error}</p>
         <button onClick={() => router.push("/user-dashboard")} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-900/10">Return Dashboard</button>
      </div>
    </div>
  );

  const question = questions[currentQuestion];
  const isBookmarked = bookmarks.has(question?._id);
  const isFlagged = flaggedQuestions.has(question?._id);
  const bookmarkCount = bookmarks.size;
  const progress = ((Object.keys(answers).length) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-gray-900 font-sans flex flex-col overflow-hidden selection:bg-blue-100 selection:text-blue-600">
      
      {/* PROFESSIONAL EXAMINATION HEADER */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 shrink-0 z-30 shadow-sm">
        <div className="flex items-center gap-6">
           <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-900/10">Q</div>
           <div>
              <h1 className="text-xs font-black text-gray-900 uppercase tracking-widest">{test?.title}</h1>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">Institutional Intelligence Paper</p>
           </div>
        </div>

        <div className="flex items-center gap-12">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Completion Vector</span>
              <div className="w-56 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-600 transition-all duration-500 shadow-sm" style={{ width: `${progress}%` }} />
              </div>
           </div>

           <div className={`px-10 py-3 rounded-2xl border-2 flex items-center gap-5 transition-all duration-500 ${timeLeft < 300 ? "bg-red-50 border-red-100 text-red-600 animate-pulse" : "bg-gray-50 border-gray-100 text-gray-900"}`}>
              <Clock size={20} className={timeLeft < 300 ? "text-red-600" : "text-blue-600"} />
              <div className="flex flex-col">
                 <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Grid Time Leak</span>
                 <span className="text-lg font-mono font-black tracking-tighter leading-none">{formatTime(timeLeft)}</span>
              </div>
           </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT NAVIGATOR (SIDEBAR STYLE IMAGE #3) */}
        <aside className="w-80 bg-white border-r border-gray-100 overflow-y-auto hidden lg:flex flex-col p-10">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Grid Navigator</h3>
              <span className="px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest">{questions.length} Nodes</span>
           </div>

           <div className="grid grid-cols-4 gap-4">
              {questions.map((q, idx) => (
                <button
                  key={q._id}
                  onClick={() => handleQuestionChange(idx)}
                  className={`w-full aspect-square rounded-2xl font-black text-[11px] transition-all duration-300 flex items-center justify-center border-2 relative ${
                    idx === currentQuestion 
                      ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-900/10 scale-105 z-10" 
                      : answers[q._id] !== undefined
                      ? "bg-blue-50 text-blue-600 border-blue-100"
                      : bookmarks.has(q._id)
                      ? "bg-amber-50 text-amber-600 border-amber-100"
                      : "bg-gray-50 text-gray-400 border-gray-50 hover:border-gray-200 hover:bg-white"
                  }`}
                >
                  {(idx + 1).toString().padStart(2, "0")}
                  {bookmarks.has(q._id) && idx !== currentQuestion && (
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-500 rounded-full border-2 border-white shadow-sm" />
                  )}
                </button>
              ))}
           </div>

           <div className="mt-12 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-blue-600 shadow-sm" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Answered: {Object.keys(answers).length}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unanswered: {questions.length - Object.keys(answers).length}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Bookmarked: {bookmarkCount}</span>
              </div>
           </div>

           <div className="mt-auto pt-10">
              <button 
                onClick={() => setShowExitModal(true)}
                className="w-full flex items-center justify-center gap-4 px-6 py-5 text-red-600 hover:bg-red-50 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-red-100"
              >
                 <LogOut size={18} />
                 Terminate Session
              </button>
           </div>
        </aside>

        {/* MAIN EXAMINATION AREA */}
        <section className="flex-1 overflow-y-auto p-12 lg:px-24 xl:px-32 scroll-smooth">
           <div className="max-w-4xl mx-auto space-y-12">
              
              <div 
                key={currentQuestion}
                className={`bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-blue-900/5 overflow-hidden transition-all duration-300 ${isExiting ? "opacity-0 translate-x-10 scale-95" : "animate-in fade-in slide-in-from-left-10 duration-700"}`}
              >
                 {/* Question Header */}
                 <div className="px-14 py-10 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 px-6 py-2.5 rounded-xl">Node {currentQuestion + 1}</span>
                       <div className="w-px h-6 bg-gray-200" />
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Institutional Intelligence Matrix</span>
                    </div>
                    <div className="flex items-center gap-4">
                       {questionTimeLeft !== null && test?.questionTimer && (
                          <div className="flex items-center gap-3 px-5 py-2.5 bg-amber-50 rounded-xl border border-amber-100 mr-2">
                             <Zap size={16} className="text-amber-500 animate-pulse" />
                             <span className="text-[10px] font-black text-amber-600 uppercase tabular-nums">{questionTimeLeft}s</span>
                          </div>
                       )}
                       <button 
                        onClick={() => toggleBookmark(question?._id)}
                        className={`p-3 rounded-xl border transition-all ${isBookmarked ? "bg-amber-50 border-amber-200 text-amber-500" : "bg-white border-gray-100 text-gray-300 hover:border-gray-200"}`}
                       >
                         <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
                       </button>
                    </div>
                 </div>

                 {/* Question Body */}
                 <div className="p-16 lg:p-20">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-[1.2] mb-16 selection:bg-blue-100 selection:text-blue-600 tracking-tighter italic">
                       {question?.questionText}
                    </h2>

                    <div className="space-y-5">
                       {question?.options.map((opt, i) => (
                         <button
                           key={i}
                           onClick={() => handleAnswerSelect(question._id, i)}
                           className={`w-full group flex items-center justify-between p-7 rounded-[2.5rem] border-2 transition-all duration-300 transform-gpu active:scale-[0.98] ${
                             answers[question._id] === i
                               ? "bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-900/20 translate-x-3"
                               : "bg-gray-50 border-gray-50 text-gray-500 hover:border-blue-200 hover:bg-white"
                           }`}
                         >
                           <div className="flex items-center gap-8">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300 ${
                                answers[question._id] === i
                                  ? "bg-white/20 text-white"
                                  : "bg-white border border-gray-100 text-gray-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600"
                              }`}>
                                {String.fromCharCode(65 + i)}
                              </div>
                              <span className="text-base font-black uppercase tracking-tight italic line-clamp-2 md:line-clamp-none">
                                {opt.text}
                              </span>
                           </div>
                           <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                             answers[question._id] === i ? "border-white bg-white text-blue-600" : "border-gray-200 bg-white group-hover:border-blue-400"
                           }`}>
                             {answers[question._id] === i && <CheckCircle2 size={16} strokeWidth={4} />}
                           </div>
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between px-6 pb-20">
                 <button
                   onClick={() => handleQuestionChange(Math.max(0, currentQuestion - 1))}
                   disabled={currentQuestion === 0}
                   className="flex items-center gap-4 px-10 py-6 bg-white border border-gray-100 rounded-[2.5rem] text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-blue-200 hover:text-blue-600 disabled:opacity-0 transition-all active:scale-95 shadow-sm"
                 >
                   <ChevronLeft size={18} />
                   Retrace Logic
                 </button>

                 {currentQuestion < questions.length - 1 ? (
                   <button
                     onClick={() => handleQuestionChange(currentQuestion + 1)}
                     className="group flex items-center gap-4 px-12 py-6 bg-blue-600 rounded-[2.5rem] text-[10px] font-black text-white uppercase tracking-widest shadow-2xl shadow-blue-900/10 hover:bg-blue-700 transition-all active:scale-95"
                   >
                     Advance Sequence
                     <ChevronRight size={18} />
                   </button>
                 ) : (
                   <button
                     onClick={handleSubmit}
                     disabled={submitting}
                     className="px-14 py-6 bg-blue-600 text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-blue-900/20 hover:bg-blue-700 transition-all"
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-gray-900/80 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white border border-gray-100 rounded-[4rem] p-16 max-w-lg w-full shadow-2xl space-y-10 animate-in zoom-in-95 duration-300">
              <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-sm ${showExitModal ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
                 {showExitModal ? <LogOut size={40} /> : <CheckCircle2 size={40} />}
              </div>
              <div className="text-center space-y-6">
                 <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">{showExitModal ? "Confirm Termination" : "Finalize Intelligence"}</h3>
                 <p className="text-sm font-bold text-gray-400 leading-relaxed italic">
                    {showExitModal 
                      ? "Confirm session abort? Active progress vectors will be synchronized, but time parameters may be restricted for subsequent entries." 
                      : `Evaluation comprehensive. ${Object.keys(answers).length}/${questions.length} nodes processed. Generate scorecard?`}
                 </p>
              </div>
              <div className="flex flex-col gap-4">
                 <button 
                   onClick={showExitModal ? () => router.push("/user-dashboard") : handleSubmit}
                   className={`w-full py-6 rounded-3xl font-black text-[11px] uppercase tracking-widest text-white shadow-xl transition-all ${showExitModal ? "bg-red-600 hover:bg-red-700 shadow-red-900/10" : "bg-blue-600 hover:bg-blue-700 shadow-blue-900/10"}`}
                 >
                    {showExitModal ? "Terminate Active Session" : "Finalize Protocol"}
                 </button>
                 <button 
                    onClick={() => { setShowExitModal(false); setShowSubmitModal(false); }}
                    className="w-full py-6 bg-gray-50 border border-gray-100 text-gray-400 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:text-gray-900 hover:bg-gray-100 transition-all"
                 >
                    Abort, Resume Loop
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* ANTI-CHEAT TAB WARNING 🔥 */}
      {showAntiCheatHUD && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[400] bg-red-600 text-white px-12 py-6 rounded-[2.5rem] shadow-2xl animate-in slide-in-from-top-6 duration-300 flex items-center gap-5">
          <AlertCircle size={24} />
          <div>
            <p className="text-[12px] font-black uppercase tracking-widest">Protocol Violation — Warning {Math.min(tabSwitchWarnings, 3)}/2</p>
            <p className="text-[11px] opacity-70 mt-1 font-bold">{tabSwitchWarnings >= 3 ? "Auto-submitting paper..." : "Further anomalies will result in immediate session termination."}</p>
          </div>
        </div>
      )}

      {/* GUEST MODE CTA MODAL */}
      {showGuestModal && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-2xl z-[500] flex items-center justify-center p-8 animate-in fade-in zoom-in duration-500">
           <div className="bg-white border border-gray-100 rounded-[4.5rem] p-20 max-w-xl w-full text-center shadow-2xl shadow-blue-900/10 flex flex-col items-center">
              <div className="w-28 h-28 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-sm rotate-3 border border-blue-100"><Star size={48} fill="currentColor" /></div>
              
              <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-6 italic">Intelligence Milestone: <span className="text-blue-600">{guestScore}</span></h3>
              <p className="text-sm font-bold text-gray-400 mb-12 max-w-[360px] leading-relaxed uppercase tracking-widest">Performance captured. To synchronize your trajectory and unlock deep cognitive analytics, initialize institutional registration.</p>
              
              <div className="flex flex-col gap-5 w-full">
                 <button onClick={() => router.push("/register")} className="w-full py-7 bg-blue-600 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-blue-900/20 hover:scale-105 transition-all flex items-center justify-center gap-3">
                    <Zap size={18} /> Initialize Scholar Enrollment
                 </button>
                 <button onClick={() => { localStorage.clear(); router.push("/"); }} className="w-full py-5 text-gray-400 hover:text-red-600 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all">
                    Discard Intelligence & Terminate
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
