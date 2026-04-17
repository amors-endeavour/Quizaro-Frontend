"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import AdminFolderCard from "@/components/AdminFolderCard";
import AdminTestCard from "@/components/AdminTestCard";
import AnalyticsModal from "@/components/AnalyticsModal";
import API from "@/app/lib/api";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";

interface Test {
  _id: string;
  title: string;
  description?: string;
  duration?: number;
  price?: number;
  totalQuestions?: number;
  category?: string;
  seriesId?: string;
  paperNumber?: number;
  difficulty?: string;
  status?: "Draft" | "Published";
  createdAt: string;
}

interface Series {
  _id: string;
  title: string;
  description?: string;
  category?: string;
}

export default function TestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSeriesModal, setShowSeriesModal] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<{show: boolean, type: 'delete' | 'series_delete' | 'bulk_delete', targetId?: string, targetName?: string}>({show: false, type: 'delete'});
  const [statusMsg, setStatusMsg] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  
  // Navigation State
  const [currentSeriesId, setCurrentSeriesId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 30,
    price: 0,
    seriesId: "",
    paperNumber: 1,
    difficulty: "Medium"
  });

  const [seriesFormData, setSeriesFormData] = useState({
    title: "",
    description: "",
    category: "General",
    isFinite: false,
    maxPapers: 5
  });

  const [selectedAnalyticsTest, setSelectedAnalyticsTest] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testsRes, seriesRes] = await Promise.all([
          API.get("/admin/tests"),
          API.get("/admin/series")
        ]);
        setTests(testsRes.data);
        setSeries(seriesRes.data);
      } catch (err) {
        console.error("Failed to fetch library data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Logic: Filter tests based on current series and search
  const filteredTests = useMemo(() => {
    return tests.filter((t) => {
      const matchesSeries = currentSeriesId ? t.seriesId === currentSeriesId : true;
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSeries && matchesSearch;
    });
  }, [tests, currentSeriesId, searchQuery]);

  const handleSeriesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/admin/series/create", seriesFormData);
      setStatusMsg({ text: "Series generated successfully.", type: 'success' });
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      setStatusMsg({ text: err?.response?.data?.message || "Generation failure.", type: 'error' });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTest) {
        await API.put(`/admin/test/${editingTest._id}`, formData);
      } else {
        await API.post("/test/create", formData);
      }
      setStatusMsg({ text: "Paper metadata preserved.", type: 'success' });
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      setStatusMsg({ text: "Reservation error detected.", type: 'error' });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  const handleToggleSelect = (id: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedTests([...selectedTests, id]);
    } else {
      setSelectedTests(selectedTests.filter(sid => sid !== id));
    }
  };

  const handleDeleteSeries = async (id: string) => {
    try {
      await API.delete(`/admin/series/${id}`);
      setStatusMsg({ text: "Series and nested papers expunged.", type: 'success' });
      setTimeout(() => window.location.reload(), 2000);
    } catch {
      setStatusMsg({ text: "Expunge operation blocked.", type: 'error' });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedTests.map(id => API.delete(`/admin/test/${id}`)));
      setTests(tests.filter(t => !selectedTests.includes(t._id)));
      setSelectedTests([]);
      setShowConfirmModal({ show: false, type: 'bulk_delete' });
      setStatusMsg({ text: "Batch papers expunged.", type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch {
      setStatusMsg({ text: "Batch operation failure.", type: 'error' });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleStatusToggle = async (id: string, newStatus: string) => {
     try {
       // Optimistic update for UI smoothness
       setTests(tests.map(t => t._id === id ? { ...t, status: newStatus as any } : t));
       await API.put(`/admin/test/${id}`, { status: newStatus });
     } catch {
       console.error("Status update failed");
     }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/admin/test/${id}`);
      setTests(tests.filter(t => t._id !== id));
      setSelectedTests(selectedTests.filter(sid => sid !== id));
      setShowConfirmModal({ show: false, type: 'delete' });
      setStatusMsg({ text: "Single item expunged.", type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch {
      setStatusMsg({ text: "Operation failed.", type: 'error' });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleExport = (testId: string) => {
    const token = document.cookie.split('token=')[1]?.split(';')[0];
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/admin/export/${testId}?token=${token}`, '_blank');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isCSV = file.name.endsWith(".csv");

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          let importData;
          const text = event.target?.result as string;

          if (isCSV) {
            // Advanced CSV Parser: Handles quoted strings with commas efficiently
            // Format: Title, Description, Duration
            // Question, A, B, C, D, CorrectIndex(0-3), Explanation
            const lines = text.split("\n").filter(l => l.trim());
            const [testInfo, ...qLines] = lines;
            
            // Regex to split by comma but ignore commas inside quotes
            const splitCsv = (str: string) => {
              const matches = str.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
              return matches ? matches.map(m => m.replace(/^"|"$/g, '').trim()) : str.split(",").map(s => s.trim());
            };

            const [title, description, duration] = splitCsv(testInfo);

            const questions = qLines.map(line => {
              const parts = splitCsv(line);
              // Expected 7 parts: Q, A, B, C, D, Index, Expl
              const [qText, a, b, c, d, correct, expl] = parts;
              return {
                questionText: qText,
                options: [
                  { text: a || "Option A" },
                  { text: b || "Option B" },
                  { text: c || "Option C" },
                  { text: d || "Option D" }
                ],
                correctOption: Number(correct) || 0,
                explanation: expl || ""
              };
            });

            importData = {
              test: { title: title || "Imported Paper", description: description || "No description provided", duration: Number(duration) || 30 },
              questions
            };
          } else {
            importData = JSON.parse(text);
          }

          setLoading(true);
          await API.post("/admin/import", importData);
          alert("Institutional Data Ported Successfully!");
          window.location.reload();
        } catch (err) {
          alert("Ingestion Error: Please verify file format integrity.");
          setLoading(false);
        }
      };
      reader.readAsText(file);
    } catch {
      alert("System Error: Critical failure during ingestion.");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050816] flex items-center justify-center font-black animate-pulse text-cyan-400 uppercase tracking-widest leading-none text-xs text-center">Accessing Institutional <br/> Library Grid...</div>;

  return (
    <div className="flex flex-col min-h-screen relative bg-[#050816] text-white selection:bg-cyan-500/30">
      <main className="flex-1 overflow-y-auto">
        <AdminHeader 
          title={currentSeriesId ? series.find(s => s._id === currentSeriesId)?.title || "Papers" : "Institutional Library"}
          path={[
            { label: "Series Catalog", href: currentSeriesId ? "#" : undefined },
            ...(currentSeriesId ? [{ label: series.find(s => s._id === currentSeriesId)?.title || "Papers" }] : [])
          ]}
          onNew={() => {
            setEditingTest(null);
            setFormData({
              title: "",
              description: "",
              duration: 30,
              price: 0,
              seriesId: currentSeriesId || "",
              paperNumber: tests.filter(t => t.seriesId === currentSeriesId).length + 1,
              difficulty: "Medium"
            });
            setShowModal(true);
          }}
          onSearchChange={setSearchQuery}
        />

        <div className="p-10 lg:p-14 max-w-[1700px] mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
          
          {/* BATCH ACTION BAR (FLOATING) */}
          {selectedTests.length > 0 && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-2xl text-white px-8 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-8 animate-in slide-in-from-bottom-20 duration-500 border border-white/20">
               <div className="flex items-center gap-3 pr-8 border-r border-white/10">
                  <span className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center font-black text-xs shadow-lg shadow-cyan-900/40">{selectedTests.length}</span>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Selection Active</p>
               </div>
               
               <div className="flex items-center gap-6">
                  <button onClick={() => setShowConfirmModal({ show: true, type: 'bulk_delete' })} className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors italic">Batch Expunge</button>
                  <button onClick={() => setSelectedTests([])} className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Reset</button>
               </div>
            </div>
          )}

          {/* FOLDER INFO HUD */}
          <div className="flex items-center justify-between mb-4 animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="flex items-center gap-6">
                <div 
                  onClick={() => {
                    if (selectedTests.length === filteredTests.length) setSelectedTests([]);
                    else setSelectedTests(filteredTests.map(t => t._id));
                  }}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${selectedTests.length === filteredTests.length && filteredTests.length > 0 ? "bg-cyan-600 border-cyan-400 shadow-lg shadow-cyan-900/40" : "border-white/10 bg-white/5"}`}
                >
                  {selectedTests.length === filteredTests.length && filteredTests.length > 0 && <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]" />}
                </div>
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-3 italic">
                   {currentSeriesId ? "Papers" : "Institutional Catalogs"}
                   <span className="text-gray-800">/</span>
                   <span className="text-white tracking-tighter normal-case font-black text-xs italic">
                     {currentSeriesId ? series.find(s => s._id === currentSeriesId)?.title : "Overview"}
                   </span>
                </h3>
             </div>
             
             <div className="flex gap-4">
                <div className="relative group">
                   <button className="px-6 py-2.5 bg-white/5 text-gray-400 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white hover:border-white/20 transition-all italic">
                     Import Registry
                   </button>
                   <input 
                      type="file" 
                      accept=".json,.csv" 
                      onChange={handleImport}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                   />
                </div>

                  {!currentSeriesId && (
                   <>
                    <button 
                      onClick={() => {
                        setEditingTest(null);
                        setFormData({
                          title: "",
                          description: "",
                          duration: 30,
                          price: 0,
                          seriesId: "",
                          paperNumber: 1,
                          difficulty: "Medium"
                        });
                        setShowModal(true);
                      }}
                      className="px-6 py-2.5 bg-white text-black hover:bg-cyan-400 hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic shadow-xl shadow-cyan-900/10"
                    >
                      + New Paper
                    </button>
                    <button 
                      onClick={() => setShowSeriesModal(true)}
                      className="px-6 py-2.5 bg-cyan-600/10 text-cyan-400 border border-cyan-400/20 hover:bg-cyan-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic shadow-lg shadow-black/20"
                    >
                      + New Series
                    </button>
                   </>
                 )}
                {currentSeriesId && (
                  <button 
                    onClick={() => setCurrentSeriesId(null)}
                    className="px-6 py-2.5 bg-white/5 text-gray-500 border border-white/5 hover:border-white/10 hover:text-white hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic"
                  >
                    ← Catalog Grid
                  </button>
                )}
             </div>
          </div>

          {!currentSeriesId ? (
            /* SERIES GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {series.length === 0 && tests.filter(t => !t.seriesId).length === 0 ? (
                <div className="col-span-full py-40 text-center bg-white/5 rounded-[4rem] border border-dashed border-white/10 animate-pulse">
                  <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest italic tracking-[0.3em]">Institutional Repository Empty</p>
                </div>
              ) : (
                <>
                  {series.map((s) => (
                    <AdminFolderCard 
                      key={s._id} 
                      name={s.title} 
                      count={tests.filter(t => t.seriesId === s._id).length}
                      onClick={() => {
                        setCurrentSeriesId(s._id);
                        window.scrollTo(0, 0);
                      }}
                      onDelete={() => setShowConfirmModal({ show: true, type: 'series_delete', targetId: s._id, targetName: s.title })}
                    />
                  ))}
                  
                  {/* Standalone Papers displayed as cards in the main view */}
                  {tests.filter(t => !t.seriesId).map((test) => (
                    <div key={test._id} className="col-span-full xl:col-span-2">
                       <AdminTestCard 
                        title={test.title}
                        description={test.description}
                        date={new Date(test.createdAt).toLocaleDateString()}
                        status={(test.status || (test.totalQuestions || 0) > 0 ? "Published" : "Draft") as any}
                        onEdit={() => {
                          setEditingTest(test);
                          setFormData({
                            title: test.title,
                            description: test.description || "",
                            duration: test.duration || 30,
                            price: test.price || 0,
                            seriesId: "",
                            paperNumber: test.paperNumber || 1,
                            difficulty: test.difficulty || "Medium"
                          });
                          setShowModal(true);
                        }}
                        onQuestions={() => router.push(`/admin-dashboard/${test._id}`)}
                        onDelete={() => setShowConfirmModal({ show: true, type: 'delete', targetId: test._id })}
                        onExport={() => handleExport(test._id)}
                        onAnalytics={() => setSelectedAnalyticsTest({ id: test._id, title: test.title })}
                       />
                    </div>
                  ))}
                </>
              )}
            </div>
          ) : (
            /* PAPERS LIST VIEW */
            <div className="flex flex-col gap-6">
               <button 
                  onClick={() => {
                    setEditingTest(null);
                    setFormData({
                      title: "",
                      description: "",
                      duration: 30,
                      price: 0,
                      seriesId: currentSeriesId || "",
                      paperNumber: tests.filter(t => t.seriesId === currentSeriesId).length + 1,
                      difficulty: "Medium"
                    });
                    setShowModal(true);
                  }}
                  className="w-full py-12 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center gap-4 text-gray-600 hover:border-cyan-400/30 hover:text-cyan-400 transition-all group bg-white/[0.02] backdrop-blur-sm"
               >
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all">+</div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Synthesize New Assessment Node</span>
               </button>

               {filteredTests.length === 0 ? (
                 <div className="py-24 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/5">
                   <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] italic opacity-50 underline decoration-cyan-400/30 underline-offset-8">Empty Intelligence Sequence</p>
                 </div>
               ) : (
                 filteredTests.sort((a,b) => (a.paperNumber || 0) - (b.paperNumber || 0)).map((test) => (
                    <AdminTestCard 
                      key={test._id}
                      title={test.title}
                      description={`Paper ${test.paperNumber || "N/A"}`}
                      date={new Date(test.createdAt).toISOString().split('T')[0].replace(/-/g, '/')}
                      status={test.status || "Draft"}
                      isSelected={selectedTests.includes(test._id)}
                      onSelect={(val) => handleToggleSelect(test._id, val)}
                      onStatusToggle={(ns) => handleStatusToggle(test._id, ns)}
                      onEdit={() => {
                        setEditingTest(test);
                        setFormData({
                          title: test.title,
                          description: test.description || "",
                          duration: test.duration || 30,
                          price: test.price || 0,
                          seriesId: test.seriesId || "",
                          paperNumber: test.paperNumber || 1,
                          difficulty: test.difficulty || "Medium"
                        });
                        setShowModal(true);
                      }}
                      onQuestions={() => router.push(`/admin-dashboard/${test._id}`)}
                      onDelete={() => setShowConfirmModal({ show: true, type: 'delete', targetId: test._id })}
                      onExport={() => handleExport(test._id)}
                      onAnalytics={() => setSelectedAnalyticsTest({ id: test._id, title: test.title })}
                    />
                 ))
               )}
            </div>
          )}
        </div>
      </main>

      {/* ANALYTICS MODAL */}
      {selectedAnalyticsTest && (
        <AnalyticsModal 
          testId={selectedAnalyticsTest.id}
          testTitle={selectedAnalyticsTest.title}
          onClose={() => setSelectedAnalyticsTest(null)}
        />
      )}

      {/* CREATE / EDIT MODAL (TEST PAPER) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0f1d] border border-white/10 rounded-[4rem] w-full max-w-xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-300">
            <div className="px-10 py-10 bg-white/5 border-b border-white/10 flex items-center justify-between">
               <h3 className="text-xl font-black text-white tracking-tight uppercase italic">
                 {editingTest ? "Node Calibration" : "Construction Hub"}
               </h3>
               <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors duration-300">
                 <X size={28} />
               </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-12 space-y-8">
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 italic">Intelligence Sequence Assignment</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all font-black text-sm text-cyan-400 appearance-none"
                  value={formData.seriesId}
                  onChange={(e) => setFormData({...formData, seriesId: e.target.value})}
                >
                  <option value="" className="bg-[#0a0f1d]">Standalone Intelligence Node</option>
                  {series.map(s => <option key={s._id} value={s._id} className="bg-[#0a0f1d]">{s.title}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 italic">Node Identity</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all font-black text-sm text-white placeholder:text-gray-700"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    placeholder="e.g. Model Paper 01"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 italic">Sequence Rank</label>
                  <input 
                    type="number"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all font-black text-sm text-white"
                    value={formData.paperNumber}
                    onChange={(e) => setFormData({...formData, paperNumber: Number(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 italic">Duration (Min)</label>
                  <input 
                    type="number"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all font-black text-sm text-white"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 italic">Registry Fee (₹)</label>
                  <input 
                    type="number"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all font-black text-sm text-amber-500"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex gap-6 pt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-5 border-2 border-white/5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest text-gray-600 hover:bg-white/5 hover:text-white transition duration-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-5 bg-white text-black rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all duration-300 shadow-2xl shadow-cyan-900/20 active:scale-95"
                >
                  {editingTest ? "Preserve Evolution" : "Initialize Node"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SERIES MODAL */}
      {showSeriesModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0f1d] border border-white/10 rounded-[4rem] w-full max-w-xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-300">
            <div className="px-10 py-10 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
               <h3 className="text-xl font-black tracking-tight uppercase italic">Intelligence Catalyst Construction</h3>
               <button onClick={() => setShowSeriesModal(false)} className="text-white/40 hover:text-white transition-colors duration-300">
                 <X size={28} />
               </button>
            </div>
            
            <form onSubmit={handleSeriesSubmit} className="p-12 space-y-8">
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 italic">Series Taxonomy</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all font-black text-sm text-white placeholder:text-gray-700"
                  value={seriesFormData.title}
                  onChange={(e) => setSeriesFormData({...seriesFormData, title: e.target.value})}
                  required
                  placeholder="e.g. Mathematics Essentials"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 italic">Neural Pathway Description</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all font-black text-sm text-gray-400 min-h-[120px] placeholder:text-gray-700 italic"
                  value={seriesFormData.description}
                  onChange={(e) => setSeriesFormData({...seriesFormData, description: e.target.value})}
                  placeholder="Describe the learning path..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 italic">Academic Domain</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all font-black text-sm text-white placeholder:text-gray-700"
                  value={seriesFormData.category}
                  onChange={(e) => setSeriesFormData({...seriesFormData, category: e.target.value})}
                  required
                  placeholder="e.g. Mathematics, English, etc."
                />
              </div>

              <div className="flex gap-6 pt-6">
                <button 
                  type="button" 
                  onClick={() => setShowSeriesModal(false)}
                  className="flex-1 py-5 border-2 border-white/5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest text-gray-600 hover:bg-white/5 hover:text-white transition duration-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl shadow-blue-900/40 border border-white/10"
                >
                  Synthesize Series
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSTITUTIONAL STATUS HUD 🔥 */}
      {statusMsg && (
        <div className={`fixed bottom-10 left-10 z-[300] px-8 py-6 rounded-[2.5rem] border shadow-2xl animate-in slide-in-from-left-10 duration-500 flex items-center gap-5 backdrop-blur-2xl ${statusMsg.type === 'success' ? "bg-white/5 border-cyan-400/20 text-cyan-400 shadow-cyan-900/10" : "bg-white/5 border-red-400/20 text-red-500 shadow-red-900/10"}`}>
           <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${statusMsg.type === 'success' ? "bg-cyan-400/10" : "bg-red-400/10"}`}>
              {statusMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-none italic">{statusMsg.text}</p>
        </div>
      )}

      {/* CONFIRMATION OVERLAY 🔥 */}
      {showConfirmModal.show && (
         <div className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="bg-[#0a0f1d] border border-white/10 rounded-[4rem] p-16 max-w-lg w-full shadow-[0_50px_100px_rgba(0,0,0,0.8)] text-center space-y-10 animate-in zoom-in-95 duration-300">
               <div className="w-24 h-24 bg-red-400/10 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-red-950/20 border border-red-500/20">
                  <AlertCircle size={40} className="animate-pulse" />
               </div>
               <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">{showConfirmModal.type === 'series_delete' ? "Expunge Registry" : "Expunge Node"}</h3>
                  <p className="text-sm font-bold text-gray-500 leading-relaxed italic">
                     {showConfirmModal.type === 'series_delete' 
                       ? `Are you certain you want to permanently expunge "${showConfirmModal.targetName}"? This will terminate all nested intelligence nodes and student analytics. This operation is non-reversible.` 
                       : showConfirmModal.type === 'bulk_delete'
                       ? `Are you certain you want to expunge ${selectedTests.length} selected assets from the intelligence core?`
                       : "Are you certain you want to permanently expunge this assessment node from the registry?"}
                  </p>
               </div>
               <div className="flex flex-col gap-6">
                  <button 
                    onClick={
                      showConfirmModal.type === 'series_delete' 
                        ? () => handleDeleteSeries(showConfirmModal.targetId!) 
                        : showConfirmModal.type === 'bulk_delete'
                        ? handleBulkDelete
                        : () => handleDelete(showConfirmModal.targetId!)
                    }
                    className="w-full py-6 bg-red-600 hover:bg-red-700 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-red-900/20 transition-all active:scale-95 duration-300"
                  >
                     Confirm Expunge Operation
                  </button>
                  <button 
                    onClick={() => setShowConfirmModal({ show: false, type: 'delete' })}
                    className="w-full py-6 bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all duration-300 border border-white/5"
                  >
                     Abort Operation
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
