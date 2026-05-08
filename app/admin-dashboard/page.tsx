"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import API from "@/app/lib/api";
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
  ChevronDown
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

// MOCK DATA FROM IMAGE 1
const revenueData = [
  { name: 'May 12', value: 12000 },
  { name: 'May 19', value: 38000 },
  { name: 'May 26', value: 28000 },
  { name: 'Jun 02', value: 62000 },
  { name: 'Jun 09', value: 42000 },
  { name: 'Jun 16', value: 78000 },
];

const quizDistData = [
  { name: 'Paid Quizzes', value: 96, color: '#6366f1' },
  { name: 'Unpaid Quizzes', value: 160, color: '#22c55e' },
];

const recentAttempts = [
  { id: 1, name: 'Rohit Kumar', quiz: 'Science Quiz', progress: 80, time: '2 min ago', avatar: 'RK' },
  { id: 2, name: 'Priya Sharma', quiz: 'History Quiz', progress: 60, time: '10 min ago', avatar: 'PS' },
  { id: 3, name: 'Amit Verma', quiz: 'JavaScript Quiz', progress: 90, time: '20 min ago', avatar: 'AV' },
  { id: 4, name: 'Neha Singh', quiz: 'Math Quiz', progress: 70, time: '30 min ago', avatar: 'NS' },
  { id: 5, name: 'Karan Mehta', quiz: 'HTML Quiz', progress: 85, time: '40 min ago', avatar: 'KM' },
];

const allQuizzes = [
  { id: 1, title: 'Science Fundamentals', type: 'Free', questions: 25, difficulty: 'Easy', price: 0, icon: '🔬' },
  { id: 2, title: 'JavaScript Advanced', type: 'Premium', questions: 40, difficulty: 'Hard', price: 149, icon: 'JS' },
  { id: 3, title: 'World History', type: 'Free', questions: 30, difficulty: 'Medium', price: 0, icon: '🏺' },
  { id: 4, title: 'React JS Basics', type: 'Premium', questions: 35, difficulty: 'Medium', price: 129, icon: '⚛️' },
  { id: 5, title: 'Basic Mathematics', type: 'Free', questions: 20, difficulty: 'Easy', price: 0, icon: '➗' },
  { id: 6, title: 'Business Management', type: 'Premium', questions: 45, difficulty: 'Hard', price: 199, icon: '💼' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await API.get("/user/profile");
        const role = (data?.role || data?.user?.role || "student").toString().toLowerCase();
        if (role !== "admin") {
          router.replace("/admin-login");
          return;
        }
        setIsAuthChecked(true);
      } catch {
        router.replace("/admin-login");
      }
    };
    checkAuth();
  }, [router]);

  if (!isAuthChecked) return null;

  return (
    <div className="min-h-screen bg-[#f8f9fd]">
      <AdminHeader title="Dashboard" path={[]} />

      <main className="p-8 lg:p-10 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
        
        {/* DASHBOARD HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-4">
              Dashboard <span className="text-sm font-bold text-gray-400">Welcome back, Admin!</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-500 shadow-sm">
              <Calendar size={16} />
              May 12 - Jun 12, 2024
            </div>
          </div>
        </div>

        {/* TOP ROW: SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Users', value: '12,458', trend: '+ 12.5%', icon: <Users size={24} />, color: 'blue' },
            { label: 'Total Quizzes', value: '256', trend: '+ 8.4%', icon: <FileText size={24} />, color: 'indigo' },
            { label: 'Total Revenue', value: '₹2,45,890', trend: '+ 18.6%', icon: <CreditCard size={24} />, color: 'green' },
            { label: 'Active Subscriptions', value: '1,245', trend: '+ 10.3%', icon: <Crown size={24} />, color: 'orange' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm flex flex-col gap-6 group hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                  stat.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                  <h3 className="text-2xl font-black text-gray-900 leading-none">{stat.value}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg">{stat.trend}</span>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">vs last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* SECOND ROW: WIDGETS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* REVENUE OVERVIEW */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-8 flex flex-col gap-8">
            <div className="flex items-center justify-between">
               <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Revenue Overview</h3>
               <button className="flex items-center gap-3 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold text-gray-500">
                  This Month <ChevronDown size={14} />
               </button>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="100%">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#9ca3af'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#9ca3af'}} tickFormatter={(v) => `₹${v/1000}K`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 800, color: '#6366f1' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* QUIZ DISTRIBUTION */}
          <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-8 flex flex-col gap-8">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Quiz Distribution</h3>
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={quizDistData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {quizDistData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
                  <h4 className="text-xl font-black text-gray-900">256</h4>
                </div>
              </div>
              <div className="w-full space-y-4">
                {quizDistData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{item.name}</span>
                    </div>
                    <p className="text-[11px] font-black text-gray-900">{item.value} <span className="text-gray-400 ml-1">({((item.value/256)*100).toFixed(1)}%)</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RECENT ATTEMPTS */}
          <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-8 flex flex-col gap-8">
            <div className="flex items-center justify-between">
               <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Recent Attempts</h3>
               <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="space-y-8 flex-1">
              {recentAttempts.map((attempt) => (
                <div key={attempt.id} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center font-bold text-sm text-gray-500">
                    {attempt.avatar}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-black text-gray-900 uppercase italic leading-none">{attempt.name}</h4>
                      <span className="text-[11px] font-black text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">{attempt.progress}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{attempt.quiz}</p>
                      <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">{attempt.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* THIRD SECTION: ALL QUIZZES */}
        <div className="bg-white rounded-[3rem] border border-gray-50 shadow-sm p-10 flex flex-col gap-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">All Quizzes</h3>
              <div className="flex items-center gap-6">
                {['All', 'Paid', 'Unpaid'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-[11px] font-black uppercase tracking-[0.2em] pb-2 border-b-4 transition-all ${
                      activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-300 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <button className="px-8 py-4 bg-[#6366f1] text-white rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
              <PlusCircle size={18} /> + Create Quiz
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {allQuizzes.map((quiz) => (
              <div key={quiz.id} className="bg-gray-50/50 rounded-[2rem] border border-gray-100 p-8 flex flex-col gap-8 group hover:bg-white hover:border-blue-200 transition-all relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                    quiz.type === 'Free' ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                  }`}>
                    {quiz.type}
                  </span>
                  <button className="text-gray-300 hover:text-gray-900"><MoreVertical size={18} /></button>
                </div>
                
                <div className="flex flex-col items-center text-center gap-4">
                   <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-3xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                      {quiz.icon}
                   </div>
                   <div className="space-y-2">
                     <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight italic">{quiz.title}</h4>
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{quiz.questions} Questions • {quiz.difficulty}</p>
                   </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  {quiz.price > 0 ? (
                    <>
                      <span className="text-lg font-black text-gray-900">₹{quiz.price}</span>
                      <button className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Buy Now</button>
                    </>
                  ) : (
                    <button className="w-full py-3.5 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Start Quiz</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM SECTION: ADDITIONAL METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'Total Paid Quizzes', value: '96', icon: <CreditCard size={20} />, color: 'blue' },
             { label: 'Total Unpaid Quizzes', value: '160', icon: <FileText size={20} />, color: 'green' },
             { label: 'Total Quiz Attempts', value: '8,945', icon: <Activity size={20} />, color: 'blue' },
             { label: 'Average Score', value: '72.4%', icon: <Star size={20} />, color: 'orange' },
           ].map((item) => (
              <div key={item.label} className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm flex items-center gap-6">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                   item.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                   item.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                 }`}>
                   {item.icon}
                 </div>
                 <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                    <h4 className="text-xl font-black text-gray-900 leading-none">{item.value}</h4>
                 </div>
              </div>
           ))}
        </div>

      </main>
    </div>
  );
}
