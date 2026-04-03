// "use client";

// import { useRouter } from "next/navigation";

// export default function HomePage() {
//   const router = useRouter();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">

//       {/* Navbar */}
//       <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
//         <h1 className="text-2xl font-bold text-indigo-600">
//           Study Web
//         </h1>

//         <div className="space-x-4">
//           <button
//             onClick={() => router.push("/login")}
//             className="px-4 py-2 text-indigo-600 font-medium"
//           >
//             Login
//           </button>

//           <button
//             onClick={() => router.push("/register")}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow"
//           >
//             Register
//           </button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="text-center py-20 px-6">
//         <h2 className="text-5xl font-extrabold text-gray-800 mb-6">
//           Crack Your Exams With Confidence 🚀
//         </h2>

//         <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
//           Practice unlimited mock tests, track your performance,
//           get detailed explanations, and improve your rank
//           with our intelligent test platform.
//         </p>

//         <div className="space-x-4">
//           <button
//             onClick={() => router.push("/register")}
//             className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition"
//           >
//             Get Started
//           </button>

//           <button
//             onClick={() => router.push("/dashboard")}
//             className="px-6 py-3 bg-white border border-indigo-600 text-indigo-600 rounded-xl shadow-lg hover:bg-indigo-50 transition"
//           >
//             Go to Dashboard
//           </button>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-16 bg-white px-8">
//         <h3 className="text-3xl font-bold text-center mb-12">
//           Why Choose Study Web?
//         </h3>

//         <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
//           <FeatureCard
//             title="Unlimited Questions"
//             description="Practice unlimited MCQs with correct answers and detailed explanations."
//           />

//           <FeatureCard
//             title="Instant Results"
//             description="See correct and wrong answers immediately after submitting the test."
//           />

//           <FeatureCard
//             title="Live Ranking"
//             description="Compete with others and track your real-time rank on leaderboard."
//           />

//           <FeatureCard
//             title="Performance Analytics"
//             description="Detailed score breakdown and subject-wise improvement insights."
//           />

//           <FeatureCard
//             title="Timer Based Tests"
//             description="Simulate real exam environment with countdown timer."
//           />

//           <FeatureCard
//             title="Secure Authentication"
//             description="Protected login system with JWT authentication."
//           />
//         </div>
//       </section>

//       {/* How It Works */}
//       <section className="py-20 px-8 bg-indigo-50">
//         <h3 className="text-3xl font-bold text-center mb-12">
//           How It Works
//         </h3>

//         <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
//           <Step number="1" text="Create your account" />
//           <Step number="2" text="Start a mock test" />
//           <Step number="3" text="View results & improve" />
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="text-center py-6 bg-white border-t">
//         <p className="text-gray-500">
//           © {new Date().getFullYear()} Study Web. All rights reserved.
//         </p>
//       </footer>
//     </div>
//   );
// }

// /* ---------- Feature Card Component ---------- */

// type FeatureProps = {
//   title: string;
//   description: string;
// };

// function FeatureCard({ title, description }: FeatureProps) {
//   return (
//     <div className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
//       <h4 className="text-xl font-semibold mb-3 text-indigo-600">
//         {title}
//       </h4>
//       <p className="text-gray-600">
//         {description}
//       </p>
//     </div>
//   );
// }

// /* ---------- Step Component ---------- */

// type StepProps = {
//   number: string;
//   text: string;
// };

// function Step({ number, text }: StepProps) {
//   return (
//     <div className="bg-white p-6 rounded-2xl shadow">
//       <div className="text-3xl font-bold text-indigo-600 mb-3">
//         {number}
//       </div>
//       <p className="text-gray-700">{text}</p>
//     </div>
//   );
// }











// "use client";

// import Link from "next/link";

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-gray-100 text-gray-800">

//       {/* 🔵 HERO SECTION */}
//       <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24 px-6 text-center">
//         <h1 className="text-5xl font-bold mb-6">
//           Crack Your Exams with Smart Test Series 🚀
//         </h1>
//         <p className="text-lg max-w-2xl mx-auto mb-8">
//           Practice unlimited MCQ tests, get instant results with explanations,
//           track your performance, and compete with thousands of students.
//         </p>

//         <div className="flex justify-center gap-4">
//           <Link
//             href="/register"
//             className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow hover:scale-105 transition"
//           >
//             Get Started
//           </Link>
//           <Link
//             href="/login"
//             className="bg-black px-6 py-3 rounded-lg font-semibold shadow hover:scale-105 transition"
//           >
//             Login
//           </Link>
//         </div>
//       </section>

//       {/* 🟢 FEATURES SECTION */}
//       <section className="py-20 px-6 max-w-6xl mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-14">
//           Why Choose Our Platform?
//         </h2>

//         <div className="grid md:grid-cols-3 gap-10">
//           <FeatureCard
//             title="Unlimited Questions"
//             desc="Access unlimited MCQs with detailed explanations."
//           />
//           <FeatureCard
//             title="Instant Result Analysis"
//             desc="See correct, wrong answers & explanation instantly."
//           />
//           <FeatureCard
//             title="Live Ranking"
//             desc="Check your position among all test participants."
//           />
//         </div>
//       </section>

//       {/* 🟡 TEST PREVIEW */}
//       <section className="bg-white py-20 px-6">
//         <h2 className="text-3xl font-bold text-center mb-12">
//           Popular Test Series
//         </h2>

//         <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
//           <TestCard title="SSC CGL Mock Series" questions="5000+ Questions" />
//           <TestCard title="Banking PO Test Series" questions="4200+ Questions" />
//           <TestCard title="UPSC Prelims Practice" questions="8000+ Questions" />
//         </div>
//       </section>

//       {/* 🟣 HOW IT WORKS */}
//       <section className="py-20 px-6 max-w-6xl mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-14">
//           How It Works
//         </h2>

//         <div className="grid md:grid-cols-4 gap-8 text-center">
//           <Step number="1" text="Register Account" />
//           <Step number="2" text="Purchase Test Series" />
//           <Step number="3" text="Attempt Test" />
//           <Step number="4" text="Get Rank & Analysis" />
//         </div>
//       </section>

//       {/* 🔴 CTA */}
//       <section className="bg-blue-600 text-white text-center py-16 px-6">
//         <h2 className="text-3xl font-bold mb-6">
//           Start Your Preparation Today 💪
//         </h2>
//         <Link
//           href="/register"
//           className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold shadow hover:scale-105 transition"
//         >
//           Join Now
//         </Link>
//       </section>

//       {/* ⚫ FOOTER */}
//       <footer className="bg-black text-white text-center py-6">
//         © {new Date().getFullYear()} Study Web. All rights reserved.
//       </footer>

//     </div>
//   );
// }

// /* 🔹 Reusable Components */

// function FeatureCard({ title, desc }: { title: string; desc: string }) {
//   return (
//     <div className="bg-white p-8 shadow rounded-xl text-center hover:shadow-lg transition">
//       <h3 className="text-xl font-semibold mb-4">{title}</h3>
//       <p className="text-gray-600">{desc}</p>
//     </div>
//   );
// }

// function TestCard({ title, questions }: { title: string; questions: string }) {
//   return (
//     <div className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition">
//       <h3 className="text-lg font-bold mb-2">{title}</h3>
//       <p className="text-gray-600 mb-4">{questions}</p>
//       <Link
//         href="/login"
//         className="text-blue-600 font-semibold hover:underline"
//       >
//         Attempt Now →
//       </Link>
//     </div>
//   );
// }

// function Step({ number, text }: { number: string; text: string }) {
//   return (
//     <div>
//       <div className="bg-blue-600 text-white w-12 h-12 mx-auto rounded-full flex items-center justify-center font-bold mb-4">
//         {number}
//       </div>
//       <p className="font-semibold">{text}</p>
//     </div>
//   );
// }


// "use client";

// import Link from "next/link";

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-800">

//       {/* 🔷 NAVBAR */}
//       <nav className="flex justify-between items-center px-8 py-5 bg-white shadow-sm sticky top-0 z-50">
//         <h1 className="text-2xl font-bold text-blue-600">StudyWeb</h1>
//         <div className="space-x-6 hidden md:block">
//           <Link href="/" className="hover:text-blue-600">Home</Link>
//           <Link href="/tests" className="hover:text-blue-600">Tests</Link>
//           <Link href="/about" className="hover:text-blue-600">About</Link>
//           <Link href="/contact" className="hover:text-blue-600">Contact</Link>
//         </div>
//         <div className="space-x-4">
//           <Link
//             href="/login"
//             className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
//           >
//             Login
//           </Link>
//           <Link
//             href="/register"
//             className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
//           >
//             Register
//           </Link>
//         </div>
//       </nav>

//       {/* 🔵 HERO SECTION */}
//       <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-28 px-6 text-center">
//         <h1 className="text-5xl font-bold mb-6 leading-tight">
//           Crack Competitive Exams <br /> With Smart Practice 🚀
//         </h1>
//         <p className="text-lg max-w-2xl mx-auto mb-10">
//           Practice unlimited MCQs, get instant performance insights,
//           detailed explanations, and compete with thousands of students.
//         </p>

//         <Link
//           href="/register"
//           className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
//         >
//           Start Free Now
//         </Link>
//       </section>

//       {/* 🟢 FEATURES */}
//       <section className="py-24 px-6 max-w-6xl mx-auto">
//         <h2 className="text-4xl font-bold text-center mb-16">
//           Why Choose StudyWeb?
//         </h2>

//         <div className="grid md:grid-cols-3 gap-10">
//           <FeatureCard
//             title="Unlimited Practice"
//             desc="Access thousands of MCQs with detailed solutions."
//           />
//           <FeatureCard
//             title="Instant Analytics"
//             desc="Track accuracy, speed & performance instantly."
//           />
//           <FeatureCard
//             title="Live Rankings"
//             desc="Compete with real aspirants & improve daily."
//           />
//         </div>
//       </section>

//       {/* 🟡 POPULAR TEST SERIES */}
//       <section className="bg-white py-24 px-6">
//         <h2 className="text-4xl font-bold text-center mb-16">
//           Popular Test Series
//         </h2>

//         <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
//           <TestCard title="SSC CGL Mock Series" questions="5000+ Questions" />
//           <TestCard title="Banking PO Test Series" questions="4200+ Questions" />
//           <TestCard title="UPSC Prelims Practice" questions="8000+ Questions" />
//         </div>
//       </section>

//       {/* 🟣 HOW IT WORKS */}
//       <section className="py-24 px-6 max-w-6xl mx-auto">
//         <h2 className="text-4xl font-bold text-center mb-16">
//           How It Works
//         </h2>

//         <div className="grid md:grid-cols-4 gap-8 text-center">
//           <Step number="1" text="Create Account" />
//           <Step number="2" text="Choose Test Series" />
//           <Step number="3" text="Attempt Test" />
//           <Step number="4" text="View Rank & Analysis" />
//         </div>
//       </section>

//       {/* 🔴 CALL TO ACTION */}
//       <section className="bg-blue-600 text-white text-center py-20 px-6">
//         <h2 className="text-4xl font-bold mb-6">
//           Ready to Boost Your Preparation? 💪
//         </h2>
//         <p className="mb-8 text-lg">
//           Join thousands of students already preparing smarter.
//         </p>
//         <Link
//           href="/register"
//           className="bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
//         >
//           Join Now
//         </Link>
//       </section>

//       {/* ⚫ FOOTER */}
//       <footer className="bg-black text-white py-10">
//         <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-sm">
//           <div>
//             <h3 className="font-semibold text-lg mb-4">StudyWeb</h3>
//             <p>Smart online test platform for competitive exam preparation.</p>
//           </div>

//           <div>
//             <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
//             <ul className="space-y-2">
//               <li><Link href="/about">About Us</Link></li>
//               <li><Link href="/contact">Contact</Link></li>
//               <li><Link href="/privacy">Privacy Policy</Link></li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-semibold text-lg mb-4">Contact</h3>
//             <p>Email: support@studyweb.com</p>
//             <p>Phone: +91 98765 43210</p>
//           </div>
//         </div>

//         <div className="text-center mt-10 text-gray-400 text-sm">
//           © {new Date().getFullYear()} StudyWeb. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// }

// /* 🔹 Reusable Components */

// function FeatureCard({ title, desc }: { title: string; desc: string }) {
//   return (
//     <div className="bg-gray-100 p-8 rounded-2xl shadow hover:shadow-xl transition">
//       <h3 className="text-xl font-semibold mb-4">{title}</h3>
//       <p className="text-gray-600">{desc}</p>
//     </div>
//   );
// }

// function TestCard({ title, questions }: { title: string; questions: string }) {
//   return (
//     <div className="bg-gray-50 p-8 rounded-2xl shadow hover:shadow-xl transition">
//       <h3 className="text-lg font-bold mb-2">{title}</h3>
//       <p className="text-gray-600 mb-6">{questions}</p>
//       <Link
//         href="/login"
//         className="text-blue-600 font-semibold hover:underline"
//       >
//         Attempt Now →
//       </Link>
//     </div>
//   );
// }

// function Step({ number, text }: { number: string; text: string }) {
//   return (
//     <div>
//       <div className="bg-blue-600 text-white w-14 h-14 mx-auto rounded-full flex items-center justify-center font-bold mb-4 text-lg">
//         {number}
//       </div>
//       <p className="font-semibold">{text}</p>
//     </div>
//   );
// }


// "use client";

// import Link from "next/link";
// import { BookOpen, BarChart3, Trophy } from "lucide-react";
// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800">

//       {/* 🔵 HERO SECTION */}
//       <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-32 px-6 text-center">
//         <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
//           Crack Competitive Exams <br /> With Smart Practice 
//         </h1>

//         <p className="text-lg max-w-2xl mx-auto mb-10 opacity-90">
//           Practice unlimited MCQs, track performance, get instant analysis
//           and compete with thousands of aspirants.
//         </p>

//         <Link
//           href="/register"
//           className="bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold shadow-xl hover:scale-105 transition"
//         >
//           Start Free Now
//         </Link>
//       </section>

//       {/* 🟢 FEATURES */}
//       <section className="py-24 px-6 max-w-6xl mx-auto">
//         <h2 className="text-4xl font-bold text-center mb-16">
//           Why Choose StudyWeb?
//         </h2>

//         <div className="grid md:grid-cols-3 gap-10">

//           <FeatureCard
//             icon={<BookOpen size={28} />}
//             title="Unlimited Practice"
//             desc="Access thousands of MCQs with detailed explanations."
//           />

//           <FeatureCard
//             icon={<BarChart3 size={28} />}
//             title="Instant Analytics"
//             desc="Track accuracy, speed and improvement in real-time."
//           />

//           <FeatureCard
//             icon={<Trophy size={28} />}
//             title="Live Rankings"
//             desc="Compete with aspirants and climb the leaderboard."
//           />

//         </div>
//       </section>

//       {/* 🟡 TEST SERIES */}
//       <section className="bg-white py-24 px-6">
//         <h2 className="text-4xl font-bold text-center mb-16">
//           Popular Test Series
//         </h2>

//         <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

//           <TestCard
//             title="SSC CGL Mock Series"
//             questions="5000+ Questions"
//           />

//           <TestCard
//             title="Banking PO Test Series"
//             questions="4200+ Questions"
//           />

//           <TestCard
//             title="UPSC Prelims Practice"
//             questions="8000+ Questions"
//           />

//         </div>
//       </section>

//       {/* 🟣 HOW IT WORKS */}
//       <section className="py-24 px-6 max-w-6xl mx-auto">
//         <h2 className="text-4xl font-bold text-center mb-16">
//           How It Works
//         </h2>

//         <div className="grid md:grid-cols-4 gap-8 text-center">

//           <Step number="1" text="Create Account" />
//           <Step number="2" text="Choose Test Series" />
//           <Step number="3" text="Attempt Test" />
//           <Step number="4" text="View Rank & Analysis" />

//         </div>
//       </section>

//       {/* 🔴 CTA */}
//       <section className="bg-blue-600 text-white text-center py-20 px-6">
//         <h2 className="text-4xl font-bold mb-6">
//           Ready to Boost Your Preparation? 💪
//         </h2>

//         <p className="mb-8 text-lg opacity-90">
//           Join thousands of students preparing smarter.
//         </p>

//         <Link
//           href="/register"
//           className="bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold shadow-xl hover:scale-105 transition"
//         >
//           Join Now
//         </Link>
//       </section>

//       {/* ⚫ FOOTER */}
//       <footer className="bg-black text-white py-12">
//         <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-sm">

//           <div>
//             <h3 className="font-semibold text-lg mb-4">StudyWeb</h3>
//             <p>
//               Smart online test platform for competitive exam preparation.
//             </p>
//           </div>

//           <div>
//             <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
//             <ul className="space-y-2">
//               <li><Link href="/about">About Us</Link></li>
//               <li><Link href="/contact">Contact</Link></li>
//               <li><Link href="/privacy">Privacy Policy</Link></li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-semibold text-lg mb-4">Contact</h3>
//             <p>Email: support@studyweb.com</p>
//             <p>Phone: +91 98765 43210</p>
//           </div>

//         </div>

//         <div className="text-center mt-10 text-gray-400 text-sm">
//           © {new Date().getFullYear()} StudyWeb. All rights reserved.
//         </div>
//       </footer>

//     </div>
//   );
// }


// /* 🔹 Feature Card */

// function FeatureCard({ icon, title, desc }: any) {
//   return (
//     <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition text-center">

//       <div className="text-blue-600 mb-4 flex justify-center">
//         {icon}
//       </div>

//       <h3 className="text-xl font-semibold mb-3">
//         {title}
//       </h3>

//       <p className="text-gray-600">
//         {desc}
//       </p>

//     </div>
//   );
// }


// /* 🔹 Test Card */

// function TestCard({ title, questions }: any) {
//   return (
//     <div className="bg-gray-50 p-8 rounded-2xl shadow hover:shadow-xl transition border">

//       <h3 className="text-lg font-bold mb-2">
//         {title}
//       </h3>

//       <p className="text-gray-600 mb-6">
//         {questions}
//       </p>

//       <Link
//         href="/login"
//         className="text-blue-600 font-semibold hover:underline"
//       >
//         Attempt Now →
//       </Link>

//     </div>
//   );
// }


// /* 🔹 Steps */

// function Step({ number, text }: any) {
//   return (
//     <div>

//       <div className="bg-blue-600 text-white w-14 h-14 mx-auto rounded-full flex items-center justify-center font-bold mb-4 text-lg shadow-lg">
//         {number}
//       </div>

//       <p className="font-semibold">
//         {text}
//       </p>

//     </div>
//   );
// }


// "use client";

// import Link from "next/link";
// import footer;
// import Image from "next/image";
// import { BookOpen, BarChart3, Trophy } from "lucide-react";

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-[#050816] text-white">

//       {/* 🌌 BACKGROUND GRID EFFECT */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e3a8a20,_transparent)] pointer-events-none"></div>


//       {/* 🧠 HERO */}
//       <section className="text-center py-32 px-6 relative">

//         {/* Glow Orb */}
//         <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-600/30 blur-[120px] rounded-full"></div>

//         <div className="relative z-10">
//           <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
//             Train Your Brain <br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
//               Like Never Before
//             </span>
//           </h1>

//           <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
//             Smart quizzes powered by intelligent analytics to help you
//             learn faster, perform better, and rank higher.
//           </p>

//           <Link
//             href="/register"
//             className="px-10 py-4 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 shadow-[0_0_25px_rgba(139,92,246,0.6)] hover:scale-105 transition"
//           >
//             ⚡ Start Practicing
//           </Link>
//         </div>
//       </section>

//       {/* 🟢 FEATURES */}
//       <section className="py-24 px-6 max-w-6xl mx-auto">
//         <h2 className="text-4xl font-bold text-center mb-16">
//           Why Quizaro?
//         </h2>

//         <div className="grid md:grid-cols-3 gap-10">
//           <FeatureCard icon={<BookOpen />} title="Smart Practice" />
//           <FeatureCard icon={<BarChart3 />} title="AI Analytics" />
//           <FeatureCard icon={<Trophy />} title="Rank System" />
//         </div>
//       </section>

//       {/* 🟣 TEST SERIES */}
//       <section className="py-24 px-6">
//         <h2 className="text-4xl font-bold text-center mb-16">
//           Test Series
//         </h2>

//         <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           <TestCard title="SSC CGL" />
//           <TestCard title="Banking PO" />
//           <TestCard title="UPSC Prelims" />
//         </div>
//       </section>

//       {/* 🔴 CTA */}
//       <section className="text-center py-24">
//         <h2 className="text-4xl font-bold mb-6">
//           Ready to Level Up? 🚀
//         </h2>

//         <Link
//           href="/register"
//           className="px-10 py-4 bg-purple-600 rounded-xl shadow-lg hover:bg-purple-700 transition"
//         >
//           Join Now
//         </Link>
//       </section>

//       {/* ⚫ FOOTER
//       <footer className="text-center py-10 text-gray-500 border-t border-white/10">
//         © {new Date().getFullYear()} Quizaro
//       </footer> */}

//       </footer>
//     </div>
//   );
// }

// /* 🔹 Feature Card */
// function FeatureCard({ icon, title }: any) {
//   return (
//     <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-purple-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition text-center">
//       <div className="text-blue-400 mb-4 flex justify-center">{icon}</div>
//       <h3 className="text-xl font-semibold">{title}</h3>
//     </div>
//   );
// }

// /* 🔹 Test Card */
// function TestCard({ title }: any) {
//   return (
//     <div className="p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] hover:scale-105 transition">
//       <h3 className="text-lg font-bold mb-4">{title}</h3>

//       <Link href="/login" className="text-blue-400">
//         Attempt →
//       </Link>
//     </div>
//   );
// }

// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { BookOpen, BarChart3, Trophy, Users, Brain, Zap } from "lucide-react";

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-[#050816] text-white overflow-hidden">

    
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_#6d28d920,_transparent)]"></div>

     
//       <section className="text-center py-40 px-6 relative">

//         <div className="absolute w-[600px] h-[600px] bg-purple-600/30 blur-[150px] rounded-full top-10 left-1/2 -translate-x-1/2"></div>

//         <div className="relative z-10 max-w-4xl mx-auto">
//           <h1 className="text-6xl md:text-8xl font-extrabold leading-tight mb-8">
//             Upgrade Your <br />
//             <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
//               Brain Power
//             </span>
//           </h1>

//           <p className="text-gray-400 text-xl mb-12">
//             Practice smarter with AI-driven quizzes, deep analytics, and
//             real-time rankings.
//           </p>

//           <div className="flex justify-center gap-6">
//             <Link
//               href="/register"
//               className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-[0_0_30px_rgba(139,92,246,0.7)] hover:scale-105 transition"
//             >
//                Start Free
//             </Link>

//             <Link
//               href="/login"
//               className="px-10 py-4 border border-white/20 rounded-xl hover:bg-white/10 transition"
//             >
//               Login
//             </Link>
//           </div>
//         </div>
//       </section>

    
//       <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6 py-20 text-center">
//         <Stat number="50K+" label="Students" />
//         <Stat number="1M+" label="Questions Solved" />
//         <Stat number="10K+" label="Daily Tests" />
//       </section>

    
//       <section className="py-28 px-6 max-w-6xl mx-auto">
//         <h2 className="text-5xl font-bold text-center mb-20">
//           Powerful Features
//         </h2>

//         <div className="grid md:grid-cols-3 gap-10">
//           <FeatureCard icon={<Brain />} title="AI Learning" desc="Adaptive learning paths for maximum efficiency." />
//           <FeatureCard icon={<BarChart3 />} title="Deep Analytics" desc="Track speed, accuracy & weak topics." />
//           <FeatureCard icon={<Trophy />} title="Leaderboard" desc="Compete with top students nationwide." />
//         </div>
//       </section>

  
//       <section className="py-28 px-6 text-center">
//         <h2 className="text-5xl font-bold mb-20">How It Works</h2>

//         <div className="grid md:grid-cols-4 gap-10 max-w-6xl mx-auto">
//           <Step number="1" text="Sign Up" />
//           <Step number="2" text="Pick Exam" />
//           <Step number="3" text="Attempt Test" />
//           <Step number="4" text="Analyze Results" />
//         </div>
//       </section>

   
//       <section className="py-28 px-6 max-w-5xl mx-auto text-center">
//         <h2 className="text-5xl font-bold mb-16">What Students Say</h2>

//         <div className="grid md:grid-cols-2 gap-10">
//           <Testimonial name="Aman Sharma" text="Quizaro helped me improve my speed drastically!" />
//           <Testimonial name="Sara Khan" text="Best platform for exam preparation hands down." />
//         </div>
//       </section>


//       <section className="py-32 text-center">
//         <h2 className="text-5xl font-bold mb-6">
//           Start Your Success Journey 
//         </h2>

//         <Link
//           href="/register"
//           className="px-12 py-5 text-lg bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-xl hover:scale-105 transition"
//         >
//           Join Quizaro
//         </Link>
//       </section>

    
//       <footer className="text-center py-10 text-gray-500 border-t border-white/10">
//         © {new Date().getFullYear()} Quizaro
//       </footer>
//     </div>
//   );
// }

// /* 🔹 Components */
// function FeatureCard({ icon, title, desc }: any) {
//   return (
//     <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500 hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition text-center">
//       <div className="text-blue-400 mb-4 flex justify-center">{icon}</div>
//       <h3 className="text-xl font-bold mb-2">{title}</h3>
//       <p className="text-gray-400">{desc}</p>
//     </div>
//   );
// }

// function Step({ number, text }: any) {
//   return (
//     <div>
//       <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 shadow-lg">
//         {number}
//       </div>
//       <p>{text}</p>
//     </div>
//   );
// }

// function Stat({ number, label }: any) {
//   return (
//     <div>
//       <h3 className="text-4xl font-bold text-blue-400">{number}</h3>
//       <p className="text-gray-400">{label}</p>
//     </div>
//   );
// }

// function Testimonial({ name, text }: any) {
//   return (
//     <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
//       <p className="text-gray-300 mb-4">"{text}"</p>
//       <h4 className="font-semibold">{name}</h4>
//     </div>
//   );
// }


"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Footer from "@/components/Footer";
// import Header from "@/components/Navbar";
// import Footer from "@/components/Footer";
import {
  Brain,
  BarChart3,
  Trophy,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  Star,
  ChevronDown,
  ArrowRight,
  Play,
  Users,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  Flame,
  Sparkles,
} from "lucide-react";


/* Types */ 

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tag?: string;
}

interface ExamCardProps {
  emoji: string;
  title: string;
  subtitle: string;
  count: string;
  color: string;
}

interface StepProps {
  number: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

interface PricingCardProps {
  plan: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
}

interface TestimonialProps {
  name: string;
  role: string;
  text: string;
  avatar: string;
  rating: number;
  exam?: string;
}

interface StatProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface FaqItemProps {
  question: string;
  answer: string;
}

/*  Page */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white font-sans overflow-x-hidden">
      

      
      <HeroSection />

      
      <TrustedBySection />

      
      <StatsSection />

   
      <FeaturesSection />

      
      <ExamCategoriesSection />

      <HowItWorksSection />

  
      <AIShowcaseSection />

     
      <PricingSection />

     
      <TestimonialsSection />

      <FaqSection />


      <CtaSection />

      <Footer />

      <GlobalStyles />
    </div>
  );
}

/* HERO */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden">
      {/* BACKGROUND layers */}
      <div className="absolute inset-0">
        <div className="absolute w-[900px] h-[900px] bg-[radial-gradient(circle,_#6d28d940_0%,_transparent_70%)] rounded-full top-[-200px] left-1/2 -translate-x-1/2" />
        <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,_#0891b230_0%,_transparent_70%)] rounded-full bottom-0 left-0 -translate-x-1/3" />
        <div className="absolute w-[400px] h-[400px] bg-[radial-gradient(circle,_#7c3aed25_0%,_transparent_70%)] rounded-full bottom-10 right-0 translate-x-1/4" />
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-10 w-3 h-3 bg-cyan-400/60 rounded-full animate-floatA" />
      <div className="absolute top-1/3 right-16 w-2 h-2 bg-purple-400/60 rounded-full animate-floatB" />
      <div className="absolute bottom-1/4 left-1/4 w-4 h-4 bg-blue-400/40 rounded-full animate-floatC" />
      <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-cyan-300/50 rounded-full animate-floatA" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">

        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8 backdrop-blur-sm">
          <Sparkles size={14} className="text-yellow-400" />
          AI-Powered Exam Preparation Platform
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black leading-[1.05] mb-6 tracking-tight">
          Crack Any Exam{" "}
          <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
            With Confidence
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          India&apos;s smartest quiz platform. Adaptive AI tests, real-time
          analytics, live leaderboards — everything you need to outperform
          50,000+ aspirants.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-14">
          <Link
            href="/register"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl font-bold text-base shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_rgba(99,102,241,0.7)] hover:scale-105 transition-all duration-300"
          >
            <Zap size={18} className="group-hover:animate-bounce" />
            Start Free — No Card Needed
          </Link>
          <button className="group inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/15 rounded-2xl font-semibold text-base hover:bg-white/5 hover:border-white/30 transition-all duration-300">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition">
              <Play size={14} className="ml-0.5" />
            </div>
            Watch Demo
          </button>
        </div>

        {/* Social proof */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["bg-blue-500", "bg-purple-500", "bg-cyan-500", "bg-pink-500"].map((c, i) => (
                <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-[#050816] flex items-center justify-center text-[10px] font-bold`}>
                  {["A", "S", "R", "M"][i]}
                </div>
              ))}
            </div>
            <span>50,000+ students enrolled</span>
          </div>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
            ))}
            <span className="ml-1">4.9/5 rating</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* TRUSTED BY */

function TrustedBySection() {
  const brands = ["IIT Delhi", "IIT Bombay", "Delhi University", "BITS Pilani", "NIT Trichy", "IIM Ahmedabad"];
  return (
    <section className="py-12 border-y border-white/[0.05] overflow-hidden">
      <p className="text-center text-sm text-gray-600 uppercase tracking-[0.2em] mb-8">
        Trusted by students from
      </p>
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {[...brands, ...brands].map((b, i) => (
          <span key={i} className="text-gray-600 font-semibold text-sm hover:text-gray-400 transition-colors cursor-default">
            {b}
          </span>
        ))}
      </div>
    </section>
  );
}

/* STATS */
function StatsSection() {
  const stats: StatProps[] = [
    { value: "50K+", label: "Active Students", icon: <Users size={20} /> },
    { value: "2M+", label: "Questions Solved", icon: <BookOpen size={20} /> },
    { value: "98%", label: "Success Rate", icon: <Target size={20} /> },
    { value: "200+", label: "Exam Categories", icon: <Award size={20} /> },
  ];
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-center group hover:border-purple-500/30 hover:bg-white/[0.05] transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition" />
            <div className="flex justify-center mb-3 text-purple-400">{s.icon}</div>
            <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-1">
              {s.value}
            </div>
            <div className="text-gray-500 text-sm">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* FEATURES */
function FeaturesSection() {
  const features: FeatureCardProps[] = [
    {
      icon: <Brain size={28} />,
      title: "Adaptive AI Engine",
      desc: "Our ML model analyses your weak spots and dynamically adjusts question difficulty for maximum improvement.",
      tag: "AI-Powered",
    },
    {
      icon: <BarChart3 size={28} />,
      title: "Deep Analytics",
      desc: "Visualise accuracy, speed, topic-wise performance and improvement trends over time.",
      tag: "Pro",
    },
    {
      icon: <Trophy size={28} />,
      title: "Live Leaderboards",
      desc: "Compete with thousands of students in real-time tests and climb national rankings.",
    },
    {
      icon: <Clock size={28} />,
      title: "Timed Mock Tests",
      desc: "Simulate real exam conditions with auto-scored, NTA-pattern mock papers.",
    },
    {
      icon: <Flame size={28} />,
      title: "Daily Streaks",
      desc: "Build consistent habits with daily challenges, streak rewards, and personal bests.",
    },
    {
      icon: <Shield size={28} />,
      title: "Exam-Pattern Accurate",
      desc: "Questions curated by IITians and subject-matter experts aligned to the latest syllabus.",
      tag: "Expert Verified",
    },
  ];

  return (
    <section className="py-28 px-6" id="features">
      <div className="max-w-6xl mx-auto">
        <SectionLabel text="Features" />
        <h2 className="section-title">
          Everything You Need to <br className="hidden md:block" />
          <span className="gradient-text">Score Higher</span>
        </h2>
        <p className="section-sub">
          From adaptive quizzes to in-depth analysis — Quizaro gives you an
          unfair advantage over other aspirants.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, tag }: FeatureCardProps) {
  return (
    <div className="group relative p-7 rounded-3xl bg-white/[0.03] border border-white/[0.08] hover:border-purple-500/40 transition-all duration-400 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/8 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl translate-x-8 translate-y-8 group-hover:opacity-60 transition" />

      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
          {icon}
        </div>

        {tag && (
          <span className="absolute top-0 right-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-purple-500/30 text-purple-300">
            {tag}
          </span>
        )}

        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

/* EXAM CATEGORIES */
function ExamCategoriesSection() {
  const exams: ExamCardProps[] = [
    { emoji: "🔬", title: "JEE / NEET", subtitle: "Engineering & Medical", count: "8,400+ tests", color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30" },
    { emoji: "📜", title: "UPSC / IAS", subtitle: "Civil Services", count: "3,200+ tests", color: "from-amber-500/20 to-orange-500/20 border-amber-500/30" },
    { emoji: "🏦", title: "Banking PO/Clerk", subtitle: "SBI, IBPS, RBI", count: "5,100+ tests", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30" },
    { emoji: "⚔️", title: "Defence", subtitle: "CDS, NDA, AFCAT", count: "2,700+ tests", color: "from-red-500/20 to-pink-500/20 border-red-500/30" },
    { emoji: "📊", title: "SSC / Railway", subtitle: "CGL, CHSL, RRB NTPC", count: "6,300+ tests", color: "from-violet-500/20 to-purple-500/20 border-violet-500/30" },
    { emoji: "🎓", title: "CAT / MBA", subtitle: "IIM Entrance", count: "1,900+ tests", color: "from-pink-500/20 to-rose-500/20 border-pink-500/30" },
  ];

  return (
    <section className="py-28 px-6 relative" id="exams">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1e1b4b30_0%,_transparent_70%)]" />
      <div className="max-w-6xl mx-auto relative">
        <SectionLabel text="Exam Categories" />
        <h2 className="section-title">
          Prepare for <span className="gradient-text">Any Exam</span> You Target
        </h2>
        <p className="section-sub">
          Over 200 exam categories with 1M+ questions updated daily by domain experts.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-16">
          {exams.map((e) => (
            <ExamCard key={e.title} {...e} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/exams"
            className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors group"
          >
            View all 200+ exam categories
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ExamCard({ emoji, title, subtitle, count, color }: ExamCardProps) {
  return (
    <Link
      href="/exams"
      className={`group relative p-6 rounded-2xl bg-gradient-to-br ${color} border hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/[0.03]" />
      <div className="flex items-start justify-between mb-4">
        <span className="text-3xl">{emoji}</span>
        <ArrowRight size={16} className="text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
      </div>
      <h3 className="font-bold text-white text-base mb-1">{title}</h3>
      <p className="text-gray-400 text-sm mb-3">{subtitle}</p>
      <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">{count}</span>
    </Link>
  );
}

// WORKING
function HowItWorksSection() {
  const steps: StepProps[] = [
    { number: "01", title: "Create Free Account", desc: "Sign up in 30 seconds. No credit card required.", icon: <Users size={20} /> },
    { number: "02", title: "Choose Your Exam", desc: "Select from 200+ categories with custom difficulty.", icon: <BookOpen size={20} /> },
    { number: "03", title: "Take AI-Powered Tests", desc: "Adaptive questions that focus on your weak areas.", icon: <Brain size={20} /> },
    { number: "04", title: "Track & Improve", desc: "Detailed analysis and AI insights after every test.", icon: <TrendingUp size={20} /> },
  ];

  return (
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionLabel text="How It Works" />
        <h2 className="section-title">
          Go From Zero to <span className="gradient-text">Exam Ready</span>
        </h2>
        <p className="section-sub">
          Start improving in minutes — not months. Our streamlined flow gets you practising fast.
        </p>

        <div className="relative mt-20">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <StepCard key={s.number} {...s} delay={i * 100} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ number, title, desc, icon, delay }: StepProps & { delay: number }) {
  return (
    <div className="relative text-center group" style={{ animationDelay: `${delay}ms` }}>
      <div className="relative inline-flex w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-white/10 items-center justify-center mb-6 mx-auto group-hover:border-purple-500/50 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-400">
        <span className="text-2xl font-black text-white/20 absolute">{number}</span>
        <span className="text-purple-400 relative z-10">{icon}</span>
      </div>
      <h3 className="font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

/* AI SHOWCASE */
function AIShowcaseSection() {
  return (
    <section className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent" />
      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <SectionLabel text="AI Intelligence" />
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
              Your Personal AI <br />
              <span className="gradient-text">Study Coach</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8">
              Unlike static test series, Quizaro&apos;s AI analyses thousands of data
              points from your sessions — accuracy patterns, response speed, topic
              confidence — to build a personalised preparation roadmap unique to you.
            </p>
            <ul className="space-y-4">
              {[
                "Identifies and targets your weakest topics automatically",
                "Adjusts question difficulty in real-time",
                "Predicts your score range before the actual exam",
                "Suggests optimal daily study schedule",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-400">
                  <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold text-sm hover:opacity-90 transition"
            >
              Try AI Analysis Free <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right — mock dashboard card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-3xl blur-3xl" />
            <div className="relative bg-[#0a0d25]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-semibold text-gray-300">AI Performance Report</h4>
                <span className="text-xs text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full">Live</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Accuracy", value: "84%", trend: "+12%" },
                  { label: "Speed", value: "1.4s", trend: "-0.3s" },
                  { label: "Rank", value: "#247", trend: "↑128" },
                ].map((m) => (
                  <div key={m.label} className="bg-white/5 rounded-2xl p-4 text-center">
                    <div className="text-xl font-black text-white">{m.value}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{m.label}</div>
                    <div className="text-[10px] text-emerald-400 mt-1">{m.trend}</div>
                  </div>
                ))}
              </div>

              {/* Bar chart mock */}
              <div className="mb-5">
                <p className="text-xs text-gray-600 mb-3">Topic-wise strength</p>
                {[
                  { topic: "Maths", pct: 78, color: "from-cyan-500 to-blue-500" },
                  { topic: "Physics", pct: 91, color: "from-blue-500 to-purple-500" },
                  { topic: "Chemistry", pct: 63, color: "from-purple-500 to-pink-500" },
                  { topic: "Biology", pct: 55, color: "from-pink-500 to-rose-500" },
                ].map(({ topic, pct, color }) => (
                  <div key={topic} className="flex items-center gap-3 mb-2.5">
                    <span className="text-xs text-gray-500 w-20">{topic}</span>
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 w-8">{pct}%</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <p className="text-xs text-purple-300">
                  🤖 <strong>AI Insight:</strong> Focus on Organic Chemistry this week — improving by just 15% will boost your overall score by ~4 marks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* PRICING*/
function PricingSection() {
  const plans: PricingCardProps[] = [
    {
      plan: "Free",
      price: "₹0",
      period: "forever",
      desc: "Perfect for getting started",
      features: ["10 tests/month", "Basic analytics", "5 exam categories", "Community support"],
      cta: "Start Free",
    },
    {
      plan: "Pro",
      price: "₹299",
      period: "/month",
      desc: "For serious aspirants",
      features: [
        "Unlimited tests",
        "Full AI analytics",
        "All 200+ categories",
        "Live leaderboard",
        "Priority support",
        "Offline downloads",
      ],
      cta: "Get Pro",
      highlighted: true,
      badge: "Most Popular",
    },
    {
      plan: "Elite",
      price: "₹699",
      period: "/month",
      desc: "For top rankers",
      features: [
        "Everything in Pro",
        "1-on-1 mentor sessions",
        "Previous year papers",
        "Doubt clearing chat",
        "Score guarantee*",
        "Early feature access",
      ],
      cta: "Go Elite",
    },
  ];

  return (
    <section className="py-28 px-6 relative" id="pricing">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1e1b4b20_0%,_transparent_60%)]" />
      <div className="max-w-5xl mx-auto relative">
        <SectionLabel text="Pricing" />
        <h2 className="section-title">
          Simple, <span className="gradient-text">Transparent Pricing</span>
        </h2>
        <p className="section-sub">
          No hidden fees. No contracts. Upgrade or cancel anytime.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {plans.map((p) => (
            <PricingCard key={p.plan} {...p} />
          ))}
        </div>
        <p className="text-center text-xs text-gray-600 mt-8">
          * Score guarantee terms and conditions apply. All prices include GST.
        </p>
      </div>
    </section>
  );
}

function PricingCard({ plan, price, period, desc, features, cta, highlighted, badge }: PricingCardProps) {
  return (
    <div className={`relative p-7 rounded-3xl border transition-all duration-300 flex flex-col ${
      highlighted
        ? "bg-gradient-to-b from-purple-900/40 to-blue-900/30 border-purple-500/50 shadow-[0_0_50px_rgba(139,92,246,0.3)] scale-105"
        : "bg-white/[0.03] border-white/[0.08] hover:border-white/20"
    }`}>
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 whitespace-nowrap">
          {badge}
        </span>
      )}

      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{plan}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-white">{price}</span>
          <span className="text-gray-500 text-sm">{period}</span>
        </div>
        <p className="text-gray-500 text-sm mt-2">{desc}</p>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-gray-400">
            <CheckCircle size={15} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <Link
        href="/register"
        className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${
          highlighted
            ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 hover:scale-105 shadow-lg"
            : "border border-white/15 hover:bg-white/5 hover:border-white/30"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

/*  TESTIMONIALS */
function TestimonialsSection() {
  const testimonials: TestimonialProps[] = [
    {
      name: "Arjun Mehta",
      role: "AIR 47, JEE Advanced 2024",
      exam: "JEE Advanced",
      text: "Quizaro's adaptive tests are insane. It literally identified my weak chapters in Week 1 and within 2 months I improved my mock score by 40 marks.",
      avatar: "AM",
      rating: 5,
    },
    {
      name: "Priya Soni",
      role: "Selected in SBI PO 2024",
      exam: "Banking PO",
      text: "I cracked SBI PO in my first attempt, largely because of the timed sectional tests here. The analytics dashboard is the best I've seen anywhere.",
      avatar: "PS",
      rating: 5,
    },
    {
      name: "Ravi Kumar",
      role: "UPSC CSE 2023 (Rank 312)",
      exam: "UPSC",
      text: "The Current Affairs module and prelims mock series are gold. Concise, accurate, and perfectly curated for serious UPSC aspirants.",
      avatar: "RK",
      rating: 5,
    },
    {
      name: "Sneha Verma",
      role: "NEET 2024 — 690/720",
      exam: "NEET",
      text: "From 560 to 690 in 4 months. The AI spotted that my Biology diagrams were weak and the custom drill sets fixed it completely.",
      avatar: "SV",
      rating: 5,
    },
  ];

  return (
    <section className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent" />
      <div className="max-w-6xl mx-auto relative">
        <SectionLabel text="Success Stories" />
        <h2 className="section-title">
          Real Results from <span className="gradient-text">Real Students</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mt-16">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ name, role, text, avatar, rating, exam }: TestimonialProps) {
  return (
    <div className="group p-7 rounded-3xl bg-white/[0.03] border border-white/[0.07] hover:border-white/15 transition-all duration-300 hover:bg-white/[0.05] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl" />

      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {avatar}
          </div>
          <div>
            <div className="font-bold text-white text-sm">{name}</div>
            <div className="text-gray-500 text-xs">{role}</div>
          </div>
        </div>
        {exam && (
          <span className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2.5 py-1 rounded-full">
            {exam}
          </span>
        )}
      </div>

      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
        ))}
      </div>

      <p className="text-gray-400 text-sm leading-relaxed">&ldquo;{text}&rdquo;</p>
    </div>
  );
}

/* FAQ */
function FaqSection() {
  const faqs = [
    { question: "Is Quizaro really free to start?", answer: "Yes! The Free plan gives you 10 tests per month across 5 exam categories with no credit card required. Upgrade only when you want unlimited access." },
    { question: "How does the AI adaptive engine work?", answer: "After each test, our ML model maps your response patterns to a skill graph. It then selects questions from topics where your accuracy is below your personal threshold, gradually increasing difficulty as you improve." },
    { question: "Are the questions from previous years' papers?", answer: "Our Elite plan includes a curated previous year question (PYQ) bank spanning 10 years for all major exams, verified by subject experts." },
    { question: "Can I access Quizaro on mobile?", answer: "Absolutely. Quizaro is fully responsive and we have dedicated iOS and Android apps for offline test-taking." },
    { question: "How often is the content updated?", answer: "Questions and current affairs are updated daily. Full-length mocks are released every week in sync with the latest exam patterns." },
    { question: "Is there a refund policy?", answer: "We offer a 7-day no-questions-asked refund on all paid plans if you feel the platform doesn't meet your needs." },
  ];

  return (
    <section className="py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <SectionLabel text="FAQ" />
        <h2 className="section-title">
          Frequently Asked <span className="gradient-text">Questions</span>
        </h2>

        <div className="mt-12 space-y-3">
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
    <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${open ? "border-purple-500/40 bg-white/[0.04]" : "border-white/[0.07] bg-white/[0.02] hover:border-white/15"}`}>
      <button
        className="w-full flex items-center justify-between px-6 py-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-sm text-white pr-4">{question}</span>
        <ChevronDown
          size={16}
          className={`text-gray-500 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-purple-400" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-gray-400 leading-relaxed">{answer}</div>
      )}
    </div>
  );
}

/* CTA FINAL */
function CtaSection() {
  return (
    <section className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-purple-950/30 to-blue-950/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#6d28d930_0%,_transparent_70%)]" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8">
          <Flame size={14} className="text-orange-400" />
          Join 50,000+ aspirants already preparing
        </div>

        <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
          Your Exam Success <br />
          <span className="gradient-text">Starts Today</span>
        </h2>

        <p className="text-gray-400 text-lg mb-10">
          Free forever. No credit card. Start your first AI-powered test in under 60 seconds.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/register"
            className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl font-bold text-base shadow-[0_0_50px_rgba(99,102,241,0.5)] hover:shadow-[0_0_70px_rgba(99,102,241,0.8)] hover:scale-105 transition-all duration-300"
          >
            <Zap size={18} />
            Create Free Account
          </Link>
          <Link
            href="#exams"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-white/15 rounded-2xl font-semibold text-base hover:bg-white/5 hover:border-white/30 transition-all"
          >
            Browse Exams
          </Link>
        </div>
      </div>
    </section>
  );
}

/* Shared Small Components*/
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

/* global */
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

      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-marquee { animation: marquee 18s linear infinite; }
    `}</style>
  );
}