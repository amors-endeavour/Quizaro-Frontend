"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import API from "@/app/lib/api";
import { 
  Plus, 
  Trash2, 
  FileEdit,
  AlertCircle,
  CheckCircle2,
  PieChart,
  Layers,
  ArrowDownToLine,
  ArrowLeft,
  HelpCircle,
  Shield,
  Clock,
  Target,
  Users,
  Lock,
  Mail,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  Settings,
  X
} from "lucide-react";
import Link from "next/link";

interface Question {
  _id?: string;
  text: string;
  type: "mcq" | "descriptive";
  options: { text: string }[];
  correctOption: number;
  marks: number;
  section?: string;
}

interface TestSettings {
  title: string;
  duration: number;
  passingCriteria: number;
  allowedAttempts: number;
  isStrict: boolean;
  shuffleOptions: boolean;
  instructions: string;
  category: string;
  questionTimer: number;
}

export default function QuestionStudio({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Questions");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testSettings, setTestSettings] = useState<TestSettings>({
    title: "",
    duration: 30,
    passingCriteria: 40,
    allowedAttempts: 1,
    isStrict: false,
    shuffleOptions: true,
    instructions: "",
    category: "General",
    questionTimer: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState<{show: boolean, type: 'delete' | 'save', targetId?: string}>({show: false, type: 'delete'});
  const [statusMsg, setStatusMsg] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    text: "",
    type: "mcq",
    options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
    correctOption: 0,
    marks: 1,
    section: "General"
  });

  const [bulkData, setBulkData] = useState("");

  const loadData = async () => {
    try {
      const [testRes, qRes] = await Promise.all([
        API.get(`/test/${id}`),
        API.get(`/admin/questions/${id}`)
      ]);
      
      const qData = qRes.data.map((q: any) => ({
        ...q,
        text: q.questionText || q.text || "", // Handle both variants
        marks: q.marks || q.marks || 1      // Normalize marks 🔥
      }));

      setQuestions(qData);
      setTestSettings({
        title: testRes.data.title || "",
        duration: testRes.data.duration || 30,
        passingCriteria: testRes.data.passingCriteria || 40,
        allowedAttempts: testRes.data.allowedAttempts || 1,
        isStrict: testRes.data.isStrict || false,
        shuffleOptions: testRes.data.shuffleOptions ?? true,
        instructions: testRes.data.description || "",
        category: testRes.data.category || "General",
        questionTimer: testRes.data.questionTimer || 0
      });
    } catch (err) {
      console.error("Studio data fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await API.get("/user/profile");
        const role = (data?.role || data?.user?.role)?.toString().toLowerCase();
        if (role !== "admin") {
          router.replace("/admin-login");
          return;
        }
        setIsAuthChecked(true);
      } catch {
        router.replace("/admin-login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!isAuthChecked) return;
    loadData();
  }, [id, isAuthChecked]);

  const handleUpdateTest = async () => {
    setSaving(true);
    try {
      await API.put(`/admin/test/${id}`, {
        ...testSettings,
        description: testSettings.instructions
      });
      setStatusMsg({ text: "Institutional parameters synchronized successfully.", type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
      loadData();
    } catch {
      setStatusMsg({ text: "Parameter synchronization failed.", type: 'error' });
      setTimeout(() => setStatusMsg(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveQuestion = async (q: Question) => {
    setSaving(true);
    try {
      if (q._id) {
        await API.put(`/admin/question/${q._id}`, { ...q, questionText: q.text });
      } else {
        await API.post(`/question/add/${id}`, { ...q, questionText: q.text });
      }
      setStatusMsg({ text: "Assessment item preserved successfully.", type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
      loadData();
      setIsEditing(false);
    } catch {
      setStatusMsg({ text: "Failed to preserve assessment item.", type: 'error' });
      setTimeout(() => setStatusMsg(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    try {
      await API.delete(`/admin/question/${qId}`);
      setStatusMsg({ text: "Item expunged from registry.", type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
      loadData();
      setShowConfirmModal({ show: false, type: 'delete' });
    } catch {
      setStatusMsg({ text: "Expunge operation failed.", type: 'error' });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleBulkImport = async () => {
    try {
      const parsed = JSON.parse(bulkData);
      if (Array.isArray(parsed)) {
        await Promise.all(parsed.map(q => API.post(`/question/add/${id}`, { ...q, questionText: q.text || q.questionText })));
        setBulkData("");
        setActiveTab("Questions");
        loadData();
        setStatusMsg({ text: `${parsed.length} items merged into registry.`, type: 'success' });
        setTimeout(() => setStatusMsg(null), 3000);
      }
    } catch {
      setStatusMsg({ text: "JSON parsing failure - verification required.", type: 'error' });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col items-center justify-center space-y-6">
      <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      <p className="font-bold animate-pulse text-blue-600 uppercase tracking-widest text-[10px]">
        Synchronizing Assessment Data...
      </p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc] text-gray-900">
      <AdminHeader 
        title={testSettings.title} 
        path={[{ label: "Papers", href: "/admin-dashboard/tests" }, { label: "Studio" }]} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: 'Questions', label: 'Questions', icon: <Layers size={14} /> },
          { id: 'Settings', label: 'Configuration', icon: <Settings size={14} /> },
          { id: 'Analytics', label: 'Telemetry', icon: <PieChart size={14} /> }
        ]}
      />

      <div className="flex-1 flex overflow-hidden">
          {/* SIDEBAR NAVIGATION */}
          <div className="w-72 bg-white border-r border-gray-100 flex flex-col pt-8">
             {[
                { id: "Questions", label: "Synthesis Matrix", icon: <HelpCircle size={18} /> },
                { id: "Grading", label: "Grading Protocol", icon: <Target size={18} /> },
                { id: "Sections", label: "Institutional Units", icon: <Layers size={18} /> },
                { id: "Settings", label: "Core Configuration", icon: <Settings size={18} /> }
             ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-8 py-5 flex items-center justify-between group transition-all border-l-4 ${activeTab === tab.id ? "bg-blue-50 border-blue-600 text-blue-700" : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={activeTab === tab.id ? "text-blue-600" : "text-gray-300 group-hover:text-gray-500"}>{tab.icon}</span>
                    <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
                  </div>
                  <ChevronRight size={14} className={activeTab === tab.id ? "text-blue-400" : "text-gray-200"} />
                </button>
             ))}
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 overflow-y-auto bg-[#f8f9fc] p-10 lg:p-14">
              {activeTab === "Questions" ? (
                <div className="max-w-5xl mx-auto space-y-10">
                    {/* TEST DETAILS HEADER */}
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm animate-in slide-in-from-top-4 duration-500">
                       <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-50">
                          <div className="space-y-1">
                             <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-3 italic">
                                Assessment Intelligence <FileEdit size={16} className="text-blue-600" />
                             </h2>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active session parameters</p>
                          </div>
                       </div>
                       <div className="flex flex-wrap items-center gap-10">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                                <Clock size={18} />
                             </div>
                             <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Time Budget</p>
                                <p className="text-[13px] font-bold text-gray-900">{Math.floor(testSettings.duration / 60)}h {testSettings.duration % 60}m</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                                <Target size={18} />
                             </div>
                             <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Entity Tags</p>
                                <p className="text-[11px] font-black text-blue-600 uppercase tracking-tighter">JUNIOR ASSISTANT , {testSettings.title?.toUpperCase()}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* QUESTIONS LIST */}
                    <div className="space-y-6">
                       {questions.map((q, idx) => (
                          <div key={idx} className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm group hover:border-blue-200 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                             <div className="flex justify-between items-start mb-10">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black text-xs italic shadow-lg shadow-gray-900/10">{idx + 1}</div>
                                   <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">{q.type} Assessment</span>
                                </div>
                                <div className="flex items-center gap-2">
                                   <button onClick={() => { setCurrentQuestion(q); setIsEditing(true); }} className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><FileEdit size={18}/></button>
                                   <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Layers size={18}/></button>
                                   <button onClick={() => setShowConfirmModal({ show: true, type: 'delete', targetId: q._id })} className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                                </div>
                             </div>

                             <p className="text-[16px] font-bold text-gray-900 leading-relaxed mb-10 italic tracking-tight">{q.text}</p>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-14">
                                {q.options.map((opt, i) => (
                                   <div key={i} className={`flex items-center gap-5 px-6 py-4 rounded-2xl border transition-all ${q.correctOption === i ? "border-green-200 bg-green-50 text-green-700 shadow-sm shadow-green-500/10" : "border-gray-50 bg-gray-50/50 text-gray-500"}`}>
                                      <div className={`w-6 h-6 rounded-lg border flex items-center justify-center font-black text-[10px] ${q.correctOption === i ? "border-green-300 bg-green-500 text-white" : "border-gray-200 bg-white"}`}>
                                         {String.fromCharCode(65 + i)}
                                      </div>
                                      <span className="text-[13px] font-bold">{opt.text}</span>
                                   </div>
                                ))}
                             </div>
                             
                             <div className="mt-12 flex items-center gap-4 pt-10 border-t border-gray-50">
                                <div className="flex items-center gap-3 px-4 py-2 bg-green-50 border border-green-100 rounded-xl">
                                   <Target size={14} className="text-green-600" />
                                   <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Weight: +{q.marks}</span>
                                </div>
                                <div className="flex items-center gap-3 px-4 py-2 bg-red-50 border border-red-100 rounded-xl">
                                   <Shield size={14} className="text-red-600" />
                                   <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Penalty: -0.25</span>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>

                    <button 
                       onClick={() => {
                          setCurrentQuestion({ text: "", type: "mcq", options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }], correctOption: 0, marks: 1, section: "General" });
                          setIsEditing(true);
                       }}
                       className="w-full py-12 bg-white border-2 border-dashed border-gray-200 rounded-[3rem] text-gray-400 font-black uppercase tracking-widest text-[11px] hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-4 shadow-sm group"
                    >
                       <div className="w-16 h-16 rounded-[2rem] bg-gray-50 text-gray-300 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-90 transition-all duration-500 flex items-center justify-center shadow-sm">
                          <Plus size={32} />
                       </div>
                       Synthesize New Question Node
                    </button>
                </div>
              ) : activeTab === "Settings" ? (
                 <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-[3rem] shadow-sm overflow-hidden animate-in zoom-in-95 duration-500">
                    <div className="p-12 border-b border-gray-50 flex items-center justify-between">
                       <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Institutional Configuration</h3>
                       <Lock size={18} className="text-gray-300" />
                    </div>
                    <div className="p-12 lg:p-16 space-y-12">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assessment Label</label>
                             <input 
                                value={testSettings.title}
                                onChange={(e) => setTestSettings({...testSettings, title: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-5 outline-none focus:border-blue-400 focus:bg-white transition-all font-black text-gray-900 shadow-inner"
                             />
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Duration Matrix (Min)</label>
                             <input 
                                type="number"
                                value={testSettings.duration}
                                onChange={(e) => setTestSettings({...testSettings, duration: Number(e.target.value)})}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-5 outline-none focus:border-blue-400 focus:bg-white transition-all font-black text-gray-900 shadow-inner"
                             />
                          </div>
                       </div>
                       <button 
                          onClick={handleUpdateTest}
                          disabled={saving}
                          className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50"
                       >
                          {saving ? "Synchronizing Configuration..." : "Commit Protocol Changes"}
                       </button>
                    </div>
                 </div>
              ) : (
                 <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-[4rem] p-24 text-center shadow-sm">
                    <PieChart size={48} className="mx-auto text-blue-50 mb-8" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[11px] italic">Telemetry module undergoing synchronization</p>
                 </div>
              )}
          </div>
      </div>

      {/* MCQ EDITOR MODAL - Modern SaaS Look */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[500] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white rounded-[3.5rem] w-full max-w-6xl flex flex-col shadow-2xl h-[90vh] border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-500">
              {/* Header Bar */}
              <div className="px-12 py-10 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-blue-900/20">
                       <FileEdit size={28} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Synthesis Node</h3>
                       <div className="flex items-center gap-4 mt-2">
                          <span className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-[9px] font-black border border-green-100 uppercase tracking-widest">Weight: +1</span>
                          <span className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-[9px] font-black border border-red-100 uppercase tracking-widest">Penalty: -0.25</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleSaveQuestion(currentQuestion)} 
                      className="px-12 py-5 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl active:scale-95"
                    >
                       Deploy Node
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)} 
                      className="w-14 h-14 bg-white text-gray-400 hover:text-red-500 border border-gray-100 rounded-2xl flex items-center justify-center transition-all hover:bg-red-50"
                    >
                       <X size={28} />
                    </button>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-16 lg:p-20 space-y-20">
                 {/* Question Section */}
                 <div className="space-y-10">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xs italic">Q</div>
                          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Inquiry Content</h3>
                       </div>
                       <div className="flex items-center gap-8">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Complexity Level</label>
                          <select className="bg-gray-50 border border-gray-200 rounded-2xl px-8 py-4 text-[11px] font-black text-gray-700 outline-none focus:border-blue-400 transition-all">
                             <option>Standard</option>
                             <option>Foundational</option>
                             <option>Expert</option>
                          </select>
                       </div>
                    </div>
                    <textarea 
                      value={currentQuestion.text}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, text: e.target.value})}
                      placeholder="Input assessment inquiry here..."
                      className="w-full min-h-[220px] bg-gray-50 border border-gray-200 rounded-[2.5rem] p-12 outline-none focus:border-blue-400 focus:bg-white transition-all text-gray-900 text-[20px] font-black italic placeholder:text-gray-300 shadow-inner"
                    />
                 </div>

                 {/* Answers Section */}
                 <div className="space-y-10">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center font-black text-xs italic">A</div>
                          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Response Matrix</h3>
                       </div>
                       <div className="flex items-center gap-4 px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Protocol: Single Response
                       </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                       {currentQuestion.options.map((opt, i) => (
                          <div key={i} className="flex items-center gap-8 group">
                             <button 
                                onClick={() => setCurrentQuestion({...currentQuestion, correctOption: i})}
                                className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all ${currentQuestion.correctOption === i ? "border-green-500 bg-green-50 shadow-lg shadow-green-500/10" : "border-gray-100 bg-white hover:border-blue-200 shadow-sm"}`}
                             >
                                {currentQuestion.correctOption === i ? <CheckCircle2 size={32} className="text-green-600" /> : <span className="text-[11px] font-black text-gray-300">{String.fromCharCode(65 + i)}</span>}
                             </button>
                             <div className={`flex-1 bg-gray-50 border border-gray-100 rounded-[1.5rem] px-10 py-6 flex items-center justify-between transition-all group-hover:border-blue-200 focus-within:border-blue-400 focus-within:bg-white shadow-inner`}>
                                <input 
                                  value={opt.text}
                                  onChange={(e) => {
                                    const newOpts = [...currentQuestion.options];
                                    newOpts[i].text = e.target.value;
                                    setCurrentQuestion({...currentQuestion, options: newOpts});
                                  }}
                                  className="flex-1 bg-transparent outline-none text-gray-900 text-[16px] font-black placeholder:text-gray-200 italic"
                                  placeholder={`Response Option ${i + 1}`}
                                />
                             </div>
                             <button 
                               onClick={() => {
                                 const newOpts = currentQuestion.options.filter((_, idx) => idx !== i);
                                 setCurrentQuestion({...currentQuestion, options: newOpts});
                               }}
                               className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all shadow-lg"
                               title="Discard Option"
                             >
                                <Trash2 size={24} />
                             </button>
                          </div>
                       ))}
                    </div>

                    <button 
                      onClick={() => setCurrentQuestion({...currentQuestion, options: [...currentQuestion.options, { text: "" }]})}
                      className="w-full py-8 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-[11px] font-black text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all flex items-center justify-center gap-4 uppercase tracking-widest group"
                    >
                       <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center shadow-lg">
                          <Plus size={20} />
                       </div>
                       Append Response Node
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* STATUS & CONFIRMATION MODALS */}
      {statusMsg && (
        <div className={`fixed bottom-12 left-12 z-[600] px-10 py-6 rounded-[2.5rem] border shadow-2xl flex items-center gap-6 animate-in slide-in-from-left-12 duration-500 backdrop-blur-3xl bg-white/80 ${statusMsg.type === 'success' ? "border-green-100 text-green-700" : "border-red-100 text-red-600"}`}>
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${statusMsg.type === 'success' ? "bg-green-50" : "bg-red-50"}`}>
              {statusMsg.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
           </div>
           <p className="text-[11px] font-black uppercase tracking-widest">{statusMsg.text}</p>
        </div>
      )}

      {showConfirmModal.show && (
         <div className="fixed inset-0 z-[700] bg-gray-900/40 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-[4rem] p-16 lg:p-20 max-w-md w-full shadow-2xl text-center space-y-12 animate-in zoom-in-95 duration-500 border border-gray-100">
               <div className="w-28 h-28 bg-red-50 text-red-500 border border-red-100 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl shadow-red-500/10">
                  <AlertCircle size={48} />
               </div>
               <div className="space-y-4">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Discard Node?</h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">This operation will permanently purge the synthesized node from the institutional mesh. Proceed with caution.</p>
               </div>
               <div className="flex flex-col gap-5">
                  <button onClick={() => handleDeleteQuestion(showConfirmModal.targetId!)} className="w-full py-6 bg-red-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-2xl shadow-red-900/40 active:scale-95">Confirm Purge</button>
                  <button onClick={() => setShowConfirmModal({ show: false, type: 'delete' })} className="w-full py-6 bg-gray-100 text-gray-500 rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-gray-200 transition-all">Abort Operation</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
