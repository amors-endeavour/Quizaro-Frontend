"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import AdminFolderCard from "@/components/AdminFolderCard";
import AdminTestCard from "@/components/AdminTestCard";
import API from "@/app/lib/api";
import { X } from "lucide-react";

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
      window.location.reload();
    } catch {
      alert("Failed to create series");
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
      window.location.reload();
    } catch {
      alert("Failed to save test");
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

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedTests.length} tests?`)) return;
    try {
      await Promise.all(selectedTests.map(id => API.delete(`/admin/test/${id}`)));
      setTests(tests.filter(t => !selectedTests.includes(t._id)));
      setSelectedTests([]);
    } catch {
      alert("Batch delete failed");
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
    if (!confirm("Are you sure?")) return;
    try {
      await API.delete(`/admin/test/${id}`);
      setTests(tests.filter(t => t._id !== id));
      setSelectedTests(selectedTests.filter(sid => sid !== id));
    } catch {
      alert("Delete failed");
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
            // Basic CSV Parser: "Title, Description, Duration\nQuestion,A,B,C,D,CorrectIndex,Explanation"
            const lines = text.split("\n").filter(l => l.trim());
            const [testInfo, ...qLines] = lines;
            const [title, description, duration] = testInfo.split(",").map(s => s.trim());

            const questions = qLines.map(line => {
              const [qText, a, b, c, d, correct, expl] = line.split(",").map(s => s.trim());
              return {
                questionText: qText,
                options: [a, b, c, d],
                correctAnswer: Number(correct),
                explanation: expl
              };
            });

            importData = {
              test: { title, description, duration: Number(duration) || 30 },
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

  if (loading) return <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center font-black animate-pulse text-blue-600 uppercase tracking-widest leading-none">Accessing Library Grid...</div>;

  return (
    <div className="flex flex-col min-h-screen relative bg-[#f8f9fc]">
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
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-8 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-8 animate-in slide-in-from-bottom-20 duration-500">
               <div className="flex items-center gap-3 pr-8 border-r border-white/10">
                  <span className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xs">{selectedTests.length}</span>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Selection Active</p>
               </div>
               
               <div className="flex items-center gap-6">
                  <button onClick={handleBulkDelete} className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors">Batch Delete</button>
                  <button onClick={() => setSelectedTests([])} className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Clear Selection</button>
               </div>
            </div>
          )}

          {/* FOLDER INFO HUD */}
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-6">
                <div 
                  onClick={() => {
                    if (selectedTests.length === filteredTests.length) setSelectedTests([]);
                    else setSelectedTests(filteredTests.map(t => t._id));
                  }}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${selectedTests.length === filteredTests.length && filteredTests.length > 0 ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-100" : "border-gray-200"}`}
                >
                  {selectedTests.length === filteredTests.length && filteredTests.length > 0 && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
                   {currentSeriesId ? "Papers in Series" : "Institutional Quiz Series"}
                   <span className="text-gray-200">/</span>
                   <span className="text-gray-900 tracking-tighter normal-case font-black text-xs">
                     {currentSeriesId ? series.find(s => s._id === currentSeriesId)?.title : "Overview"}
                   </span>
                </h3>
             </div>
             
             <div className="flex gap-4">
                <div className="relative group">
                   <button className="px-6 py-2.5 bg-gray-50 text-gray-900 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:shadow-xl transition-all">
                     Import Paper
                   </button>
                   <input 
                      type="file" 
                      accept=".json,.csv" 
                      onChange={handleImport}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                   />
                </div>

                {!currentSeriesId && (
                   <button 
                     onClick={() => setShowSeriesModal(true)}
                     className="px-6 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                   >
                     + New Series
                   </button>
                )}
                {currentSeriesId && (
                  <button 
                    onClick={() => setCurrentSeriesId(null)}
                    className="px-6 py-2.5 bg-gray-50 text-gray-400 hover:bg-white hover:shadow-xl rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    ← Back to Catalog
                  </button>
                )}
             </div>
          </div>

          {!currentSeriesId ? (
            /* SERIES GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {series.length === 0 ? (
                <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">No Series Containers Detected</p>
                </div>
              ) : (
                series.map((s) => (
                  <AdminFolderCard 
                    key={s._id} 
                    name={s.title} 
                    count={tests.filter(t => t.seriesId === s._id).length}
                    onClick={() => {
                      setCurrentSeriesId(s._id);
                      window.scrollTo(0, 0);
                    }}
                  />
                ))
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
                  className="w-full py-8 border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 text-gray-300 hover:border-blue-200 hover:text-blue-500 transition-all group"
               >
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">+</div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add New Paper to this Series</span>
               </button>

               {filteredTests.length === 0 ? (
                 <div className="py-20 text-center">
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic opacity-50">Empty Series Sequence</p>
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
                          difficulty: "Medium"
                        });
                        setShowModal(true);
                      }}
                      onQuestions={() => router.push(`/admin-dashboard/${test._id}`)}
                      onDelete={() => handleDelete(test._id)}
                      onExport={() => handleExport(test._id)}
                    />
                 ))
               )}
            </div>
          )}
        </div>
      </main>

      {/* CREATE / EDIT MODAL (TEST PAPER) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="px-10 py-8 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
               <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                 {editingTest ? "Assessment Calibration" : "New Paper Construction"}
               </h3>
               <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900 transition">
                 <X size={24} />
               </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Parent Series Assignment</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all font-bold appearance-none"
                  value={formData.seriesId}
                  onChange={(e) => setFormData({...formData, seriesId: e.target.value})}
                  required
                >
                  <option value="">Select Target Series</option>
                  {series.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Paper Identity</label>
                  <input 
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all font-bold text-gray-900"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    placeholder="e.g. Model Paper 01"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Sequence Index</label>
                  <input 
                    type="number"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all font-bold text-gray-900"
                    value={formData.paperNumber}
                    onChange={(e) => setFormData({...formData, paperNumber: Number(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Duration (Min)</label>
                  <input 
                    type="number"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all font-bold text-gray-900"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Enrollment Fee (₹)</label>
                  <input 
                    type="number"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all font-bold text-gray-900"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 border-2 border-gray-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition shadow-xl"
                >
                  {editingTest ? "Update Changes" : "Save and Continue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SERIES MODAL */}
      {showSeriesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="px-10 py-8 bg-blue-600 text-white flex items-center justify-between">
               <h3 className="text-xl font-black tracking-tight uppercase">New Series Construction</h3>
               <button onClick={() => setShowSeriesModal(false)} className="text-white/60 hover:text-white transition">
                 <X size={24} />
               </button>
            </div>
            
            <form onSubmit={handleSeriesSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Series Title</label>
                <input 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all font-bold text-gray-900"
                  value={seriesFormData.title}
                  onChange={(e) => setSeriesFormData({...seriesFormData, title: e.target.value})}
                  required
                  placeholder="e.g. Mathematics Essentials"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Series Description</label>
                <textarea 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all font-bold min-h-[100px] text-gray-900"
                  value={seriesFormData.description}
                  onChange={(e) => setSeriesFormData({...seriesFormData, description: e.target.value})}
                  placeholder="Describe the learning path..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowSeriesModal(false)}
                  className="flex-1 py-4 border-2 border-gray-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-200"
                >
                  Generate Series
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
