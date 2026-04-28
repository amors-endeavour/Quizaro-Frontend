"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import AdminFolderCard from "@/components/AdminFolderCard";
import AdminTestCard from "@/components/AdminTestCard";
import AnalyticsModal from "@/components/AnalyticsModal";
import API from "@/app/lib/api";
import { X, AlertCircle, CheckCircle2, Zap, Plus } from "lucide-react";

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
  isPublished?: boolean;
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
  const [showAutoIngestModal, setShowAutoIngestModal] = useState(false);
  const [showSeriesModal, setShowSeriesModal] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<{show: boolean, type: 'delete' | 'series_delete' | 'bulk_delete', targetId?: string, targetName?: string}>({show: false, type: 'delete'});
  const [statusMsg, setStatusMsg] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  
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
    difficulty: "Medium",
    category: "General"
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
  }, [isAuthChecked]);

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
       setTests(tests.map(t => t._id === id ? { ...t, isPublished: newStatus === "Published" } : t));
       await API.put(`/admin/test/publish/${id}`);
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

  const handleAutoIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileInput = document.getElementById('auto-pdf-upload') as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!file) {
      setStatusMsg({ text: "No PDF Payload Detected.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("postImage", file);
      uploadData.append("title", formData.title);
      uploadData.append("category", formData.category || "General");

      await API.post("/admin/auto-ingest", uploadData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setStatusMsg({ text: "Intelligence Scanned & MCQs Generated.", type: "success" });
      setShowAutoIngestModal(false);
      setFormData({ title: "", description: "", duration: 30, price: 0, category: "General", seriesId: "", paperNumber: 1, difficulty: "Medium" });
      
      // Refresh tests
      const testsRes = await API.get("/admin/tests");
      setTests(testsRes.data);
      
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      setStatusMsg({ text: "Ingestion Protocol Failed.", type: "error" });
      setTimeout(() => setStatusMsg(null), 3000);
    } finally {
      setLoading(false);
    }
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


  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc] text-gray-800">
      <AdminHeader 
        title={currentSeriesId ? series.find(s => s._id === currentSeriesId)?.title || "Papers" : "My Library"}
        path={[
          { label: "My Library", href: "/admin-dashboard/tests" },
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
            difficulty: "Medium",
            category: "General"
          });
          setShowModal(true);
        }}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1400px] mx-auto space-y-8">
          
          <div className="flex items-center justify-between border-b border-gray-200 pb-6">
             <div className="flex items-center gap-4">
                <input 
                  type="checkbox" 
                  checked={selectedTests.length === filteredTests.length && filteredTests.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedTests(filteredTests.map(t => t._id));
                    else setSelectedTests([]);
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                />
                <span className="text-[13px] font-bold text-gray-600 uppercase tracking-tight">
                   {!currentSeriesId ? `Folder(${series.length})` : `Tests(${filteredTests.length})`}
                </span>
                {selectedTests.length > 0 && (
                  <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                    <button onClick={() => setShowConfirmModal({ show: true, type: 'bulk_delete' })} className="text-[11px] font-bold text-red-600 hover:text-red-700 uppercase">Batch Delete</button>
                    <button onClick={() => setSelectedTests([])} className="text-[11px] font-bold text-gray-500 hover:text-gray-700 uppercase">Clear</button>
                  </div>
                )}
             </div>
             
             <div className="flex gap-3">
                 <div className="relative group">
                    <button className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-[11px] font-bold hover:bg-gray-50 transition-all shadow-sm">
                      Import Registry
                    </button>
                    <input 
                       type="file" 
                       accept=".json,.csv" 
                       onChange={handleImport}
                       className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                 </div>

                 <button 
                   onClick={() => setShowAutoIngestModal(true)}
                   className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-[11px] font-bold hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2"
                 >
                   <Zap size={14} /> AUTO-INGEST PDF
                 </button>

                 {!currentSeriesId && (
                    <button 
                      onClick={() => setShowSeriesModal(true)}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-[11px] font-bold hover:bg-blue-700 transition-all shadow-sm"
                    >
                      + NEW SERIES
                    </button>
                 )}

                 {currentSeriesId && (
                   <button 
                     onClick={() => setCurrentSeriesId(null)}
                     className="px-5 py-2.5 bg-white text-gray-600 border border-gray-300 rounded-lg text-[11px] font-bold hover:bg-gray-50 transition-all"
                   >
                     Back to Library
                   </button>
                 )}
             </div>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="h-64 bg-white border border-gray-200 rounded-xl animate-pulse shadow-sm" />
               ))}
             </div>
          ) : !currentSeriesId ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {series.map((s) => (
                  <AdminFolderCard 
                    key={s._id} 
                    name={s.title} 
                    onClick={() => {
                      setCurrentSeriesId(s._id);
                      window.scrollTo(0, 0);
                    }}
                    onDelete={() => setShowConfirmModal({ show: true, type: 'series_delete', targetId: s._id, targetName: s.title })}
                  />
                ))}
              </div>

              {tests.filter(t => !t.seriesId).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-tight border-b border-gray-200 pb-2">Standalone Tests</h3>
                  <div className="flex flex-col gap-4">
                    {tests.filter(t => !t.seriesId).map((test) => (
                      <AdminTestCard 
                        key={test._id}
                        title={test.title}
                        description={test.description || "General Assessment"}
                        date={new Date(test.createdAt).toLocaleDateString()}
                        status={test.isPublished ? "Published" : "Draft"}
                        onStatusToggle={(ns) => handleStatusToggle(test._id, ns)}
                        onEdit={() => {
                          setEditingTest(test);
                          setFormData({
                            title: test.title,
                            description: test.description || "",
                            duration: test.duration || 30,
                            price: test.price || 0,
                            seriesId: "",
                            paperNumber: test.paperNumber || 1,
                            difficulty: test.difficulty || "Medium",
                            category: test.category || "General"
                          });
                          setShowModal(true);
                        }}
                        onQuestions={() => router.push(`/admin-dashboard/${test._id}`)}
                        onDelete={() => setShowConfirmModal({ show: true, type: 'delete', targetId: test._id })}
                        onExport={() => handleExport(test._id)}
                        onAnalytics={() => setSelectedAnalyticsTest({ id: test._id, title: test.title })}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
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
                      difficulty: "Medium",
                      category: "General"
                    });
                    setShowModal(true);
                  }}
                  className="w-full py-10 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center gap-3 text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all bg-white shadow-sm group"
               >
                  <Zap size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[14px] font-bold">Add New Test Case</span>
               </button>

               {filteredTests.length === 0 ? (
                 <div className="py-24 text-center bg-white border border-dashed border-gray-200 rounded-xl">
                   <p className="text-[13px] text-gray-400 font-bold uppercase tracking-widest">No tests found in this series</p>
                 </div>
               ) : (
                 filteredTests.sort((a,b) => (a.paperNumber || 0) - (b.paperNumber || 0)).map((test) => (
                    <AdminTestCard 
                      key={test._id}
                      title={test.title}
                      description={`JUNIOR ASSISTANT, ${series.find(s => s._id === currentSeriesId)?.title.toUpperCase() || "TEST SERIES"}`}
                      date={new Date(test.createdAt).toISOString().split('T')[0].replace(/-/g, '/')}
                      status={test.isPublished ? "Published" : "Draft"}
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
                          difficulty: test.difficulty || "Medium",
                          category: test.category || "General"
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

      {selectedAnalyticsTest && (
        <AnalyticsModal 
          testId={selectedAnalyticsTest.id}
          testTitle={selectedAnalyticsTest.title}
          onClose={() => setSelectedAnalyticsTest(null)}
        />
      )}

      {showAutoIngestModal && (
         <div className="fixed inset-0 z-[500] bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-xl w-full shadow-2xl space-y-8">
               <div className="text-center">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Zap size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight uppercase">Auto-Ingest PDF</h3>
                  <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mt-2">AI-Powered MCQ Generation</p>
               </div>

               <form onSubmit={handleAutoIngest} className="space-y-6">
                  <div className="space-y-4">
                     <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Source PDF</label>
                     <input 
                        type="file"
                        accept=".pdf"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 outline-none text-xs font-bold text-gray-700"
                        id="auto-pdf-upload"
                        required
                     />
                  </div>

                  <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Test Title</label>
                        <input 
                           required
                           className="w-full bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 outline-none focus:border-blue-500 text-sm font-bold text-gray-800"
                           placeholder="Ex: Advanced Physics MCQs"
                           value={formData.title}
                           onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                     </div>
                  </div>

                  {loading && (
                    <div className="space-y-3">
                       <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 animate-progress" style={{ width: `100%` }} />
                       </div>
                       <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest text-center animate-pulse">Processing Document Intelligence...</p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                     <button 
                        type="button" 
                        onClick={() => setShowAutoIngestModal(false)}
                        className="flex-1 py-4 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all"
                     >
                        Cancel
                     </button>
                     <button 
                        type="submit"
                        disabled={loading}
                        className="flex-[1.5] py-4 bg-blue-600 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-blue-900/10 disabled:opacity-50 flex items-center justify-center gap-3"
                     >
                        <Zap size={16} /> {loading ? "Ingesting..." : "Commence Ingest"}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[500] flex items-center justify-center p-6">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
               <h3 className="text-lg font-bold text-gray-900">
                 {editingTest ? "Edit Test Details" : "Create New Test"}
               </h3>
               <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                 <X size={24} />
               </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Series Attachment</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 outline-none focus:border-blue-500 font-bold text-sm text-gray-800"
                  value={formData.seriesId}
                  onChange={(e) => setFormData({...formData, seriesId: e.target.value})}
                >
                  <option value="">No Series (Standalone)</option>
                  {series.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Title</label>
                  <input 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 outline-none focus:border-blue-500 font-bold text-sm text-gray-800"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    placeholder="e.g. Model Paper 01"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Paper #</label>
                  <input 
                    type="number"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 outline-none focus:border-blue-500 font-bold text-sm text-gray-800"
                    value={formData.paperNumber}
                    onChange={(e) => setFormData({...formData, paperNumber: Number(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Duration (Min)</label>
                  <input 
                    type="number"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 outline-none focus:border-blue-500 font-bold text-sm text-gray-800"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Price (₹)</label>
                  <input 
                    type="number"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 outline-none focus:border-blue-500 font-bold text-sm text-gray-800"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10"
                >
                  {editingTest ? "Save Changes" : "Create Test"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSeriesModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[500] flex items-center justify-center p-6">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
               <h3 className="text-lg font-bold text-gray-900">Create New Series</h3>
               <button onClick={() => setShowSeriesModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                 <X size={24} />
               </button>
            </div>
            
            <form onSubmit={handleSeriesSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Series Title</label>
                <input 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 outline-none focus:border-blue-500 font-bold text-sm text-gray-800"
                  value={seriesFormData.title}
                  onChange={(e) => setSeriesFormData({...seriesFormData, title: e.target.value})}
                  required
                  placeholder="e.g. SSC General Studies Series"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Academic Category</label>
                <input 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 outline-none focus:border-blue-500 font-bold text-sm text-gray-800"
                  value={seriesFormData.category}
                  onChange={(e) => setSeriesFormData({...seriesFormData, category: e.target.value})}
                  required
                  placeholder="e.g. SSC / Banking"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button" 
                  onClick={() => setShowSeriesModal(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10"
                >
                  Create Series
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {statusMsg && (
        <div className={`fixed bottom-10 left-10 z-[600] px-8 py-5 rounded-xl border shadow-2xl flex items-center gap-4 animate-in slide-in-from-left-10 duration-500 bg-white ${statusMsg.type === 'success' ? "border-green-200 text-green-700" : "border-red-200 text-red-600"}`}>
           {statusMsg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
           <p className="text-[12px] font-bold uppercase tracking-tight">{statusMsg.text}</p>
        </div>
      )}

      {/* CONFIRMATION OVERLAY */}
      {showConfirmModal.show && (
         <div className="fixed inset-0 z-[700] bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-10 max-w-md w-full shadow-2xl text-center space-y-8">
               <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle size={40} />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 uppercase italic">Confirm Deletion</h3>
                  <p className="text-sm text-gray-500 font-medium">This operation will permanently remove the data and all associated analytics. Proceed with caution.</p>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => setShowConfirmModal({ show: false, type: 'delete' })} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-200 transition-all uppercase text-[11px] tracking-widest">Cancel</button>
                  <button 
                    onClick={() => {
                      if (showConfirmModal.type === 'series_delete') handleDeleteSeries(showConfirmModal.targetId!);
                      else if (showConfirmModal.type === 'bulk_delete') handleBulkDelete();
                      else handleDelete(showConfirmModal.targetId!);
                    }} 
                    className="flex-1 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all uppercase text-[11px] tracking-widest"
                  >
                    Delete
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
