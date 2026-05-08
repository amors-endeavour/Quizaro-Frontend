"use client";

import { useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import { UploadCloud, FileText, Search, MoreVertical, Download, Trash2, ChevronRight, Eye } from "lucide-react";

export default function PDFManagement() {
  const [pdfs] = useState([
    { id: 1, name: "Introduction to AI.pdf", category: "AI", size: "2.4 MB", date: "May 20, 2025", downloads: 124 },
    { id: 2, name: "Machine Learning Basics.pdf", category: "ML", size: "4.1 MB", date: "May 19, 2025", downloads: 89 },
    { id: 3, name: "Data Science Handbook.pdf", category: "Data Science", size: "15.2 MB", date: "May 18, 2025", downloads: 256 },
    { id: 4, name: "Python Programming Guide.pdf", category: "Python", size: "1.8 MB", date: "May 17, 2025", downloads: 412 },
  ]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <AdminHeader 
        title="PDF Management" 
        path={[{ label: "Home" }, { label: "PDFs" }]} 
      />

      <main className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* PDF UPLOAD ZONE */}
        <section className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center space-y-8">
           <div className="w-24 h-24 bg-purple-50 text-purple-600 rounded-[2rem] flex items-center justify-center shadow-lg shadow-purple-900/5 animate-pulse">
              <UploadCloud size={48} />
           </div>
           <div className="text-center space-y-3">
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Upload PDF</h3>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic">Drag and drop a PDF here, or click to browse</p>
           </div>
           <div className="w-full max-w-2xl p-16 border-4 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center gap-8 hover:border-purple-200 transition-all group cursor-pointer">
              <button className="px-10 py-5 bg-[#7C3AED] text-white rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-purple-900/20 group-hover:scale-105 transition-all">
                Choose File
              </button>
              <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic">Only PDF files are allowed.</p>
           </div>
        </section>

        {/* PDF DETAILS FORM */}
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 space-y-10">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Document Configuration</h3>
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Access Control:</span>
                 <div className="flex items-center bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                    <button className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-purple-600 bg-white shadow-sm rounded-lg">Public</button>
                    <button className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-gray-900">Premium</button>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">PDF Title</label>
                <input type="text" placeholder="Enter document title" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 text-sm focus:border-purple-600 outline-none transition-all placeholder:text-gray-300" />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Category / Subject</label>
                <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 text-sm text-gray-500 focus:border-purple-600 outline-none transition-all">
                   <option>Select category</option>
                   <option>General Knowledge</option>
                   <option>Science & Tech</option>
                   <option>History</option>
                </select>
              </div>
           </div>
        </section>

        {/* YOUR PDFS LIST */}
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Your PDFs</h3>
            <div className="relative w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search PDFs..." 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-[12px] focus:border-purple-600 outline-none transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">PDF Name</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Category</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">File Size</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Uploaded On</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Downloads</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pdfs.map((pdf) => (
                  <tr key={pdf.id} className="group hover:bg-gray-50 transition-all duration-500">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center border border-red-100 shadow-sm group-hover:rotate-6 transition-transform">
                          <FileText size={20} />
                        </div>
                        <p className="text-sm font-black text-gray-900 uppercase tracking-tighter italic leading-none">{pdf.name}</p>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-purple-100">{pdf.category}</span>
                    </td>
                    <td className="px-10 py-8 text-[11px] font-black text-gray-500 uppercase tracking-widest italic">{pdf.size}</td>
                    <td className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-widest italic">{pdf.date}</td>
                    <td className="px-10 py-8 font-black text-gray-900 italic text-sm">{pdf.downloads}</td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="p-3 bg-gray-50 text-gray-400 hover:text-purple-600 rounded-xl transition-all"><Eye size={18} /></button>
                        <button className="p-3 bg-gray-50 text-gray-400 hover:text-green-600 rounded-xl transition-all"><Download size={18} /></button>
                        <button className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 rounded-xl transition-all"><Trash2 size={18} /></button>
                        <button className="p-2.5 text-gray-300 hover:text-gray-900"><MoreVertical size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-10 border-t border-gray-50 flex items-center justify-between">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Showing 1 to 4 of 24 PDFs</p>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-300 hover:text-gray-900 bg-gray-50 rounded-lg"><ChevronRight size={16} className="rotate-180" /></button>
              <button className="w-8 h-8 bg-purple-600 text-white rounded-lg text-[10px] font-black">1</button>
              <button className="w-8 h-8 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-black">2</button>
              <button className="w-8 h-8 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-black">3</button>
              <button className="p-2 text-gray-300 hover:text-gray-900 bg-gray-50 rounded-lg"><ChevronRight size={16} /></button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
