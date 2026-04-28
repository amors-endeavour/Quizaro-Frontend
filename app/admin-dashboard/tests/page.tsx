"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import AdminFolderCard from "@/components/AdminFolderCard";
import AdminTestCard from "@/components/AdminTestCard";
import AnalyticsModal from "@/components/AnalyticsModal";
import API from "@/app/lib/api";
import { X, AlertCircle, CheckCircle2, Zap, Plus, ChevronRight, Info, Search, Filter, Download, Trash2, Edit3, Settings } from "lucide-react";

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
      setStatusMsg({ text: "Series matrix generated successfully.", type: 'success' });
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      setStatusMsg({ text: err?.response?.data?.message || "Generation protocol failure.", type: 'error' });
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
      setStatusMsg({ text: "Assessment metadata preserved in registry.", type: 'success' });
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      setStatusMsg({ text: "Registry preservation error detected.", type: 'error' });
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
      setStatusMsg({ text: "Series and associated nodes expunged.", type: 'success' });
      setTimeout(() => window.location.reload(), 2000);
    } catch {
      setStatusMsg({ text: "Expunge operation restricted.", type: 'error' });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedTests.map(id => API.delete(`/admin/test/${id}`)));
      setTests(tests.filter(t => !selectedTests.includes(t._id)));
      setSelectedTests([]);
      setShowConfirmModal({ show: false, type: 'bulk_delete' });
      setStatusMsg({ text: "Batch node expungement complete.", type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch {
      setStatusMsg({ text: "Batch operation synchronization failure.", type: 'error' });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleStatusToggle = async (id: string, newStatus: string) => {
     try {
       setTests(tests.map(t => t._id === id ? { ...t, isPublished: newStatus === "Published" } : t));
       await API.put(`/admin/test/publish/${id}`);
     } catch {
       console.error("Grid status update synchronization failed");
     }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/admin/test/${id}`);
      setTests(tests.filter(t => t._id !== id));
      setSelectedTests(selectedTests.filter(sid => sid !== id));
      setShowConfirmModal({ show: false, type: 'delete' });
      setStatusMsg({ text: "Intelligence node expunged from grid.", type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch {
      setStatusMsg({ text: "Deletion protocol failure.", type: 'error' });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleExport = (testId: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/admin/export/${testId}?token=${token}`, '_blank');
  };

  const handleAutoIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileInput = document.getElementById('auto-pdf-upload') as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!file) {
      setStatusMsg({ text: "No intelligence payload detected.", type: "error" });
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
      
      const testsRes = await API.get("/admin/tests");
      setTests(testsRes.data);
      
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      setStatusMsg({ 
        text: err?.response?.data?.message || "Ingestion Protocol Failed.", 
        type: "error" 
      });
      setTimeout(() => setStatusMsg(null), 5000);
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
            const lines = text.split("\n").filter(l => l.trim());
            const [testInfo, ...qLines] = lines;
            const splitCsv = (str: string) => {
              const matches = str.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
              return matches ? matches.map(m => m.replace(/^"|"$/g, '').trim()) : str.split(",").map(s => s.trim());
            };
            const [title, description, duration] = splitCsv(testInfo);
            const questions = qLines.map(line => {
              const parts = splitCsv(line);
              const [qText, a, b, c, d, correct, expl] = parts;
              return {
                questionText: qText,
                options: [{ text: a || "Option A" }, { text: b || "Option B" }, { text: c || "Option C" }, { text: d || "Option D" }],
                correctOption: Number(correct) || 0,
                explanation: expl || ""
              };
            });
            importData = { test: { title: title || "Imported Node", description: description || "No description provided", duration: Number(duration) || 30 }, questions };
          } else {
            importData = JSON.parse(text);
          }

          setLoading(true);
          await API.post("/admin/import", importData);
          setStatusMsg({ text: "Institutional Data Ported Successfully.", type: "success" });
          setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
          setStatusMsg({ text: "Ingestion Error: File format integrity compromised.", type: "error" });
          setLoading(false);
        }
      };
      reader.readAsText(file);
    } catch {
      setStatusMsg({ text: "System Error: Critical failure during ingestion.", type: "error" });
    }
  };

  if (loading && tests.length === 0) return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex flex-col items-center justify-center space-y-6 transition-colors duration-300">
      <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin" />
      <p className="font-black animate-pulse text-blue-600 dark:text-blue-400 uppercase tracking-widest text-[10px] italic leading-none">
        Synchronizing Intelligence Registry...
      </p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc] dark:bg-[#050816] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <AdminHeader 
        title={currentSeriesId ? series.find(s => s._id === currentSeriesId)?.title || "Assessment Registry" : "Institutional Intelligence Library"}
        path={[
          { label: "Governance" },
          { label: "Library", href: "/admin-dashboard/tests" },
          ...(currentSeriesId ? [{ label: series.find(s => s._id === currentSeriesId)?.title || "Nodes" }] : [])
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

      <main className="flex-1 overflow-y-auto p-8 lg:p-14">
        <div className="max-w-[1700px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-20">
          
          <div className="flex flex-col xl:flex-row xl:items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-12 gap-10 transition-all duration-500">
             <div className="flex items-center gap-8">
                <div className="relative flex items-center">
                   <input 
                     type="checkbox" 
                     checked={selectedTests.length === filteredTests.length && filteredTests.length > 0}
                     onChange={(e) => {
                       if (e.target.checked) setSelectedTests(filteredTests.map(t => t._id));
                       else setSelectedTests([]);
                     }}
                     className="w-7 h-7 rounded-xl border-gray-200 dark:border-gray-700 text-blue-600 focus:ring-blue-500 cursor-pointer bg-white dark:bg-[#0a0f29] transition-all" 
                   />
                </div>
                <div className="space-y-1">
                   <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest italic leading-none">
                      {!currentSeriesId ? `Cluster Matrix [${series.length}]` : `Node Matrix [${filteredTests.length}]`}
                   </h3>
                   <p className="text-[9px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-widest italic leading-none">Registry Synchronization Status: Optimal</p>
                </div>
                {selectedTests.length > 0 && (
                   <div className="flex items-center gap-8 ml-8 pl-8 border-l-2 border-gray-100 dark:border-gray-800 animate-in slide-in-from-left-6 duration-500">
                      <button onClick={() => setShowConfirmModal({ show: true, type: 'bulk_delete' })} className="px-6 py-3 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest italic hover:bg-red-700 transition-all shadow-xl shadow-red-900/20 active:scale-95 flex items-center gap-3">
                         <Trash2 size={14} /> Batch Purge
                      </button>
                      <button onClick={() => setSelectedTests([])} className="text-[10px] font-black text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest italic transition-all active:scale-95">Clear Selective Nodes</button>
                   </div>
                )}
             </div>
             
             <div className="flex flex-wrap gap-5 justify-end items-center">
                 <div className="relative group">
                    <button className="px-10 py-5 bg-white dark:bg-[#0a0f29] text-gray-600 dark:text-gray-400 border-2 border-gray-50 dark:border-gray-800 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:border-blue-600 dark:hover:border-blue-500 transition-all shadow-sm italic active:scale-[0.98] flex items-center gap-3">
                      <Download size={16} /> Port Registry Payload
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
                   className="px-10 py-5 bg-indigo-600 dark:bg-indigo-700 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-all shadow-2xl shadow-indigo-900/30 flex items-center gap-4 italic active:scale-[0.98]"
                 >
                   <Zap size={18} /> Neural Auto-Ingest
                 </button>

                 {!currentSeriesId && (
                    <button 
                      onClick={() => setShowSeriesModal(true)}
                      className="px-10 py-5 bg-blue-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/30 italic active:scale-[0.98] flex items-center gap-3"
                    >
                      <Plus size={18} /> Generate Series Matrix
                    </button>
                 )}

                 {currentSeriesId && (
                   <button 
                     onClick={() => setCurrentSeriesId(null)}
                     className="px-10 py-5 bg-white dark:bg-[#0a0f29] text-gray-600 dark:text-gray-400 border-2 border-gray-50 dark:border-gray-800 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-sm italic active:scale-[0.98]"
                   >
                     Back to Global Registry
                   </button>
                 )}
             </div>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
               {[1,2,3,4,5,6,7,8,9,10].map(i => (
                 <div key={i} className="h-72 bg-white dark:bg-[#0a0f29] border border-gray-50 dark:border-gray-800 rounded-[3.5rem] animate-pulse shadow-sm" />
               ))}
             </div>
          ) : !currentSeriesId ? (
            <div className="space-y-20 transition-all duration-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-12">
                {series.map((s) => (
                  <AdminFolderCard 
                    key={s._id} 
                    name={s.title} 
                    onClick={() => {
                      setCurrentSeriesId(s._id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onDelete={() => setShowConfirmModal({ show: true, type: 'series_delete', targetId: s._id, targetName: s.title })}
                  />
                ))}
              </div>

              {tests.filter(t => !t.seriesId).length > 0 && (
                <div className="space-y-12 pt-12 border-t border-gray-50 dark:border-gray-800">
                   <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/30"><Info size={24} /></div>
                      <div className="space-y-1">
                         <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] italic leading-none whitespace-nowrap">Standalone Intelligence Nodes</h3>
                         <p className="text-[9px] text-gray-300 dark:text-gray-800 font-black uppercase tracking-widest italic leading-none">Unclustered Assessment Entities</p>
                      </div>
                      <div className="w-full h-px bg-gray-50 dark:bg-gray-800/50" />
                   </div>
                  <div className="grid grid-cols-1 gap-8">
                    {tests.filter(t => !t.seriesId).map((test) => (
                      <AdminTestCard 
                        key={test._id}
                        title={test.title}
                        description={test.description || "Foundational Institutional Assessment Node Synchronized with Grid"}
                        date={new Date(test.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
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
            <div className="grid grid-cols-1 gap-8 animate-in slide-in-from-right-10 duration-700">
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
                  className="w-full py-24 border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[5rem] flex flex-col items-center justify-center gap-8 text-gray-300 dark:text-gray-800 hover:text-blue-600 dark:hover:text-blue-500 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-700 bg-white dark:bg-[#0a0f29] shadow-sm group active:scale-[0.99] relative overflow-hidden"
               >
                  <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <div className="w-24 h-24 rounded-[2.5rem] bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12 transition-all duration-700 shadow-2xl relative z-10">
                     <Plus size={40} />
                  </div>
                  <div className="space-y-3 text-center relative z-10">
                     <span className="text-xl font-black uppercase tracking-widest italic block text-gray-900 dark:text-white transition-colors duration-500">Initialize Intelligence Node</span>
                     <p className="text-[10px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] italic leading-none">Provisioning assessment sequence metadata in cluster</p>
                  </div>
               </button>

               {filteredTests.length === 0 ? (
                 <div className="py-48 text-center bg-white dark:bg-[#0a0f29] border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[5rem] shadow-sm flex flex-col items-center gap-10 transition-all duration-700">
                   <div className="w-24 h-24 bg-gray-50 dark:bg-[#050816] rounded-[2.5rem] flex items-center justify-center text-gray-100 dark:text-gray-900 shadow-inner"><Info size={56} /></div>
                   <div className="space-y-4">
                      <p className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Registry Void Detected</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-[0.4em] italic leading-none">No Intellectual Nodes Provisioned In This Matrix Cluster</p>
                   </div>
                 </div>
               ) : (
                 filteredTests.sort((a,b) => (a.paperNumber || 0) - (b.paperNumber || 0)).map((test) => (
                    <AdminTestCard 
                      key={test._id}
                      title={test.title}
                      description={`NODE OPERATIONAL // GRID SEQUENCE ${test.paperNumber?.toString().padStart(2, '0') || "XX"} // ${series.find(s => s._id === currentSeriesId)?.title.toUpperCase() || "INTELLECTUAL MATRIX CLUSTER"}`}
                      date={new Date(test.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
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

      {/* AUTO-INGEST MODAL 🤖 */}
      {showAutoIngestModal && (
         <div className="fixed inset-0 z-[600] bg-gray-900/60 dark:bg-black/90 backdrop-blur-2xl flex items-center justify-center p-8 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 rounded-[5rem] p-20 max-w-2xl w-full shadow-2xl space-y-16 animate-in zoom-in-95 duration-700 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 animate-pulse" />
               <div className="text-center space-y-6">
                  <div className="w-28 h-28 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl border-4 border-white dark:border-[#0a0f29] rotate-3 hover:rotate-0 transition-transform duration-700">
                    <Zap size={56} />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic leading-none">Neural Ingestion Protocol</h3>
                     <p className="text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.4em] italic leading-none">AI-Powered Institutional Synthesis Loop</p>
                  </div>
               </div>

               <form onSubmit={handleAutoIngest} className="space-y-12">
                  <div className="space-y-5">
                     <label className="text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] ml-2 italic leading-none">Payload Source (PDF Registry)</label>
                     <div className="relative group/input">
                        <input 
                           type="file"
                           accept=".pdf"
                           className="w-full bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-3xl px-10 py-6 outline-none focus:border-blue-600 text-[12px] font-black text-gray-900 dark:text-white italic cursor-pointer transition-all"
                           id="auto-pdf-upload"
                           required
                        />
                     </div>
                  </div>

                  <div className="space-y-5">
                     <label className="text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] ml-2 italic leading-none">Entity Metadata Title</label>
                     <input 
                        required
                        className="w-full bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-3xl px-10 py-6 outline-none focus:border-blue-600 text-[16px] font-black text-gray-900 dark:text-white italic placeholder:text-gray-200 dark:placeholder:text-gray-900 transition-all shadow-inner"
                        placeholder="Ex: Advanced Matrix Synthesis Phase I"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                     />
                  </div>

                  {loading && (
                    <div className="space-y-6 bg-blue-50/50 dark:bg-blue-900/10 p-12 rounded-[3.5rem] border-2 border-blue-100 dark:border-blue-800/30 animate-in fade-in duration-500">
                       <div className="h-3.5 w-full bg-gray-200 dark:bg-[#050816] rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-blue-600 animate-pulse w-full shadow-[0_0_20px_rgba(37,99,235,0.5)]" />
                       </div>
                       <p className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.4em] text-center italic leading-none animate-pulse">Codifying Ingested Intelligence Nodes...</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-8 pt-8">
                     <button 
                        type="button" 
                        onClick={() => setShowAutoIngestModal(false)}
                        className="flex-1 py-8 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-700 hover:text-gray-900 dark:hover:text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest italic transition-all active:scale-[0.98] border-2 border-transparent hover:border-gray-100 dark:hover:border-gray-700 shadow-sm"
                     >
                        Abort Protocol
                     </button>
                     <button 
                        type="submit"
                        disabled={loading}
                        className="flex-[1.5] py-8 bg-blue-600 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest transition-all shadow-2xl shadow-blue-900/40 disabled:opacity-50 flex items-center justify-center gap-6 italic active:scale-[0.98]"
                     >
                        <Zap size={24} /> {loading ? "Scanning Neural Path..." : "Commence Ingest Cycle"}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[600] bg-gray-900/60 dark:bg-black/90 backdrop-blur-2xl flex items-center justify-center p-8 animate-in fade-in duration-500">
          <div className="bg-white dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 rounded-[5rem] w-full max-w-3xl shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden flex flex-col max-h-[95vh] relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
            <div className="px-20 py-12 bg-gray-50/30 dark:bg-[#050816]/30 border-b-2 border-gray-50 dark:border-gray-800 flex items-center justify-between transition-all duration-500">
               <div className="space-y-2">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">
                    {editingTest ? "Configure Entity" : "Initialize Matrix Entity"}
                  </h3>
                  <p className="text-[10px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] italic leading-none">Intelligence Metadata Provisioning Hub</p>
               </div>
               <button onClick={() => setShowModal(false)} className="w-16 h-16 bg-white dark:bg-gray-800 shadow-sm border-2 border-gray-50 dark:border-gray-700 rounded-3xl flex items-center justify-center text-gray-300 hover:text-red-600 transition-all active:scale-90 group">
                 <X size={32} className="group-hover:rotate-90 transition-transform" />
               </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-20 space-y-12 overflow-y-auto custom-scrollbar flex-1">
              <div className="space-y-5">
                <label className="text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] ml-2 italic leading-none">Cluster Attachment (Series)</label>
                <div className="relative">
                   <select 
                     className="w-full bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-3xl px-10 py-7 outline-none focus:border-blue-600 font-black text-[15px] text-gray-900 dark:text-white uppercase tracking-tighter italic appearance-none cursor-pointer shadow-inner"
                     value={formData.seriesId}
                     onChange={(e) => setFormData({...formData, seriesId: e.target.value})}
                   >
                     <option value="">STANDALONE ENTITY // NO CLUSTER</option>
                     {series.map(s => <option key={s._id} value={s._id}>{s.title.toUpperCase()}</option>)}
                   </select>
                   <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><Filter size={20} /></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-5">
                  <label className="text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] ml-2 italic leading-none">Entity Identifier (Title)</label>
                  <input 
                    className="w-full bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-3xl px-10 py-7 outline-none focus:border-blue-600 font-black text-[18px] text-gray-900 dark:text-white italic placeholder:text-gray-200 dark:placeholder:text-gray-900 transition-all shadow-inner"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    placeholder="Ex: Assessment Protocol A-01"
                  />
                </div>
                <div className="space-y-5">
                  <label className="text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] ml-2 italic leading-none">Sequence Ordinal (#)</label>
                  <input 
                    type="number"
                    className="w-full bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-3xl px-10 py-7 outline-none focus:border-blue-600 font-black text-[18px] text-gray-900 dark:text-white italic transition-all shadow-inner"
                    value={formData.paperNumber}
                    onChange={(e) => setFormData({...formData, paperNumber: Number(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-5">
                  <label className="text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] ml-2 italic leading-none">Temporal Protocol (Minutes)</label>
                  <input 
                    type="number"
                    className="w-full bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-3xl px-10 py-7 outline-none focus:border-blue-600 font-black text-[18px] text-gray-900 dark:text-white italic transition-all shadow-inner"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-5">
                  <label className="text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] ml-2 italic leading-none">Registry Access Credit (INR)</label>
                  <input 
                    type="number"
                    className="w-full bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-3xl px-10 py-7 outline-none focus:border-blue-600 font-black text-[18px] text-gray-900 dark:text-white italic transition-all shadow-inner"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 pt-12">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-8 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-700 hover:text-gray-900 dark:hover:text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest transition-all italic active:scale-[0.98] border-2 border-transparent hover:border-gray-100 dark:hover:border-gray-700 shadow-sm"
                >
                  Discard Configuration
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-8 bg-blue-600 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest transition-all shadow-2xl shadow-blue-900/40 hover:bg-blue-700 active:scale-[0.98] italic flex items-center justify-center gap-4"
                >
                  <CheckCircle2 size={20} /> {editingTest ? "Commit Matrix Updates" : "Deploy Entity To Grid"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSeriesModal && (
        <div className="fixed inset-0 z-[600] bg-gray-900/60 dark:bg-black/90 backdrop-blur-2xl flex items-center justify-center p-8 animate-in fade-in duration-500">
          <div className="bg-white dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 rounded-[5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden flex flex-col relative transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
            <div className="px-20 py-12 bg-gray-50/30 dark:bg-[#050816]/30 border-b-2 border-gray-50 dark:border-gray-800 flex items-center justify-between transition-all duration-500">
               <div className="space-y-2">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Generate Series Matrix</h3>
                  <p className="text-[10px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] italic leading-none">Multi-Node Cluster Infrastructure Provisioning</p>
               </div>
               <button onClick={() => setShowSeriesModal(false)} className="w-16 h-16 bg-white dark:bg-gray-800 shadow-sm border-2 border-gray-50 dark:border-gray-700 rounded-3xl flex items-center justify-center text-gray-300 hover:text-red-600 transition-all active:scale-90 group">
                 <X size={32} className="group-hover:rotate-90 transition-transform" />
               </button>
            </div>
            
            <form onSubmit={handleSeriesSubmit} className="p-20 space-y-12">
              <div className="space-y-5">
                <label className="text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] ml-2 italic leading-none">Cluster Identifier (Title)</label>
                <input 
                  className="w-full bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-3xl px-10 py-7 outline-none focus:border-blue-600 font-black text-[18px] text-gray-900 dark:text-white italic placeholder:text-gray-200 dark:placeholder:text-gray-900 transition-all shadow-inner"
                  value={seriesFormData.title}
                  onChange={(e) => setSeriesFormData({...seriesFormData, title: e.target.value})}
                  required
                  placeholder="Ex: Institutional Intelligence Matrix V.X"
                />
              </div>

              <div className="space-y-5">
                <label className="text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] ml-2 italic leading-none">Institutional Sector (Category)</label>
                <div className="relative">
                   <input 
                     className="w-full bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-3xl px-10 py-7 outline-none focus:border-blue-600 font-black text-[18px] text-gray-900 dark:text-white italic placeholder:text-gray-200 dark:placeholder:text-gray-900 transition-all shadow-inner"
                     value={seriesFormData.category}
                     onChange={(e) => setSeriesFormData({...seriesFormData, category: e.target.value})}
                     required
                     placeholder="Ex: National Governance / Technical Synthesis"
                   />
                   <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><Settings size={20} className="animate-spin-slow" /></div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 pt-12">
                <button 
                  type="button" 
                  onClick={() => setShowSeriesModal(false)}
                  className="flex-1 py-8 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-700 hover:text-gray-900 dark:hover:text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest italic transition-all active:scale-[0.98] border-2 border-transparent hover:border-gray-100 dark:hover:border-gray-700 shadow-sm"
                >
                  Discard Generation
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-8 bg-blue-600 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest transition-all shadow-2xl shadow-blue-900/40 hover:bg-blue-700 active:scale-[0.98] italic flex items-center justify-center gap-4"
                >
                  <Plus size={20} /> Commence Generation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {statusMsg && (
        <div className={`fixed bottom-12 left-12 z-[700] px-12 py-8 rounded-[3rem] border-2 shadow-2xl flex items-center gap-8 animate-in slide-in-from-left-12 duration-700 bg-white/90 dark:bg-[#0a0f29]/90 backdrop-blur-3xl transition-all ${statusMsg.type === 'success' ? "border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400" : "border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400"}`}>
           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${statusMsg.type === 'success' ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
              {statusMsg.type === 'success' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
           </div>
           <p className="text-[13px] font-black uppercase tracking-widest italic leading-none">{statusMsg.text}</p>
        </div>
      )}

      {/* CONFIRMATION OVERLAY */}
      {showConfirmModal.show && (
         <div className="fixed inset-0 z-[800] bg-gray-900/60 dark:bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-[#0a0f29] border-2 border-gray-100 dark:border-gray-800 rounded-[5rem] p-20 max-w-xl w-full shadow-2xl text-center space-y-16 animate-in zoom-in-95 duration-700 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />
               <div className="w-28 h-28 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-4 border-white dark:border-[#0a0f29] rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700">
                  <AlertCircle size={56} />
               </div>
               <div className="space-y-6">
                  <h3 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Confirm Grid Purge</h3>
                  <p className="text-[14px] text-gray-400 dark:text-gray-700 font-black leading-relaxed uppercase tracking-widest italic">Permanent expungement of node intelligence and associated analytics from institutional registry. Are you sure?</p>
               </div>
               <div className="flex flex-col gap-6">
                  <button onClick={() => setShowConfirmModal({ show: false, type: 'delete' })} className="w-full py-8 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-700 hover:text-gray-900 dark:hover:text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest italic transition-all active:scale-[0.98] border-2 border-transparent hover:border-gray-100 dark:hover:border-gray-700">Abort Deletion Protocol</button>
                  <button 
                    onClick={() => {
                      if (showConfirmModal.type === 'series_delete') handleDeleteSeries(showConfirmModal.targetId!);
                      else if (showConfirmModal.type === 'bulk_delete') handleBulkDelete();
                      else handleDelete(showConfirmModal.targetId!);
                    }} 
                    className="w-full py-8 bg-red-600 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest transition-all shadow-2xl shadow-red-900/40 hover:bg-red-700 active:scale-[0.98] italic flex items-center justify-center gap-4"
                  >
                    <Trash2 size={20} /> Confirm Permanent Purge
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
