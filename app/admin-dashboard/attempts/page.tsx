"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import API from "@/app/lib/api";
import { 
  Activity, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  ChevronRight,
  TrendingUp,
  FileText,
  User
} from "lucide-react";

interface Attempt {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  testId: {
    _id: string;
    title: string;
  };
  score: number;
  totalMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  submittedAt: string;
}

export default function AttemptsPage() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [testFilter, setTestFilter] = useState("all");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await API.get("/user/profile");
        const role = (data?.role || data?.user?.role)?.toLowerCase();
        if (role !== "admin") {
          router.replace("/admin-login");
        }
      } catch {
        router.replace("/admin-login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const { data } = await API.get("/admin/attempts");
        setAttempts(data);
      } catch (err) {
        console.error("Failed to fetch attempts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  const uniqueTests = [...new Set(attempts.map((a) => a.testId?._id))].filter(Boolean);

  const filteredAttempts = attempts.filter((attempt) => {
    const matchesSearch = 
      attempt.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      attempt.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      attempt.testId?.title?.toLowerCase().includes(search.toLowerCase());
    const matchesTest = testFilter === "all" || attempt.testId?._id === testFilter;
    return matchesSearch && matchesTest;
  });

  const getPercentage = (score: number, total: number) => {
    if (!total) return 0;
    return Math.round((score / total) * 100);
  };

  if (loading) return <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center font-black animate-pulse text-blue-600 uppercase tracking-widest leading-none">Accessing Activity Flow...</div>;

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader 
        title="Institutional Performance Flow" 
        path={[{ label: "Console" }, { label: "Attempts" }]} 
      />

      <div className="p-8 lg:p-14 max-w-[1600px] mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
         
         {/* SEARCH HUB */}
         <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 relative group w-full">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
               <input
                 type="text"
                 placeholder="Search by student name, email or test..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-100/30 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-sm font-bold text-gray-900"
               />
            </div>
            <div className="flex items-center gap-4 bg-white p-3 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/30 w-full md:w-auto">
               <Filter size={18} className="text-gray-400 ml-4" />
               <select
                 value={testFilter}
                 onChange={(e) => setTestFilter(e.target.value)}
                 className="bg-transparent text-xs font-black uppercase tracking-widest outline-none pr-8 cursor-pointer text-gray-600"
               >
                 <option value="all">All Tests</option>
                 {uniqueTests.map((testId) => {
                   const test = attempts.find((a) => a.testId?._id === testId);
                   return <option key={testId} value={testId}>{test?.testId?.title}</option>;
                 })}
               </select>
            </div>
         </div>

         {/* ATTEMPTS TABLE (IMAGE #1 STYLE) */}
         <section className="bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-100/30 overflow-hidden">
            <div className="px-12 py-10 border-b border-gray-50 flex items-center justify-between">
               <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Activity size={18} />
                  Live Activity Flow
               </h3>
               <div className="flex items-center gap-4 bg-gray-50/50 px-6 py-2 rounded-full border border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Attempts:</span>
                  <span className="text-xs font-black text-gray-900">{filteredAttempts.length}</span>
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-gray-50/50">
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Student Identity</th>
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Exam Subject</th>
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Score Card</th>
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Efficiency</th>
                        <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right pr-16">Submission</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {filteredAttempts.length === 0 ? (
                       <tr>
                         <td colSpan={5} className="px-12 py-20 text-center text-gray-400 font-bold italic">No examination records detected.</td>
                       </tr>
                     ) : (
                       filteredAttempts.map((attempt) => {
                         const percentage = getPercentage(attempt.score, attempt.totalMarks);
                         return (
                           <tr key={attempt._id} className="group hover:bg-gray-50/50 transition-all cursor-pointer">
                              <td className="px-12 py-8">
                                 <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                       <User size={20} />
                                    </div>
                                    <div>
                                       <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{attempt.userId?.name || "Anonymous Student"}</p>
                                       <p className="text-[10px] text-gray-400 font-bold mt-1 line-clamp-1">{attempt.userId?.email || "No Email Provided"}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-12 py-8">
                                 <div className="flex items-center gap-3">
                                    <FileText size={16} className="text-blue-500 opacity-50" />
                                    <span className="text-xs font-black text-gray-600 uppercase tracking-tight">{attempt.testId?.title}</span>
                                 </div>
                              </td>
                              <td className="px-12 py-8 text-center">
                                 <div className="inline-flex flex-col items-center">
                                    <p className="text-sm font-black text-gray-900">{attempt.score}<span className="text-gray-300 ml-1">/ {attempt.totalMarks}</span></p>
                                    <p className="text-[8px] font-black text-green-500 uppercase tracking-widest mt-1">+{attempt.correctAnswers} Correct</p>
                                 </div>
                              </td>
                              <td className="px-12 py-8 text-center">
                                 <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors ${
                                   percentage >= 60 ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                                 }`}>
                                   {percentage}% Accuracy
                                 </span>
                              </td>
                              <td className="px-12 py-8 text-right pr-16">
                                 <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                       <Calendar size={12} className="opacity-50" />
                                       {new Date(attempt.submittedAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                       <Clock size={12} className="opacity-50" />
                                       {new Date(attempt.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                 </div>
                              </td>
                           </tr>
                         );
                       })
                     )}
                  </tbody>
               </table>
            </div>
         </section>

      </div>
    </div>
  );
}
