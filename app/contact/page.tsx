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
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      {/* HERO */}
      <section className="py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-400">
          Have questions or need support? Our team is here to help you.
        </p>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        {/* CONTACT INFO */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>

          <div className="space-y-6 text-gray-300">
            <div className="flex items-center gap-4">
              <Mail className="text-purple-400" />
              <span>support@quizaro.com</span>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="text-purple-400" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="text-purple-400" />
              <span>India</span>
            </div>
          </div>

          <p className="mt-8 text-gray-400">
            We usually respond within 24 hours. Feel free to reach out anytime.
          </p>
        </div>

        {/* CONTACT FORM */}
        {submitted ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
            <p className="text-gray-400">We&apos;ll get back to you soon.</p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: "", email: "", message: "" });
              }}
              className="mt-4 px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
            >
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6">Send a Message</h3>

            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mb-4 p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
              required
            />

            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full mb-4 p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
              required
            />

            <textarea
              placeholder="Your Message"
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full mb-6 p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 font-medium"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>
          </form>
        )}
      </section>

      {/* CTA */}
      <section className="text-center py-20 px-6">
        <h2 className="text-4xl font-bold mb-6">
          Start Your Preparation Today
        </h2>
        <p className="mb-8 text-lg text-gray-400">
          Join thousands of students already preparing smarter.
        </p>
        <a
          href="/register"
          className="inline-block bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-10 py-4 rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
        >
          Join Quizaro
        </a>
      </section>
    </div>
  );
}
