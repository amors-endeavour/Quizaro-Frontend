"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import API from "@/app/lib/api";
import io from "socket.io-client";
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
  Download,
  Zap,
  Info,
  X,
  ArrowUpRight
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

    const socket = io(process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com", {
      transports: ["websocket"]
    });

    socket.on("admin:attemptUpdate", (data) => {
      console.log("Real-time telemetry event received:", data);
      fetchReports();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleExport = (type: 'csv' | 'pdf') => {
    const headers = "Student,Test,Score,Percentage,Date\n";
    const rows = attempts.map(a => `${a.userId?.name},${a.testId?.title},${a.score},${((a.score/a.totalMarks)*100).toFixed(2)}%,${new Date(a.submittedAt).toLocaleDateString()}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Quizaro_Audit_Log_${new Date().getTime()}.${type === 'csv' ? 'csv' : 'txt'}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (loading && attempts.length === 0) return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex flex-col items-center justify-center space-y-8 transition-colors duration-300">
      <div className="w-20 h-20 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin shadow-sm" />
      <p className="font-black animate-pulse text-blue-600 dark:text-blue-400 uppercase tracking-[0.5em] text-[10px] italic leading-none">
        Synthesizing Audit Grid Node...
      </p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc] dark:bg-[#050816] text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <AdminHeader 
        title="Institutional Intelligence Audit" 
        path={[{ label: "Governance" }, { label: "Performance Telemetry" }]} 
      />

      <div className="flex-1 overflow-y-auto p-8 lg:p-14 max-w-[1750px] mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 w-full pb-20">
        
        {/* LIVE METRICS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
           {[
             { label: "Active Cohort (Weekly)", val: `${stats?.activeThisWeek || 0}`, icon: <Users size={28} />, color: "blue", trend: "+12.5% Grid Growth" },
             { label: "Mean Velocity Index", val: `${stats?.avgScore || 0}%`, icon: <TrendingUp size={28} />, color: "green", trend: "Optimal Response Rate" },
             { label: "Registry Incident Freq.", val: `${stats?.incidentRate || '0.0'}%`, icon: <AlertCircle size={28} />, color: "red", trend: "Nominal System Range" },
             { label: "Avg Neural Efficiency", val: `${stats?.avgTime || 0}m`, icon: <Clock size={28} />, color: "orange", trend: "Standard Session Pace" }
           ].map((m) => (
             <div key={m.label} className="bg-white dark:bg-[#0a0f29] p-12 rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-700 flex flex-col justify-between group relative overflow-hidden active:scale-[0.98]">
                <div className={`absolute -top-10 -right-10 w-32 h-32 blur-3xl opacity-20 transition-all duration-700 group-hover:scale-150 ${
                   m.color === "blue" ? "bg-blue-600" : 
                   m.color === "green" ? "bg-green-600" :
                   m.color === "red" ? "bg-red-600" : "bg-orange-600"
                }`} />
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-12 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-sm ${
                   m.color === "blue" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : 
                   m.color === "green" ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" :
                   m.color === "red" ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                }`}>
                   {m.icon}
                </div>
                <div className="space-y-5 relative z-10">
                   <div className="space-y-1">
                      <h3 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-none tracking-tighter italic">{m.val}</h3>
                      <p className="text-[11px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-[0.3em] italic leading-none">{m.label}</p>
                   </div>
                   <p className={`text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2 ${
                      m.color === "blue" ? "text-blue-600 dark:text-blue-500" : 
                      m.color === "green" ? "text-green-600 dark:text-green-500" :
                      m.color === "red" ? "text-red-600 dark:text-red-500" : "text-orange-600 dark:text-orange-500"
                   }`}>
                      {m.trend} <ArrowUpRight size={12} />
                   </p>
                </div>
             </div>
           ))}
        </section>

        {/* PERFORMANCE ANALYSIS GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
           
           <section className="xl:col-span-2 bg-white dark:bg-[#0a0f29] rounded-[5rem] border border-gray-100 dark:border-gray-800 shadow-sm p-16 lg:p-20 space-y-16 group overflow-hidden transition-all duration-700 relative">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600/10" />
              <div className="flex items-center justify-between">
                 <div className="space-y-3">
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Institutional Participation Hub</h3>
                    <p className="text-[11px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-[0.4em] italic leading-none">Real-time enrollment telemetry synchronization flow</p>
                 </div>
                 <div className="flex items-center gap-6">
                    <button onClick={() => handleExport('csv')} className="w-16 h-16 bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-700 hover:text-blue-600 dark:hover:text-blue-500 rounded-[1.5rem] transition-all duration-500 flex items-center justify-center active:scale-90 shadow-sm group/btn">
                       <Download size={24} className="group-hover/btn:translate-y-1 transition-transform" />
                    </button>
                 </div>
              </div>

              <div className="h-[400px] w-full relative pt-16">
                 <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                       <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                       </linearGradient>
                       <filter id="glow">
                          <feGaussianBlur stdDeviation="6" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                       </filter>
                    </defs>
                    <path d="M 0 350 Q 150 250 300 200 Q 450 230 600 120 Q 750 150 900 80 Q 1050 100 1200 50 L 1200 450 L 0 450 Z" fill="url(#areaGrad)" className="transition-all duration-1000" />
                    <path d="M 0 350 Q 150 250 300 200 Q 450 230 600 120 Q 750 150 900 80 Q 1050 100 1200 50" fill="none" stroke="#2563eb" strokeWidth="10" strokeLinecap="round" filter="url(#glow)" className="transition-all duration-1000" />
                 </svg>
                 <div className="flex justify-between mt-16 px-8 border-t-2 border-gray-50 dark:border-gray-800 pt-10">
                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => <span key={day} className="text-[12px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-[0.5em] italic">{day}</span>)}
                 </div>
              </div>
           </section>

           <section className="bg-white dark:bg-[#0a0f29] rounded-[5rem] border border-gray-100 dark:border-gray-800 shadow-sm p-16 flex flex-col items-center justify-between text-center transition-all duration-700 group hover:border-blue-600/30 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl" />
              <div className="w-full space-y-4">
                 <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-[2rem] border-2 border-blue-100 dark:border-blue-800/30 flex items-center justify-center mx-auto mb-10 shadow-sm group-hover:rotate-12 transition-all duration-700"><PieChart size={40} /></div>
                 <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Accuracy Spectrum</h3>
                 <p className="text-[11px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-[0.3em] italic leading-none">Intra-Cluster Performance Weight Distribution</p>
              </div>
              <div className="relative w-80 h-80 my-16 group/pie">
                 <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-500/5 rounded-full blur-3xl group-hover/pie:scale-125 transition-transform duration-1000" />
                 <svg className="w-full h-full -rotate-90 relative">
                    <circle cx="160" cy="160" r="120" fill="none" stroke="currentColor" className="text-gray-50 dark:text-[#050816]" strokeWidth="36" />
                    <circle cx="160" cy="160" r="120" fill="none" stroke="#2563eb" strokeWidth="36" strokeDasharray="754" strokeDashoffset="200" strokeLinecap="round" className="drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-7xl font-black text-gray-900 dark:text-white tracking-tighter italic leading-none">94%</span>
                    <span className="text-[11px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.4em] italic mt-4 leading-none">Mastery Index</span>
                 </div>
              </div>
              <div className="w-full grid grid-cols-2 gap-8">
                 <div className="bg-gray-50 dark:bg-[#050816] p-8 rounded-[2.5rem] border-2 border-gray-50 dark:border-gray-800 shadow-inner group/stat hover:border-blue-600 transition-all duration-500">
                    <p className="text-xl font-black text-gray-900 dark:text-white italic leading-none">Peak</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-widest mt-3 italic leading-none">Quantitative Node</p>
                 </div>
                 <div className="bg-gray-50 dark:bg-[#050816] p-8 rounded-[2.5rem] border-2 border-gray-50 dark:border-gray-800 shadow-inner group/stat hover:border-blue-600 transition-all duration-500">
                    <p className="text-xl font-black text-gray-400 dark:text-gray-700 italic leading-none">Mean</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-widest mt-3 italic leading-none">Logical Synthesis</p>
                 </div>
              </div>
           </section>
        </div>

        {/* PERFORMANCE STREAM */}
        <section className="bg-white dark:bg-[#0a0f29] rounded-[5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-all duration-700">
           <div className="px-16 py-14 lg:px-20 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-10 bg-gray-50/30 dark:bg-[#050816]/30">
              <div className="space-y-3">
                 <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-6 italic leading-none">
                    <Activity size={32} className="text-blue-600 dark:text-blue-400" />
                    Live Audit Stream Matrix
                 </h3>
                 <p className="text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.4em] italic leading-none">Real-time Scholar Performance Synchronization</p>
              </div>
              <button onClick={() => handleExport('csv')} className="flex items-center gap-5 px-12 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-widest shadow-2xl shadow-blue-900/40 transition-all active:scale-[0.98] italic hover:bg-blue-700">
                 <FileText size={20} />
                 Institutional Export Protocol
              </button>
           </div>

           <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-gray-50/50 dark:bg-[#050816]/50 border-b border-gray-50 dark:border-gray-800">
                       <th className="px-16 lg:px-20 py-10 text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-700 italic">Scholar Entity Identity</th>
                       <th className="px-16 py-10 text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-700 italic">Assessment Identifier</th>
                       <th className="px-16 py-10 text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-700 italic text-center">Neural Grade Vector</th>
                       <th className="px-16 lg:px-20 py-10 text-right text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-700 italic">Audit Action Hub</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {attempts.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-16 py-48 text-center text-gray-200 dark:text-gray-900 font-black uppercase tracking-[0.5em] italic text-sm">No institutional telemetry detected in grid buffer matrix.</td>
                      </tr>
                    ) : (
                      attempts.map((attempt) => (
                        <tr key={attempt._id} className="group hover:bg-gray-50/50 dark:hover:bg-[#050816]/50 transition-all duration-700 cursor-pointer" onClick={() => setSelectedAttempt(attempt)}>
                           <td className="px-16 lg:px-20 py-12">
                              <div className="flex items-center gap-10">
                                 <div className="w-16 h-16 bg-gray-50 dark:bg-[#050816] border-2 border-gray-50 dark:border-gray-800 rounded-[1.5rem] flex items-center justify-center font-black text-xl text-gray-300 dark:text-gray-800 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-700 shadow-inner italic">{attempt.userId?.name?.charAt(0)}</div>
                                 <div className="flex flex-col gap-2">
                                    <span className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{attempt.userId?.name}</span>
                                    <span className="text-[11px] text-gray-400 dark:text-gray-700 font-black mt-1 lowercase italic leading-none tracking-widest">{attempt.userId?.email}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-16 py-12">
                              <div className="flex items-center gap-6">
                                 <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-800/30 shadow-sm"><FileText size={22} /></div>
                                 <span className="text-[15px] font-black text-gray-900 dark:text-white tracking-tighter uppercase italic leading-none">{attempt.testId?.title}</span>
                              </div>
                           </td>
                           <td className="px-16 py-12">
                              <div className="flex flex-col items-center gap-5">
                                 <div className="flex items-center gap-6">
                                    <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter italic leading-none tabular-nums">{((attempt.score / attempt.totalMarks) * 100).toFixed(0)}%</span>
                                    <div className="w-40 h-3 bg-gray-100 dark:bg-[#050816] rounded-full overflow-hidden shadow-inner">
                                       <div className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all duration-1000" style={{ width: `${(attempt.score / attempt.totalMarks) * 100}%` }} />
                                    </div>
                                 </div>
                                 <p className="text-[10px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-[0.3em] italic leading-none">{attempt.score} / {attempt.totalMarks} Points Encrypted</p>
                              </div>
                           </td>
                           <td className="px-16 lg:px-20 py-12 text-right">
                              <button className="px-10 py-5 bg-white dark:bg-[#0a0f29] border-2 border-gray-50 dark:border-gray-800 text-gray-400 dark:text-gray-700 rounded-2xl text-[11px] font-black uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-700 italic shadow-sm active:scale-95">Initialize Deep Audit</button>
                           </td>
                        </tr>
                      ))
                    )}
                 </tbody>
              </table>
           </div>
        </section>
      </div>

      {selectedAttempt && (
        <div className="fixed inset-0 bg-gray-900/60 dark:bg-black/95 backdrop-blur-3xl z-[600] flex items-center justify-center p-8 animate-in fade-in duration-500">
           <div className="bg-white dark:bg-[#0a0f29] rounded-[5rem] w-full max-w-6xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-700 border-2 border-gray-100 dark:border-gray-800 flex flex-col max-h-[92vh] relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
              <div className="px-20 py-14 bg-gray-50/50 dark:bg-[#050816]/30 border-b-2 border-gray-50 dark:border-gray-800 flex items-center justify-between transition-all duration-500">
                 <div className="flex items-center gap-12">
                    <div className="w-28 h-28 bg-blue-600 text-white rounded-[2.5rem] flex items-center justify-center font-black text-4xl shadow-2xl shadow-blue-900/30 italic rotate-6 border-4 border-white dark:border-[#0a0f29]">{selectedAttempt.userId?.name.charAt(0)}</div>
                    <div className="space-y-3">
                       <h3 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">{selectedAttempt.userId?.name}</h3>
                       <p className="text-[12px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-[0.4em] italic leading-none">Audit Authorization String: {selectedAttempt._id.slice(-16).toUpperCase()}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedAttempt(null)} className="w-16 h-16 bg-white dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 rounded-3xl flex items-center justify-center text-gray-300 hover:text-red-600 transition-all duration-500 shadow-sm active:scale-90 group">
                    <X size={36} className="group-hover:rotate-90 transition-transform" />
                 </button>
              </div>
              <div className="p-20 space-y-20 overflow-y-auto custom-scrollbar flex-1">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="bg-blue-50/50 dark:bg-blue-900/20 p-12 rounded-[4rem] border-2 border-blue-100 dark:border-blue-800/30 flex flex-col justify-between h-56 group hover:bg-blue-600 transition-all duration-700 relative overflow-hidden">
                       <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-600/10 group-hover:bg-white/20 rounded-full blur-2xl transition-all" />
                       <p className="text-[12px] font-black text-blue-600 dark:text-blue-400 group-hover:text-blue-100 uppercase tracking-[0.3em] italic leading-none relative z-10">Neural Synthesis Score</p>
                       <h4 className="text-6xl font-black text-blue-700 dark:text-blue-300 group-hover:text-white tracking-tighter italic leading-none relative z-10">{selectedAttempt.score}<span className="text-2xl mx-3 opacity-30 italic">/</span>{selectedAttempt.totalMarks}</h4>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#050816] p-12 rounded-[4rem] border-2 border-gray-100 dark:border-gray-800 flex flex-col justify-between h-56 group hover:border-blue-600 transition-all duration-700 relative overflow-hidden">
                       <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gray-100 dark:bg-gray-800/50 rounded-full blur-2xl transition-all" />
                       <p className="text-[12px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] italic leading-none relative z-10">Assessment Node Cluster</p>
                       <h4 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic leading-tight group-hover:text-blue-600 transition-all duration-700 relative z-10">{selectedAttempt.testId?.title}</h4>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#050816] p-12 rounded-[4rem] border-2 border-gray-100 dark:border-gray-800 flex flex-col justify-between h-56 group hover:border-green-600 transition-all duration-700 relative overflow-hidden">
                       <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-green-100/50 dark:bg-green-900/10 rounded-full blur-2xl transition-all" />
                       <p className="text-[12px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] italic leading-none relative z-10">Matrix Integrity Commit</p>
                       <div className="flex items-center gap-6 relative z-10">
                          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center group-hover:bg-green-600 group-hover:text-white group-hover:scale-110 transition-all duration-700 border-2 border-green-100 dark:border-green-800/30 shadow-sm"><CheckCircle2 size={24} /></div>
                          <h4 className="text-3xl font-black text-green-600 dark:text-green-500 tracking-tighter uppercase italic leading-none group-hover:text-green-600 transition-all duration-700">Verified Commit</h4>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-12">
                    <div className="flex items-center gap-8">
                       <h5 className="text-[13px] font-black text-gray-900 dark:text-white uppercase tracking-[0.5em] italic leading-none whitespace-nowrap flex items-center gap-6"><Layers size={24} className="text-blue-600 dark:text-blue-400" />Detailed Synthesis Telemetry</h5>
                       <div className="w-full h-px bg-gray-50 dark:bg-gray-800/50" />
                    </div>
                    <div className="bg-gray-50 dark:bg-[#050816] rounded-[4rem] p-24 border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center gap-10 group hover:border-blue-600 transition-all duration-1000 relative overflow-hidden">
                       <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-all duration-1000" />
                       <Zap size={64} className="text-gray-100 dark:text-gray-900 group-hover:text-blue-600 group-hover:scale-125 transition-all duration-1000 relative z-10" />
                       <div className="space-y-4 relative z-10">
                          <p className="text-[14px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] italic leading-relaxed max-w-xl mx-auto">Institutional response metadata is archived in the encrypted cloud matrix. Initializing deep neural audit protocol requires administrator security clearance level 04 // OMNI-CLEARANCE REQUIRED.</p>
                       </div>
                       <button className="px-12 py-6 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-widest rounded-[1.5rem] italic hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-700 relative z-10 active:scale-95 shadow-xl">Request High-Level Clearance</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
