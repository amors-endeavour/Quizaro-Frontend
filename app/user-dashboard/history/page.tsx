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
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-3 px-4">
                 <Calendar size={18} />
                 Assessment History
              </h3>

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
