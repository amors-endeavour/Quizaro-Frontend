"use client";

import { useEffect, useState } from "react";
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

  if (loading) return <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center font-black animate-pulse text-blue-600 uppercase tracking-widest leading-none">Accessing Intelligence Grid...</div>;

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader 
        title="Institutional Intelligence" 
        path={[{ label: "Intelligence" }, { label: "Performance Reports" }]} 
      />

      <div className="p-8 lg:p-14 max-w-[1700px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
        
        {/* LIVE METRICS (IMAGE #1 ANALYTICS STYLE) */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
           {[
             { label: "Active Cohort", val: "1,294", icon: <Users size={24} />, color: "blue" },
             { label: "Completion Velocity", val: "84.2%", icon: <TrendingUp size={24} />, color: "green" },
             { label: "Incident Rate", val: "0.4%", icon: <AlertCircle size={24} />, color: "red" },
             { label: "Avg Efficiency", val: "42m", icon: <Clock size={24} />, color: "orange" }
           ].map((m) => (
             <div key={m.label} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between group hover:border-blue-200 transition-all duration-500">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform ${
                  m.color === "blue" ? "bg-blue-50 text-blue-600 mb-6 shadow-blue-50" : 
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
           
           {/* LARGE AREA CHART (DAILY ENROLLMENT) */}
           <section className="lg:col-span-2 bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-100/30 p-12 space-y-10 group">
              <div className="flex items-center justify-between">
                 <div>
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">System Participation Flow</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Real-time enrollment tracking for last 7 days</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
                       <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                       <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Live Flow</span>
                    </div>
                 </div>
              </div>

              {/* CUSTOM SVG AREA CHART */}
              <div className="h-80 w-full relative pt-10">
                 <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                       <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                       </linearGradient>
                       <filter id="shadow">
                           <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#2563eb" floodOpacity="0.2"/>
                       </filter>
                    </defs>
                    
                    {/* Grid Lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                       <line key={i} x1="0" y1={i * 25 + "%"} x2="100%" y2={i * 25 + "%"} stroke="#f8fafc" strokeWidth="2" />
                    ))}

                    {/* Area Path */}
                    <path 
                      d="M 0 250 Q 150 180 300 120 Q 450 150 600 80 Q 750 100 900 40 L 1000 40 L 1000 320 L 0 320 Z" 
                      fill="url(#areaGrad)"
                      className="transition-all duration-1000"
                    />
                    
                    {/* Line Path */}
                    <path 
                      d="M 0 250 Q 150 180 300 120 Q 450 150 600 80 Q 750 100 900 40 L 1000 40" 
                      fill="none" 
                      stroke="#2563eb" 
                      strokeWidth="6" 
                      strokeLinecap="round"
                      filter="url(#shadow)"
                      className="animate-in fade-in duration-1000"
                    />

                    {/* Interaction Points */}
                    {[0, 300, 600, 900].map((x, i) => (
                       <circle key={x} cx={x} cy={[250, 120, 80, 40][i]} r="6" fill="white" stroke="#2563eb" strokeWidth="4" className="hover:r-8 transition-all cursor-crosshair" />
                    ))}
                 </svg>
                 
                 {/* X-Axis Labels */}
                 <div className="flex justify-between mt-8 px-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                       <span key={day} className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{day}</span>
                    ))}
                 </div>
              </div>
           </section>

           {/* DISTRIBUTION CIRCLE (ACCURACY BY DOMAIN) */}
           <section className="bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-100/30 p-10 flex flex-col items-center justify-between text-center group">
              <div className="w-full">
                 <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <PieChart size={24} />
                 </div>
                 <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Accuracy Spectrum</h3>
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2">Topic-wise score distribution</p>
              </div>

              {/* CUSTOM DONUT CHART */}
              <div className="relative w-56 h-56 my-8">
                 <svg className="w-full h-full -rotate-90">
                    <circle cx="112" cy="112" r="80" fill="none" stroke="#f8fafc" strokeWidth="24" />
                    <circle 
                      cx="112" cy="112" r="80" 
                      fill="none" stroke="#2563eb" 
                      strokeWidth="24" 
                      strokeDasharray="502" 
                      strokeDashoffset="120" 
                      strokeLinecap="round" 
                      className="transition-all duration-1000"
                    />
                    <circle 
                      cx="112" cy="112" r="80" 
                      fill="none" stroke="#06b6d4" 
                      strokeWidth="24" 
                      strokeDasharray="502" 
                      strokeDashoffset="420" 
                      strokeLinecap="round" 
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-gray-900 leading-none tracking-tighter">91%</span>
                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest mt-1">Mastery</span>
                 </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-4">
                 <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100">
                    <p className="text-xs font-black text-gray-900 leading-none">High</p>
                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">Quantitative</p>
                 </div>
                 <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100">
                    <p className="text-xs font-black text-gray-400 leading-none italic font-normal">Moderate</p>
                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">Logical Reasoning</p>
                 </div>
              </div>
           </section>
        </div>

        {/* RECENT ACTIVITY TABLE (IMAGE #1 LIST STYLE) */}
        <section className="bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-100/30 overflow-hidden">
            <div className="px-12 py-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/10">
               <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
                  <BarChart3 size={18} className="text-blue-500" />
                  Real-time Participation Stream
               </h3>
               <div className="w-3 h-3 rounded-full bg-green-500 animate-ping" />
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-gray-50/30 px-12 border-b border-gray-50">
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Timestamp</th>
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Student Identity</th>
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Activity Context</th>
                        <th className="px-12 py-6 text-right pr-16 text-[10px] font-black uppercase tracking-widest text-gray-400">Result Score</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/50">
                     {[1, 2, 3, 4, 5].map((row) => (
                       <tr key={row} className="group hover:bg-gray-50/50 transition-all cursor-pointer">
                          <td className="px-12 py-7 text-[10px] font-black text-gray-400 font-mono">2026-04-10 05:{40-row}</td>
                          <td className="px-12 py-7">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-black text-xs text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">ST</div>
                                <span className="text-xs font-black text-gray-900 uppercase">Student_{row}84C</span>
                             </div>
                          </td>
                          <td className="px-12 py-7">
                             <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Clock size={12} /></div>
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">Paper Session Finished</span>
                             </div>
                          </td>
                          <td className="px-12 py-7 text-right pr-16">
                             <span className="text-sm font-black text-gray-900 tracking-tighter">84<span className="text-gray-300 ml-1">/ 100</span></span>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
        </section>

      </div>
    </div>
  );
}

const History = ({ size }: { size: number }) => (
  <Clock size={size} />
);
