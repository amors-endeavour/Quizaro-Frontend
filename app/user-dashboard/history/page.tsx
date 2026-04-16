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
  FileText
} from "lucide-react";
import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

  if (loading) return <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center font-black animate-pulse text-blue-600 uppercase tracking-widest leading-none">Aggregating Metrics...</div>;

  let chartData = [...attempts].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((a, i) => ({
    date: new Date(a.createdAt).toLocaleDateString(),
    score: Math.round(parseFloat(a.percentage)),
    index: i + 1
  }));

  // Phase 6.3 - Predictive Score Analytics (Linear Regression MVP)
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
    
    // Fill previous slots with null string so the dotted line originates from the last real point correctly
    // or just pass 'predicted' alongside 'score' for the last node so the line connects natively.
    (chartData[n-1] as any).predicted = chartData[n-1].score; // tie it
    chartData.push({
      date: "Next",
      predicted: predictedScore,
      index: nextIndex
    } as any);
  }

  const handleExportCSV = () => {
    const csvData = attempts.map(a => ({
      TestName: a.testId?.title || 'Unknown',
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
    link.setAttribute('download', 'Quizaro_Performance_History.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="flex h-screen bg-[#f8f9fc] text-gray-900 font-sans overflow-hidden">
      <UserSidebar userName={user?.name || "Student"} />

      <main className="flex-1 overflow-y-auto">
        <UserHeader 
          title="Performance IQ" 
          breadcrumbs={["Student", "Analytics Dashboard"]} 
        />

        <div className="p-8 lg:p-12 max-w-[1400px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
           
           {/* PERFORMANCE OVERVIEW HUD */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/30 flex items-center gap-6">
                 <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-50">
                    <TrendingUp size={28} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Attempts</p>
                    <h3 className="text-3xl font-black text-gray-900">{attempts.length}</h3>
                 </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/30 flex items-center gap-6">
                 <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-50">
                    <Award size={28} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Average Proficiency</p>
                    <h3 className="text-3xl font-black text-gray-900">
                      {attempts.length > 0 ? Math.round(attempts.reduce((acc, curr) => acc + parseFloat(curr.percentage), 0) / attempts.length) : 0}%
                    </h3>
                 </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/30 flex items-center gap-6">
                 <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-50">
                    <Clock size={28} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Active Learning</p>
                    <h3 className="text-3xl font-black text-gray-900">
                       {Math.round(attempts.reduce((acc, curr) => acc + (curr.timeTaken || 0), 0) / 60)} Min
                    </h3>
                 </div>
              </div>
           </div>

           {/* ATTEMPT REGISTRY */}
           <section className="space-y-6">
              <div className="flex items-center justify-between px-4">
                 <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-3">
                    <Calendar size={18} />
                    Assessment History
                 </h3>
                 <button 
                   onClick={handleExportCSV}
                   className="px-6 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition shadow-xl flex items-center gap-2"
                 >
                   Export CSV
                 </button>
              </div>

              {chartData.length > 1 && (
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/30 h-80 mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 900 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 900 }} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }} 
                      />
                      <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={4} activeDot={{ r: 8, fill: '#2563eb', stroke: '#fff', strokeWidth: 4 }} />
                      {chartData.length >= 3 && (
                        <Line type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={4} strokeDasharray="5 5" activeDot={{ r: 8, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 4 }} />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="space-y-4">
                {attempts.length === 0 ? (
                  <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">No evaluation records detected yet.</p>
                  </div>
                ) : (
                  attempts.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(attempt => (
                    <div 
                      key={attempt._id} 
                      onClick={() => router.push(`/result?attemptId=${attempt._id}`)}
                      className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all duration-300 group cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6"
                    >
                       <div className="flex items-center gap-6 flex-1">
                          <div className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                             <FileText size={24} />
                          </div>
                          <div>
                             <h4 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{attempt.testId?.title}</h4>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-4">
                                <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(attempt.createdAt).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1.5"><Clock size={12} /> {Math.round(attempt.timeTaken / 60)}:{(attempt.timeTaken % 60).toString().padStart(2, '0')}</span>
                             </p>
                          </div>
                       </div>

                       <div className="flex items-center gap-8">
                          <div className="text-right">
                             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Proficiency</p>
                             <div className="flex items-center gap-3">
                                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                   <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${attempt.percentage}%` }} />
                                </div>
                                <span className="text-sm font-black text-gray-900">{Math.round(parseFloat(attempt.percentage))}%</span>
                             </div>
                          </div>
                          <div className="w-12 h-12 bg-gray-50 text-gray-400 group-hover:bg-blue-600 group-hover:text-white rounded-2xl flex items-center justify-center transition-all">
                             <CheckCircle2 size={20} />
                          </div>
                       </div>
                    </div>
                  ))
                )}
              </div>
           </section>
        </div>
      </main>
    </div>
  );
}
