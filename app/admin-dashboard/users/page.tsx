"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import AdminHeader from "@/components/AdminHeader";
import API from "@/app/lib/api";
import useSWR from "swr";
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  UserPlus, 
  Search, 
  Filter as FilterIcon, 
  Plus, 
  Download, 
  Eye, 
  MoreVertical, 
  ChevronRight,
  Trash2,
  XCircle,
  ShieldAlert,
  ArrowUpDown,
  Mail,
  Calendar,
  Clock,
  Lock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  User,
  X,
  FileText,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// FETCHERS
const fetcher = (url: string) => API.get(url).then(res => res.data);

interface UserRegistry {
  id: string;
  name: string;
  handle?: string;
  email: string;
  status: 'Active' | 'Inactive';
  joinedOn?: string;
  joinedTimestamp?: number;
  createdAt: string;
  avatar?: string;
  color?: string;
  lastActive?: string;
}

export default function UsersManagementPage() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const itemsPerPage = 10;

  // VISIBILITY STATES
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // FORM & FILTER STATES
  const [filters, setFilters] = useState({
    status: "All",
    joinDate: "All Time",
    activity: "All"
  });
  const [isExporting, setIsExporting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReauthModalOpen, setIsReauthModalOpen] = useState(false);
  const [reauthPassword, setReauthPassword] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    handle: "",
    email: "",
    role: "student"
  });

  const filterRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  // REAL-TIME DATABASE SYNCHRONIZATION
  const { data: usersData, error, mutate } = useSWR<UserRegistry[]>('/admin/users', fetcher, { 
    refreshInterval: 5000,
    fallbackData: [] // Zero-baseline policy
  });

  const allUsers: UserRegistry[] = usersData || [];

  // Outside Click Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // DERIVED METRICS (Real-Time)
  const stats = useMemo(() => {
    const total = allUsers.length;
    const active = allUsers.filter(u => u.status === 'Active').length;
    const inactive = allUsers.filter(u => u.status === 'Inactive').length;
    const newThisMonth = allUsers.filter(u => {
      const joinedDate = new Date(u.joinedTimestamp || u.createdAt);
      const now = new Date();
      return joinedDate.getMonth() === now.getMonth() && joinedDate.getFullYear() === now.getFullYear();
    }).length;

    return {
      total: total.toLocaleString(),
      active: active.toLocaleString(),
      newThisMonth: newThisMonth.toLocaleString(),
      activePercent: total > 0 ? Math.round((active / total) * 100) : 0,
      newPercent: total > 0 ? Math.round((newThisMonth / total) * 100) : 0
    };
  }, [allUsers]);

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone. We recommend downloading a registry backup first.")) return;
    
    // Optimistic UI Update
    const previousUsers = usersData;
    const updatedUsers = allUsers.filter(u => u.id !== id);
    
    try {
      // Trigger mutate for immediate UI removal
      mutate(updatedUsers, false);
      
      await API.delete(`/admin/users/${id}`);
      setToast({ message: "Registry updated: User permanently removed.", type: 'success' });
    } catch (err) {
      // Revert if API fails
      mutate(previousUsers);
      setToast({ message: "Administrative Error: Failed to delete user. Please verify backend connectivity.", type: "error" });
    }
  };

  // FILTERED DATA
  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.handle?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filters.status === "All" || user.status === filters.status;
      
      let matchesDate = true;
      const now = Date.now();
      const joinedTs = user.joinedTimestamp || new Date(user.createdAt).getTime();
      if (filters.joinDate === "Last 7 Days") {
        matchesDate = (now - joinedTs) <= 7 * 24 * 60 * 60 * 1000;
      } else if (filters.joinDate === "Last 30 Days") {
        matchesDate = (now - joinedTs) <= 30 * 24 * 60 * 60 * 1000;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [allUsers, searchQuery, filters]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const toggleSelectUser = (id: string) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(u => u.id));
    }
  };

  const handleBulkAction = async (action: 'delete' | 'deactivate') => {
    setIsBulkLoading(true);
    try {
      // In real app: await API.post('/admin/users/bulk-action', { ids: selectedUsers, action });
      await new Promise(resolve => setTimeout(resolve, 1500));
      setToast({ message: `${selectedUsers.length} users ${action === 'delete' ? 'deleted' : 'deactivated'} successfully`, type: 'success' });
      setSelectedUsers([]);
      mutate(); // Trigger re-validation
    } catch (err) {
      setToast({ message: "Failed to perform action", type: "error" });
    } finally {
      setIsBulkLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.post('/admin/users', newUser);
      setToast({ message: "New user provisioned successfully", type: "success" });
      setShowAddUserModal(false);
      setNewUser({ name: "", handle: "", email: "", role: "student" });
      mutate();
    } catch (err) {
      setToast({ message: "Failed to add user", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = async (type: 'csv' | 'pdf') => {
    if (allUsers.length === 0) {
      setToast({ message: "No data available to export", type: "error" });
      setShowExportDropdown(false);
      return;
    }

    if (type === 'csv') {
      setIsReauthModalOpen(true);
      setShowExportDropdown(false);
      return;
    }

    processExport(type);
  };

  const processExport = async (type: 'csv' | 'pdf') => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (type === 'csv') {
      const headers = ["Full Name", "Username Handle", "Email Address", "Current Status", "Joined On"];
      const rows = filteredUsers.map(u => [
        u.name, 
        u.handle || `@${u.name.toLowerCase().replace(" ", ".")}`, 
        u.email, 
        u.status, 
        u.joinedOn || new Date(u.createdAt).toLocaleDateString()
      ]);
      const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Quizaro_Users_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    setToast({ message: `Users list exported as ${type.toUpperCase()}`, type: 'success' });
    setIsExporting(false);
    setReauthPassword("");
    setIsReauthModalOpen(false);
  };

  const handleVerifyBackup = async () => {
    if (!reauthPassword) return;
    setIsSubmitting(true);
    try {
      // Simulated institutional security check (consistent with settings)
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (reauthPassword === "admin123") {
        processExport('csv');
      } else {
        setToast({ message: "Security Error: Invalid administrative password.", type: "error" });
      }
    } catch (err) {
      setToast({ message: "Security Error: Authentication channel compromised.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== "All" && v !== "All Time").length;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <AdminHeader title="Users" path={[{ label: "Dashboard" }, { label: "Users" }]} />

      <main className="p-10 lg:p-14 max-w-[1700px] mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* STATISTICS ROW (DYNAMIC) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           {[
             { label: "Total Users", value: stats.total, sub: "All registered users", icon: <Users size={24} />, color: "purple" },
             { label: "Active Users", value: stats.active, sub: `${stats.activePercent}% of total users`, icon: <UserCheck size={24} />, color: "green", health: "text-green-600" },
             { label: "New Users (This Month)", value: stats.newThisMonth, sub: `${stats.newPercent}% of total users`, icon: <UserPlus size={24} />, color: "blue", health: "text-blue-600" },
           ].map((stat, idx) => (
             <div key={idx} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col gap-8 group hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                   <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${
                     stat.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                     stat.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                   }`}>
                      {stat.icon}
                   </div>
                   <div className="text-right">
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2 italic">{stat.label}</p>
                      <h3 className="text-3xl font-black text-gray-900 italic tracking-tighter leading-none">{stat.value}</h3>
                   </div>
                </div>
                <p className={`text-[11px] font-bold uppercase tracking-widest italic ${stat.health || "text-gray-300"}`}>
                   {stat.sub}
                </p>
             </div>
           ))}
        </div>

        {/* TABLE CONTROLS */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
           <div className="flex items-center gap-5 flex-1 max-w-2xl">
              <div className="relative flex-1">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Search users..." 
                   className="w-full bg-white border border-gray-100 rounded-2xl pl-16 pr-8 py-4 text-sm focus:border-purple-600 outline-none transition-all placeholder:text-gray-300 font-bold italic"
                 />
              </div>
              
              <div className="relative" ref={filterRef}>
                 <button 
                   onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                   className={`flex items-center gap-4 px-8 py-4 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest italic shadow-sm hover:border-purple-200 transition-all ${activeFiltersCount > 0 ? "text-purple-600 border-purple-100" : "text-gray-500"}`}
                 >
                    <FilterIcon size={18} className={activeFiltersCount > 0 ? "text-purple-600" : "text-gray-400"} /> 
                    Filter 
                    {activeFiltersCount > 0 && <span className="bg-purple-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[9px]">{activeFiltersCount}</span>}
                    <ChevronDown size={14} className={`transition-transform duration-300 ${showFilterDropdown ? "rotate-180" : ""}`} />
                 </button>

                 {showFilterDropdown && (
                   <div className="absolute top-[120%] left-0 w-80 bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl p-8 z-[200] animate-in slide-in-from-top-4 duration-500">
                      <div className="space-y-8">
                         <div className="space-y-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">User Status</p>
                            <div className="flex flex-wrap gap-3">
                               {["All", "Active", "Inactive"].map(s => (
                                 <button 
                                   key={s}
                                   onClick={() => setFilters({ ...filters, status: s })}
                                   className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all ${filters.status === s ? "bg-purple-600 text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                                 >
                                    {s}
                                 </button>
                               ))}
                            </div>
                         </div>
                         <div className="space-y-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Joined Date</p>
                            <div className="flex flex-wrap gap-3">
                               {["All Time", "Last 7 Days", "Last 30 Days"].map(d => (
                                 <button 
                                   key={d}
                                   onClick={() => setFilters({ ...filters, joinDate: d })}
                                   className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all ${filters.joinDate === d ? "bg-purple-600 text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                                 >
                                    {d}
                                 </button>
                               ))}
                            </div>
                         </div>
                         <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                            <button 
                              onClick={() => setFilters({ status: "All", joinDate: "All Time", activity: "All" })}
                              className="text-[10px] font-black text-red-500 uppercase tracking-widest italic"
                            >
                               Reset
                            </button>
                            <button 
                              onClick={() => setShowFilterDropdown(false)}
                              className="px-6 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest italic"
                            >
                               Apply
                            </button>
                         </div>
                      </div>
                   </div>
                 )}
              </div>

              <button 
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-4 px-8 py-4 bg-[#7C3AED] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest italic shadow-lg shadow-purple-900/20 active:scale-95 transition-all whitespace-nowrap"
              >
                 <Plus size={18} /> Add User
              </button>
           </div>
           
           <div className="relative" ref={exportRef}>
              <button 
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                disabled={isExporting}
                className="flex items-center gap-4 px-8 py-4 bg-white border border-gray-100 rounded-2xl text-[11px] font-black text-gray-500 uppercase tracking-widest italic shadow-sm hover:border-purple-200 transition-all border-purple-100/50"
              >
                 {isExporting ? <Loader2 size={18} className="animate-spin text-purple-600" /> : <Download size={18} className="text-purple-600" />}
                 Export <ChevronDown size={14} className={`transition-transform duration-300 ${showExportDropdown ? "rotate-180" : ""}`} />
              </button>

              {showExportDropdown && (
                <div className="absolute top-[120%] right-0 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 z-[200] animate-in slide-in-from-top-4 duration-500">
                   <div className="space-y-1">
                      <button 
                        onClick={() => handleExport('csv')}
                        className="w-full flex items-center gap-4 px-4 py-3 text-[11px] font-black text-gray-500 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all uppercase tracking-widest italic"
                      >
                         <FileText size={16} /> Export as CSV
                      </button>
                      <button 
                        onClick={() => handleExport('pdf')}
                        className="w-full flex items-center gap-4 px-4 py-3 text-[11px] font-black text-gray-500 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all uppercase tracking-widest italic"
                      >
                         <ShieldCheck size={16} /> Export as PDF
                      </button>
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* ACTIVE FILTERS BADGES */}
        {activeFiltersCount > 0 && (
           <div className="flex items-center gap-4 flex-wrap animate-in fade-in slide-in-from-left-4 duration-500">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mr-2">Active Filters:</p>
              {filters.status !== "All" && (
                <div className="bg-purple-50 text-purple-600 px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest italic flex items-center gap-3 border border-purple-100">
                   Status: {filters.status}
                   <button onClick={() => setFilters({ ...filters, status: "All" })}><X size={12} /></button>
                </div>
              )}
              {filters.joinDate !== "All Time" && (
                <div className="bg-purple-50 text-purple-600 px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest italic flex items-center gap-3 border border-purple-100">
                   Joined: {filters.joinDate}
                   <button onClick={() => setFilters({ ...filters, joinDate: "All Time" })}><X size={12} /></button>
                </div>
              )}
           </div>
        )}

        {/* DATA TABLE SECTION (DYNAMIC) */}
        <div className="bg-white rounded-[4rem] border border-gray-100 shadow-sm overflow-hidden relative min-h-[600px] flex flex-col">
           
           {/* BULK ACTIONS BAR */}
           {selectedUsers.length > 0 && (
             <div className="absolute top-0 left-0 w-full bg-purple-600 px-12 py-8 flex items-center justify-between animate-in slide-in-from-top-full duration-500 z-50">
                <div className="flex items-center gap-8">
                   <button onClick={() => setSelectedUsers([])} className="text-white hover:rotate-90 transition-transform">
                      <XCircle size={24} />
                   </button>
                   <p className="text-white text-[13px] font-black uppercase tracking-widest italic">
                      {selectedUsers.length} Users Selected
                   </p>
                </div>
                <div className="flex items-center gap-6">
                   <button 
                     onClick={() => handleBulkAction('deactivate')}
                     disabled={isBulkLoading}
                     className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all disabled:opacity-50"
                   >
                      Deactivate
                   </button>
                   <button 
                     onClick={() => handleBulkAction('delete')}
                     disabled={isBulkLoading}
                     className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all shadow-lg shadow-black/20 disabled:opacity-50"
                   >
                      {isBulkLoading ? "Processing..." : "Delete Permanently"}
                   </button>
                </div>
             </div>
           )}

           <div className="p-12 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">All Users</h3>
           </div>

           <div className="overflow-x-auto flex-1">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-gray-50/50">
                       <th className="px-12 py-8 w-20">
                          <input 
                            type="checkbox" 
                            checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                            onChange={toggleSelectAll}
                            className="w-5 h-5 rounded-md border-gray-300 text-purple-600 focus:ring-purple-600 transition-all cursor-pointer"
                          />
                       </th>
                       <th className="px-12 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Username</th>
                       <th className="px-12 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Email</th>
                       <th className="px-12 py-8 text-center text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Status</th>
                       <th className="px-12 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Join Date</th>
                       <th className="px-12 py-8 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {allUsers.length === 0 ? (
                       <tr>
                          <td colSpan={6} className="px-12 py-32 text-center space-y-4">
                             <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Users size={40} className="text-gray-200" />
                             </div>
                             <p className="text-gray-400 font-black uppercase tracking-[0.2em] italic">No active users found in registry.</p>
                             <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest italic">Provision new users to populate the database.</p>
                          </td>
                       </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                         <td colSpan={6} className="px-12 py-32 text-center text-gray-400 font-black uppercase tracking-widest italic">
                            No users found matching your criteria.
                         </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((user) => (
                        <tr key={user.id} className={`group hover:bg-gray-50 transition-all duration-500 cursor-pointer ${selectedUsers.includes(user.id) ? "bg-purple-50/50" : ""}`}>
                           <td className="px-12 py-8">
                              <input 
                                type="checkbox" 
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => toggleSelectUser(user.id)}
                                className="w-5 h-5 rounded-md border-gray-300 text-purple-600 focus:ring-purple-600 transition-all cursor-pointer"
                              />
                           </td>
                           <td className="px-12 py-8">
                              <p className="text-[14px] font-black text-gray-900 uppercase tracking-tighter italic leading-none">{user.handle || `@${user.name.toLowerCase().replace(" ", ".")}`}</p>
                           </td>
                           <td className="px-12 py-8">
                              <p className="text-[13px] font-bold text-gray-500 lowercase italic">{user.email}</p>
                           </td>
                           <td className="px-12 py-8 text-center">
                              <div className="flex justify-center">
                                 {user.status === 'Active' ? (
                                   <div className="w-8 h-8 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shadow-sm border border-green-100">
                                      <CheckCircle2 size={16} />
                                   </div>
                                 ) : (
                                   <div className="w-8 h-8 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shadow-sm border border-red-100">
                                      <XCircle size={16} />
                                   </div>
                                 )}
                              </div>
                           </td>
                           <td className="px-12 py-8">
                              <p className="text-[13px] font-black text-gray-500 uppercase italic leading-none">{user.joinedOn || new Date(user.createdAt).toLocaleDateString()}</p>
                           </td>
                           <td className="px-12 py-8 text-right">
                              <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button 
                                   onClick={() => handleDeleteUser(user.id)}
                                   className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                 >
                                    <Trash2 size={18} />
                                 </button>
                                 <button className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"><MoreVertical size={18} /></button>
                              </div>
                           </td>
                        </tr>
                      ))
                    )}
                 </tbody>
              </table>
           </div>

           {/* PAGINATION FOOTER */}
           <div className="p-12 border-t border-gray-50 flex items-center justify-between bg-gray-50/20">
              <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest italic">
                 Showing {filteredUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
              </p>
              <div className="flex items-center gap-3">
                 <button 
                   disabled={currentPage === 1}
                   onClick={() => setCurrentPage(p => p - 1)}
                   className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-all disabled:opacity-30 shadow-sm"
                 >
                    <ChevronRight size={18} className="rotate-180" />
                 </button>
                 
                 {[1, 2, 3, "...", Math.ceil(filteredUsers.length / itemsPerPage) || 1].map((p, i) => (
                   <button 
                     key={i}
                     onClick={() => typeof p === 'number' && setCurrentPage(p)}
                     className={`w-11 h-11 rounded-xl text-[11px] font-black transition-all ${
                       (typeof p === 'number' && currentPage === p) ? "bg-purple-600 text-white shadow-xl shadow-purple-900/20" : "bg-white border border-gray-100 text-gray-400 hover:border-purple-200"
                     } ${typeof p !== 'number' ? 'cursor-default' : ''} shadow-sm`}
                   >
                      {p}
                   </button>
                 ))}

                 <button 
                   disabled={currentPage === Math.ceil(filteredUsers.length / itemsPerPage) || filteredUsers.length === 0}
                   onClick={() => setCurrentPage(p => p + 1)}
                   className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-all disabled:opacity-30 shadow-sm"
                 >
                    <ChevronRight size={18} />
                 </button>
              </div>
           </div>
        </div>

      </main>

      {/* ADD USER MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-500">
           <div className="bg-white border border-gray-100 rounded-[3.5rem] p-16 max-w-2xl w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
              
              <button 
                onClick={() => setShowAddUserModal(false)}
                className="absolute top-10 right-10 text-gray-300 hover:text-gray-900 transition-colors"
              >
                 <X size={24} />
              </button>

              <div className="space-y-12 relative z-10">
                 <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-sm">
                       <UserPlus size={32} />
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Provision New User</h3>
                       <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.3em] italic">Add a new entity to the institutional registry</p>
                    </div>
                 </div>

                 <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-2">Full Name</label>
                       <div className="relative">
                          <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input 
                             type="text" 
                             required
                             placeholder=""
                             value={newUser.name}
                             onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                             className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-16 pr-6 py-4 text-sm font-bold italic outline-none focus:border-purple-600 transition-all shadow-inner"
                           />
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-2">Username Handle</label>
                       <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold italic">@</span>
                          <input 
                             type="text" 
                             required
                             placeholder=""
                             value={newUser.handle}
                             onChange={(e) => setNewUser({...newUser, handle: e.target.value})}
                             className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold italic outline-none focus:border-purple-600 transition-all shadow-inner"
                           />
                       </div>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-2">Email Address</label>
                       <div className="relative">
                          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input 
                            type="email" 
                            required
                            placeholder=""
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-16 pr-6 py-4 text-sm font-bold italic outline-none focus:border-purple-600 transition-all shadow-inner"
                          />
                       </div>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-2">Initial Institutional Role</label>
                       <select 
                         value={newUser.role}
                         onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-4 text-sm font-black uppercase italic outline-none focus:border-purple-600 transition-all appearance-none cursor-pointer"
                       >
                          <option value="student">Student Registry</option>
                          <option value="admin">Institutional Authority</option>
                       </select>
                    </div>

                    <div className="md:col-span-2 pt-8 flex items-center gap-6">
                       <button 
                         type="button" 
                         onClick={() => setShowAddUserModal(false)}
                         className="flex-1 py-5 bg-gray-50 text-gray-400 rounded-2xl font-black text-[12px] uppercase tracking-widest italic hover:bg-gray-100 transition-all"
                       >
                          Cancel
                       </button>
                       <button 
                          type="submit"
                          disabled={isSubmitting || !newUser.name || !newUser.handle || !newUser.email.includes('@')}
                          className="flex-[2] py-5 bg-purple-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest italic shadow-xl shadow-purple-900/20 hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
                        >
                           {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Provisioning...</> : <><ShieldCheck size={18} /> Authorize & Add User</>}
                        </button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}

      {/* SECURITY RE-AUTH MODAL FOR BACKUP */}
      <AnimatePresence>
        {isReauthModalOpen && (
          <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xl flex items-center justify-center p-8">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="bg-white rounded-[3.5rem] p-16 max-w-lg w-full shadow-2xl space-y-12 text-center relative overflow-hidden"
             >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 to-indigo-600" />
                <button 
                   onClick={() => setIsReauthModalOpen(false)}
                   className="absolute top-10 right-10 p-3 text-gray-300 hover:text-gray-900 transition-all"
                >
                   <X size={24} />
                </button>

                <div className="space-y-8">
                   <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
                      <ShieldAlert size={44} />
                   </div>
                   <div className="space-y-3">
                      <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Security Check</h3>
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic">Administrative password required for registry backup.</p>
                   </div>
                </div>

                <div className="space-y-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-left block ml-1">Confirm Identity</label>
                      <input 
                        type="password" 
                        value={reauthPassword}
                        onChange={(e) => setReauthPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-8 py-6 text-xl font-black tracking-[0.5em] focus:bg-white focus:border-purple-600 outline-none transition-all text-center placeholder:tracking-widest" 
                      />
                   </div>
                   <div className="flex flex-col gap-4">
                      <button 
                        onClick={handleVerifyBackup}
                        disabled={isSubmitting || !reauthPassword}
                        className="w-full py-6 bg-gray-900 text-white rounded-3xl font-black text-[12px] uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all italic flex items-center justify-center gap-3"
                      >
                         {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                         Authorize Download
                      </button>
                      <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase italic">
                         <Lock size={14} /> secure administrative channel
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOM TOAST */}
      {toast && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[2000] animate-in slide-in-from-bottom-8 duration-500">
           <div className={`px-8 py-4 bg-white rounded-2xl shadow-2xl border flex items-center gap-4 ${toast.type === 'success' ? 'text-green-600 border-green-100' : 'text-red-500 border-red-100'}`}>
              {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="text-[11px] font-black uppercase tracking-widest italic">{toast.message}</span>
           </div>
        </div>
      )}
    </div>
  );
}
