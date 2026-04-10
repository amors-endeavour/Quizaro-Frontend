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
  status?: "Draft" | "Published";
  createdAt: string;
}

export default function TestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  
  // Navigation State
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 30,
    price: 0,
    category: "General"
  });

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const { data } = await API.get("/admin/tests");
        setTests(data);
      } catch (err) {
        console.error("Failed to fetch tests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  // Logic: Group tests by category to create "Folders"
  const folders = useMemo(() => {
    const groups: Record<string, number> = {};
    tests.forEach((t) => {
      const cat = t.category || "General";
      groups[cat] = (groups[cat] || 0) + 1;
    });
    return Object.entries(groups).map(([name, count]) => ({ name, count }));
  }, [tests]);

  // Logic: Filter tests based on current folder and search
  const filteredTests = useMemo(() => {
    return tests.filter((t) => {
      const matchesFolder = currentFolder ? (t.category || "General") === currentFolder : true;
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFolder && matchesSearch;
    });
  }, [tests, currentFolder, searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTest) {
        await API.put(`/admin/test/${editingTest._id}`, formData);
      } else {
        await API.post("/test/create", formData);
      }
      window.location.reload(); // Refresh to catch changes
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

  if (loading) return <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center font-black animate-pulse text-blue-600 uppercase tracking-widest leading-none">Accessing Library Grid...</div>;

  return (
    <div className="flex flex-col min-h-full relative">
      <main className="flex-1 overflow-y-auto">
        <AdminHeader 
          title={currentFolder || "Institutional Library"}
          path={[
            { label: "My Library", href: currentFolder ? "#" : undefined },
            ...(currentFolder ? [{ label: currentFolder }] : [])
          ]}
          onNew={() => {
            setEditingTest(null);
            setFormData({ title: "", description: "", duration: 30, price: 0, category: currentFolder || "General" });
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
                  <button className="text-[10px] font-black uppercase tracking-widest hover:text-blue-400 transition-colors">Move to Series</button>
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
                   {currentFolder ? "Tests in Context" : "Institutional Folders"}
                   <span className="text-gray-200">/</span>
                   <span className="text-gray-900 tracking-tighter normal-case font-black text-xs">{currentFolder || "Overview"}</span>
                </h3>
             </div>
             
             {currentFolder && (
               <button 
                 onClick={() => setCurrentFolder(null)}
                 className="px-6 py-2.5 bg-gray-50 text-gray-400 hover:bg-white hover:shadow-xl rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
               >
                 ← Back to Archive
               </button>
             )}
          </div>

          {!currentFolder ? (
            /* FOLDER GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {folders.length === 0 ? (
                <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-gray-200 transition-all hover:bg-gray-50">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">No Series Containers Detected</p>
                </div>
              ) : (
                folders.map((f) => (
                  <AdminFolderCard 
                    key={f.name} 
                    name={f.name} 
                    count={f.count}
                    onClick={() => {
                      setCurrentFolder(f.name);
                      window.scrollTo(0, 0);
                    }}
                  />
                ))
              )}
            </div>
          ) : (
            /* TESTS LIST VIEW */
            <div className="flex flex-col gap-6">
               {filteredTests.length === 0 ? (
                 <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">No Modules in this Archive</p>
                 </div>
               ) : (
                 filteredTests.map((test) => (
                    <AdminTestCard 
                      key={test._id}
                      title={test.title}
                      description={currentFolder}
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
                          category: test.category || "General"
                        });
                        setShowModal(true);
                      }}
                      onQuestions={() => router.push(`/admin-dashboard/${test._id}`)}
                      onDelete={() => handleDelete(test._id)}
                    />
                 ))
               )}
            </div>
          )}
        </div>
      </main>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
               <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                 {editingTest ? "Edit Settings" : "Create New Content"}
               </h3>
               <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900 transition">
                 <X size={24} />
               </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Series / Folder Name</label>
                <input 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all font-bold"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="e.g. Computers, JKSSB Junior Assistant"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Test Title</label>
                <input 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all font-bold"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="e.g. Model Paper 01"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Duration (Min)</label>
                  <input 
                    type="number"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all font-bold"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Price (₹)</label>
                  <input 
                    type="number"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all font-bold"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-200"
                >
                  {editingTest ? "Update Changes" : "Save and Continue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
