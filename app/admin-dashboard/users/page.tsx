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
  Unlock,
  Filter,
  Shield,
  ArrowRight,
  Database
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
        const usersRes = await API.get("/admin/users").catch(() => ({ data: [] }));
        setUsers(usersRes.data);
        setFilteredUsers(usersRes.data);

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

  if (loading && users.length === 0) return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#050816] flex flex-col items-center justify-center space-y-6 transition-colors duration-300">
      <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin shadow-sm" />
      <p className="font-black animate-pulse text-blue-600 dark:text-blue-400 uppercase tracking-[0.5em] text-[10px] italic">
        Synchronizing Identity Registry...
      </p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc] dark:bg-[#050816] text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <AdminHeader 
        title={activeTab === 'access' ? "Access Rights Control" : "Institutional Governance"} 
        path={[{ label: "Administration" }, { label: "Security & Permissions" }]} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: 'access', label: 'Access Control', icon: <Lock size={14} /> },
          { id: 'governance', label: 'User Matrix', icon: <Database size={14} /> }
        ]}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 overflow-y-auto p-8 lg:p-14 max-w-[1500px] mx-auto w-full space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-20">
        
        {activeTab === 'access' ? (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
             
             <div className="xl:col-span-8 space-y-12">
                <div className="bg-white dark:bg-[#0a0f29] rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-sm p-12 lg:p-20 relative overflow-hidden transition-all duration-500">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                   
                   <div className="space-y-12 relative z-10">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-blue-900/30 rotate-3">
                            <ShieldCheck size={32} />
                         </div>
                         <div className="space-y-1">
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic leading-none">Institutional Override</h2>
                            <p className="text-[11px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-[0.3em] leading-none italic">Provisioning Premium Credentials Via Administrative Authority</p>
                         </div>
                      </div>

                      <form onSubmit={handleGrant} className="space-y-10">
                         <div className="space-y-5">
                            <label className="text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] ml-2 flex items-center gap-3 leading-none italic">
                               <Mail size={14} className="text-blue-600 dark:text-blue-400" /> Candidate Identifier (Email)
                            </label>
                            <input 
                              type="email"
                              required
                              placeholder="candidate@institutional-vault.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] px-10 py-7 outline-none focus:border-blue-600 transition-all font-black text-[16px] text-gray-900 dark:text-white shadow-inner placeholder:text-gray-300 dark:placeholder:text-gray-800 italic"
                            />
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-5">
                               <label className="text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] ml-2 flex items-center gap-3 leading-none italic">
                                  <Layers size={14} className="text-blue-600 dark:text-blue-400" /> Target Series Cluster
                               </label>
                               <div className="relative">
                                  <select 
                                    value={selectedSeriesId}
                                    onChange={(e) => {
                                      setSelectedSeriesId(e.target.value);
                                      if (e.target.value) setSelectedTestId("");
                                    }}
                                    className="w-full bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] px-8 py-6 outline-none focus:border-blue-600 transition-all font-black text-[14px] text-gray-900 dark:text-white appearance-none shadow-sm uppercase tracking-tighter italic cursor-pointer"
                                  >
                                     <option value="">No Series Selected</option>
                                     {series.map(s => <option key={s._id} value={s._id}>{s.title.toUpperCase()}</option>)}
                                  </select>
                                  <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><Filter size={18} /></div>
                               </div>
                            </div>

                            <div className="space-y-5">
                               <label className="text-[11px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] ml-2 flex items-center gap-3 leading-none italic">
                                  <TrendingUp size={14} className="text-blue-600 dark:text-blue-400" /> Standalone Assessment Node
                               </label>
                               <div className="relative">
                                  <select 
                                    value={selectedTestId}
                                    onChange={(e) => {
                                        setSelectedTestId(e.target.value);
                                        if (e.target.value) setSelectedSeriesId("");
                                    }}
                                    className="w-full bg-gray-50 dark:bg-[#050816] border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] px-8 py-6 outline-none focus:border-blue-600 transition-all font-black text-[14px] text-gray-900 dark:text-white appearance-none shadow-sm uppercase tracking-tighter italic cursor-pointer"
                                  >
                                     <option value="">No Paper Selected</option>
                                     {tests.map(t => <option key={t._id} value={t._id}>{t.title.toUpperCase()}</option>)}
                                  </select>
                                  <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><TrendingUp size={18} /></div>
                               </div>
                            </div>
                         </div>

                         {message && (
                            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-2 border-green-100 dark:border-green-800/30 p-8 rounded-[2.5rem] flex items-center gap-6 animate-in fade-in slide-in-from-top-6 duration-500 shadow-sm">
                               <CheckCircle2 size={32} />
                               <span className="text-[13px] font-black uppercase tracking-widest italic">{message}</span>
                            </div>
                         )}

                         {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-2 border-red-100 dark:border-red-800/30 p-8 rounded-[2.5rem] flex items-center gap-6 animate-in fade-in slide-in-from-top-6 duration-500 shadow-sm">
                               <AlertCircle size={32} />
                               <span className="text-[13px] font-black uppercase tracking-widest italic">{error}</span>
                            </div>
                         )}

                         <button 
                           disabled={loading}
                           className="w-full lg:w-fit px-16 py-7 bg-blue-600 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/40 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 italic"
                         >
                            {loading ? "Authenticating Authority..." : "Authorize Registry Access"}
                            <Key size={20} className="group-hover:rotate-12 transition-transform" />
                         </button>
                      </form>
                   </div>
                </div>
             </div>

             <div className="xl:col-span-4 space-y-12">
                <div className="bg-white dark:bg-[#0a0f29] p-10 rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-10 transition-all duration-500">
                   <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/30"><Shield size={24} /></div>
                      <div className="space-y-1">
                         <h3 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-widest italic leading-none">Security Protocol</h3>
                         <p className="text-[9px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-widest italic leading-none">Institutional Access Control</p>
                      </div>
                   </div>
                   
                   <div className="space-y-6">
                      <p className="text-[11px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest leading-relaxed italic border-l-4 border-blue-600 pl-6">
                         Administrative override enables granular granting of assessment nodes to verified candidates, bypassing standard registry restrictions.
                      </p>
                      
                      <div className="space-y-4 pt-6">
                         <div className="flex items-center gap-4 group">
                            <div className="w-10 h-10 bg-gray-50 dark:bg-[#050816] rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner"><Zap size={18} /></div>
                            <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest italic">Instant Registry Sync</span>
                         </div>
                         <div className="flex items-center gap-4 group">
                            <div className="w-10 h-10 bg-gray-50 dark:bg-[#050816] rounded-xl flex items-center justify-center text-green-500 group-hover:bg-green-600 group-hover:text-white transition-all duration-500 shadow-inner"><CheckCircle2 size={18} /></div>
                            <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest italic">Immutable Audit Trail</span>
                         </div>
                         <div className="flex items-center gap-4 group">
                            <div className="w-10 h-10 bg-gray-50 dark:bg-[#050816] rounded-xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner"><Lock size={18} /></div>
                            <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest italic">Encrypted Session Vault</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="pt-8 border-t border-gray-50 dark:border-gray-800">
                      <button onClick={() => setActiveTab('governance')} className="w-full py-5 bg-gray-900 dark:bg-[#050816] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest italic hover:bg-blue-600 transition-all flex items-center justify-center gap-4 active:scale-95">
                         View Identity Matrix <ArrowRight size={16} />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="space-y-16 animate-in fade-in slide-in-from-right-10 duration-1000">
             
             {/* USER TABLE */}
             <div className="bg-white dark:bg-[#0a0f29] rounded-[4.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-all duration-500">
                <div className="px-16 py-12 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-[#050816]/30">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-800/30 shadow-sm"><Users size={28} /></div>
                      <div className="space-y-1">
                         <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Identity Matrix</h3>
                         <p className="text-[10px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-[0.4em] italic leading-none">Candidates Synced Across Global Grid</p>
                      </div>
                   </div>
                   <div className="px-8 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest italic shadow-sm">
                      Active Entities: {filteredUsers.length}
                   </div>
                </div>

                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-gray-50/20 dark:bg-gray-800/10 border-b border-gray-50 dark:border-gray-800">
                            <th className="px-12 py-10 text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-700 italic">Candidate Identity</th>
                            <th className="px-12 py-10 text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-700 italic">Security Protocol (Role)</th>
                            <th className="px-12 py-10 text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-700 italic">Registry Timestamp</th>
                            <th className="px-12 py-10 text-right text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-700 italic">Moderation Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                         {filteredUsers.length === 0 ? (
                            <tr>
                               <td colSpan={4} className="px-12 py-32 text-center text-gray-300 dark:text-gray-800 font-black uppercase text-[12px] tracking-[0.5em] italic">No entities detected in current query matrix</td>
                            </tr>
                         ) : (
                            filteredUsers.map(u => (
                               <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-[#050816]/30 transition-all group cursor-pointer">
                                  <td className="px-12 py-10">
                                     <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-gray-50 dark:bg-[#050816] rounded-2xl flex items-center justify-center font-black text-gray-400 dark:text-gray-700 border border-gray-100 dark:border-gray-800 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-500 italic shadow-inner">
                                           {u.name[0].toUpperCase()}
                                        </div>
                                        <div>
                                           <p className="text-[17px] font-black text-gray-900 dark:text-white uppercase tracking-tighter group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors italic leading-none">{u.name}</p>
                                           <p className="text-[10px] font-black text-gray-400 dark:text-gray-700 mt-2 lowercase italic tracking-widest">{u.email}</p>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-12 py-10">
                                     <div className="relative inline-block group/select">
                                        <select 
                                          value={u.role || "student"}
                                          onChange={(e) => changeRole(u._id, e.target.value)}
                                          className={`text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-2xl outline-none appearance-none cursor-pointer border-2 italic transition-all duration-500 ${u.role === 'admin' ? 'bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/30' : 'bg-gray-50/50 dark:bg-gray-800/10 text-gray-400 dark:text-gray-700 border-gray-100 dark:border-gray-800/50'} hover:border-blue-400 active:scale-95`}
                                        >
                                          <option value="student">Student Node</option>
                                          <option value="admin">Institutional Authority</option>
                                        </select>
                                     </div>
                                  </td>
                                  <td className="px-12 py-10">
                                     <div className="space-y-1">
                                        <p className="text-[12px] font-black text-gray-900 dark:text-white uppercase italic leading-none">{new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</p>
                                        <p className="text-[9px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-widest italic leading-none">Identity Sync Date</p>
                                     </div>
                                  </td>
                                  <td className="px-12 py-10 text-right">
                                     <button 
                                       onClick={() => toggleBan(u._id, u.isBanned)}
                                       className={`px-8 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-500 flex items-center gap-3 italic active:scale-95 ml-auto shadow-sm border-2 ${u.isBanned ? 'bg-green-50/50 dark:bg-green-900/10 text-green-600 dark:text-green-500 border-green-100 dark:border-green-800/30 hover:bg-green-600 hover:text-white' : 'bg-red-50/50 dark:bg-red-900/10 text-red-600 dark:text-red-500 border-red-100 dark:border-red-800/30 hover:bg-red-600 hover:text-white'}`}
                                     >
                                        {u.isBanned ? <><UserCheck size={16}/> Restore Node</> : <><UserX size={16}/> Suspend Entity</>}
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
             <div className="bg-white dark:bg-[#0a0f29] rounded-[4.5rem] border border-gray-100 dark:border-gray-800 shadow-sm p-16 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600/50 via-indigo-600/50 to-blue-600/50" />
                
                <div className="flex items-center justify-between mb-12">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-gray-50 dark:bg-[#050816] rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner border border-gray-100 dark:border-gray-800"><Activity size={28} /></div>
                      <div className="space-y-1">
                         <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Security Telemetry</h3>
                         <p className="text-[10px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-[0.4em] italic leading-none">Immutable Governance Audit Log</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 px-8 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[9px] font-black uppercase tracking-widest italic border border-blue-100 dark:border-blue-800/30">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Live Telemetry
                   </div>
                </div>

                <div className="space-y-6 max-h-[700px] overflow-y-auto pr-8 custom-scrollbar">
                   {auditLogs.length === 0 ? (
                     <div className="py-32 text-center text-gray-200 dark:text-gray-800 font-black uppercase text-[12px] tracking-[0.5em] italic">No governance incidents recorded in current registry session</div>
                   ) : (
                     auditLogs.map(log => (
                       <div key={log._id} className="bg-gray-50/30 dark:bg-[#050816]/30 border-2 border-gray-50 dark:border-gray-800 p-10 rounded-[3.5rem] flex flex-col md:flex-row md:items-center justify-between group hover:border-blue-600 transition-all duration-700 gap-8">
                          <div className="flex items-center gap-8">
                             <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xl group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12 transition-all duration-700">
                                {log.action === 'GRANT_ROLE' ? <ShieldCheck size={28}/> : <Zap size={28}/>}
                             </div>
                             <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                   <p className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] leading-none italic bg-blue-50/50 dark:bg-blue-900/10 px-6 py-2 rounded-full border border-blue-100 dark:border-blue-800/30">{log.action}</p>
                                   <p className="text-[9px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-widest italic">Action Code</p>
                                </div>
                                <p className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">Authority: {log.adminId?.name || "GRID-CORE-SYSTEM"}</p>
                             </div>
                          </div>
                          <div className="md:text-right space-y-3 pl-24 md:pl-0 border-l-4 md:border-l-0 md:border-r-4 border-gray-100 dark:border-gray-800 pr-0 md:pr-10 py-2">
                             <p className="text-[13px] font-black text-gray-900 dark:text-white uppercase italic tracking-tight leading-none">{new Date(log.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).toUpperCase()}</p>
                             <p className="text-[10px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-[0.2em] italic leading-none">{log.resourceType} Synchronization</p>
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
