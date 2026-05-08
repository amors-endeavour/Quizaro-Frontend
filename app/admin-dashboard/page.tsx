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
  CheckCircle2,
  Clock,
  LayoutGrid,
  Activity,
  Star,
  Search,
  Bell,
  User as UserIcon,
  ChevronDown,
  XCircle
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
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);

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
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">All Quizzes</h3>
              <div className="flex items-center gap-8 relative">
                {['All', 'Paid', 'Unpaid'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-[11px] font-black uppercase tracking-[0.2em] pb-3 transition-all relative z-10 ${
                      activeTab === tab ? "text-blue-600" : "text-gray-300 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full animate-in fade-in slide-in-from-left-2 duration-300"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <button 
              onClick={() => router.push("/admin-dashboard/quizzes/unpaid")}
              className="px-10 py-5 bg-[#6366f1] text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all"
            >
              <PlusCircle size={20} /> + Create Quiz
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {allQuizzes
              .filter(q => {
                if (activeTab === 'Paid') return q.type === 'Premium';
                if (activeTab === 'Unpaid') return q.type === 'Free';
                return true;
              })
              .map((quiz) => (
                <div key={quiz.id} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 flex flex-col gap-8 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 relative">
                  <div className="flex items-center justify-between">
                    <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      quiz.type === 'Free' ? "bg-green-50 text-green-600 border-green-100" : "bg-blue-50 text-blue-600 border-blue-100"
                    }`}>
                      {quiz.type}
                    </span>
                    <button className="p-2.5 text-gray-200 hover:text-gray-900 transition-colors"><MoreVertical size={20} /></button>
                  </div>
                  
                  <div className="flex flex-col items-center text-center gap-6">
                     <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all duration-500">
                        {quiz.icon}
                     </div>
                     <div className="space-y-3">
                       <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic leading-none">{quiz.title}</h4>
                       <div className="flex items-center justify-center gap-3">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{quiz.questions} Questions</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{quiz.difficulty}</span>
                       </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 pt-6 border-t border-gray-50 mt-auto">
                    {quiz.price > 0 ? (
                      <div className="w-full flex items-center gap-6">
                        <div className="flex flex-col">
                           <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Price</span>
                           <span className="text-2xl font-black text-gray-900 tracking-tighter">₹{quiz.price}</span>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedQuiz(quiz);
                            setIsPricingModalOpen(true);
                          }}
                          className="flex-1 py-5 bg-[#2563eb] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                        >
                          Buy Now
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          setSelectedQuiz(quiz);
                          setIsPreviewModalOpen(true);
                        }}
                        className="w-full py-5 bg-[#22c55e] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-green-900/20 active:scale-95 transition-all"
                      >
                        Start Quiz
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* MODALS */}
        {isPreviewModalOpen && (
          <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
             <div className="bg-white rounded-[3rem] p-12 max-w-2xl w-full shadow-2xl space-y-10 animate-in zoom-in duration-500 relative">
                <button onClick={() => setIsPreviewModalOpen(false)} className="absolute top-8 right-8 p-3 text-gray-300 hover:text-gray-900 transition-all"><XCircle size={28} /></button>
                <div className="flex flex-col items-center gap-8 text-center">
                   <div className="w-24 h-24 bg-green-50 text-green-600 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner border border-green-100">{selectedQuiz?.icon}</div>
                   <div className="space-y-3">
                      <span className="px-5 py-2 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Preview Mode (Admin)</span>
                      <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">{selectedQuiz?.title}</h3>
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic">Take this assessment as a student to verify the quality.</p>
                   </div>
                   <div className="grid grid-cols-3 gap-6 w-full py-8 border-y border-gray-100">
                      <div>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Time Limit</p>
                         <p className="text-lg font-black text-gray-900 uppercase tracking-tighter italic">30 Mins</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pass Mark</p>
                         <p className="text-lg font-black text-gray-900 uppercase tracking-tighter italic">75%</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Difficulty</p>
                         <p className="text-lg font-black text-gray-900 uppercase tracking-tighter italic">{selectedQuiz?.difficulty}</p>
                      </div>
                   </div>
                   <button className="w-full py-6 bg-[#22c55e] text-white rounded-3xl font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl shadow-green-900/20 hover:scale-105 active:scale-95 transition-all">Launch Preview</button>
                </div>
             </div>
          </div>
        )}

        {isPricingModalOpen && (
          <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
             <div className="bg-white rounded-[3rem] p-12 max-w-2xl w-full shadow-2xl space-y-12 animate-in zoom-in duration-500 relative">
                <button onClick={() => setIsPricingModalOpen(false)} className="absolute top-8 right-8 p-3 text-gray-300 hover:text-gray-900 transition-all"><XCircle size={28} /></button>
                <div className="space-y-4">
                   <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Pricing & Access Rules</h3>
                   <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic">Configure how students access {selectedQuiz?.title}</p>
                </div>

                <div className="space-y-8">
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Series Price (₹)</label>
                         <input type="number" defaultValue={selectedQuiz?.price} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-xl font-black focus:border-blue-600 outline-none transition-all" />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Access Level</label>
                         <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-sm font-black uppercase tracking-widest outline-none focus:border-blue-600">
                            <option>One-time Purchase</option>
                            <option>Subscription Required</option>
                            <option>Bundle Exclusive</option>
                         </select>
                      </div>
                   </div>
                   <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100 space-y-3">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none italic">Admin Advisory</p>
                      <p className="text-[11px] text-blue-600 font-bold italic leading-relaxed">Adjusting the price will affect all future transactions for this quiz. Students who have already purchased will retain their access.</p>
                   </div>
                </div>

                <button className="w-full py-6 bg-[#2563eb] text-white rounded-3xl font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all">Update Access Settings</button>
             </div>
          </div>
        )}

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
