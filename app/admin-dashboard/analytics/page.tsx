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

// MOCK DATA GENERATION FOR LAST 30 DAYS
const generateMockData = () => {
  const data = [];
  const startDay = 1;
  const days = ["May 1", "May 8", "May 15", "May 22", "May 29"];
  
  for (let i = 1; i <= 31; i++) {
    data.push({
      name: i % 7 === 1 ? `May ${i}` : "",
      date: `May ${i}`,
      users: 500 + (i * 25) + Math.floor(Math.random() * 100),
      completions: 40 + Math.floor(Math.random() * 140),
    });
  }
  return data;
};

const categoryData = [
  { name: "Personality", value: 42, color: "#7C3AED" },
  { name: "Career", value: 25, color: "#60A5FA" },
  { name: "Relationship", value: 18, color: "#C084FC" },
  { name: "Health", value: 15, color: "#F472B6" },
];

const userBreakdownData = [
  { name: "Free Users", value: 68, color: "#7C3AED" },
  { name: "Paid Users", value: 32, color: "#60A5FA" },
];

export default function AnalyticsPage() {
  const chartData = useMemo(() => generateMockData(), []);

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
          {[
            { label: "Total Users", value: "1,248", trend: "12.5%", isUp: true },
            { label: "Total Quizzes", value: "342", trend: "8.7%", isUp: true },
            { label: "Total Revenue", value: "$8,945", trend: "15.3%", isUp: true },
            { label: "Conversion Rate", value: "4.68%", trend: "2.1%", isUp: true },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none italic">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 leading-none">{stat.value}</h3>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 text-[11px] font-black ${stat.isUp ? "text-green-500" : "text-red-500"}`}>
                   {stat.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                   {stat.isUp ? "↑" : "↓"} {stat.trend}
                </div>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">from last month</span>
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
                            {categoryData.map((entry, index) => (
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
                    {categoryData.map((item) => (
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
           </div>

           {/* USER BREAKDOWN */}
           <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 space-y-10">
              <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic">User Breakdown</h4>
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
                            {userBreakdownData.map((entry, index) => (
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
                    {userBreakdownData.map((item) => (
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
           </div>

        </div>

      </main>
    </div>
  );
}
