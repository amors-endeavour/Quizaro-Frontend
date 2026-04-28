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
  X,
  Zap,
  Info,
  Activity,
  FileText
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
        text: q.questionText || q.text || "",
        marks: q.marks || 1
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
      setStatusMsg({ text: "Institutional parameters synchronized.", type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
      loadData();
    } catch {
      setStatusMsg({ text: "Synchronization failure.", type: 'error' });
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
      setStatusMsg({ text: "Assessment item preserved.", type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
      loadData();
      setIsEditing(false);
    } catch {
      setStatusMsg({ text: "Preservation protocol failed.", type: 'error' });
      setTimeout(() => setStatusMsg(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    try {
      await API.delete(`/admin/question/${qId}`);
      setStatusMsg({ text: "Registry item expunged.", type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
      loadData();
      setShowConfirmModal({ show: false, type: 'delete' });
    } catch {
      setStatusMsg({ text: "Expunge protocol failure.", type: 'error' });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  if (loading && questions.length === 0) return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex flex-col items-center justify-center space-y-6 transition-colors duration-300">
      <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin" />
      <p className="font-black animate-pulse text-blue-600 dark:text-blue-400 uppercase tracking-widest text-[10px]">
        Synchronizing Neural Workspace...
      </p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc] dark:bg-[#050816] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <AdminHeader 
        title={testSettings.title} 
        path={[{ label: "Governance" }, { label: "Library", href: "/admin-dashboard/tests" }, { label: "Neural Studio" }]} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: 'Questions', label: 'Synthesis Matrix', icon: <Layers size={14} /> },
          { id: 'Settings', label: 'Configuration', icon: <Settings size={14} /> },
          { id: 'Analytics', label: 'Telemetry', icon: <PieChart size={14} /> }
        ]}
      />

      <div className="flex-1 flex overflow-hidden">
          {/* SIDEBAR NAVIGATION */}
          <div className="w-80 bg-white dark:bg-[#0a0f29] border-r border-gray-100 dark:border-gray-800 flex flex-col pt-10 transition-colors duration-300 shrink-0 shadow-sm relative z-10">
             {[
                { id: "Questions", label: "Synthesis Matrix", icon: <HelpCircle size={20} /> },
                { id: "Grading", label: "Grading Protocol", icon: <Target size={20} /> },
                { id: "Sections", label: "Institutional Units", icon: <Layers size={20} /> },
                { id: "Settings", label: "Core Configuration", icon: <Settings size={20} /> }
             ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-10 py-6 flex items-center justify-between group transition-all border-l-4 ${activeTab === tab.id ? "bg-blue-50 dark:bg-blue-900/20 border-blue-600 text-blue-700 dark:text-blue-400" : "border-transparent text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-[#050816] hover:text-gray-900 dark:hover:text-white"}`}
                >
                  <div className="flex items-center gap-6">
                    <span className={activeTab === tab.id ? "text-blue-600 dark:text-blue-400" : "text-gray-200 dark:text-gray-800 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"}>{tab.icon}</span>
                    <span className="text-[11px] font-black uppercase tracking-widest italic">{tab.label}</span>
                  </div>
                  <ChevronRight size={16} className={activeTab === tab.id ? "text-blue-600 dark:text-blue-400" : "text-gray-100 dark:text-gray-900"} />
                </button>
             ))}

             <div className="mt-auto p-10 space-y-6">
                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] border border-blue-100 dark:border-blue-800/30">
                   <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest italic leading-none mb-3">Sync Status</p>
                   <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-500" />
                      <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest italic">Grid Operational</span>
                   </div>
                </div>
             </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 overflow-y-auto bg-[#f8f9fc] dark:bg-[#050816] p-10 lg:p-14 transition-colors duration-300">
              {activeTab === "Questions" ? (
                <div className="max-w-5xl mx-auto space-y-12 pb-20">
                    {/* TEST DETAILS HEADER */}
                    <div className="bg-white dark:bg-[#0a0f29] border border-gray-100 dark:border-gray-800 rounded-[3.5rem] p-12 shadow-sm animate-in slide-in-from-top-6 duration-700 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 pb-10 border-b border-gray-50 dark:border-gray-800">
                          <div className="space-y-3">
                             <div className="flex items-center gap-4">
                                <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] italic leading-none">Assessment Intelligence</h2>
                                <div className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest italic shadow-lg shadow-blue-900/20">Studio v4.0</div>
                             </div>
                             <p className="text-[10px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-widest italic leading-none">Active session neural configuration</p>
                          </div>
                          <div className="flex items-center gap-4">
                             <button className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-400 dark:text-gray-500 hover:text-blue-600 transition-all shadow-sm"><Download size={20} /></button>
                             <button className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-400 dark:text-gray-500 hover:text-blue-600 transition-all shadow-sm"><Activity size={20} /></button>
                          </div>
                       </div>
                       <div className="flex flex-wrap items-center gap-12">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-600 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                <Clock size={20} />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-2 italic">Temporal Budget</p>
                                <p className="text-[14px] font-black text-gray-900 dark:text-white italic leading-none">{Math.floor(testSettings.duration / 60)}h {testSettings.duration % 60}m Active</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                <Target size={20} />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-2 italic">Cluster Identity</p>
                                <p className="text-[12px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest italic leading-none">{testSettings.title?.toUpperCase() || "UNIDENTIFIED NODE"}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* QUESTIONS LIST */}
                    <div className="space-y-8">
                       {questions.map((q, idx) => (
                          <div key={idx} className="bg-white dark:bg-[#0a0f29] border border-gray-100 dark:border-gray-800 rounded-[3.5rem] p-12 shadow-sm group hover:border-blue-200 dark:hover:border-blue-500/50 transition-all duration-500 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: `${idx * 50}ms` }}>
                             <div className="flex justify-between items-start mb-10">
                                <div className="flex items-center gap-6">
                                   <div className="w-12 h-12 rounded-2xl bg-gray-900 dark:bg-gray-800 text-white flex items-center justify-center font-black text-sm italic shadow-xl shadow-gray-900/10 group-hover:rotate-12 transition-transform duration-500">{idx + 1}</div>
                                   <div className="space-y-2">
                                      <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] bg-blue-50 dark:bg-blue-900/20 px-6 py-2 rounded-full border border-blue-100 dark:border-blue-800/30 italic">Assessment Node // {q.type}</span>
                                      <p className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest italic leading-none">System Verification: 100% Integrity</p>
                                   </div>
                                </div>
                                <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#050816] p-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-inner">
                                   <button onClick={() => { setCurrentQuestion(q); setIsEditing(true); }} className="p-3 text-gray-300 dark:text-gray-700 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all shadow-sm"><FileEdit size={18}/></button>
                                   <button className="p-3 text-gray-300 dark:text-gray-700 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all shadow-sm"><Activity size={18}/></button>
                                   <div className="w-px h-6 bg-gray-100 dark:bg-gray-800 mx-1" />
                                   <button onClick={() => setShowConfirmModal({ show: true, type: 'delete', targetId: q._id })} className="p-3 text-gray-300 dark:text-gray-700 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all shadow-sm"><Trash2 size={18}/></button>
                                </div>
                             </div>

                             <p className="text-[18px] font-black text-gray-900 dark:text-white leading-relaxed mb-12 italic tracking-tight group-hover:text-blue-600 transition-colors duration-500">{q.text}</p>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-10">
                                {q.options.map((opt, i) => (
                                   <div key={i} className={`flex items-center gap-6 px-8 py-5 rounded-[2rem] border-2 transition-all duration-500 ${q.correctOption === i ? "border-green-100 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 shadow-xl shadow-green-900/5" : "border-gray-50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/30 text-gray-400 dark:text-gray-600"}`}>
                                      <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-[11px] transition-all duration-500 ${q.correctOption === i ? "border-green-400 dark:border-green-600 bg-green-600 dark:bg-green-700 text-white shadow-lg" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"}`}>
                                         {String.fromCharCode(65 + i)}
                                      </div>
                                      <span className="text-[14px] font-black italic">{opt.text}</span>
                                   </div>
                                ))}
                             </div>
                             
                             <div className="mt-14 flex items-center gap-6 pt-10 border-t border-gray-50 dark:border-gray-800">
                                <div className="flex items-center gap-3 px-6 py-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-2xl transition-all hover:scale-105 duration-300">
                                   <Target size={16} className="text-green-600 dark:text-green-400" />
                                   <span className="text-[10px] font-black text-green-700 dark:text-green-400 uppercase tracking-widest italic">Weight: +{q.marks} Institutional Credits</span>
                                </div>
                                <div className="flex items-center gap-3 px-6 py-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-2xl transition-all hover:scale-105 duration-300">
                                   <Shield size={16} className="text-red-600 dark:text-red-400" />
                                   <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest italic">Neural Penalty: -0.25</span>
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
                       className="w-full py-20 bg-white dark:bg-[#0a0f29] border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[4rem] text-gray-300 dark:text-gray-800 font-black uppercase tracking-[0.3em] text-[12px] hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-700 flex flex-col items-center justify-center gap-8 shadow-sm group active:scale-[0.99] italic"
                    >
                       <div className="w-20 h-20 rounded-[2.5rem] bg-gray-50 dark:bg-[#050816] text-gray-200 dark:text-gray-900 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-180 transition-all duration-1000 flex items-center justify-center shadow-xl">
                          <Plus size={40} />
                       </div>
                       Synthesize Neural Question Node
                    </button>
                </div>
              ) : activeTab === "Settings" ? (
                <div className="max-w-4xl mx-auto bg-white dark:bg-[#0a0f29] border border-gray-100 dark:border-gray-800 rounded-[4rem] shadow-sm overflow-hidden animate-in zoom-in-95 duration-500 transition-all duration-500">
                    <div className="px-12 py-10 lg:px-16 lg:py-12 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#050816]/30">
                       <div className="space-y-1">
                          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.3em] italic leading-none">Institutional Configuration</h3>
                          <p className="text-[10px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-widest italic leading-none">Governance parameter synchronization</p>
                       </div>
                       <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-gray-700"><Lock size={20} /></div>
                    </div>
                    <div className="p-12 lg:p-16 space-y-12">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2 leading-none italic">Assessment Identifier (Title)</label>
                             <input 
                                value={testSettings.title}
                                onChange={(e) => setTestSettings({...testSettings, title: e.target.value})}
                                className="w-full bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 rounded-[1.5rem] px-8 py-5 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all duration-500 font-black text-sm text-gray-900 dark:text-white italic shadow-inner"
                                placeholder="e.g. SSC CGL Phase 01"
                             />
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2 leading-none italic">Temporal Protocol (Minutes)</label>
                             <input 
                                type="number"
                                value={testSettings.duration}
                                onChange={(e) => setTestSettings({...testSettings, duration: Number(e.target.value)})}
                                className="w-full bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 rounded-[1.5rem] px-8 py-5 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all duration-500 font-black text-sm text-gray-900 dark:text-white shadow-inner"
                             />
                          </div>
                       </div>
                       
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2 leading-none italic">Institutional Category Matrix</label>
                          <select 
                             className="w-full bg-gray-50 dark:bg-[#050816] border border-gray-100 dark:border-gray-800 rounded-[1.5rem] px-8 py-5 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all duration-500 font-black text-sm text-gray-900 dark:text-white italic shadow-inner appearance-none cursor-pointer"
                             value={testSettings.category}
                             onChange={(e) => setTestSettings({...testSettings, category: e.target.value})}
                          >
                             <option value="General">Foundational Matrix</option>
                             <option value="Civil Services">Civil Services Cluster</option>
                             <option value="Banking">Banking & Fiscal Protocol</option>
                             <option value="Engineering">Advanced Engineering Node</option>
                          </select>
                       </div>

                       <div className="pt-8">
                          <button 
                             onClick={handleUpdateTest}
                             disabled={saving}
                             className="w-full py-8 bg-blue-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 italic"
                          >
                             {saving ? (
                                <>
                                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                   Synchronizing Configuration...
                                </>
                             ) : (
                                <>
                                   <CheckCircle2 size={18} />
                                   Commit Protocol Modifications
                                </>
                             )}
                          </button>
                       </div>
                    </div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto bg-white dark:bg-[#0a0f29] border border-gray-100 dark:border-gray-800 rounded-[5rem] p-32 text-center shadow-sm flex flex-col items-center gap-10 animate-in zoom-in-95 duration-700">
                    <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-[2.5rem] flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xl animate-pulse">
                       <PieChart size={48} />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Telemetry Module Staged</h3>
                       <p className="text-[11px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-[0.3em] italic leading-none">Undergoing Real-time Synchronization</p>
                    </div>
                </div>
              )}
          </div>
      </div>

      {/* MCQ EDITOR MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-[#050816]/60 dark:bg-black/80 backdrop-blur-xl z-[500] flex items-center justify-center p-6 animate-in fade-in duration-500">
           <div className="bg-white dark:bg-[#0a0f29] rounded-[4rem] w-full max-w-6xl flex flex-col shadow-2xl h-[92vh] border border-gray-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-500 transition-all">
              {/* Header Bar */}
              <div className="px-12 py-10 lg:px-16 bg-gray-50/50 dark:bg-[#050816]/30 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-8">
                 <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-900/20 transition-all rotate-6 hover:rotate-0 duration-500">
                       <FileEdit size={32} />
                    </div>
                    <div className="space-y-3">
                       <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Synthesis Protocol</h3>
                       <div className="flex items-center gap-6">
                          <span className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-6 py-2 rounded-full text-[10px] font-black border border-green-100 dark:border-green-800/30 uppercase tracking-widest leading-none italic">Weight: +{currentQuestion.marks} Credit</span>
                          <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-6 py-2 rounded-full text-[10px] font-black border border-red-100 dark:border-red-800/30 uppercase tracking-widest leading-none italic">Penalty: -0.25 Logic</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-6 w-full sm:w-auto">
                    <button 
                      onClick={() => handleSaveQuestion(currentQuestion)} 
                      disabled={saving}
                      className="flex-1 sm:flex-none px-12 py-6 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] flex items-center justify-center gap-4 italic"
                    >
                       {saving ? "Deploying..." : "Deploy Node to Grid"}
                       {!saving && <Zap size={18} />}
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)} 
                      className="w-16 h-16 bg-white dark:bg-gray-800 text-gray-300 dark:text-gray-700 hover:text-red-500 dark:hover:text-red-400 border border-gray-100 dark:border-gray-700 rounded-2xl flex items-center justify-center transition-all hover:bg-red-50 dark:hover:bg-red-900/20 shadow-sm active:scale-90"
                    >
                       <X size={32} />
                    </button>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-16 lg:p-20 space-y-20 custom-scrollbar">
                 {/* Question Section */}
                 <div className="space-y-10">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center font-black text-sm italic shadow-sm border border-blue-100 dark:border-blue-800/30">Q</div>
                          <div className="space-y-1">
                             <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest italic leading-none">Inquiry Protocol</h3>
                             <p className="text-[10px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-widest italic leading-none">Core Neural Inquiry Synthesis</p>
                          </div>
                       </div>
                       <div className="hidden sm:flex items-center gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none italic text-right block">Complexity Matrix</label>
                             <select className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-8 py-4 text-[11px] font-black text-gray-900 dark:text-white outline-none focus:border-blue-400 transition-all uppercase tracking-widest italic appearance-none cursor-pointer">
                                <option>Standard Intelligence</option>
                                <option>Foundational Node</option>
                                <option>Expert Synthesis</option>
                             </select>
                          </div>
                       </div>
                    </div>
                    <textarea 
                      value={currentQuestion.text}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, text: e.target.value})}
                      placeholder="Input the core inquiry for assessment synthesis..."
                      className="w-full min-h-[250px] bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-[3rem] p-12 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#0a0f29] transition-all duration-500 text-gray-900 dark:text-white text-[22px] font-black italic placeholder:text-gray-200 dark:placeholder:text-gray-800 shadow-inner"
                    />
                 </div>

                 {/* Answers Section */}
                 <div className="space-y-12">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center font-black text-sm italic shadow-sm border border-green-100 dark:border-green-800/30">A</div>
                          <div className="space-y-1">
                             <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest italic leading-none">Response Options</h3>
                             <p className="text-[10px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-widest italic leading-none">Neural Branching Paths</p>
                          </div>
                       </div>
                       <div className="hidden sm:flex items-center gap-4 px-8 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-full text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest leading-none italic">
                          Single Point Truth Selection
                       </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                       {currentQuestion.options.map((opt, i) => (
                          <div key={i} className="flex items-center gap-8 group">
                             <button 
                                onClick={() => setCurrentQuestion({...currentQuestion, correctOption: i})}
                                className={`w-16 h-16 rounded-[1.5rem] border-2 flex items-center justify-center transition-all duration-500 shrink-0 ${currentQuestion.correctOption === i ? "border-green-500 bg-green-600 text-white shadow-2xl shadow-green-500/20" : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-500 shadow-sm"}`}
                             >
                                {currentQuestion.correctOption === i ? <CheckCircle2 size={36} /> : <span className="text-[12px] font-black text-gray-200 dark:text-gray-800 group-hover:text-blue-500">{String.fromCharCode(65 + i)}</span>}
                             </button>
                             <div className={`flex-1 bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] px-12 py-8 flex items-center justify-between transition-all duration-500 group-hover:border-blue-400 focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-[#0a0f29] shadow-inner`}>
                                <input 
                                  value={opt.text}
                                  onChange={(e) => {
                                    const newOpts = [...currentQuestion.options];
                                    newOpts[i].text = e.target.value;
                                    setCurrentQuestion({...currentQuestion, options: newOpts});
                                  }}
                                  className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white text-[18px] font-black placeholder:text-gray-200 dark:placeholder:text-gray-800 italic leading-none"
                                  placeholder={`Response Protocol Option ${i + 1}`}
                                />
                             </div>
                             <button 
                               onClick={() => {
                                 const newOpts = currentQuestion.options.filter((_, idx) => idx !== i);
                                 setCurrentQuestion({...currentQuestion, options: newOpts});
                               }}
                               className="w-16 h-16 shrink-0 flex items-center justify-center rounded-[1.5rem] bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-300 dark:text-gray-700 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-[#0a0f29] transition-all duration-500 shadow-sm active:scale-90"
                               title="Discard Branch"
                             >
                                <Trash2 size={24} />
                             </button>
                          </div>
                       ))}
                    </div>

                    <button 
                      onClick={() => setCurrentQuestion({...currentQuestion, options: [...currentQuestion.options, { text: "" }]})}
                      className="w-full py-10 border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem] text-[12px] font-black text-gray-300 dark:text-gray-800 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-200 dark:hover:border-blue-500/50 transition-all duration-700 flex items-center justify-center gap-6 uppercase tracking-[0.3em] group active:scale-[0.99] italic"
                    >
                       <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-200 dark:text-gray-900 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 flex items-center justify-center shadow-lg">
                          <Plus size={24} />
                       </div>
                       Append Neural Response Branch
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* STATUS & CONFIRMATION MODALS */}
      {statusMsg && (
        <div className={`fixed bottom-12 left-12 z-[600] px-10 py-7 rounded-[3rem] border shadow-2xl flex items-center gap-8 animate-in slide-in-from-left-12 duration-500 backdrop-blur-3xl bg-white/80 dark:bg-gray-900/80 ${statusMsg.type === 'success' ? "border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400" : "border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400"}`}>
           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${statusMsg.type === 'success' ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
              {statusMsg.type === 'success' ? <CheckCircle2 size={28} /> : <AlertCircle size={28} />}
           </div>
           <p className="text-[12px] font-black uppercase tracking-widest italic">{statusMsg.text}</p>
        </div>
      )}

      {showConfirmModal.show && (
         <div className="fixed inset-0 z-[700] bg-[#050816]/60 dark:bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#0a0f29] rounded-[4rem] p-16 lg:p-24 max-w-lg w-full shadow-2xl text-center space-y-14 animate-in zoom-in-95 duration-700 border border-gray-100 dark:border-gray-800">
               <div className="w-32 h-32 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-2 border-red-100 dark:border-red-900/30 rounded-[3.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-red-500/10">
                  <AlertCircle size={64} />
               </div>
               <div className="space-y-6">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic leading-none">Confirm Purge?</h3>
                  <p className="text-[11px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest leading-relaxed italic">Permanent expungement of this neural node from the institutional mesh. Recovery protocols are unavailable.</p>
               </div>
               <div className="flex flex-col gap-6">
                  <button onClick={() => handleDeleteQuestion(showConfirmModal.targetId!)} className="w-full py-8 bg-red-600 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-2xl shadow-red-900/40 active:scale-[0.98] italic">Permanent Expunge</button>
                  <button onClick={() => setShowConfirmModal({ show: false, type: 'delete' })} className="w-full py-8 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-700 transition-all italic">Abort Protocol</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
