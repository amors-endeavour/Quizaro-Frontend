"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-gray-900 selection:bg-blue-100 selection:text-blue-600">
      <Navbar />

      {/* HERO */}
      <section className="py-32 px-10 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter italic">Contact Support</h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-400 font-bold leading-relaxed uppercase tracking-wider">
          Forensic support and technical assistance. Our infrastructure team is available for clinical resolution of all inquiries.
        </p>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-24 px-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
        {/* CONTACT INFO */}
        <div className="space-y-12">
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-600 mb-8">Access Vectors</h2>
            <div className="space-y-8">
              <ContactInfoItem icon={<Mail className="text-blue-600" />} label="Digital Correspondence" value="support@quizaro.com" />
              <ContactInfoItem icon={<Phone className="text-blue-600" />} label="Voice Interface" value="+91 98765 43210" />
              <ContactInfoItem icon={<MapPin className="text-blue-600" />} label="Geospatial Node" value="HQ, India" />
            </div>
          </div>

          <div className="p-10 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm">
            <p className="text-gray-400 font-bold text-sm leading-relaxed italic">
              Standard response latency: &lt; 24 institutional hours. Our telemetry monitors all incoming packets for prioritized resolution.
            </p>
          </div>
        </div>

        {/* CONTACT FORM */}
        {submitted ? (
          <div className="bg-white border border-gray-100 rounded-[3rem] p-16 text-center shadow-2xl shadow-blue-900/5 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-sm">
               <Send size={32} />
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight italic">Message Codified</h3>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-10 leading-relaxed">Synchronization complete. Await protocol response.</p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: "", email: "", message: "" });
              }}
              className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition active:scale-95 shadow-xl shadow-blue-900/10"
            >
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-[3rem] p-12 lg:p-16 shadow-2xl shadow-blue-900/5">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 mb-10">Interface Message</h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Entity Identity</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-blue-400 focus:bg-white text-gray-900 font-bold placeholder:text-gray-300 transition-all text-sm shadow-inner"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Access Identity (Email)</label>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-blue-400 focus:bg-white text-gray-900 font-bold placeholder:text-gray-300 transition-all text-sm shadow-inner"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Message Payload</label>
                <textarea
                  placeholder="Inquiry Description"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-blue-400 focus:bg-white text-gray-900 font-bold placeholder:text-gray-300 transition-all text-sm shadow-inner resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-4 bg-blue-600 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition active:scale-95 disabled:opacity-50 shadow-xl shadow-blue-900/10 mt-4"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Codify & Send <Send size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </section>

      {/* CTA */}
      <section className="text-center py-32 px-10 max-w-4xl mx-auto">
        <h2 className="text-4xl font-black mb-8 tracking-tight italic">
          Join the Intelligence Grid
        </h2>
        <p className="mb-12 text-gray-400 font-bold uppercase tracking-widest text-sm">
          Join thousands of students already preparing with institutional precision.
        </p>
        <Link
          href="/register"
          className="inline-block bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-900/10 hover:bg-blue-700 transition active:scale-95"
        >
          Initialize Registry
        </Link>
      </section>
    </div>
  );
}

function ContactInfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-6 group">
      <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-black text-gray-900 tracking-tight italic">{value}</p>
      </div>
    </div>
  );
}
