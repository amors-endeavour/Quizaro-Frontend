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
  Eye,
  Activity,
  Lock,
  Unlock
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

interface AuditLog {
  _id: string;
  action: string;
  adminId: { name: string; email: string };
  resourceType: string;
  details: any;
  createdAt: string;
}

export default function StudentAccessPage() {
  const [email, setEmail] = useState("");
  const [series, setSeries] = useState<Series[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState("");
  const [selectedTestId, setSelectedTestId] = useState("");
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<PlatformUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("access");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch users first as it's the most critical
        const usersRes = await API.get("/admin/users").catch(() => ({ data: [] }));
        setUsers(usersRes.data);
        setFilteredUsers(usersRes.data);

        // Fetch other catalogs
        const [seriesRes, testsRes, logsRes] = await Promise.all([
          API.get("/admin/series").catch(() => ({ data: [] })),
          API.get("/admin/tests").catch(() => ({ data: [] })),
          API.get("/admin/audit-logs").catch(() => ({ data: [] }))
        ]);
        
        setSeries(seriesRes.data);
        setTests(testsRes.data);
        setAuditLogs(logsRes.data);
      } catch (err) {
        console.error("Critical governance load error", err);
        setError("Failed to synchronize with identity vault.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      setFilteredUsers(users);
      return;
    }
    const filtered = users.filter(u => 
      u.name.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q)
    );
    setFilteredUsers(filtered);
    
    // If user is searching, automatically switch to Governance tab to show results
    if (q.length > 1 && activeTab !== 'governance') {
      setActiveTab('governance');
    }
  }, [searchQuery, users, activeTab]);

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
      // Refresh logs
      const logsRes = await API.get("/admin/audit-logs");
      setAuditLogs(logsRes.data);
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
        title={activeTab === 'access' ? "Access Rights" : "Institutional Governance"} 
        path={[{ label: "Governance" }, { label: activeTab === 'access' ? "Access Rights" : "Security" }]} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: 'access', label: 'Access Rights', icon: <Lock size={14} /> },
          { id: 'governance', label: 'Governance', icon: <Activity size={14} /> }
        ]}
        onSearchChange={setSearchQuery}
      />

      <div className="p-8 lg:p-14 max-w-[1400px] mx-auto w-full space-y-12">
        
        {activeTab === 'access' ? (
          /* ACCESS RIGHTS VIEW */
          <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 p-12 lg:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
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
        ) : (
          /* GOVERNANCE VIEW */
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
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
                         {filteredUsers.length === 0 ? (
                           <tr><td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-black uppercase text-[10px] tracking-widest italic">No candidates matching identity query</td></tr>
                         ) : (
                           filteredUsers.map(u => (
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
                                    <button 
                                      onClick={() => toggleBan(u._id, u.isBanned)}
                                      className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 ${u.isBanned ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                    >
                                       {u.isBanned ? <><UserCheck size={14}/> Remove Suspension</> : <><UserX size={14}/> Enforce Ban</>}
                                    </button>
                                 </td>
                              </tr>
                           ))
                         )}
                      </tbody>
                   </table>
                </div>
             </div>

             {/* AUDIT LOGS */}
             <div className="bg-gray-900 rounded-[3.5rem] p-12 lg:p-16 text-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full bg-blue-600/5 blur-3xl pointer-events-none" />
                <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8 flex items-center gap-4">
                   <Activity size={24} className="text-cyan-400" /> Security Audit Log
                </h3>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 scrollbar-hide">
                   {auditLogs.length === 0 ? (
                     <div className="py-20 text-center text-gray-600 font-black uppercase text-[10px] tracking-widest italic">No security incidents recorded</div>
                   ) : (
                     auditLogs.map(log => (
                       <div key={log._id} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group hover:border-cyan-400/20 transition-all">
                          <div className="flex items-center gap-6">
                             <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 flex items-center justify-center text-cyan-400 border border-cyan-400/20">
                                {log.action === 'GRANT_ROLE' ? <ShieldCheck size={20}/> : <Zap size={20}/>}
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{log.action}</p>
                                <p className="text-sm font-bold text-gray-300 mt-1">Admin: {log.adminId?.name || "System"}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{new Date(log.createdAt).toLocaleString()}</p>
                             <p className="text-[9px] font-bold text-cyan-400/60 mt-1 uppercase tracking-tighter">{log.resourceType}</p>
                          </div>
                       </div>
                     ))
                   )}
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
