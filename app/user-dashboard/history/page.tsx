"use client";

import { useEffect, useState } from "react";
import UserSidebar from "@/components/UserSidebar";
import UserHeader from "@/components/UserHeader";
import API from "@/app/lib/api";
import { 
  Award, 
  Clock, 
  Calendar,
  CheckCircle2,
  TrendingUp,
  FileText,
  Download,
  Activity,
  Zap,
  Target,
  ArrowUpRight,
  ChevronRight,
  History
} from "lucide-react";
import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Papa from 'papaparse';

interface Attempt {
  _id: string;
  testId: { title: string };
  score: number;
  percentage: string;
  timeTaken: number;
  createdAt: string;
}

export default function PerformancePage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, attemptsRes] = await Promise.all([
          API.get("/user/profile"),
          API.get("/user/attempts")
        ]);
        setUser(profileRes.data.user || profileRes.data);
        setAttempts(attemptsRes.data);
      } catch (err) {
        console.error("Failed to load performance data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  let chartData = [...attempts].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((a, i) => ({
    date: new Date(a.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase(),
    score: Math.round(parseFloat(a.percentage)),
    index: i + 1,
    fullDate: new Date(a.createdAt).toLocaleDateString()
  }));

  // Linear Regression Prediction Logic
  if (chartData.length >= 3) {
    const n = chartData.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    chartData.forEach(p => {
      sumX += p.index;
      sumY += p.score;
      sumXY += p.index * p.score;
      sumXX += p.index * p.index;
    });

    const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    const nextIndex = n + 1;
    const predictedScore = Math.min(100, Math.max(0, Math.round(m * nextIndex + b)));
    
    (chartData[n-1] as any).predicted = chartData[n-1].score;
    chartData.push({
      date: "PROJ.",
      predicted: predictedScore,
      index: nextIndex,
      fullDate: "Predictive Analytics"
    } as any);
  }

  const handleExportCSV = () => {
    const csvData = attempts.map(a => ({
      TestName: a.testId?.title || 'Unknown Protocol',
      Score: a.score,
      Percentage: Math.round(parseFloat(a.percentage)) + '%',
      TimeTakenSeconds: a.timeTaken,
      Date: new Date(a.createdAt).toLocaleString()
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Quizaro_Neural_History_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex flex-col items-center justify-center space-y-8 transition-colors duration-300">
      <div className="w-20 h-20 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin shadow-sm" />
      <p className="font-black animate-pulse text-blue-600 dark:text-blue-400 uppercase tracking-[0.5em] text-[10px] italic leading-none">
        Accessing Neural History Registry...
      </p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc] dark:bg-[#050816] text-gray-900 dark:text-gray-100 transition-colors duration-500">
        <UserHeader 
          title="Neural History & Analytics" 
          breadcrumbs={["Intelligence", "Evaluation Matrix"]} 
        />

        <div className="p-8 lg:p-14 max-w-[1600px] mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 w-full pb-20">
           
           {/* PERFORMANCE HUD */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white dark:bg-[#0a0f29] p-10 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-700 relative overflow-hidden">
                 <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
                 <div className="space-y-4 relative z-10">
                    <div className="space-y-1">
                       <h3 className="text-4xl font-black text-gray-900 dark:text-white italic tracking-tighter leading-none tabular-nums group-hover:text-blue-600 transition-colors">{attempts.length}</h3>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-700 italic leading-none">Total Sync Cycles</p>
                    </div>
                    <p className="text-[9px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest italic flex items-center gap-2">Registry Commits <ArrowUpRight size={10} /></p>
                 </div>
                 <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30 rounded-2xl flex items-center justify-center shadow-sm group-hover:rotate-12 transition-all duration-700">
                    <TrendingUp size={32} />
                 </div>
              </div>

              <div className="bg-white dark:bg-[#0a0f29] p-10 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group hover:border-green-300 dark:hover:border-green-600 transition-all duration-700 relative overflow-hidden">
                 <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-600/5 rounded-full blur-3xl pointer-events-none" />
                 <div className="space-y-4 relative z-10">
                    <div className="space-y-1">
                       <h3 className="text-4xl font-black text-gray-900 dark:text-white italic tracking-tighter leading-none tabular-nums group-hover:text-green-600 transition-colors">
                          {attempts.length > 0 ? Math.round(attempts.reduce((acc, curr) => acc + parseFloat(curr.percentage), 0) / attempts.length) : 0}%
                       </h3>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-700 italic leading-none">Mean Proficiency Index</p>
                    </div>
                    <p className="text-[9px] font-black text-green-600 dark:text-green-500 uppercase tracking-widest italic flex items-center gap-2">Optimal Load <ArrowUpRight size={10} /></p>
                 </div>
                 <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800/30 rounded-2xl flex items-center justify-center shadow-sm group-hover:rotate-12 transition-all duration-700">
                    <Target size={32} />
                 </div>
              </div>

              <div className="bg-white dark:bg-[#0a0f29] p-10 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-700 relative overflow-hidden">
                 <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
                 <div className="space-y-4 relative z-10">
                    <div className="space-y-1">
                       <h3 className="text-4xl font-black text-gray-900 dark:text-white italic tracking-tighter leading-none tabular-nums group-hover:text-purple-600 transition-colors">
                          {Math.round(attempts.reduce((acc, curr) => acc + (curr.timeTaken || 0), 0) / 60)}
                       </h3>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-700 italic leading-none">Neural Training Min</p>
                    </div>
                    <p className="text-[9px] font-black text-purple-600 dark:text-purple-500 uppercase tracking-widest italic flex items-center gap-2">Focus Duration <ArrowUpRight size={10} /></p>
                 </div>
                 <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800/30 rounded-2xl flex items-center justify-center shadow-sm group-hover:rotate-12 transition-all duration-700">
                    <Clock size={32} />
                 </div>
              </div>
           </div>

           {/* ANALYTICS SECTION */}
           <section className="space-y-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between px-6 gap-8">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-gray-50 dark:bg-[#050816] text-blue-600 dark:text-blue-400 border-2 border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-center shadow-inner"><Activity size={28} /></div>
                    <div className="space-y-1">
                       <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Performance Telemetry</h3>
                       <p className="text-[10px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-[0.4em] italic leading-none">Predictive Neural Velocity Flow</p>
                    </div>
                 </div>
                 <button 
                   onClick={handleExportCSV}
                   className="px-10 py-5 bg-white dark:bg-[#0a0f29] text-gray-600 dark:text-gray-400 border-2 border-gray-100 dark:border-gray-800 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-700 shadow-sm flex items-center justify-center gap-4 italic active:scale-95 group/export"
                 >
                   <Download size={18} className="group-hover/export:translate-y-0.5 transition-transform" /> Preserve Registry CSV
                 </button>
              </div>

              {chartData.length > 1 && (
                <div className="bg-white dark:bg-[#0a0f29] p-10 rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-sm h-[450px] overflow-hidden relative group/chart transition-all duration-700">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover/chart:scale-125 transition-transform duration-1000" />
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(0,0,0,0.03)" className="dark:stroke-gray-800/30" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 900, fontFamily: 'inherit' }} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 900, fontFamily: 'inherit' }} dx={-10} domain={[0, 100]} />
                      <Tooltip 
                        cursor={{ stroke: '#2563eb', strokeWidth: 2, strokeDasharray: '5 5' }}
                        contentStyle={{ backgroundColor: '#050816', borderRadius: '24px', border: '2px solid rgba(255,255,255,0.08)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', fontWeight: 900, textTransform: 'uppercase', fontSize: '11px', color: '#fff', padding: '15px 20px' }} 
                        itemStyle={{ color: '#2563eb' }}
                        labelStyle={{ color: '#6b7280', marginBottom: '8px' }}
                      />
                      <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={6} activeDot={{ r: 10, fill: '#2563eb', stroke: '#fff', strokeWidth: 4 }} className="drop-shadow-[0_10px_10px_rgba(37,99,235,0.3)]" dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }} />
                      {chartData.length >= 3 && (
                        <Line type="monotone" dataKey="predicted" stroke="#a855f7" strokeWidth={6} strokeDasharray="12 12" activeDot={{ r: 10, fill: '#a855f7', stroke: '#fff', strokeWidth: 4 }} dot={false} className="opacity-50" />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="grid grid-cols-1 gap-8">
                {attempts.length === 0 ? (
                  <div className="py-48 text-center bg-gray-50/50 dark:bg-[#0a0f29] rounded-[5rem] border-4 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center gap-10 transition-all duration-1000">
                    <div className="w-28 h-28 bg-white dark:bg-gray-800 rounded-[3.5rem] flex items-center justify-center text-gray-100 dark:text-gray-900 shadow-2xl border-2 border-gray-50 dark:border-gray-700"><History size={56} /></div>
                    <div className="space-y-4">
                       <p className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Neural registry empty</p>
                       <p className="text-[12px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.4em] italic leading-none">No Evaluation Records Found In Grid Buffer</p>
                    </div>
                  </div>
                ) : (
                  attempts
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((attempt) => (
                      <div 
                        key={attempt._id} 
                        onClick={() => router.push(`/result?attemptId=${attempt._id}`)}
                        className="bg-white dark:bg-[#0a0f29] p-10 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:border-blue-600 dark:hover:border-blue-500 transition-all duration-700 group cursor-pointer flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden"
                      >
                         <div className="absolute top-0 left-0 w-2 h-full bg-blue-600/30 group-hover:bg-blue-600 transition-all" />
                         <div className="flex items-center gap-10 flex-1 relative z-10">
                            <div className="w-18 h-18 bg-gray-50 dark:bg-[#050816] text-gray-300 dark:text-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-[1.5rem] flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12 transition-all duration-700 shadow-inner group-hover:border-blue-500">
                               <FileText size={32} />
                            </div>
                            <div className="space-y-3">
                               <h4 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors uppercase italic tracking-tighter leading-none">{attempt.testId?.title}</h4>
                               <div className="flex items-center gap-6">
                                  <div className="flex items-center gap-3 text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-widest italic leading-none"><Calendar size={14} className="text-blue-600 dark:text-blue-500" /> {new Date(attempt.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</div>
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800" />
                                  <div className="flex items-center gap-3 text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-widest italic leading-none"><Clock size={14} className="text-blue-600 dark:text-blue-500" /> {Math.floor(attempt.timeTaken / 60)}:{(attempt.timeTaken % 60).toString().padStart(2, '0')} Sync Time</div>
                               </div>
                            </div>
                         </div>

                         <div className="flex items-center gap-12 relative z-10 w-full md:w-auto">
                            <div className="flex-1 md:text-right space-y-4">
                               <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-300 dark:text-gray-800 italic leading-none">Neural Proficiency Grade</p>
                               <div className="flex items-center justify-end gap-5">
                                  <div className="w-40 h-3 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner hidden lg:block">
                                     <div className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all duration-1000" style={{ width: `${attempt.percentage}%` }} />
                                  </div>
                                  <span className="text-3xl font-black text-gray-900 dark:text-white italic tabular-nums leading-none">{Math.round(parseFloat(attempt.percentage))}%</span>
                               </div>
                            </div>
                            <div className="w-14 h-14 bg-gray-50 dark:bg-[#050816] text-gray-100 dark:text-gray-800 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 rounded-2xl flex items-center justify-center transition-all duration-700 border-2 border-transparent shadow-sm">
                               <CheckCircle2 size={24} />
                            </div>
                         </div>
                      </div>
                )))}
              </div>
           </section>

           <div className="flex items-center justify-center gap-10 text-gray-100 dark:text-gray-900 italic font-black uppercase tracking-[1em] text-[12px] pt-12">
              <div className="w-32 h-px bg-gray-50 dark:bg-gray-900" />
              End Of Registry Matrix
              <div className="w-32 h-px bg-gray-50 dark:bg-gray-900" />
           </div>
        </div>
    </div>
  );
}
