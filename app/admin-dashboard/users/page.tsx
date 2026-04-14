"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";
import API from "@/app/lib/api";
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Key, 
  Mail, 
  Layers, 
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Zap
} from "lucide-react";

interface Series {
  _id: string;
  title: string;
}

interface Test {
  _id: string;
  title: string;
}

export default function StudentAccessPage() {
  const [email, setEmail] = useState("");
  const [series, setSeries] = useState<Series[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState("");
  const [selectedTestId, setSelectedTestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [seriesRes, testsRes] = await Promise.all([
          API.get("/admin/series"),
          API.get("/admin/tests")
        ]);
        setSeries(seriesRes.data);
        setTests(testsRes.data);
      } catch (err) {
        console.error("Catalog load failed", err);
      }
    };
    loadCatalog();
  }, []);

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { data } = await API.post("/admin/grant-access", {
        userEmail: email,
        seriesId: selectedSeriesId || undefined,
        testId: selectedTestId || undefined
      });
      setMessage(data.message);
      setEmail("");
      setSelectedSeriesId("");
      setSelectedTestId("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Granting process failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc]">
      <AdminHeader 
        title="Student Access" 
        path={[{ label: "Governance" }, { label: "Access Rights" }]} 
      />

      <div className="p-8 lg:p-14 max-w-[1200px] mx-auto w-full space-y-12">
        
        {/* ACCESS HUD */}
        <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 p-12 lg:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           
           <div className="flex-1 space-y-8 z-10 w-full lg:w-auto">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-100">
                    <ShieldCheck size={28} />
                 </div>
                 <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Institutional Override</h2>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 italic">Grant premium access to specific candidates</p>
                 </div>
              </div>

              <form onSubmit={handleGrant} className="space-y-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <Mail size={12} /> Student Email Address
                    </label>
                    <input 
                      type="email"
                      required
                      placeholder="student@institution.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-8 py-5 outline-none focus:border-blue-400 focus:bg-white transition-all font-bold text-gray-900 shadow-inner"
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                          <Layers size={12} /> Target Series (Optional)
                       </label>
                       <select 
                         value={selectedSeriesId}
                         onChange={(e) => {
                           setSelectedSeriesId(e.target.value);
                           if (e.target.value) setSelectedTestId("");
                         }}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-400 transition-all font-bold text-gray-900 appearance-none"
                       >
                          <option value="">No Series Selected</option>
                          {series.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
                       </select>
                    </div>

                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                          <TrendingUp size={12} /> Standalone Paper (Optional)
                       </label>
                       <select 
                         value={selectedTestId}
                         onChange={(e) => {
                            setSelectedTestId(e.target.value);
                            if (e.target.value) setSelectedSeriesId("");
                         }}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-400 transition-all font-bold text-gray-900 appearance-none"
                       >
                          <option value="">No Paper Selected</option>
                          {tests.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
                       </select>
                    </div>
                 </div>

                 {message && (
                    <div className="bg-green-50 text-green-600 border border-green-100 p-6 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                       <CheckCircle2 size={24} />
                       <span className="text-xs font-black uppercase tracking-widest">{message}</span>
                    </div>
                 )}

                 {error && (
                    <div className="bg-red-50 text-red-500 border border-red-100 p-6 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                       <AlertCircle size={24} />
                       <span className="text-xs font-black uppercase tracking-widest">{error}</span>
                    </div>
                 )}

                 <button 
                   disabled={loading}
                   className="w-full lg:w-fit px-12 py-5 bg-gray-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                 >
                    {loading ? "Authenticating Authority..." : "Authorize Student Access"}
                    <Key size={18} className="translate-y-[-1px]" />
                 </button>
              </form>
           </div>

           <div className="w-full lg:w-80 space-y-8 flex-shrink-0">
              <div className="bg-blue-50 p-8 rounded-[2.5rem] space-y-6">
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-relaxed">
                    Override protocol allows granting expired or premium content bypass to verified candidates.
                 </p>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <Zap size={16} className="text-blue-600" />
                       <span className="text-xs font-bold text-gray-700">Instant Registry Sync</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <CheckCircle2 size={16} className="text-blue-600" />
                       <span className="text-xs font-bold text-gray-700">Audit Log Entries</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
