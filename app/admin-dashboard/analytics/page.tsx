"use client";

import { useState, useMemo } from "react";
import AdminHeader from "@/components/AdminHeader";
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  ChevronDown
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";

import useSWR from "swr";
import API from "@/app/lib/api";

const fetcher = (url: string) => API.get(url).then(res => res.data);

export default function AnalyticsPage() {
  // REAL-TIME DATABASE SYNCHRONIZATION
  const { data: stats } = useSWR('/admin/dashboard/stats', fetcher, { refreshInterval: 5000 });
  const { data: chartData = [] } = useSWR('/admin/analytics/growth', fetcher, { 
    refreshInterval: 5000,
    fallbackData: [] // Zero-baseline policy
  });
  const { data: distribution } = useSWR('/admin/analytics/distribution', fetcher, { refreshInterval: 5000 });

  const summaryStats = useMemo(() => [
    { label: "Total Users", value: stats?.totalUsers?.toLocaleString() || "0", color: "purple" },
    { label: "Total Quizzes", value: stats?.totalQuizzes?.toLocaleString() || "0", color: "blue" },
    { label: "Total Revenue", value: `₹${stats?.totalRevenue?.toLocaleString() || "0"}`, color: "green" },
    { label: "Active Participants", value: stats?.activeParticipants?.toLocaleString() || "0", color: "orange" },
  ], [stats]);

  const categoryData = useMemo(() => distribution?.categories || [], [distribution]);
  const userBreakdownData = useMemo(() => distribution?.userBreakdown || [], [distribution]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <AdminHeader title="Analytics" path={[{ label: "Home" }, { label: "Analytics" }]} />

      <main className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* HEADER SECTION */}
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Analytics</h2>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] italic">Overview of your platform performance</p>
        </div>

        {/* TOP ROW: SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6 group hover:border-purple-200 transition-all">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none italic">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 leading-none italic">{stat.value}</h3>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Live Syncing</span>
              </div>
            </div>
          ))}
        </div>

        {/* MIDDLE SECTION: TIME-SERIES CHARTS */}
        <div className="space-y-10">
          {/* USER GROWTH AREA CHART */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 space-y-10">
             <div className="flex items-center justify-between">
                <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic">User Growth</h4>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest">
                   Last 30 Days <ChevronDown size={14} />
                </div>
             </div>
             <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} 
                        tickFormatter={(v) => v.toLocaleString()}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '1.2rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 800, color: '#7C3AED' }}
                      />
                      <Area type="monotone" dataKey="users" stroke="#7C3AED" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* QUIZ COMPLETIONS BAR CHART */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 space-y-10">
             <div className="flex items-center justify-between">
                <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic">Quiz Completions</h4>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest">
                   Monthly Volume <ChevronDown size={14} />
                </div>
             </div>
             <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} 
                      />
                      <Tooltip 
                        cursor={{fill: '#F8FAFC'}}
                        contentStyle={{ borderRadius: '1.2rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 800, color: '#7C3AED' }}
                      />
                      <Bar dataKey="completions" fill="#7C3AED" radius={[6, 6, 0, 0]} barSize={24} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* BOTTOM ROW: DISTRIBUTION INSIGHTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           
           {/* TOP QUIZ CATEGORIES */}
           <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 space-y-10">
              <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic">Top Quiz Categories</h4>
              {categoryData.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
                   <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 mx-auto shadow-inner">
                      <PieChartIcon size={32} />
                   </div>
                   <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">No category data identified</p>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                   <div className="relative w-48 h-48">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={8}
                              dataKey="value"
                            >
                              {categoryData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                         </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                         <PieChartIcon className="text-gray-200" size={32} />
                      </div>
                   </div>
                   <div className="flex-1 space-y-5 w-full">
                      {categoryData.map((item: any) => (
                         <div key={item.name} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                               <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest italic">{item.name}</span>
                            </div>
                            <span className="text-[11px] font-black text-gray-900 italic">{item.value}%</span>
                         </div>
                      ))}
                   </div>
                </div>
              )}
           </div>

           {/* USER BREAKDOWN */}
           <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 space-y-10">
              <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic">User Breakdown</h4>
              {userBreakdownData.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
                   <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 mx-auto shadow-inner">
                      <Users size={32} />
                   </div>
                   <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">No user data identified</p>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                   <div className="relative w-48 h-48">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie
                              data={userBreakdownData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={8}
                              dataKey="value"
                            >
                              {userBreakdownData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                         </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                         <Users className="text-gray-200" size={32} />
                      </div>
                   </div>
                   <div className="flex-1 space-y-5 w-full">
                      {userBreakdownData.map((item: any) => (
                         <div key={item.name} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                               <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest italic">{item.name}</span>
                            </div>
                            <span className="text-[11px] font-black text-gray-900 italic">{item.value}%</span>
                         </div>
                      ))}
                   </div>
                </div>
              )}
           </div>

        </div>

      </main>
    </div>
  );
}
