"use client";

import { useState, useEffect, useMemo } from "react";
import AdminHeader from "@/components/AdminHeader";
import { 
  DollarSign, 
  CheckCircle, 
  Clock, 
  RotateCcw, 
  Search, 
  Calendar, 
  Download, 
  MoreVertical,
  ChevronRight,
  User as UserIcon,
  CreditCard,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Inbox
} from "lucide-react";

interface Transaction {
  id: string;
  hash: string;
  user: string;
  email: string;
  plan: string;
  period: string;
  amount: number; // Stored as number for calculations
  status: 'Successful' | 'Pending' | 'Failed' | 'Refunded';
  date: string;
  time: string;
  avatar: string;
  timestamp: number;
}

const fetcher = (url: string) => API.get(url).then(res => res.data);

import useSWR from "swr";
import API from "@/app/lib/api";

export default function PaymentsPage() {
  const [paymentStatus, setPaymentStatus] = useState("ALL_TRANSACTIONS");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // REAL-TIME DATABASE SYNCHRONIZATION
  const { data: transactions = [], error } = useSWR<Transaction[]>('/admin/payments', fetcher, { 
    refreshInterval: 5000,
    fallbackData: [] // Zero-baseline policy
  });

  // Institutional Metrics Aggregation (Strict Zero-Baseline)
  const stats = useMemo(() => {
    const successful = transactions.filter(t => t.status === 'Successful');
    const totalRevenue = successful.reduce((acc, t) => acc + t.amount, 0);
    const pending = transactions.filter(t => t.status === 'Pending').length;
    const refunded = transactions.filter(t => t.status === 'Refunded').reduce((acc, t) => acc + t.amount, 0);

    return {
      totalRevenue: `₹${totalRevenue.toLocaleString()}`,
      successfulCount: successful.length.toString(),
      pendingCount: pending.toString(),
      refundedAmount: `₹${refunded.toLocaleString()}`
    };
  }, [transactions]);

  const itemsPerPage = 8;

  // Filtering Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      const matchesStatus = paymentStatus === "ALL_TRANSACTIONS" || 
                           txn.status.toUpperCase() === paymentStatus;
      const matchesSearch = txn.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           txn.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [paymentStatus, searchQuery]);

  // Reset pagination on tab change
  useEffect(() => {
    setCurrentPage(1);
  }, [paymentStatus, searchQuery]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      const headers = ["Transaction ID", "User Name", "User Email", "Plan/Item", "Amount", "Status", "Date/Time"];
      const rows = filteredTransactions.map(txn => [
        txn.id, txn.user, txn.email, `${txn.plan} (${txn.period})`,
        txn.amount.toString(), txn.status, `${txn.date} ${txn.time}`
      ]);
      const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Quizaro_Payments_${paymentStatus}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setToast("Transaction report downloaded successfully");
    } finally {
      setIsExporting(false);
    }
  };

  const tabs = [
    { label: "All Transactions", value: "ALL_TRANSACTIONS" },
    { label: "Successful", value: "SUCCESSFUL" },
    { label: "Pending", value: "PENDING" },
    { label: "Failed", value: "FAILED" },
    { label: "Refunded", value: "REFUNDED" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <AdminHeader title="Payments" path={[{ label: "Home" }, { label: "Payments" }]} />

      <main className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
        
        {/* HEADER SECTION */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl shadow-sm border border-purple-100">
                <CreditCard size={24} />
             </div>
             <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Payments</h2>
          </div>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] italic ml-14">Track and manage all platform transactions.</p>
        </div>

        {/* SUMMARY STATISTICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Total Revenue", value: stats.totalRevenue, icon: <DollarSign size={24} />, color: "purple" },
            { label: "Successful Payments", value: stats.successfulCount, icon: <CheckCircle size={24} />, color: "green" },
            { label: "Pending Payments", value: stats.pendingCount, icon: <Clock size={24} />, color: "orange" },
            { label: "Refunded Amount", value: stats.refundedAmount, icon: <RotateCcw size={24} />, color: "red" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col gap-6 group hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  stat.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                  stat.color === 'green' ? 'bg-green-50 text-green-600' :
                  stat.color === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                }`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                   <h3 className="text-2xl font-black text-gray-900 leading-none italic">{stat.value}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest italic">Live Database Stream</span>
              </div>
            </div>
          ))}
        </div>

        {/* TRANSACTIONS FILTER & NAVIGATION */}
        <div className="space-y-8">
           <div className="flex items-center gap-10 border-b border-gray-100 overflow-x-auto no-scrollbar relative">
              {tabs.map((tab) => (
                <button 
                  key={tab.value}
                  onClick={() => setPaymentStatus(tab.value)}
                  className={`relative pb-4 text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all italic ${
                    paymentStatus === tab.value ? "text-purple-600" : "text-gray-300 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                  {paymentStatus === tab.value && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 rounded-full animate-in slide-in-from-left-4 duration-300" />
                  )}
                </button>
              ))}
           </div>

           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4 flex-1 max-w-2xl">
                 <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by ID, Name or Email..." 
                      className="w-full bg-white border border-gray-100 rounded-xl pl-12 pr-4 py-4 text-sm focus:border-purple-600 outline-none transition-all placeholder:text-gray-300 font-bold italic"
                    />
                 </div>
                 <div className="flex items-center gap-3 px-6 py-4 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-500 shadow-sm cursor-pointer hover:border-purple-200 transition-all">
                    <Calendar size={18} className="text-gray-400" />
                    Last 30 Days
                 </div>
              </div>
              <button 
                disabled={isExporting}
                onClick={handleExport}
                className="px-8 py-4 bg-white border border-gray-100 text-purple-600 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-sm hover:bg-purple-50 transition-all border-purple-100 disabled:opacity-50"
              >
                 {isExporting ? <><Loader2 size={18} className="animate-spin" /> Exporting...</> : <><Download size={18} /> Export</>}
              </button>
           </div>
        </div>

        {/* DATA TABLE SECTION */}
        <section className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden relative min-h-[500px] flex flex-col">
          {filteredTransactions.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Transaction</th>
                      <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">User</th>
                      <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Plan / Item</th>
                      <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Amount</th>
                      <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Status</th>
                      <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Date</th>
                      <th className="px-10 py-8 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedData.map((txn) => (
                      <tr key={txn.id} className="group hover:bg-gray-50 transition-all duration-500 cursor-pointer">
                        <td className="px-10 py-8">
                           <div className="space-y-1">
                              <p className="text-sm font-black text-gray-900 uppercase tracking-tighter italic leading-none">{txn.id}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">{txn.hash}</p>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-xs italic border border-purple-100">
                                 {txn.avatar}
                              </div>
                              <div className="space-y-1">
                                 <p className="text-sm font-black text-gray-900 uppercase tracking-tighter italic leading-none">{txn.user}</p>
                                 <p className="text-[10px] text-gray-400 font-bold italic leading-none lowercase">{txn.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="space-y-1">
                              <p className="text-sm font-black text-gray-900 uppercase tracking-tighter italic leading-none">{txn.plan}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">{txn.period}</p>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <span className="text-sm font-black text-gray-900 italic">₹{txn.amount.toLocaleString()}</span>
                        </td>
                        <td className="px-10 py-8">
                           <span className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                             txn.status === 'Successful' ? "bg-green-50 text-green-600 border-green-100" :
                             txn.status === 'Pending' ? "bg-orange-50 text-orange-600 border-orange-100" :
                             txn.status === 'Failed' ? "bg-red-50 text-red-500 border-red-100" : "bg-gray-50 text-gray-400 border-gray-100"
                           }`}>
                              {txn.status}
                           </span>
                        </td>
                        <td className="px-10 py-8">
                           <div className="space-y-1">
                              <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest italic leading-none">{txn.date}</p>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic leading-none">{txn.time}</p>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <button className="p-2.5 text-gray-300 hover:text-gray-900 transition-colors"><MoreVertical size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="p-10 border-t border-gray-50 flex items-center justify-between mt-auto">
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
                    Showing {Math.min(filteredTransactions.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredTransactions.length, currentPage * itemsPerPage)} of {filteredTransactions.length} transactions
                 </p>
                 <div className="flex items-center gap-2">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                      className="p-2.5 bg-gray-50 text-gray-300 hover:text-gray-900 rounded-xl transition-all disabled:opacity-30"
                    >
                      <ChevronRight size={16} className="rotate-180" />
                    </button>
                    {Array.from({ length: Math.ceil(filteredTransactions.length / itemsPerPage) }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === Math.ceil(filteredTransactions.length / itemsPerPage) || Math.abs(p - currentPage) <= 1)
                      .map((p, index, array) => (
                        <div key={p} className="flex items-center gap-2">
                          {index > 0 && array[index - 1] !== p - 1 && <span className="text-gray-300 px-1">...</span>}
                          <button 
                            onClick={() => setCurrentPage(p)}
                            className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all ${
                              currentPage === p ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                            }`}
                          >
                            {p}
                          </button>
                        </div>
                      ))}
                    <button 
                      disabled={currentPage === Math.ceil(filteredTransactions.length / itemsPerPage)}
                      onClick={() => setCurrentPage(p => p + 1)}
                      className="p-2.5 bg-gray-50 text-gray-300 hover:text-gray-900 rounded-xl transition-all disabled:opacity-30"
                    >
                      <ChevronRight size={16} />
                    </button>
                 </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6">
               <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                  <Inbox size={48} />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">No transactions found</h3>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic">Try adjusting your filters or search query.</p>
               </div>
               <button 
                onClick={() => { setPaymentStatus("ALL_TRANSACTIONS"); setSearchQuery(""); }}
                className="px-8 py-3 bg-purple-50 text-purple-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-100 transition-all"
               >
                Reset All Filters
               </button>
            </div>
          )}
        </section>

      </main>

      {/* CUSTOM TOAST */}
      {toast && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[2000] animate-in slide-in-from-bottom-8 duration-500">
           <div className="px-8 py-4 bg-white rounded-2xl shadow-2xl border border-purple-100 flex items-center gap-4 text-purple-600">
              <CheckCircle2 size={20} />
              <span className="text-[11px] font-black uppercase tracking-widest italic">{toast}</span>
           </div>
        </div>
      )}
    </div>
  );
}
