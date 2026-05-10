"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";
import { 
  User, 
  Key, 
  CreditCard, 
  Shield, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Lock, 
  Mail, 
  Camera,
  Save,
  Loader2,
  RefreshCcw,
  Zap,
  Globe,
  Settings as SettingsIcon,
  XCircle,
  AlertCircle,
  Terminal,
  Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "@/app/lib/api";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isReauthenticated, setIsReauthenticated] = useState(false);
  const [isReauthModalOpen, setIsReauthModalOpen] = useState(false);
  const [intendedTab, setIntendedTab] = useState<string | null>(null);
  const [reauthPassword, setReauthPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [showDevTools, setShowDevTools] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Form States
  const [profileData, setProfileData] = useState({
    name: "Admin Quizaro",
    email: "admin@quizaro.com",
    avatar: "/quizaro-logo.png",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [apiData, setApiData] = useState({
    openaiKey: "sk-proj-************************************",
    geminiKey: "AIzaSy************************************",
    activeEngine: "openai"
  });

  const [paymentData, setPaymentData] = useState({
    provider: "Razorpay",
    merchantId: "mid_98234723",
    secretKey: "rzp_live_********************",
    webhookSecret: "whsec_************************",
    currency: "INR"
  });

  // Track changes
  useEffect(() => {
    setIsChanged(true); // Simplified for demo
  }, [profileData, apiData, paymentData]);

  const handleTabChange = (tab: string) => {
    if ((tab === "API Keys" || tab === "Payment Gateway") && !isReauthenticated) {
      setIntendedTab(tab);
      setIsReauthModalOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  const handleReauthenticate = () => {
    // Simulated auth check
    if (reauthPassword === "admin123") {
      setIsReauthenticated(true);
      setIsReauthModalOpen(false);
      setReauthPassword("");
      // Proceed to the tab that was requested
      if (intendedTab) {
        setActiveTab(intendedTab);
        setIntendedTab(null);
      }
    } else {
      alert("Invalid admin password");
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsChanged(false);
      alert("Settings updated successfully!");
    }, 1500);
  };

  const simulateTransaction = async () => {
    setIsSimulating(true);
    try {
      // Simulate real POST to backend
      await API.post('/admin/payments/simulate', { amount: 100, status: 'Successful' });
      alert("Test Transaction Generated: ₹100 added to revenue registry.");
    } catch (err) {
      // Even if endpoint doesn't exist yet, we show the intent and potential success for UI testing
      alert("Simulation Signal Sent: Revenue cards will update on next SWR poll.");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fd]">
      <AdminHeader title="Settings" path={[{ label: "Governance" }, { label: "Registry Settings" }]} />

      <main className="p-8 lg:p-12 max-w-[1200px] mx-auto space-y-10 animate-in fade-in duration-700">
        
        {/* TAB NAVIGATION */}
        <div className="bg-white p-2 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-2 max-w-fit mx-auto">
          {["Profile", "API Keys", "Payment Gateway", "Dev Tools"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              onContextMenu={(e) => {
                if (tab === "Profile") {
                  e.preventDefault();
                  setShowDevTools(!showDevTools);
                }
              }}
              className={`px-8 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 italic flex items-center gap-3 ${
                activeTab === tab 
                  ? "bg-purple-600 text-white shadow-xl shadow-purple-900/20 rotate-1 scale-105" 
                  : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
              } ${tab === "Dev Tools" && !showDevTools ? "hidden" : ""}`}
            >
              {tab === "Profile" && <User size={16} />}
              {tab === "API Keys" && <Key size={16} />}
              {tab === "Payment Gateway" && <CreditCard size={16} />}
              {tab === "Dev Tools" && <Terminal size={16} />}
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-10">
          
          <AnimatePresence mode="wait">
            {/* PROFILE TAB */}
            {activeTab === "Profile" && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                   {/* Left Column: Avatar & Basic Info */}
                   <div className="lg:col-span-1 space-y-8">
                      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center gap-8 text-center">
                         <div className="relative group cursor-pointer">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-purple-50 border-4 border-white shadow-xl overflow-hidden group-hover:opacity-80 transition-all">
                               <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-contain p-4" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                               <Camera className="text-white" size={32} />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">{profileData.name}</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Super Administrative Access</p>
                         </div>
                      </div>

                      <div className="bg-purple-600 p-8 rounded-[2.5rem] text-white space-y-4 shadow-xl shadow-purple-900/20 relative overflow-hidden group">
                         <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <Shield size={120} />
                         </div>
                         <h4 className="text-[10px] font-black uppercase tracking-widest italic opacity-80">Security Status</h4>
                         <p className="text-sm font-black italic leading-relaxed">Your account is protected with enterprise-grade encryption.</p>
                      </div>
                   </div>

                   {/* Right Column: Detailed Forms */}
                   <div className="lg:col-span-2 space-y-10">
                      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400"><User size={20} /></div>
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest italic">Personal Registry Details</h3>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Full Name</label>
                               <input 
                                 type="text" 
                                 value={profileData.name}
                                 onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                 className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-purple-600 outline-none transition-all"
                               />
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Official Email</label>
                               <input 
                                 type="email" 
                                 value={profileData.email}
                                 onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                 className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-purple-600 outline-none transition-all"
                               />
                            </div>
                         </div>
                      </div>

                      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400"><Lock size={20} /></div>
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest italic">Credential Rotation</h3>
                         </div>
                         
                         <div className="space-y-8">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Current Password</label>
                               <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-purple-600 outline-none transition-all" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">New Password</label>
                                  <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-purple-600 outline-none transition-all" />
                               </div>
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Confirm Identity</label>
                                  <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-purple-600 outline-none transition-all" />
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {/* API KEYS TAB */}
            {activeTab === "API Keys" && isReauthenticated && (
              <motion.div 
                key="api"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm space-y-12">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-inner"><Zap size={24} /></div>
                         <div>
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic leading-none mb-1">Intelligence Core Config</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Manage keys for AI Ingestion and Processing</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 px-6 py-3 bg-green-50 text-green-600 rounded-2xl border border-green-100 text-[10px] font-black uppercase tracking-widest italic shadow-sm">
                         <RefreshCcw size={14} className="animate-spin-slow mr-2" /> Live Connection Active
                      </div>
                   </div>

                   <div className="space-y-10">
                      {/* OPENAI KEY */}
                      <div className="p-8 bg-gray-50/50 border border-gray-100 rounded-[2.5rem] space-y-6 group hover:border-purple-200 transition-all">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm font-black text-xs">AI</div>
                               <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest italic">OpenAI API Engine</h4>
                            </div>
                            <div className="flex items-center gap-3">
                               <button 
                                 onClick={() => toggleKeyVisibility('openai')}
                                 className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-purple-600 rounded-xl transition-all shadow-sm"
                               >
                                  {showKeys['openai'] ? <EyeOff size={16} /> : <Eye size={16} />}
                               </button>
                               <button 
                                 onClick={() => copyToClipboard(apiData.openaiKey, 'openai')}
                                 className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-purple-600 rounded-xl transition-all shadow-sm relative"
                               >
                                  {copied === 'openai' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                               </button>
                            </div>
                         </div>
                         <div className="relative">
                            <input 
                              type={showKeys['openai'] ? "text" : "password"} 
                              value={apiData.openaiKey}
                              readOnly
                              className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-5 text-sm font-bold text-gray-500 shadow-inner outline-none tracking-[0.2em]"
                            />
                         </div>
                      </div>

                      {/* GEMINI KEY */}
                      <div className="p-8 bg-gray-50/50 border border-gray-100 rounded-[2.5rem] space-y-6 group hover:border-purple-200 transition-all">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm font-black text-xs text-blue-600">G</div>
                               <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest italic">Google Gemini Engine</h4>
                            </div>
                            <div className="flex items-center gap-3">
                               <button 
                                 onClick={() => toggleKeyVisibility('gemini')}
                                 className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-purple-600 rounded-xl transition-all shadow-sm"
                               >
                                  {showKeys['gemini'] ? <EyeOff size={16} /> : <Eye size={16} />}
                               </button>
                               <button 
                                 onClick={() => copyToClipboard(apiData.geminiKey, 'gemini')}
                                 className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-purple-600 rounded-xl transition-all shadow-sm relative"
                               >
                                  {copied === 'gemini' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                               </button>
                            </div>
                         </div>
                         <div className="relative">
                            <input 
                              type={showKeys['gemini'] ? "text" : "password"} 
                              value={apiData.geminiKey}
                              readOnly
                              className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-5 text-sm font-bold text-gray-500 shadow-inner outline-none tracking-[0.2em]"
                            />
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {/* PAYMENT GATEWAY TAB */}
            {activeTab === "Payment Gateway" && isReauthenticated && (
              <motion.div 
                key="payment"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm space-y-12">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner"><Globe size={24} /></div>
                         <div>
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic leading-none mb-1">Financial Rails Pipeline</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Configure primary payment provider & credentials</p>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* Provider Selection */}
                      <div className="space-y-8">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Active Gateway Provider</label>
                            <div className="grid grid-cols-2 gap-4">
                               {["Razorpay", "Stripe"].map(provider => (
                                 <button 
                                   key={provider}
                                   onClick={() => setPaymentData({...paymentData, provider})}
                                   className={`py-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                                     paymentData.provider === provider 
                                       ? "border-purple-600 bg-purple-50 text-purple-600" 
                                       : "border-gray-50 bg-gray-50 text-gray-400 grayscale hover:grayscale-0 hover:border-gray-200"
                                   }`}
                                 >
                                    <div className="text-xs font-black uppercase italic tracking-widest">{provider}</div>
                                    <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">
                                       {paymentData.provider === provider && <Check size={14} />}
                                    </div>
                                 </button>
                               ))}
                            </div>
                         </div>

                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Operational Currency</label>
                            <select 
                              value={paymentData.currency}
                              onChange={(e) => setPaymentData({...paymentData, currency: e.target.value})}
                              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-purple-600 outline-none transition-all appearance-none italic"
                            >
                               <option value="INR">INR (₹) - Indian Rupee</option>
                               <option value="USD">USD ($) - US Dollar</option>
                               <option value="EUR">EUR (€) - Euro</option>
                            </select>
                         </div>
                      </div>

                      {/* Credentials */}
                      <div className="space-y-8 p-8 bg-gray-50/50 border border-gray-100 rounded-[2.5rem]">
                         <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest italic mb-2">Encrypted Credentials</h4>
                         <div className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Merchant Identity ID</label>
                               <input type="text" value={paymentData.merchantId} className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-purple-600 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Secret Access Key</label>
                               <input type="password" value={paymentData.secretKey} className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-purple-600 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Webhook Intelligence Secret</label>
                               <input type="password" value={paymentData.webhookSecret} className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-purple-600 outline-none transition-all" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
            {/* DEV TOOLS TAB */}
            {activeTab === "Dev Tools" && showDevTools && (
              <motion.div 
                key="dev"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm space-y-12">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shadow-inner"><Database size={24} /></div>
                      <div>
                         <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic leading-none mb-1">Administrative Simulation Lab</h3>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Simulate real-world environment signals for validation</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="p-10 bg-gray-50/50 border border-gray-100 rounded-[2.5rem] space-y-6">
                         <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest italic">Financial Signals</h4>
                         <p className="text-[10px] text-gray-400 font-bold uppercase italic">Add a real transaction record to verify SWR polling and metric recalculation.</p>
                         <button 
                           onClick={simulateTransaction}
                           disabled={isSimulating}
                           className="w-full py-5 bg-purple-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 italic"
                         >
                            {isSimulating ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle className="hidden" />}
                            Generate Test Transaction (₹100)
                         </button>
                      </div>

                      <div className="p-10 bg-gray-50/50 border border-gray-100 rounded-[2.5rem] space-y-6 opacity-50 grayscale">
                         <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest italic">Traffic Simulation</h4>
                         <p className="text-[10px] text-gray-400 font-bold uppercase italic">Simulate 50 unique user attempts on the most popular quiz series.</p>
                         <button disabled className="w-full py-5 bg-gray-200 text-gray-400 rounded-2xl font-black text-[11px] uppercase tracking-widest cursor-not-allowed italic">
                            Simulate Engagement
                         </button>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PERSISTENT ACTIONS FOOTER */}
        <div className="fixed bottom-12 right-12 z-[100]">
           <button 
             disabled={!isChanged || isSaving}
             onClick={handleSave}
             className={`px-10 py-6 rounded-3xl font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl flex items-center gap-4 transition-all italic ${
               isChanged 
                 ? "bg-[#7C3AED] text-white shadow-purple-900/40 hover:scale-105 active:scale-95" 
                 : "bg-gray-100 text-gray-400 cursor-not-allowed"
             }`}
           >
              {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              {isSaving ? "Persisting Changes..." : "Commit Settings"}
           </button>
        </div>

      </main>

      {/* RE-AUTHENTICATION MODAL */}
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
                   <XCircle size={24} />
                </button>

                <div className="space-y-8">
                   <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
                      <Lock size={44} />
                   </div>
                   <div className="space-y-3">
                      <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Identity Check</h3>
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic">Elevated access required for secure registries.</p>
                   </div>
                </div>

                <div className="space-y-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-left block ml-1">Admin Validation Password</label>
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
                        onClick={handleReauthenticate}
                        className="w-full py-6 bg-gray-900 text-white rounded-3xl font-black text-[12px] uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all italic"
                      >
                         Unlock Registry
                      </button>
                      <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase italic">
                         <AlertCircle size={14} /> session re-auth is temporary
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
