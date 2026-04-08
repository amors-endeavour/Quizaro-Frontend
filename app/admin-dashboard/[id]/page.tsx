"use client";

import { useEffect, useState, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import API from "@/app/lib/api";
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Eye, 
  Settings, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  PieChart,
  Layers,
  ArrowDownToLine,
  HelpCircle
} from "lucide-react";

interface Option {
  text: string;
}

interface Question {
  _id?: string;
  questionText: string;
  options: Option[];
  correctOption: number;
  explanation?: string;
  marks?: number;
  negativeMarks?: number;
  difficulty?: "Easy" | "Medium" | "Hard";
}

interface Test {
  _id: string;
  title: string;
  duration?: number;
  category?: string;
  description?: string;
}

export default function QuestionsStudio({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("Create Questions");

  // Editor State for current question
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    questionText: "",
    options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
    correctOption: 0,
    explanation: "",
    marks: 1,
    negativeMarks: 0.25,
    difficulty: "Medium"
  });

  const [testSettings, setTestSettings] = useState({
    title: "",
    duration: 30,
    category: "General",
    instructions: ""
  });

  const fetchData = async () => {
    try {
      const [testRes, questionsRes] = await Promise.all([
        API.get(`/test/${id}`),
        API.get(`/admin/questions/${id}`),
      ]);
      setTest(testRes.data);
      setTestSettings({
        title: testRes.data.title,
        duration: testRes.data.duration || 30,
        category: testRes.data.category || "General",
        instructions: testRes.data.description || ""
      });

      const qData = questionsRes.data;
      setQuestions(qData);
      if (qData.length > 0 && currentIndex < qData.length) {
        setCurrentQuestion(qData[currentIndex]);
      } else if (qData.length > 0) {
        setCurrentQuestion(qData[0]);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error("Studio data fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleUpdateTest = async () => {
    setSaving(true);
    try {
      await API.put(`/admin/test/${id}`, {
        title: testSettings.title,
        duration: testSettings.duration,
        category: testSettings.category,
        description: testSettings.instructions
      });
      fetchData();
      alert("Test settings updated successfully!");
    } catch {
      alert("Test update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSwitch = (index: number) => {
    if (index < 0 || index > questions.length) return;
    
    if (index === questions.length) {
      setCurrentQuestion({
        questionText: "",
        options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
        correctOption: 0,
        explanation: "",
        marks: 1,
        negativeMarks: 0.25,
        difficulty: "Medium"
      });
    } else {
      setCurrentQuestion(questions[index]);
    }
    setCurrentIndex(index);
    setActiveTab("Create Questions");
  };

  const handleSaveQuestion = async () => {
    setSaving(true);
    try {
      if (currentQuestion._id) {
        await API.put(`/admin/question/${currentQuestion._id}`, currentQuestion);
      } else {
        await API.post(`/question/add/${id}`, currentQuestion);
      }
      await fetchData();
    } catch {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!currentQuestion._id) return;
    if (!confirm("Delete this question?")) return;
    try {
      await API.delete(`/admin/question/${currentQuestion._id}`);
      fetchData();
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#f3f4f9] flex items-center justify-center font-black text-blue-600 animate-pulse tracking-widest uppercase">Initializing Studio...</div>;

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="h-auto min-h-[4rem] bg-white border-b border-gray-200 px-4 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => router.push("/admin-dashboard/tests")}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition shrink-0"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2 text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest overflow-hidden">
               <span className="hidden sm:inline">My Library</span>
               <ChevronRight size={10} className="hidden sm:block" />
               <span className="truncate">{test?.category || "General"}</span>
               <ChevronRight size={10} />
               <span className="text-gray-900 truncate">{test?.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
             <button className="flex-1 sm:flex-none flex items-center gap-2 px-4 lg:px-5 py-2 border-2 border-blue-600 text-blue-600 rounded-lg text-[10px] lg:text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition justify-center">
               <Eye size={16} />
               <span className="hidden xs:inline">Preview</span>
             </button>
             <div className="hidden xs:block w-px h-6 bg-gray-200 mx-1" />
             <button 
               onClick={activeTab === "Create Questions" ? handleSaveQuestion : handleUpdateTest}
               disabled={saving}
               className="flex-1 sm:flex-none px-6 lg:px-8 py-2 bg-blue-700 text-white rounded-lg text-[10px] lg:text-xs font-black uppercase tracking-widest hover:bg-blue-800 shadow-lg shadow-blue-200 flex items-center gap-2 transition justify-center"
             >
               {saving ? "Processing..." : <><Save size={16} /><span className="hidden xs:inline">Save</span></>}
             </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <aside className="w-72 bg-white border-r border-gray-100 overflow-y-auto hidden xl:block p-4">
             <ul className="space-y-1">
                {[
                  { label: "Create Questions", icon: <Plus size={18} /> },
                  { label: "Grading", icon: <PieChart size={18} /> },
                  { label: "Test Sections", icon: <Layers size={18} /> },
                  { label: "Import Questions", icon: <ArrowDownToLine size={18} /> },
                  { label: "Test Settings", icon: <Settings size={18} /> },
                ].map((item) => (
                  <li key={item.label}>
                    <button 
                      onClick={() => setActiveTab(item.label)}
                      className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all ${activeTab === item.label ? "bg-blue-50 text-blue-700 shadow-sm" : "text-gray-500 hover:bg-gray-50"}`}
                    >
                       <div className="flex items-center gap-4">
                         <span className={activeTab === item.label ? "text-blue-600" : "text-gray-400"}>{item.icon}</span>
                         <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                       </div>
                       <ChevronRight size={14} className={activeTab === item.label ? "text-blue-400" : "text-gray-300"} />
                    </button>
                  </li>
                ))}
             </ul>

             <div className="mt-8 p-6 bg-gray-200/30 rounded-[2rem] border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Test Details</h4>
                  <button onClick={() => setActiveTab("Test Settings")} className="text-blue-600"><Settings size={12} /></button>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <HelpCircle size={14} className="text-blue-500" />
                      <span className="text-[11px] font-bold text-gray-700">{test?.duration || 0} mins Duration</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <Layers size={14} className="text-blue-500" />
                      <span className="text-[11px] font-bold text-gray-700 truncate capitalize">{test?.category || "General"}</span>
                   </div>
                </div>
             </div>
          </aside>

          <section className="flex-1 overflow-y-auto p-12 lg:px-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-4xl mx-auto">
              
              {activeTab === "Create Questions" ? (
                /* QUESTION EDITOR */
                <>
                  <div className="flex items-center justify-between mb-8 px-4">
                     <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleSwitch(currentIndex - 1)}
                          disabled={currentIndex === 0}
                          className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 disabled:opacity-20 transition shadow-sm bg-white"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-900">
                          Question {currentIndex + 1} of {questions.length}
                        </span>
                        <button 
                          onClick={() => handleSwitch(currentIndex + 1)}
                          className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 transition shadow-sm bg-white"
                        >
                          <ChevronRight size={20} />
                        </button>
                     </div>
                     <button 
                        onClick={() => handleSwitch(questions.length)}
                        className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-4 py-2 rounded-lg transition"
                      >
                       <Plus size={16} />
                       Add Blank Question
                     </button>
                  </div>

                  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_30px_70px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="px-10 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-black text-gray-900 border-r border-gray-200 pr-4 uppercase tracking-widest">
                            Multiple Choice
                          </span>
                          <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-[10px] font-black tracking-widest">+ {currentQuestion.marks || 1.0}</span>
                              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-md text-[10px] font-black tracking-widest">- {currentQuestion.negativeMarks || 0.25}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Difficulty</span>
                          <select 
                            value={currentQuestion.difficulty || "Medium"}
                            onChange={(e) => setCurrentQuestion({...currentQuestion, difficulty: e.target.value as any})}
                            className="bg-white border border-gray-200 rounded-lg px-4 py-1.5 text-xs font-bold outline-none focus:border-blue-400 transition"
                          >
                              <option>Easy</option>
                              <option>Medium</option>
                              <option>Hard</option>
                          </select>
                        </div>
                    </div>

                    <div className="p-10 space-y-10">
                        <textarea 
                          value={currentQuestion.questionText}
                          onChange={(e) => setCurrentQuestion({...currentQuestion, questionText: e.target.value})}
                          className="w-full bg-gray-50/50 border border-transparent rounded-2xl px-8 py-6 outline-none focus:border-blue-100 focus:bg-white transition-all text-xl font-bold min-h-[160px] resize-none placeholder:text-gray-300"
                          placeholder="Type your question text here..."
                        />

                        <div className="space-y-4">
                          <div className="flex items-center justify-between opacity-40">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Answer Options</h3>
                            <span className="text-[10px] font-black uppercase tracking-widest">Select correct answer</span>
                          </div>

                          <div className="space-y-3">
                              {currentQuestion.options.map((opt, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                  <div 
                                    onClick={() => setCurrentQuestion({...currentQuestion, correctOption: i})}
                                    className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all ${currentQuestion.correctOption === i ? "border-green-500 bg-green-500 text-white shadow-lg shadow-green-100" : "border-gray-100 group-hover:border-blue-300 bg-white"}`}
                                  >
                                    {currentQuestion.correctOption === i ? <CheckCircle2 size={20} /> : <span className="text-xs font-bold">{String.fromCharCode(65+i)}</span>}
                                  </div>
                                  <input 
                                    value={opt.text}
                                    onChange={(e) => {
                                      const newOpts = [...currentQuestion.options];
                                      newOpts[i].text = e.target.value;
                                      setCurrentQuestion({...currentQuestion, options: newOpts});
                                    }}
                                    placeholder={`Option ${i+1}`}
                                    className={`flex-1 bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 outline-none transition-all font-bold text-sm ${currentQuestion.correctOption === i ? "border-green-100 bg-green-50/5" : "focus:border-blue-200 focus:bg-white"}`}
                                  />
                                  <button 
                                    onClick={() => {
                                      const newOpts = currentQuestion.options.filter((_, idx) => idx !== i);
                                      setCurrentQuestion({...currentQuestion, options: newOpts});
                                    }}
                                    className="p-2 text-red-100 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              ))}
                          </div>

                          <button 
                            onClick={() => setCurrentQuestion({...currentQuestion, options: [...currentQuestion.options, { text: "" }]})}
                            className="bg-gray-100 text-gray-500 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition shadow-sm"
                          >
                            Add new option
                          </button>
                        </div>
                    </div>
                  </div>
                </>
              ) : activeTab === "Test Settings" ? (
                /* TEST SETTINGS STUDIO */
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_30px_70px_rgba(0,0,0,0.03)] overflow-hidden animate-in zoom-in duration-300">
                   <div className="p-12 space-y-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Series / Folder Folder</label>
                        <input 
                          value={testSettings.category}
                          onChange={(e) => setTestSettings({...testSettings, category: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-5 outline-none focus:border-blue-400 transition-all font-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Test Title</label>
                        <input 
                          value={testSettings.title}
                          onChange={(e) => setTestSettings({...testSettings, title: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-5 outline-none focus:border-blue-400 transition-all font-black text-xl"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Duration (Min)</label>
                          <input 
                            type="number"
                            value={testSettings.duration}
                            onChange={(e) => setTestSettings({...testSettings, duration: Number(e.target.value)})}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-5 outline-none focus:border-blue-400 transition-all font-black"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Test Tags</label>
                          <input 
                            value={testSettings.category.toUpperCase()} 
                            disabled
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-5 outline-none font-black text-blue-600 opacity-50"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Test Instructions</label>
                        <textarea 
                          value={testSettings.instructions}
                          onChange={(e) => setTestSettings({...testSettings, instructions: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-5 outline-none focus:border-blue-400 transition-all font-bold min-h-[160px] resize-none"
                          placeholder="Type instructions for students..."
                        />
                      </div>
                      <div className="pt-4 flex justify-end">
                         <button 
                           onClick={handleUpdateTest}
                           className="px-12 py-4 bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition shadow-xl shadow-blue-200"
                         >
                           Update Test Details
                         </button>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                   <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">Coming Soon</h3>
                   <p className="text-gray-400 mt-2 font-bold">{activeTab} is currently under construction.</p>
                </div>
              )}

              {activeTab === "Create Questions" && (
                <div className="mt-12 flex items-center justify-between px-4">
                  <button 
                    onClick={handleDeleteQuestion}
                    className="flex items-center gap-2 text-xs font-black text-red-300 uppercase tracking-widest hover:text-red-600 transition"
                  >
                    <Trash2 size={16} />
                    Delete this question
                  </button>
                  <div className="flex items-center gap-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      <span>Saved in {test?.category || "General"}</span>
                      <span className="text-blue-500 underline underline-offset-4 decoration-dotted">Live Preview</span>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
  );
}
