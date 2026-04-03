// "use client";

// import { Mail, Phone, MapPin } from "lucide-react";

// export default function ContactPage() {
//   return (
//     <div className="min-h-screen bg-gray-50">

//       {/* HERO */}
//       <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24 px-6 text-center">
//         <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
//         <p className="max-w-2xl mx-auto text-lg">
//           Have questions or need support? Our team is here to help you.
//         </p>
//       </section>

//       {/* CONTACT SECTION */}
//       <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

//         {/* CONTACT INFO */}
//         <div>
//           <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>

//           <div className="space-y-6 text-gray-700">

//             <div className="flex items-center gap-4">
//               <Mail className="text-blue-600" />
//               <span>support@studyweb.com</span>
//             </div>

//             <div className="flex items-center gap-4">
//               <Phone className="text-blue-600" />
//               <span>+91 98765 43210</span>
//             </div>

//             <div className="flex items-center gap-4">
//               <MapPin className="text-blue-600" />
//               <span>India</span>
//             </div>

//           </div>

//           <p className="mt-8 text-gray-600">
//             We usually respond within 24 hours. Feel free to reach out anytime.
//           </p>
//         </div>

//         {/* CONTACT FORM */}
//         <form className="bg-white shadow-lg rounded-xl p-8">

//           <h3 className="text-2xl font-bold mb-6">Send a Message</h3>

//           <input
//             type="text"
//             placeholder="Your Name"
//             className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           <input
//             type="email"
//             placeholder="Your Email"
//             className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           <textarea
//             placeholder="Your Message"
//             rows={5}
//             className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
//           >
//             Send Message
//           </button>

//         </form>
//       </section>

//       {/* CTA */}
//       <section className="bg-blue-600 text-white text-center py-20 px-6">
//         <h2 className="text-4xl font-bold mb-6">
//           Start Your Preparation Today
//         </h2>

//         <p className="mb-8 text-lg">
//           Join thousands of students already preparing smarter.
//         </p>

//         <button className="bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold shadow-lg hover:scale-105 transition">
//           Join StudyWeb
//         </button>
//       </section>

//     </div>
//   );
// }


"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  CheckCircle,
  Sparkles,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  ChevronDown,
  Zap,
  HeadphonesIcon,
  BookOpen,
  AlertCircle,
} from "lucide-react";
// import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  sub: string;
  href?: string;
  color: string;
}

interface FaqItemProps {
  question: string;
  answer: string;
}

interface CategoryProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white font-sans overflow-x-hidden">
      <HeroSection />
      <ContactCardsSection />
      <MainSection />
      <SupportCategoriesSection />
      <FaqSection />
      <CtaSection />
      <Footer />
      <GlobalStyles />
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative pt-36 pb-20 px-6 overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0">
        <div className="absolute w-[700px] h-[700px] bg-[radial-gradient(circle,_#6d28d940_0%,_transparent_70%)] rounded-full top-[-150px] left-1/2 -translate-x-1/2" />
        <div className="absolute w-[350px] h-[350px] bg-[radial-gradient(circle,_#0891b225_0%,_transparent_70%)] rounded-full bottom-0 right-10" />
      </div>
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Orbs */}
      <div className="absolute top-32 left-16 w-3 h-3 bg-cyan-400/60 rounded-full animate-floatA" />
      <div className="absolute top-48 right-24 w-2 h-2 bg-purple-400/60 rounded-full animate-floatB" />
      <div className="absolute bottom-10 left-1/3 w-4 h-4 bg-blue-400/30 rounded-full animate-floatC" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8">
          <Sparkles size={14} className="text-yellow-400" />
          We&apos;re here to help
        </div>

        <h1 className="text-5xl sm:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
          Get in{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
            Touch
          </span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
          Have a question, feedback, or need support? Our team responds within
          24 hours — usually much faster.
        </p>

        {/* Availability badge */}
        <div className="inline-flex items-center gap-2 mt-8 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Support team online · Mon–Sat, 9AM–8PM IST
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CONTACT CARDS
───────────────────────────────────────────── */
function ContactCardsSection() {
  const cards: ContactCardProps[] = [
    {
      icon: <Mail size={22} />,
      title: "Email Support",
      value: "support@quizaro.in",
      sub: "Response within 24 hours",
      href: "mailto:support@quizaro.in",
      color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/20",
    },
    {
      icon: <Phone size={22} />,
      title: "Phone Support",
      value: "+91 98765 43210",
      sub: "Mon–Sat, 9AM–8PM IST",
      href: "tel:+919876543210",
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/20",
    },
    {
      icon: <MapPin size={22} />,
      title: "Our Office",
      value: "New Delhi, India",
      sub: "Connaught Place, 110001",
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/20",
    },
    {
      icon: <Clock size={22} />,
      title: "Working Hours",
      value: "Mon – Sat",
      sub: "9:00 AM – 8:00 PM IST",
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/20",
    },
  ];

  return (
    <section className="py-10 px-6">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c) => (
          <ContactCard key={c.title} {...c} />
        ))}
      </div>
    </section>
  );
}

function ContactCard({ icon, title, value, sub, href, color }: ContactCardProps) {
  const Inner = (
    <div
      className={`group p-6 rounded-2xl bg-gradient-to-br ${color} border hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
    >
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
      <p className="font-bold text-white text-sm mb-1">{value}</p>
      <p className="text-gray-500 text-xs">{sub}</p>
    </div>
  );

  return href ? (
    <a href={href} className="block">
      {Inner}
    </a>
  ) : (
    <div>{Inner}</div>
  );
}

/* ─────────────────────────────────────────────
   MAIN — Info + Form
───────────────────────────────────────────── */
function MainSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-start">
        <LeftInfo />
        <ContactForm />
      </div>
    </section>
  );
}

function LeftInfo() {
  const socials = [
    { Icon: Twitter, label: "Twitter", href: "https://twitter.com" },
    { Icon: Instagram, label: "Instagram", href: "https://instagram.com" },
    { Icon: Youtube, label: "YouTube", href: "https://youtube.com" },
    { Icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  ];

  return (
    <div>
      <SectionLabel text="Contact Us" />
      <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
        We&apos;d Love to <span className="gradient-text">Hear from You</span>
      </h2>
      <p className="text-gray-400 leading-relaxed mb-8 text-base">
        Whether you&apos;re a student with a question, a school looking to
        partner, or just someone with feedback — drop us a message and we&apos;ll
        get back to you quickly.
      </p>

      {/* Response promise */}
      <div className="space-y-4 mb-10">
        {[
          { icon: <CheckCircle size={15} className="text-emerald-400" />, text: "Dedicated support for Pro & Elite members" },
          { icon: <CheckCircle size={15} className="text-emerald-400" />, text: "Average first response time: under 4 hours" },
          { icon: <CheckCircle size={15} className="text-emerald-400" />, text: "Live chat available for urgent exam-day issues" },
          { icon: <CheckCircle size={15} className="text-emerald-400" />, text: "Hindi & English support both available" },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-start gap-3 text-sm text-gray-400">
            <span className="mt-0.5 flex-shrink-0">{icon}</span>
            {text}
          </div>
        ))}
      </div>

      {/* Social links */}
      <div>
        <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">
          Follow us
        </p>
        <div className="flex gap-3">
          {socials.map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 text-gray-500 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition-all"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>

      {/* Map placeholder */}
      <div className="mt-10 relative rounded-2xl overflow-hidden border border-white/[0.07] bg-white/[0.02] h-44 flex items-center justify-center group hover:border-purple-500/30 transition-all">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1e1b4b30_0%,_transparent_80%)]" />
        <div className="text-center relative z-10">
          <MapPin size={28} className="text-purple-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Connaught Place, New Delhi</p>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-purple-400 hover:text-purple-300 mt-1 inline-block transition-colors"
          >
            Open in Google Maps →
          </a>
        </div>
      </div>
    </div>
  );
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="relative p-10 rounded-3xl bg-white/[0.03] border border-emerald-500/30 text-center flex flex-col items-center justify-center min-h-[480px]">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={30} className="text-emerald-400" />
        </div>
        <h3 className="text-2xl font-black text-white mb-3">Message Sent!</h3>
        <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6 leading-relaxed">
          Thanks for reaching out, <strong className="text-white">{form.name}</strong>! We&apos;ll reply to{" "}
          <strong className="text-white">{form.email}</strong> within 24 hours.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", category: "", message: "" }); }}
          className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:bg-white/10 transition"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Ambient glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-3xl blur-2xl" />

      <form
        onSubmit={handleSubmit}
        className="relative bg-[#0a0d25]/80 border border-white/[0.08] rounded-3xl p-8 backdrop-blur-sm space-y-5"
      >
        <div>
          <h3 className="text-xl font-black text-white mb-1">Send a Message</h3>
          <p className="text-gray-600 text-sm">Fill in the form and we&apos;ll be in touch.</p>
        </div>

        {/* Name + Email */}
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            label="Full Name"
            name="name"
            type="text"
            placeholder="Aman Sharma"
            value={form.name}
            onChange={handleChange}
            required
          />
          <FormField
            label="Email Address"
            name="email"
            type="email"
            placeholder="aman@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Category
          </label>
          <div className="relative">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled className="bg-[#0a0d25]">Select a category…</option>
              <option value="technical" className="bg-[#0a0d25]">Technical Issue</option>
              <option value="billing" className="bg-[#0a0d25]">Billing & Payments</option>
              <option value="content" className="bg-[#0a0d25]">Question / Content Error</option>
              <option value="partnership" className="bg-[#0a0d25]">Partnership / Schools</option>
              <option value="feedback" className="bg-[#0a0d25]">General Feedback</option>
              <option value="other" className="bg-[#0a0d25]">Other</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Subject */}
        <FormField
          label="Subject"
          name="subject"
          type="text"
          placeholder="Brief description of your issue"
          value={form.subject}
          onChange={handleChange}
          required
        />

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Message
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Tell us more about your question or issue…"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all resize-none"
          />
          <p className="text-right text-xs text-gray-700">{form.message.length}/1000</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-xl font-bold text-sm shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(99,102,241,0.6)] hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send size={15} />
              Send Message
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-700">
          By submitting, you agree to our{" "}
          <Link href="/privacy" className="text-purple-400 hover:underline">Privacy Policy</Link>
        </p>
      </form>
    </div>
  );
}

function FormField({
  label, name, type, placeholder, value, onChange, required,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUPPORT CATEGORIES
───────────────────────────────────────────── */
function SupportCategoriesSection() {
  const categories: CategoryProps[] = [
    {
      icon: <HeadphonesIcon size={22} />,
      title: "Live Chat Support",
      desc: "Available for Pro & Elite members during working hours for instant help.",
      color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/20",
    },
    {
      icon: <BookOpen size={22} />,
      title: "Help Centre",
      desc: "Browse 100+ articles covering account, tests, billing, and technical issues.",
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/20",
    },
    {
      icon: <MessageSquare size={22} />,
      title: "Community Forum",
      desc: "Ask questions, share strategies, and get answers from 50K+ fellow aspirants.",
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/20",
    },
    {
      icon: <AlertCircle size={22} />,
      title: "Report a Bug",
      desc: "Found something broken? Report it and our engineering team will fix it fast.",
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/20",
    },
  ];

  return (
    <section className="py-20 px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1e1b4b18_0%,_transparent_70%)]" />
      <div className="max-w-6xl mx-auto relative">
        <SectionLabel text="Support Options" />
        <h2 className="section-title mb-4">
          Other Ways We <span className="gradient-text">Can Help</span>
        </h2>
        <p className="section-sub mb-14">
          Not just email — explore all the ways to get the help you need, fast.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((c) => (
            <SupportCard key={c.title} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SupportCard({ icon, title, desc, color }: CategoryProps) {
  return (
    <div className={`group p-6 rounded-2xl bg-gradient-to-br ${color} border hover:scale-[1.02] transition-all duration-300 cursor-pointer`}>
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-white text-sm mb-2">{title}</h3>
      <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FAQ
───────────────────────────────────────────── */
function FaqSection() {
  const faqs: FaqItemProps[] = [
    { question: "How quickly will I get a response?", answer: "Free users receive responses within 24 hours. Pro users within 8 hours. Elite members get priority responses within 2 hours during working hours." },
    { question: "Can I reach support in Hindi?", answer: "Absolutely. Our support team is fully bilingual. Just write to us in Hindi and we'll respond in Hindi." },
    { question: "How do I report an error in a question?", answer: "Use the 'Report Question' button that appears next to every question during a test, or email us at content@quizaro.in with the question ID." },
    { question: "I forgot my password — what do I do?", answer: "Click 'Forgot Password' on the login screen. You'll receive a reset link on your registered email within 2 minutes." },
    { question: "Do you offer support for schools or coaching institutes?", answer: "Yes! We have a dedicated B2B team for institutional partnerships. Email us at partnerships@quizaro.in and we'll set up a call within 48 hours." },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <SectionLabel text="FAQ" />
        <h2 className="section-title mb-12">
          Common <span className="gradient-text">Questions</span>
        </h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <FaqItem key={f.question} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, answer }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
        open
          ? "border-purple-500/40 bg-white/[0.04]"
          : "border-white/[0.07] bg-white/[0.02] hover:border-white/15"
      }`}
    >
      <button
        className="w-full flex items-center justify-between px-6 py-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-sm text-white pr-4">{question}</span>
        <ChevronDown
          size={16}
          className={`text-gray-500 flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-180 text-purple-400" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-gray-400 leading-relaxed">{answer}</div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CTA
───────────────────────────────────────────── */
function CtaSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-purple-950/30 to-blue-950/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#6d28d928_0%,_transparent_70%)]" />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8">
          <Zap size={14} className="text-yellow-400" />
          Start preparing today
        </div>
        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
          Questions Answered. <br />
          <span className="gradient-text">Now Let&apos;s Get You Ready.</span>
        </h2>
        <p className="text-gray-400 text-lg mb-10">
          Join 50,000+ aspirants preparing smarter with Quizaro. Free forever. No card required.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl font-bold text-base shadow-[0_0_50px_rgba(99,102,241,0.5)] hover:scale-105 transition-all duration-300"
          >
            <Zap size={18} />
            Join Quizaro Free
          </Link>
          <Link
            href="/#exams"
            className="inline-flex items-center justify-center px-10 py-4 border border-white/15 rounded-2xl font-semibold text-base hover:bg-white/5 transition-all"
          >
            Browse Exams
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Shared
───────────────────────────────────────────── */
function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex justify-center mb-5">
      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-400 px-4 py-2 rounded-full bg-purple-400/10 border border-purple-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
        {text}
      </span>
    </div>
  );
}

function GlobalStyles() {
  return (
    <style jsx global>{`
      .section-title {
        font-size: clamp(2rem, 5vw, 3.5rem);
        font-weight: 900;
        text-align: center;
        line-height: 1.1;
        color: white;
        margin-bottom: 1.25rem;
      }
      .section-sub {
        text-align: center;
        color: #6b7280;
        max-width: 40rem;
        margin: 0 auto;
        line-height: 1.7;
        font-size: 1rem;
      }
      .gradient-text {
        background: linear-gradient(135deg, #22d3ee, #3b82f6, #a855f7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      @keyframes shimmer {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }
      .animate-shimmer { animation: shimmer 4s linear infinite; }
      @keyframes floatA {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        50% { transform: translateY(-18px) translateX(8px); }
      }
      @keyframes floatB {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(12px); }
      }
      @keyframes floatC {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        33% { transform: translateY(-10px) translateX(-6px); }
        66% { transform: translateY(6px) translateX(10px); }
      }
      .animate-floatA { animation: floatA 5s ease-in-out infinite; }
      .animate-floatB { animation: floatB 7s ease-in-out infinite; }
      .animate-floatC { animation: floatC 9s ease-in-out infinite; }
    `}</style>
  );
}