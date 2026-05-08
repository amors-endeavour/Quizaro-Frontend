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

  if (loading) return (
    <div className="min-h-screen bg-[#fbfbfe] flex flex-col items-center justify-center space-y-8 transition-colors duration-300">
      <div className="w-20 h-20 border-4 border-blue-50 border-t-blue-600 rounded-[1.8rem] animate-spin shadow-xl shadow-blue-600/5" />
      <p className="font-black animate-pulse text-blue-600 uppercase tracking-[0.5em] text-[11px] italic leading-none">
        Synchronizing Identity Registry...
      </p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#fbfbfe] text-gray-900 transition-colors duration-500">
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

      <div className="flex-1 overflow-y-auto p-10 lg:p-20 max-w-[1700px] mx-auto w-full space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-20">
        
        {activeTab === 'access' ? (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
             
             <div className="xl:col-span-8 space-y-16">
                <div className="bg-white rounded-[5rem] border-2 border-gray-50 shadow-sm p-16 lg:p-24 relative overflow-hidden transition-all duration-500">
                   <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] pointer-events-none" />
                   
                   <div className="space-y-16 relative z-10">
                      <div className="flex items-center gap-8">
                         <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-600/30 rotate-3">
                            <ShieldCheck size={40} />
                         </div>
                         <div className="space-y-2">
                            <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Institutional Override</h2>
                            <p className="text-[12px] text-gray-400 font-black uppercase tracking-[0.4em] leading-none italic">Provisioning Premium Credentials Via Administrative Authority</p>
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

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                               <label className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em] ml-3 flex items-center gap-4 leading-none italic">
                                  <Layers size={16} className="text-blue-600" /> Target Series Cluster
                               </label>
                               <div className="relative">
                                  <select 
                                    value={selectedSeriesId}
                                    onChange={(e) => {
                                      setSelectedSeriesId(e.target.value);
                                      if (e.target.value) setSelectedTestId("");
                                    }}
                                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-[2.5rem] px-10 py-7 outline-none focus:border-blue-600 transition-all font-black text-[15px] text-gray-900 appearance-none shadow-sm uppercase tracking-tighter italic cursor-pointer"
                                  >
                                     <option value="">No Series Selected</option>
                                     {series.map(s => <option key={s._id} value={s._id}>{s.title.toUpperCase()}</option>)}
                                  </select>
                                  <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300"><Filter size={22} /></div>
                               </div>
                            </div>

                            <div className="space-y-6">
                               <label className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em] ml-3 flex items-center gap-4 leading-none italic">
                                  <TrendingUp size={16} className="text-blue-600" /> Standalone Assessment Node
                               </label>
                               <div className="relative">
                                  <select 
                                    value={selectedTestId}
                                    onChange={(e) => {
                                        setSelectedTestId(e.target.value);
                                        if (e.target.value) setSelectedSeriesId("");
                                    }}
                                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-[2.5rem] px-10 py-7 outline-none focus:border-blue-600 transition-all font-black text-[15px] text-gray-900 appearance-none shadow-sm uppercase tracking-tighter italic cursor-pointer"
                                  >
                                     <option value="">No Paper Selected</option>
                                     {tests.map(t => <option key={t._id} value={t._id}>{t.title.toUpperCase()}</option>)}
                                  </select>
                                  <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300"><TrendingUp size={22} /></div>
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

             <div className="xl:col-span-4 space-y-16">
                <div className="bg-white p-12 rounded-[5rem] border-2 border-gray-50 shadow-sm space-y-12 transition-all duration-500">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border-2 border-blue-50"><Shield size={32} /></div>
                      <div className="space-y-1">
                         <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest italic leading-none">Security Protocol</h3>
                         <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic leading-none">Institutional Access Control</p>
                      </div>
                   </div>
                   
                   <div className="space-y-8">
                      <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest leading-relaxed italic border-l-4 border-blue-600 pl-8">
                         Administrative override enables granular granting of assessment nodes to verified candidates, bypassing standard registry restrictions.
                      </p>
                      
                      <div className="space-y-6 pt-8">
                         <div className="flex items-center gap-6 group">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 shadow-inner"><Zap size={22} /></div>
                            <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest italic">Instant Registry Sync</span>
                         </div>
                         <div className="flex items-center gap-6 group">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-green-500 group-hover:bg-green-600 group-hover:text-white transition-all duration-700 shadow-inner"><CheckCircle2 size={22} /></div>
                            <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest italic">Immutable Audit Trail</span>
                         </div>
                         <div className="flex items-center gap-6 group">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-700 shadow-inner"><Lock size={22} /></div>
                            <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest italic">Encrypted Session Vault</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="pt-10 border-t-2 border-gray-50">
                      <button onClick={() => setActiveTab('governance')} className="w-full py-6 bg-gray-900 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest italic hover:bg-blue-600 transition-all flex items-center justify-center gap-5 active:scale-95 shadow-2xl shadow-gray-900/10">
                         View Identity Matrix <ArrowRight size={20} />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="space-y-16 animate-in fade-in slide-in-from-right-10 duration-1000">
             
             {/* USER TABLE */}
             <div className="bg-white rounded-[5.5rem] border-2 border-gray-50 shadow-sm overflow-hidden transition-all duration-500">
                <div className="px-20 py-16 border-b-2 border-gray-50 flex items-center justify-between bg-gray-50/10">
                   <div className="flex items-center gap-8">
                      <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center border-2 border-blue-50 shadow-sm"><Users size={40} /></div>
                      <div className="space-y-2">
                         <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Identity Matrix</h3>
                         <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.4em] italic leading-none">Candidates Synced Across Global Grid</p>
                      </div>
                   </div>
                   <div className="px-10 py-4 bg-white border-2 border-gray-50 rounded-full text-[11px] font-black text-gray-400 uppercase tracking-widest italic shadow-sm">
                      Active Entities: {filteredUsers.length}
                   </div>
                </div>

                 <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-gray-50/30 border-b-2 border-gray-50">
                            <th className="px-20 py-12 text-[12px] font-black uppercase tracking-widest text-gray-400 italic">Candidate Identity</th>
                            <th className="px-20 py-12 text-[12px] font-black uppercase tracking-widest text-gray-400 italic">Security Protocol (Role)</th>
                            <th className="px-20 py-12 text-[12px] font-black uppercase tracking-widest text-gray-400 italic">Registry Timestamp</th>
                            <th className="px-20 py-12 text-right text-[12px] font-black uppercase tracking-widest text-gray-400 italic">Moderation Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-gray-50">
                         {filteredUsers.length === 0 ? (
                            <tr>
                               <td colSpan={4} className="px-12 py-48 text-center text-gray-100 font-black uppercase text-[15px] tracking-[0.8em] italic">No entities detected in current query matrix</td>
                            </tr>
                         ) : (
                            filteredUsers.map(u => (
                               <tr key={u._id} className="hover:bg-gray-50/50 transition-all duration-500 group cursor-pointer">
                                  <td className="px-20 py-12">
                                     <div className="flex items-center gap-8">
                                        <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center font-black text-gray-300 border-2 border-gray-50 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-700 italic shadow-inner text-xl">
                                           {u.name[0].toUpperCase()}
                                        </div>
                                        <div>
                                           <p className="text-[20px] font-black text-gray-900 uppercase tracking-tighter group-hover:text-blue-600 transition-colors duration-500 italic leading-none">{u.name}</p>
                                           <p className="text-[11px] font-black text-gray-400 mt-3 lowercase italic tracking-widest">{u.email}</p>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-20 py-12">
                                     <div className="relative inline-block group/select">
                                        <select 
                                          value={u.role || "student"}
                                          onChange={(e) => changeRole(u._id, e.target.value)}
                                          className={`text-[11px] font-black uppercase tracking-widest px-10 py-4 rounded-full outline-none appearance-none cursor-pointer border-2 italic transition-all duration-500 shadow-sm ${u.role === 'admin' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-50'} hover:border-blue-400 active:scale-95`}
                                        >
                                          <option value="student">Student Node</option>
                                          <option value="admin">Institutional Authority</option>
                                        </select>
                                     </div>
                                  </td>
                                  <td className="px-20 py-12">
                                     <div className="space-y-2">
                                        <p className="text-[14px] font-black text-gray-900 uppercase italic leading-none">{new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</p>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic leading-none">Identity Sync Date</p>
                                     </div>
                                  </td>
                                  <td className="px-20 py-12 text-right">
                                     <button 
                                       onClick={() => toggleBan(u._id, u.isBanned)}
                                       className={`px-10 py-4 text-[11px] font-black uppercase tracking-widest rounded-full transition-all duration-700 flex items-center gap-4 italic active:scale-95 ml-auto shadow-2xl border-2 ${u.isBanned ? 'bg-green-600 text-white border-green-600 shadow-green-900/10' : 'bg-red-50 text-red-600 border-red-50 shadow-red-900/5 hover:bg-red-600 hover:text-white'}`}
                                     >
                                        {u.isBanned ? <><UserCheck size={20}/> Restore Node</> : <><UserX size={20}/> Suspend Entity</>}
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
             <div className="bg-white rounded-[5.5rem] border-2 border-gray-50 shadow-sm p-20 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gray-900" />
                
                <div className="flex items-center justify-between mb-16">
                   <div className="flex items-center gap-8">
                      <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 shadow-inner border-2 border-gray-50"><Activity size={36} /></div>
                      <div className="space-y-2">
                         <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Security Telemetry</h3>
                         <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.4em] italic leading-none">Immutable Governance Audit Log</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-5 px-10 py-4 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest italic border-2 border-blue-50 shadow-sm">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" /> Live Telemetry
                   </div>
                </div>

                <div className="space-y-8 max-h-[800px] overflow-y-auto pr-10 custom-scrollbar">
                   {auditLogs.length === 0 ? (
                     <div className="py-48 text-center text-gray-100 font-black uppercase text-[15px] tracking-[0.8em] italic">No governance incidents recorded in current registry session</div>
                   ) : (
                     auditLogs.map(log => (
                       <div key={log._id} className="bg-gray-50/10 border-2 border-gray-50 p-12 rounded-[4rem] flex flex-col md:flex-row md:items-center justify-between group hover:border-gray-900 transition-all duration-700 gap-10">
                          <div className="flex items-center gap-10">
                             <div className="w-20 h-20 rounded-[2rem] bg-white border-2 border-gray-50 flex items-center justify-center text-blue-600 shadow-xl group-hover:bg-gray-900 group-hover:text-white group-hover:rotate-12 transition-all duration-700">
                                {log.action === 'GRANT_ROLE' ? <ShieldCheck size={36}/> : <Zap size={36}/>}
                             </div>
                             <div className="space-y-4">
                                <div className="flex items-center gap-5">
                                   <p className="text-[12px] font-black text-blue-600 uppercase tracking-[0.4em] leading-none italic bg-blue-50 px-8 py-3 rounded-full border-2 border-blue-50">{log.action}</p>
                                   <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Action Code</p>
                                </div>
                                <p className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Authority: {log.adminId?.name || "GRID-CORE-SYSTEM"}</p>
                             </div>
                          </div>
                          <div className="md:text-right space-y-4 pl-32 md:pl-0 border-l-4 md:border-l-0 md:border-r-4 border-gray-50 pr-0 md:pr-12 py-3">
                             <p className="text-[15px] font-black text-gray-900 uppercase italic tracking-tight leading-none">{new Date(log.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).toUpperCase()}</p>
                             <p className="text-[11px] font-black text-gray-300 uppercase tracking-[0.3em] italic leading-none">{log.resourceType} Synchronization</p>
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
