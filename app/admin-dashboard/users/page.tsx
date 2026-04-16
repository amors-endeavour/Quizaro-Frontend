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
  Zap,
  UserX,
  UserCheck,
  Eye
} from "lucide-react";

interface Series {
  _id: string;
  title: string;
}

interface Test {
  _id: string;
  title: string;
}

interface PlatformUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBanned: boolean;
  createdAt: string;
}

export default function StudentAccessPage() {
  const [email, setEmail] = useState("");
  const [series, setSeries] = useState<Series[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState("");
  const [selectedTestId, setSelectedTestId] = useState("");
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [seriesRes, testsRes, usersRes] = await Promise.all([
          API.get("/admin/series"),
          API.get("/admin/tests"),
          API.get("/admin/users")
        ]);
        setSeries(seriesRes.data);
        setTests(testsRes.data);
        setUsers(usersRes.data);
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

  const toggleBan = async (userId: string, isBanned: boolean) => {
    try {
      await API.put(`/admin/user/${userId}/ban`);
      setUsers(users.map(u => u._id === userId ? { ...u, isBanned: !isBanned } : u));
    } catch (err) {
      console.error("Ban action failed", err);
    }
  };

  const changeRole = async (userId: string, newRole: string) => {
    try {
      await API.post(`/admin/grant-role`, { userId, role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error("Role assignment failed", err);
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

         {/* USER REGISTRY TABLE */}
         <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 p-12 lg:p-16">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-4 mb-8">
               <Users size={24} className="text-blue-600" /> Platform Security & Identity Matrix
            </h3>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-gray-50/50">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 rounded-l-3xl">Candidate</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Security / Role</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Registered</th>
                        <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 rounded-r-3xl">Moderation Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {users.map(u => (
                        <tr key={u._id} className="hover:bg-gray-50/30 transition-all">
                           <td className="px-8 py-6">
                              <p className="text-sm font-black text-gray-900 uppercase tracking-wide">{u.name}</p>
                              <p className="text-[10px] font-bold text-gray-400">{u.email}</p>
                           </td>
                           <td className="px-8 py-6">
                              <select 
                                value={u.role || "student"}
                                onChange={(e) => changeRole(u._id, e.target.value)}
                                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl outline-none appearance-none cursor-pointer border ${u.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-gray-50 text-gray-600 border-gray-100'} hover:opacity-80 transition-opacity`}
                              >
                                <option value="student">Student Status</option>
                                <option value="admin">Admin Authority</option>
                              </select>
                           </td>
                           <td className="px-8 py-6 text-xs font-black text-gray-900">{new Date(u.createdAt).toLocaleDateString()}</td>
                           <td className="px-8 py-6 text-right flex items-center justify-end gap-3">
                              <button className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-xl transition-all" title="View Detailed Activity Logs">
                                 <Eye size={16} />
                              </button>
                              <button 
                                onClick={() => toggleBan(u._id, u.isBanned)}
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 ${u.isBanned ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                              >
                                 {u.isBanned ? <><UserCheck size={14}/> Remove Suspension</> : <><UserX size={14}/> Enforce Ban</>}
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

      </div>
    </div>
  );
}
