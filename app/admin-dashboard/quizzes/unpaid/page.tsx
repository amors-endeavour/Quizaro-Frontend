"use client";

import { useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import { Plus, Search, Filter, MoreVertical, Edit2, ChevronRight, BookOpen, Sparkles } from "lucide-react";

export default function UnpaidQuizzes() {
  const [quizzes] = useState([
    { id: 1, name: "Indian Polity Quiz", subject: "Polity", questions: 25, duration: "30 min", status: "Published", created: "15 Jan 2025" },
    { id: 2, name: "Physics Basics Quiz", subject: "Physics", questions: 20, duration: "25 min", status: "Published", created: "12 Jan 2025" },
    { id: 3, name: "Chemistry MCQ Test", subject: "Chemistry", questions: 30, duration: "30 min", status: "Draft", created: "10 Jan 2025" },
    { id: 4, name: "Arithmetic Practice Quiz", subject: "Quantitative Aptitude", questions: 25, duration: "20 min", status: "Published", created: "09 Jan 2025" },
  ]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <AdminHeader 
        title="Unpaid Quizzes" 
        path={[{ label: "Home" }, { label: "Unpaid Quizzes" }]} 
      />

      <main className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* QUIZ TABLE SECTION */}
        <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Unpaid Quizzes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search quizzes..." 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-[12px] focus:border-purple-600 outline-none transition-all"
                />
              </div>
              <select className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[11px] font-black uppercase tracking-widest text-gray-400 outline-none focus:border-purple-600">
                <option>All Subjects</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Mathematics</option>
              </select>
              <select className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[11px] font-black uppercase tracking-widest text-gray-400 outline-none focus:border-purple-600">
                <option>All Status</option>
                <option>Published</option>
                <option>Draft</option>
              </select>
              <button className="px-6 py-3 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">Reset</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Quiz Name</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Subject</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Questions</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Duration</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Created On</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {quizzes.map((quiz) => (
                  <tr key={quiz.id} className="group hover:bg-gray-50 transition-all duration-500">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100">
                          <BookOpen size={18} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-gray-900 uppercase tracking-tighter italic leading-tight">{quiz.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic leading-tight">Standalone Assessment</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-[11px] font-black text-gray-500 uppercase tracking-widest italic">{quiz.subject}</td>
                    <td className="px-10 py-8 font-black text-gray-900 italic text-sm">{quiz.questions}</td>
                    <td className="px-10 py-8 text-[11px] font-black text-gray-500 uppercase tracking-widest italic">{quiz.duration}</td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        quiz.status === 'Published' ? "bg-green-50 text-green-600 border border-green-100" : "bg-gray-50 text-gray-400 border border-gray-100"
                      }`}>
                        {quiz.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-widest italic">{quiz.created}</td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="px-6 py-2.5 bg-gray-50 text-purple-600 hover:bg-purple-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-purple-100 group-hover:shadow-lg group-hover:shadow-purple-900/10 flex items-center gap-2">
                          <Edit2 size={12} /> Edit
                        </button>
                        <button className="p-2.5 text-gray-300 hover:text-gray-900"><MoreVertical size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-10 border-t border-gray-50 flex items-center justify-between">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Showing 1 to 4 of 4 quizzes</p>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-300 hover:text-gray-900 bg-gray-50 rounded-lg"><ChevronRight size={16} className="rotate-180" /></button>
              <button className="w-8 h-8 bg-purple-600 text-white rounded-lg text-[10px] font-black">1</button>
              <button className="p-2 text-gray-300 hover:text-gray-900 bg-gray-50 rounded-lg"><ChevronRight size={16} /></button>
            </div>
          </div>
        </section>

        {/* CREATE UNPAID QUIZ FORM */}
        <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-10 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Create Unpaid Quiz</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic leading-none">Add standalone direct assessment</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-purple-900/20 active:scale-95 transition-all">
                <Sparkles size={16} /> ✨ Auto-Generate Quiz
              </button>
              <button className="px-8 py-4 bg-[#7C3AED] text-white rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-purple-900/20 active:scale-95 transition-all">
                Create Quiz
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-3 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Quiz Title</label>
                <span className="text-[9px] text-gray-300 font-bold">0/100</span>
              </div>
              <input type="text" placeholder="Enter quiz title" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 text-sm focus:border-purple-600 outline-none transition-all placeholder:text-gray-300" />
            </div>

            <div className="md:col-span-3 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Description (Optional)</label>
                <span className="text-[9px] text-gray-300 font-bold">0/500</span>
              </div>
              <textarea placeholder="Enter quiz description..." className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 text-sm focus:border-purple-600 outline-none transition-all min-h-[120px] placeholder:text-gray-300" />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Subject</label>
              <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 text-sm text-gray-500 focus:border-purple-600 outline-none transition-all">
                <option>Select subject</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Mathematics</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Total Questions</label>
              <input type="number" placeholder="Enter number of questions" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 text-sm focus:border-purple-600 outline-none transition-all" />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Duration (in minutes)</label>
              <input type="number" placeholder="Enter duration" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 text-sm focus:border-purple-600 outline-none transition-all" />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Difficulty Level</label>
              <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 text-sm text-gray-500 focus:border-purple-600 outline-none transition-all">
                <option>Select difficulty level</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Passing Marks (Optional)</label>
              <input type="number" placeholder="Enter passing marks" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 text-sm focus:border-purple-600 outline-none transition-all" />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Negative Marking (Optional)</label>
              <input type="text" placeholder="Enter negative marks" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 text-sm focus:border-purple-600 outline-none transition-all" />
            </div>

            <div className="md:col-span-3 flex items-center gap-3 group cursor-pointer">
              <input type="checkbox" id="shuffle" className="w-5 h-5 rounded-md border-gray-200 text-purple-600 focus:ring-purple-500 transition-all cursor-pointer" />
              <label htmlFor="shuffle" className="text-[11px] font-black text-gray-900 uppercase tracking-widest italic cursor-pointer">Shuffle Questions</label>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic">(Show questions in random order to each user)</span>
            </div>

            <div className="md:col-span-3 flex items-center justify-end gap-4 pt-10 border-t border-gray-50">
              <button className="px-8 py-4 bg-gray-50 text-gray-400 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">Cancel</button>
              <button className="px-8 py-4 bg-[#7C3AED] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-purple-900/20 active:scale-95 transition-all">Create Quiz</button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
