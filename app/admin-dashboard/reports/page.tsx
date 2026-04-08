"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  PieChart,
  Target
} from "lucide-react";

export default function ReportsDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) return <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center font-black animate-pulse text-red-500 uppercase tracking-widest leading-none">Initializing Reports...</div>;

  return (
    <main className="flex-1 overflow-y-auto">
      <AdminHeader 
        title="Incident Reports" 
        path={[{ label: "My Library" }, { label: "Reports" }]} 
      />

      <div className="p-10 lg:p-14 max-w-[1700px] mx-auto space-y-12">
        
        {/* ANALYTICS HUD (IMAGE #1 ANALYTICS STYLE) */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between">
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-50 mb-6">
                 <AlertCircle size={24} />
              </div>
              <div>
                 <h3 className="text-3xl font-black text-gray-900 leading-none">17</h3>
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-3">Unresolved Reports</p>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-50 mb-6">
                 <Users size={24} />
              </div>
              <div>
                 <h3 className="text-3xl font-black text-gray-900 leading-none">412</h3>
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-3">Active Students</p>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-50 mb-6">
                 <CheckCircle2 size={24} />
              </div>
              <div>
                 <h3 className="text-3xl font-black text-gray-900 leading-none">94.2%</h3>
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-3">Accuracy Score</p>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-50 mb-6">
                 <Target size={24} />
              </div>
              <div>
                 <h3 className="text-3xl font-black text-gray-900 leading-none">28%</h3>
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-3">Completion Rate</p>
              </div>
           </div>
        </section>

        {/* REPORT LISTING TABLE (IMAGE #1 LIST STYLE) */}
        <section className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-100/50 overflow-hidden">
           <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <History size={18} />
                 Live Performance Log
              </h3>
              <span className="bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">Require Action</span>
           </div>

           <div className="p-0">
              <table className="w-full">
                 <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 font-sans text-left">
                       <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Timestamp</th>
                       <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Student Name</th>
                       <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Test Context</th>
                       <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Incident Category</th>
                       <th className="px-10 py-5 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 pr-12">Investigation</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {[1, 2, 3, 4, 5, 6].map((row) => (
                      <tr key={row} className="hover:bg-gray-50/50 transition cursor-pointer group">
                         <td className="px-10 py-6 text-[11px] font-black text-gray-400 font-mono">2026/04/07 14:22</td>
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-black text-[11px] text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">ST</div>
                               <span className="text-xs font-black text-gray-900 uppercase">Student_{row}84C</span>
                            </div>
                         </td>
                         <td className="px-10 py-6">
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">Quantitative Aptitude Paper-0{row}</span>
                         </td>
                         <td className="px-10 py-6">
                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${row % 3 === 0 ? "bg-red-50 text-red-600 border-red-100" : "bg-orange-50 text-orange-600 border-orange-100"}`}>
                               {row % 3 === 0 ? "Connectivity Loss" : "Page Navigation Alert"}
                            </span>
                         </td>
                         <td className="px-10 py-6 text-right pr-12">
                            <button className="text-gray-400 group-hover:text-blue-600 flex items-center gap-2 justify-end text-[11px] font-black uppercase tracking-widest transition-all">
                               Check Session
                               <ChevronRight size={14} />
                            </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </section>

      </div>
    </main>
  );
}

const History = ({ size }: { size: number }) => (
  <Clock size={size} />
);
