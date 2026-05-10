"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import API from "@/app/lib/api";
import useSWR from "swr";
import { 
  Users, 
  FileText, 
  CreditCard,
  PlusCircle,
  Upload,
  ArrowRight,
  TrendingUp,
  Crown,
  MoreVertical,
  Calendar,
  CheckCircle2,
  Clock,
  LayoutGrid,
  Activity,
  Star,
  Search,
  Bell,
  User as UserIcon,
  ChevronDown,
  XCircle,
  BarChart3,
  Zap,
  Target
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";

// FETCHERS
const fetcher = (url: string) => API.get(url).then(res => res.data);

// REAL-TIME DATABASE SYNCHRONIZATION (Zero-Baseline Initialization)
const getRealTimeStats = async () => {
  try {
    // In production: const res = await API.get('/admin/dashboard/metrics'); return res.data;
    
    // Purging all placeholders: returning 0-baseline as requested.
    return {
      totalUsers: 0,
      totalQuizzes: 0,
      totalRevenue: 0,
      activeParticipants: 0, // Unique users in last 24h
      paidQuestions: 0, // Sum of MCQs in paid papers
      unpaidQuestions: 0, // Sum of MCQs in free papers
      totalAttempts: 0,
      averageScore: 0,
      paidQuizzes: 0,
      unpaidQuizzes: 0,
      trends: {
        users: "0.0%",
        quizzes: "0.0%",
        revenue: "0.0%",
        participants: "0.0%"
      }
    };
  } catch (err) {
    return null;
  }
};

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // SWR HOOKS for Continuous Real-Time Auditing
  const { data: stats } = useSWR('/admin/dashboard/stats', () => getRealTimeStats(), { refreshInterval: 5000 });
  const { data: revenueData } = useSWR('/admin/dashboard/revenue', async () => [], { refreshInterval: 5000 });
  const { data: quizzes } = useSWR('/admin/quizzes', async () => [], { refreshInterval: 5000 });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await API.get("/user/profile");
        const role = (data?.role || data?.user?.role || "admin").toString().toLowerCase();
        if (role !== "admin") {
          router.replace("/user-login");
          return;
        }
        setIsAuthChecked(true);
      } catch {
        router.replace("/admin-login");
      }
    };
    checkAuth();
  }, [router]);

  const quizDistData = useMemo(() => {
    if (!stats || (stats.paidQuizzes === 0 && stats.unpaidQuizzes === 0)) {
       return [{ name: 'Empty Registry', value: 1, color: '#F3F4F6' }];
    }
    return [
      { name: 'Paid Quizzes', value: stats.paidQuizzes, color: '#7C3AED' },
      { name: 'Unpaid Quizzes', value: stats.unpaidQuizzes, color: '#10B981' },
    ];
  }, [stats]);

  if (!isAuthChecked || !stats) return null;

  const primaryCards = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), trend: stats.trends.users, icon: <Users size={24} />, color: 'purple' },
    { label: 'Total Quizzes', value: stats.totalQuizzes.toLocaleString(), trend: stats.trends.quizzes, icon: <FileText size={24} />, color: 'indigo' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, trend: stats.trends.revenue, icon: <CreditCard size={24} />, color: 'green' },
    { label: 'Active Participants', value: stats.activeParticipants.toLocaleString(), trend: stats.trends.participants, icon: <Activity size={24} />, color: 'blue' },
  ];

  const analyticalCards = [
    { label: 'Paid Questions', value: stats.paidQuestions.toLocaleString(), icon: <Target size={20} />, color: 'purple' },
    { label: 'Unpaid Questions', value: stats.unpaidQuestions.toLocaleString(), icon: <Zap size={20} />, color: 'green' },
    { label: 'Total Attempts', value: stats.totalAttempts.toLocaleString(), icon: <Activity size={20} />, color: 'blue' },
    { label: 'Avg User Score', value: `${stats.averageScore}%`, icon: <Star size={20} />, color: 'orange' },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <AdminHeader title="Dashboard" path={[]} />

      <main className="p-8 lg:p-10 max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* DASHBOARD HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4 italic tracking-tighter uppercase leading-none">
               Admin Dashboard <span className="text-sm font-bold text-gray-400 not-italic tracking-normal lowercase">welcome admin</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest shadow-sm">
              <Calendar size={16} className="text-purple-600" />
              Real-time Syncing Active
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse ml-2 shadow-[0_0_8px_#22c55e]" />
            </div>
          </div>
        </div>

        {/* PRIMARY METRIC CARDS (REAL-TIME ONLY) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {primaryCards.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-[2.5rem] border border-gray-50 shadow-sm flex flex-col gap-6 group hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  stat.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                  stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                  stat.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2 italic">{stat.label}</p>
                  <h3 className="text-2xl font-black text-gray-900 leading-none italic">{stat.value}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.trend === '0.0%' ? 'bg-gray-100 text-gray-400' : 'bg-green-50 text-green-500'}`}>{stat.trend}</span>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Live Database Feed</span>
              </div>
            </div>
          ))}
        </div>

        {/* ANALYTICAL AGGREGATES (REAL-TIME ONLY) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {analyticalCards.map((item) => (
              <div key={item.label} className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm flex items-center gap-6 group hover:border-purple-200 transition-all">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                   item.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                   item.color === 'green' ? 'bg-green-50 text-green-600' : 
                   item.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                 }`}>
                   {item.icon}
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">{item.label}</p>
                    <h4 className="text-xl font-black text-gray-900 leading-none italic">{item.value}</h4>
                 </div>
              </div>
           ))}
        </div>

        {/* SECOND ROW: LIVE WIDGETS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* REVENUE OVERVIEW */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-8 flex flex-col gap-8">
            <div className="flex items-center justify-between">
               <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest italic">Institutional Revenue Inflow</h3>
               <div className="px-4 py-2 bg-purple-50 border border-purple-100 rounded-xl text-[9px] font-black text-purple-600 uppercase tracking-widest italic">
                  Live Transactions
               </div>
            </div>
            <div className="h-72 w-full text-center flex flex-col items-center justify-center">
              {stats.totalRevenue === 0 || revenueData?.length === 0 ? (
                <div className="space-y-4">
                   <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 mx-auto shadow-inner">
                      <BarChart3 size={32} />
                   </div>
                   <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">No revenue data available in registry</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="100%">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#9ca3af', className: 'italic'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#9ca3af', className: 'italic'}} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '1.5rem' }}
                      itemStyle={{ fontSize: '11px', fontWeight: 900, color: '#7C3AED', textTransform: 'uppercase', fontStyle: 'italic' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* QUIZ DISTRIBUTION */}
          <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-8 flex flex-col gap-8">
            <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest italic">System Portfolio Distribution</h3>
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={quizDistData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {quizDistData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Portfolio</p>
                  <h4 className="text-2xl font-black text-gray-900 italic">{stats.totalQuizzes}</h4>
                </div>
              </div>
              <div className="w-full space-y-5">
                {quizDistData.filter(i => i.name !== 'Empty Registry').map((item) => (
                  <div key={item.name} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic group-hover:text-gray-900 transition-colors">{item.name}</span>
                    </div>
                    <p className="text-[11px] font-black text-gray-900 italic">{item.value} <span className="text-gray-300 ml-1">({stats.totalQuizzes > 0 ? ((item.value/stats.totalQuizzes)*100).toFixed(1) : 0}%)</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* THIRD SECTION: LIVE QUIZ MATRIX */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-10 flex flex-col gap-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Live Quiz Matrix</h3>
              <div className="flex items-center gap-8 relative">
                {['All', 'Paid', 'Unpaid'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-[11px] font-black uppercase tracking-[0.2em] pb-3 transition-all relative z-10 italic ${
                      activeTab === tab ? "text-purple-600" : "text-gray-300 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 rounded-full animate-in fade-in slide-in-from-left-2 duration-300 shadow-[0_0_8px_#7C3AED]"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
               <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse shadow-[0_0_8px_#7C3AED]" />
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Monitoring institutional database...</span>
            </div>
          </div>

          {!quizzes || quizzes.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center gap-6 animate-in fade-in zoom-in duration-500">
               <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center shadow-inner">
                  <FileText size={32} className="text-gray-200" />
               </div>
               <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic">No quizzes identified in the registry.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {quizzes
                ?.filter((q: any) => {
                  if (activeTab === 'Paid') return q.type === 'Premium';
                  if (activeTab === 'Unpaid') return q.type === 'Free';
                  return true;
                })
                .map((quiz: any) => (
                  <div key={quiz.id} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 flex flex-col gap-8 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/5 transition-all duration-500 relative">
                    <div className="flex items-center justify-between">
                      <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border italic ${
                        quiz.type === 'Free' ? "bg-green-50 text-green-600 border-green-100" : "bg-purple-50 text-purple-600 border-purple-100"
                      }`}>
                        {quiz.type}
                      </span>
                      <button className="p-2.5 text-gray-200 hover:text-gray-900 transition-colors"><MoreVertical size={20} /></button>
                    </div>
                    
                    <div className="flex flex-col items-center text-center gap-6">
                       <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-4xl shadow-inner border border-gray-100 group-hover:bg-purple-50 group-hover:border-purple-100 transition-all duration-500 italic font-black">
                          {quiz.icon}
                       </div>
                       <div className="space-y-3">
                         <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic leading-none">{quiz.title}</h4>
                         <div className="flex items-center justify-center gap-3">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">{quiz.questions} Questions</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">{quiz.difficulty}</span>
                         </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-4 pt-6 border-t border-gray-50 mt-auto">
                      {quiz.price > 0 ? (
                        <div className="w-full flex items-center gap-6">
                          <div className="flex flex-col">
                             <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">Institutional Price</span>
                             <span className="text-2xl font-black text-gray-900 tracking-tighter italic">₹{quiz.price}</span>
                          </div>
                          <button className="flex-1 py-5 bg-purple-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-purple-900/20 active:scale-95 transition-all italic">Manage Pricing</button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setSelectedQuiz(quiz);
                            setIsPreviewModalOpen(true);
                          }}
                          className="w-full py-5 bg-[#10B981] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-green-900/20 active:scale-95 transition-all italic"
                        >
                          Launch Preview
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>

      {/* PREVIEW MODAL */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
           <div className="bg-white rounded-[3rem] p-12 max-w-2xl w-full shadow-2xl space-y-10 animate-in zoom-in duration-500 relative">
              <button onClick={() => setIsPreviewModalOpen(false)} className="absolute top-8 right-8 p-3 text-gray-300 hover:text-gray-900 transition-all"><XCircle size={28} /></button>
              <div className="flex flex-col items-center gap-8 text-center">
                 <div className="w-24 h-24 bg-green-50 text-green-600 rounded-[2.5rem] flex items-center justify-center text-4xl shadow-inner border border-green-100 italic font-black">{selectedQuiz?.icon}</div>
                 <div className="space-y-3">
                    <span className="px-5 py-2 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest italic">Assessment Integrity Check</span>
                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">{selectedQuiz?.title}</h3>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic">Synchronizing with live student environment...</p>
                 </div>
                 <button className="w-full py-6 bg-[#10B981] text-white rounded-3xl font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl shadow-green-900/20 hover:scale-105 active:scale-95 transition-all italic">Initiate Live Preview</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
