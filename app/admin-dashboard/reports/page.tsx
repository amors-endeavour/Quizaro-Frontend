"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import API from "@/app/lib/api";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  PieChart,
  Target,
  Activity,
  Layers,
  FileText,
  Download
} from "lucide-react";

interface Attempt {
  _id: string;
  userId: { name: string; email: string };
  testId: { title: string };
  score: number;
  totalMarks: number;
  submittedAt: string;
}

export default function ReportsDashboard() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);

  const fetchReports = async () => {
    try {
      const [attemptRes, statsRes] = await Promise.all([
        API.get("/admin/attempts/recent"),
        API.get("/admin/stats")
      ]);
      setAttempts(attemptRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExport = (type: 'csv' | 'pdf') => {
    alert(`Generating ${type.toUpperCase()} Institutional Audit Log...`);
    // Simulated export logic
    const headers = "Student,Test,Score,Percentage,Date\n";
    const rows = attempts.map(a => `${a.userId?.name},${a.testId?.title},${a.score},${((a.score/a.totalMarks)*100).toFixed(2)}%,${new Date(a.submittedAt).toLocaleDateString()}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Quizaro_Audit_${new Date().getTime()}.${type === 'csv' ? 'csv' : 'txt'}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (loading) return <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center font-black animate-pulse text-blue-600 uppercase tracking-widest leading-none">Synthesizing Audit Grid...</div>;

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader 
        title="Intelligence Hub" 
        path={[{ label: "Intelligence" }, { label: "Performance Audit" }]} 
      />

      <div className="p-8 lg:p-14 max-w-[1700px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700 w-full">
        
        {/* LIVE METRICS */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
           {[
             { label: "Active Cohort (Weekly)", val: `${stats?.activeThisWeek || 0}`, icon: <Users size={24} />, color: "blue" },
             { label: "Completion Velocity / Avg Marks", val: `${stats?.avgScore || 0}%`, icon: <TrendingUp size={24} />, color: "green" },
             { label: "Incident Rate", val: `${stats?.incidentRate || '0.0'}%`, icon: <AlertCircle size={24} />, color: "red" },
             { label: "Avg Efficiency", val: `${stats?.avgTime || 0}m`, icon: <Clock size={24} />, color: "orange" }
           ].map((m) => (
             <div key={m.label} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between group hover:border-blue-200 transition-all duration-500">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform ${
                   m.color === "blue" ? "bg-blue-50 text-blue-600 shadow-blue-50" : 
                   m.color === "green" ? "bg-green-50 text-green-600 shadow-green-50" :
                   m.color === "red" ? "bg-red-50 text-red-600 shadow-red-50" : "bg-orange-50 text-orange-600 shadow-orange-50"
                }`}>
                   {m.icon}
                </div>
                <div>
                   <h3 className="text-3xl font-black text-gray-900 leading-none tracking-tighter">{m.val}</h3>
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-3">{m.label}</p>
                </div>
             </div>
           ))}
        </section>

        {/* PERFORMANCE ANALYSIS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           
           <section className="lg:col-span-2 bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-100/30 p-12 space-y-10 group overflow-hidden">
              <div className="flex items-center justify-between">
                 <div>
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">System Participation Flow</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Real-time enrollment tracking for last 7 days</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <button onClick={() => handleExport('csv')} className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-xl transition-all"><Download size={18} /></button>
                 </div>
              </div>

              <div className="h-80 w-full relative pt-10 px-2">
                 <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                       <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                       </linearGradient>
                    </defs>
                    <path d="M 0 250 Q 150 180 300 120 Q 450 150 600 80 Q 750 100 900 40 L 1000 40 L 1000 320 L 0 320 Z" fill="url(#areaGrad)" />
                    <path d="M 0 250 Q 150 180 300 120 Q 450 150 600 80 Q 750 100 900 40 L 1000 40" fill="none" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
                 </svg>
                 <div className="flex justify-between mt-8">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <span key={day} className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{day}</span>)}
                 </div>
              </div>
           </section>

           <section className="bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-100/30 p-10 flex flex-col items-center justify-between text-center">
              <div className="w-full">
                 <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><PieChart size={24} /></div>
                 <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Accuracy Spectrum</h3>
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2">Topic-wise score distribution</p>
              </div>
              <div className="relative w-56 h-56 my-8">
                 <svg className="w-full h-full -rotate-90">
                    <circle cx="112" cy="112" r="80" fill="none" stroke="#f8fafc" strokeWidth="24" />
                    <circle cx="112" cy="112" r="80" fill="none" stroke="#2563eb" strokeWidth="24" strokeDasharray="502" strokeDashoffset="120" strokeLinecap="round" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-gray-900 tracking-tighter">91%</span>
                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Mastery</span>
                 </div>
              </div>
              <div className="w-full grid grid-cols-2 gap-4">
                 <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100"><p className="text-xs font-black text-gray-900">High</p><p className="text-[8px] text-gray-400 uppercase tracking-widest">Quant</p></div>
                 <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100"><p className="text-xs font-black text-gray-400 italic">Mod</p><p className="text-[8px] text-gray-400 uppercase tracking-widest">Logical</p></div>
              </div>
           </section>
        </div>

        {/* PERFORMANCE STREAM */}
        <section className="bg-white rounded-[4rem] border border-gray-100 shadow-2xl shadow-gray-100/30 overflow-hidden">
           <div className="px-14 py-11 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                 <Activity size={20} className="text-blue-600" />
                 Live Performance Stream
              </h3>
              <button onClick={() => handleExport('csv')} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 transition-all active:scale-95">
                 <FileText size={14} />
                 The Export Suite
              </button>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-gray-50/30 border-b border-gray-50">
                       <th className="px-14 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Student Identity</th>
                       <th className="px-14 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Paper Identity</th>
                       <th className="px-14 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Grade Path</th>
                       <th className="px-14 py-8 text-right pr-20 text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50/50">
                    {attempts.map((attempt) => (
                      <tr key={attempt._id} className="group hover:bg-gray-50/50 transition-all cursor-pointer" onClick={() => setSelectedAttempt(attempt)}>
                         <td className="px-14 py-9">
                            <div className="flex items-center gap-6">
                               <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">{attempt.userId?.name?.charAt(0)}</div>
                               <div className="flex flex-col">
                                  <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">{attempt.userId?.name}</span>
                                  <span className="text-[10px] text-gray-400 font-bold mt-1 lowercase">{attempt.userId?.email}</span>
                               </div>
                            </div>
                         </td>
                         <td className="px-14 py-9"><span className="text-sm font-black text-gray-900 tracking-tighter uppercase">{attempt.testId?.title}</span></td>
                         <td className="px-14 py-9">
                            <div className="flex items-center gap-4">
                               <span className="text-xl font-black text-gray-900 tracking-tighter">{((attempt.score / attempt.totalMarks) * 100).toFixed(0)}%</span>
                               <div className="w-24 h-2 bg-gray-50 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-600 transition-all" style={{ width: `${(attempt.score / attempt.totalMarks) * 100}%` }} />
                               </div>
                            </div>
                         </td>
                         <td className="px-14 py-9 text-right pr-20">
                            <button className="px-7 py-3 bg-blue-50 text-blue-600 rounded-2xl text-[9px] font-black uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">Audit Details</button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </section>
      </div>

      {selectedAttempt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-6">
           <div className="bg-white rounded-[4rem] w-full max-w-4xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500 border border-gray-100">
              <div className="px-16 py-12 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                 <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center font-black text-2xl shadow-xl shadow-blue-200">{selectedAttempt.userId?.name.charAt(0)}</div>
                    <div>
                       <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{selectedAttempt.userId?.name}</h3>
                       <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Audit Log ID: {selectedAttempt._id.slice(-8).toUpperCase()}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedAttempt(null)} className="w-12 h-12 bg-white shadow-xl rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 text-2xl">×</button>
              </div>
              <div className="p-16 space-y-12">
                 <div className="grid grid-cols-3 gap-10">
                    <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-50"><p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">Final Grade</p><h4 className="text-4xl font-black text-blue-700 tracking-tighter">{selectedAttempt.score}/{selectedAttempt.totalMarks}</h4></div>
                    <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-50"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Session Paper</p><h4 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">{selectedAttempt.testId?.title}</h4></div>
                    <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-50"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Integrity</p><h4 className="text-2xl font-black text-green-600 tracking-tighter uppercase">Verified</h4></div>
                 </div>
                 <div className="space-y-6">
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3"><Layers size={14} className="text-blue-600" />Detailed Response Log</h5>
                    <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100 flex items-center justify-center min-h-32 text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-relaxed">Response metadata secured in cloud vault.</div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
