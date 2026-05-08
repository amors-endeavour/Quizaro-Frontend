"use client";

import { useState, useEffect } from "react";
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
  CheckCircle2
} from "lucide-react";

const transactions = [
  { id: "#TXN-000124", hash: "ch_3N8...a1B2", user: "Aarav Mehta", email: "aarav@gmail.com", plan: "Premium Plan", period: "Monthly", amount: "$49.00", status: "Successful", date: "May 31, 2025", time: "10:30 AM", avatar: "AM" },
  { id: "#TXN-000123", hash: "ch_3N7...Z9Y8", user: "Priya Sharma", email: "priya@gmail.com", plan: "Premium Plan", period: "Monthly", amount: "$49.00", status: "Successful", date: "May 31, 2025", time: "09:15 AM", avatar: "PS" },
  { id: "#TXN-000122", hash: "ch_3N6...X7W6", user: "Rohan Verma", email: "rohan@gmail.com", plan: "Basic Plan", period: "Monthly", amount: "$29.00", status: "Pending", date: "May 31, 2025", time: "08:45 AM", avatar: "RV" },
  { id: "#TXN-000121", hash: "ch_3N5...V5U4", user: "Sneha Iyer", email: "sneha@gmail.com", plan: "Premium Plan", period: "Yearly", amount: "$490.00", status: "Successful", date: "May 30, 2025", time: "06:20 PM", avatar: "SI" },
  { id: "#TXN-000120", hash: "ch_3N4...T3S2", user: "Vikram Singh", email: "vikram@gmail.com", plan: "Basic Plan", period: "Monthly", amount: "$29.00", status: "Failed", date: "May 30, 2025", time: "04:10 PM", avatar: "VS" },
  { id: "#TXN-000119", hash: "ch_3N3...R2Q1", user: "Neha Kapoor", email: "neha@gmail.com", plan: "Premium Plan", period: "Monthly", amount: "$49.00", status: "Successful", date: "May 29, 2025", time: "02:05 PM", avatar: "NK" },
  { id: "#TXN-000118", hash: "ch_3N2...P100", user: "Dev Patel", email: "dev@gmail.com", plan: "Premium Plan", period: "Yearly", amount: "$490.00", status: "Refunded", date: "May 29, 2025", time: "11:30 AM", avatar: "DP" },
];

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("All Transactions");
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const filteredData = transactions.filter(txn => 
        activeTab === "All Transactions" ? true : txn.status === activeTab
      );

      // Data Mapping for CSV
      const headers = ["Transaction ID", "User Name", "User Email", "Plan/Item", "Amount", "Status", "Date/Time"];
      const rows = filteredData.map(txn => [
        txn.id,
        txn.user,
        txn.email,
        `${txn.plan} (${txn.period})`,
        txn.amount.replace('$', ''),
        txn.status,
        `${txn.date} ${txn.time}`
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(e => e.join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `Quizaro_Transactions_${activeTab.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToast("Transaction report downloaded successfully");
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

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
            { label: "Total Revenue", value: "$12,540.00", trend: "+ 12.5%", icon: <DollarSign size={24} />, color: "purple" },
            { label: "Successful Payments", value: "128", trend: "+ 8.2%", icon: <CheckCircle size={24} />, color: "green" },
            { label: "Pending Payments", value: "7", trend: "- 2.1%", icon: <Clock size={24} />, color: "orange" },
            { label: "Refunded Amount", value: "$320.00", trend: "- 15.3%", icon: <RotateCcw size={24} />, color: "red" },
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
                   <h3 className="text-2xl font-black text-gray-900 leading-none">{stat.value}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${
                  stat.trend.startsWith('+') ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50"
                }`}>
                   {stat.trend}
                </span>
                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest italic">from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* TRANSACTIONS FILTER & NAVIGATION */}
        <div className="space-y-8">
           <div className="flex items-center gap-10 border-b border-gray-100 overflow-x-auto no-scrollbar">
              {["All Transactions", "Successful", "Pending", "Failed", "Refunded"].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-4 italic ${
                    activeTab === tab ? "border-purple-600 text-purple-600" : "border-transparent text-gray-300 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
           </div>

           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4 flex-1 max-w-2xl">
                 <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search transactions..." 
                      className="w-full bg-white border border-gray-100 rounded-xl pl-12 pr-4 py-4 text-sm focus:border-purple-600 outline-none transition-all placeholder:text-gray-300"
                    />
                 </div>
                 <div className="flex items-center gap-3 px-6 py-4 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-500 shadow-sm cursor-pointer hover:border-purple-200 transition-all">
                    <Calendar size={18} className="text-gray-400" />
                    May 1, 2025 - May 31, 2025
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
        <section className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden relative">
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
                {transactions
                  .filter(txn => activeTab === "All Transactions" ? true : txn.status === activeTab)
                  .map((txn) => (
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
                       <span className="text-sm font-black text-gray-900 italic">{txn.amount}</span>
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
          <div className="p-10 border-t border-gray-50 flex items-center justify-between">
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Showing 1 to 7 of 128 transactions</p>
             <div className="flex items-center gap-2">
                <button className="p-2.5 bg-gray-50 text-gray-300 hover:text-gray-900 rounded-xl transition-all"><ChevronRight size={16} className="rotate-180" /></button>
                <button className="w-9 h-9 bg-purple-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-purple-900/20">1</button>
                <button className="w-9 h-9 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-black hover:bg-gray-100">2</button>
                <button className="w-9 h-9 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-black hover:bg-gray-100">3</button>
                <span className="text-gray-300 px-2">...</span>
                <button className="w-9 h-9 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-black hover:bg-gray-100">12</button>
                <button className="p-2.5 bg-gray-50 text-gray-300 hover:text-gray-900 rounded-xl transition-all"><ChevronRight size={16} /></button>
             </div>
          </div>
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
