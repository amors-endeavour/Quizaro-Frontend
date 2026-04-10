"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserSidebar from "@/components/UserSidebar";
import UserHeader from "@/components/UserHeader";
import API from "@/app/lib/api";
import { 
  Play, 
  Clock, 
  FileText, 
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  Lock,
  Layers
} from "lucide-react";

interface Test {
  _id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  totalQuestions: number;
  category?: string;
}

interface PurchasedTest {
  _id: string;
  testId: Test;
  purchasedAt: string;
  expiresAt: string;
  isCompleted: boolean;
}

export default function UserDashboard() {
  const router = useRouter();
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  const [purchasedTests, setPurchasedTests] = useState<PurchasedTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await API.get("/user/profile");
        const role = (data?.role || data?.user?.role)?.toLowerCase();
        if (role === "admin") {
          router.replace("/admin-dashboard");
          return;
        }
        setUser(data?.user || data);
        setIsAuthChecked(true);
      } catch {
        router.replace("/user-login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!isAuthChecked) return;
    const loadData = async () => {
      try {
        const [availableRes, purchasedRes] = await Promise.all([
          API.get("/user/tests/available"),
          API.get("/user/tests/purchased"),
        ]);
        setAvailableTests(availableRes.data);
        setPurchasedTests(purchasedRes.data);
      } catch (err) {
        console.error("Data load failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isAuthChecked]);

  if (loading) return <div className="min-h-screen bg-[#f3f4f9] flex items-center justify-center font-black text-blue-600 animate-pulse tracking-widest uppercase">Initializing Classroom...</div>;

  return (
    <div className="flex h-screen bg-[#f8f9fc] text-gray-900 font-sans overflow-hidden">
      <UserSidebar userName={user?.name || "Student"} />

      <main className="flex-1 overflow-y-auto">
        <UserHeader 
          title="Classroom Tests" 
          breadcrumbs={["Classroom", "Test Series"]} 
        />

        <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          
          {/* Dashboard Stats Overview (Institutional Style) */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
             {/* ... stats cards ... */}
             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-50">
                   <TrendingUp size={28} />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-gray-900 leading-none">{purchasedTests.length} Total</h3>
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2">Active Test Series</p>
                </div>
             </div>
             
             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center gap-6">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center shadow-lg shadow-green-50">
                   <Award size={28} />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-gray-900 leading-none">{purchasedTests.filter(t => t.isCompleted).length} Done</h3>
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2">Tests Completed</p>
                </div>
             </div>

             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center gap-6">
                <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center shadow-lg shadow-orange-50">
                   <Zap size={28} />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-gray-900 leading-none">{availableTests.length} New</h3>
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2">Available for Enrollment</p>
                </div>
             </div>
          </section>

          {/* ACTIVE TESTS SECTION */}
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
             <div className="flex items-center justify-between px-4">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-3">
                  <Play size={18} fill="currentColor" />
                  Your Active Classroom
                </h3>
             </div>

             <div className="grid grid-cols-1 gap-4">
                {purchasedTests.length === 0 ? (
                  <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">No series purchased yet. Explore the marketplace below.</p>
                  </div>
                ) : (
                  purchasedTests.map((pt) => (
                    <div key={pt._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6 group">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 group-hover:rotate-6 transition-transform">
                             <FileText size={28} />
                          </div>
                          <div>
                             <h4 className="text-lg font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{pt.testId.title}</h4>
                             <div className="flex items-center gap-4 mt-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">{pt.testId.category || "General"}</span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12} /> {pt.testId.duration} Min</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4">
                          {pt.isCompleted ? (
                             <button
                               onClick={() => router.push(`/result?attemptId=${pt._id}`)}
                               className="px-8 py-3 bg-green-50 text-green-700 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-green-600 hover:text-white transition-all shadow-lg shadow-green-50"
                             >
                               <CheckCircle2 size={16} />
                               View Scorecard
                             </button>
                          ) : (
                             <button
                               onClick={() => router.push(`/quiz/${pt.testId._id}`)}
                               className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
                             >
                               <Play size={16} fill="white" />
                               START TEST NOW
                             </button>
                          )}
                       </div>
                    </div>
                  ))
                )}
             </div>
          </section>

          {/* MARKETPLACE SECTION */}
          <section className="space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
             <div className="flex items-center justify-between px-4">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-3">
                  <Layers size={18} />
                  Available Recommendations
                </h3>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {availableTests.map((test) => (
                  <div key={test._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300">
                     <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mb-6 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-blue-100 transition-all duration-500">
                        <Lock size={32} />
                     </div>
                     <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest leading-relaxed mb-2 px-4 truncate max-w-full">{test.title}</h4>
                     <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-6 italic">{test.price === 0 ? "FREE SERIES" : `₹${test.price}`}</p>
                     
                     <button
                        onClick={() => router.push(`/quiz/${test._id}`)}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-blue-600 transition shadow-xl"
                     >
                       Unlock Now
                     </button>
                  </div>
                ))}
             </div>
          </section>

        </div>
      </main>
    </div>
  );
}
