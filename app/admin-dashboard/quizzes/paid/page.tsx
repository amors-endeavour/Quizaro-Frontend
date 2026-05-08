"use client";

import { useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import { Plus, Trash2, MoreVertical, BookOpen, Calendar, Search, ChevronRight, Sparkles } from "lucide-react";

export default function PaidQuizzes() {
  const [papers, setPapers] = useState([{ id: 1, name: "", price: "" }]);
  const [seriesList] = useState([
    { id: 1, name: "JEE Main 2025", description: "Engineering entrance exam series", papers: ["Paper 1", "Paper 2", "Paper 3"], created: "15 Jan 2025", total: 5 },
    { id: 2, name: "NEET UG 2025", description: "Medical entrance exam series", papers: ["Paper 1", "Paper 2"], created: "10 Jan 2025", total: 4 },
    { id: 3, name: "UPSC Prelims 2025", description: "Civil Services preliminary exam", papers: ["Paper 1", "Paper 2"], created: "05 Jan 2025", total: 3 },
  ]);

  const addPaper = () => {
    setPapers([...papers, { id: Date.now(), name: "", price: "" }]);
  };

  const removePaper = (id: number) => {
    setPapers(papers.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <AdminHeader 
        title="Paid Quizzes" 
        path={[{ label: "Home" }, { label: "Paid Quizzes" }]} 
      />

      <main className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* CREATE SERIES FORM */}
        <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-10 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Create Paid Quiz Series</h3>
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-purple-900/20 active:scale-95 transition-all">
                <Sparkles size={16} /> ✨ Auto-Generate Quiz
              </button>
              <button className="px-6 py-3 bg-[#7C3AED] text-white rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-purple-900/20 active:scale-95 transition-all">
                <Plus size={16} /> Create Paid Quiz Series
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Series Name</label>
              <input 
                type="text" 
                placeholder="Enter series name" 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 text-sm focus:border-purple-600 outline-none transition-all placeholder:text-gray-300"
              />
              <p className="text-[10px] text-gray-400 font-bold italic">Example: JEE Main 2025, NEET UG 2025, UPSC Prelims 2025</p>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Series Description (Optional)</label>
              <textarea 
                placeholder="Enter series description..." 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 text-sm focus:border-purple-600 outline-none transition-all min-h-[120px] placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight italic">Add Papers to Series</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Create multiple papers under this series</p>
                </div>
              </div>

              <div className="space-y-4">
                {papers.map((paper, index) => (
                  <div key={paper.id} className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gray-50/50 rounded-2xl border border-gray-100 group">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-purple-600 shadow-sm border border-gray-100">{index + 1}</div>
                    <div className="flex-1 w-full space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Paper Name</label>
                      <input 
                        type="text" 
                        placeholder={`Paper ${index + 1}`}
                        className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-purple-600 outline-none transition-all"
                      />
                    </div>
                    <div className="w-full sm:w-48 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Price (₹)</label>
                      <input 
                        type="text" 
                        placeholder="199"
                        className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-purple-600 outline-none transition-all"
                      />
                    </div>
                    <button 
                      onClick={() => removePaper(paper.id)}
                      className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all mt-6 sm:mt-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                
                <button 
                  onClick={addPaper}
                  className="w-full sm:w-auto px-6 py-4 border-2 border-dashed border-gray-200 rounded-2xl text-[11px] font-black text-purple-600 uppercase tracking-widest hover:border-purple-200 hover:bg-purple-50/30 transition-all flex items-center justify-center gap-3 italic"
                >
                  <Plus size={16} /> Add Another Paper
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6">
              <button className="px-8 py-4 bg-gray-50 text-gray-400 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">Cancel</button>
              <button className="px-8 py-4 bg-[#7C3AED] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-purple-900/20 active:scale-95 transition-all">Create Series</button>
            </div>
          </div>
        </section>

        {/* YOUR SERIES LIST */}
        <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Your Paid Quiz Series</h3>
            <div className="relative w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search series..." 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-[12px] focus:border-purple-600 outline-none transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Series Name</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Papers</th>
                  <th className="px-10 py-6 text-center text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Total Papers</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Created On</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {seriesList.map((series) => (
                  <tr key={series.id} className="group hover:bg-gray-50 transition-all duration-500">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center border border-purple-100">
                          <BookOpen size={20} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-gray-900 uppercase tracking-tighter italic">{series.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">{series.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2">
                        {series.papers.map((p, i) => (
                          <span key={i} className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-purple-100">{p} ₹199</span>
                        ))}
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-2">+ {series.total - series.papers.length} more</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center font-black text-gray-900 italic text-sm">{series.total}</td>
                    <td className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-widest italic">{series.created}</td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="px-6 py-2.5 bg-gray-50 text-purple-600 hover:bg-purple-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-purple-100 group-hover:shadow-lg group-hover:shadow-purple-900/10">View</button>
                        <button className="p-2.5 text-gray-300 hover:text-gray-900"><MoreVertical size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-10 border-t border-gray-50 flex items-center justify-between">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Showing 1 to 4 of 4 series</p>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-300 hover:text-gray-900 bg-gray-50 rounded-lg"><ChevronRight size={16} className="rotate-180" /></button>
              <button className="w-8 h-8 bg-purple-600 text-white rounded-lg text-[10px] font-black">1</button>
              <button className="p-2 text-gray-300 hover:text-gray-900 bg-gray-50 rounded-lg"><ChevronRight size={16} /></button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
