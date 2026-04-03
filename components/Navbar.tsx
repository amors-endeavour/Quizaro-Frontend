// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";

// export default function Navbar() {
//   const [open, setOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [checkingAuth, setCheckingAuth] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await fetch(`${API_URL}/user/profile`, {
//           credentials: "include",
//         });
//         setIsAuthenticated(res.ok);
//       } catch {
//         setIsAuthenticated(false);
//       } finally {
//         setCheckingAuth(false);
//       }
//     };
//     checkAuth();
//   }, []);

//   const handleAdminAccess = () => {
//     setOpen(false);
//     // Always redirect to login first - let login handle the redirect
//     router.push("/login?redirect=/admin-dashboard");
//   };

//   return (
//     <nav className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
//       <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

//         {/* LOGO */}
//         <Link href="/" className="flex items-center">
//           <img
//             src="/logo.png"
//             alt="Welcome"
//             className="h-10 w-auto object-contain cursor-pointer"
//           />
//         </Link>

//         {/* NAV LINKS */}
//         <div className="hidden md:flex gap-8 text-gray-700 font-medium">
//           <Link href="/" className="hover:text-blue-600 transition">Home</Link>
//           <Link href="/tests" className="hover:text-blue-600 transition">Tests</Link>
//           <Link href="/about" className="hover:text-blue-600 transition">About</Link>
//           <Link href="/contact" className="hover:text-blue-600 transition">Contact</Link>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="flex items-center gap-4 relative">

//           {/* LOGIN */}
//           <Link
//             href="/login"
//             className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
//           >
//             Login
//           </Link>

//           {/* REGISTER */}
//           <Link
//             href="/register"
//             className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
//           >
//             Register
//           </Link>

//           {/* DROPDOWN ARROW */}
//           <button
//             onClick={() => setOpen(!open)}
//             className="text-gray-600 hover:text-black transition text-lg"
//           >
//             ▼
//           </button>

//           {/* DROPDOWN MENU */}
//           {open && (
//             <div className="absolute right-0 top-12 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-2">
//               <button
//                 onClick={handleAdminAccess}
//                 className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition"
//                 disabled={checkingAuth}
//               >
//                 {checkingAuth ? "Checking..." : "Admin Access"}
//               </button>
//             </div>
//           )}
//         </div>

//       </div>
//     </nav>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";

// export default function Navbar() {
//   const [open, setOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [checkingAuth, setCheckingAuth] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await fetch(`${API_URL}/user/profile`, {
//           credentials: "include",
//         });
//         setIsAuthenticated(res.ok);
//       } catch {
//         setIsAuthenticated(false);
//       } finally {
//         setCheckingAuth(false);
//       }
//     };
//     checkAuth();
//   }, []);

//   const handleAdminAccess = () => {
//     setOpen(false);
//     router.push("/login?redirect=/admin-dashboard");
//   };

//   return (
//     <nav className="w-full sticky top-0 z-50 bg-neutral-950 border-b border-white/10 shadow-md">
// {/* <nav className="w-full sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-gray-200"> */}
//       <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

        
//         <Link href="/" className="flex items-center gap-3">
//           <img
//             src="/logo.png"
//             alt="Quizaro"
//             className="h-20 w-auto object-contain cursor-pointer"
//           />
         
//         </Link> 

//         {/* <Link href="/" className="flex items-center gap-5 py-[-10px]">
//           <img
//             src="/logo.png"
//             alt="Quizaro"
//             className="h-24 w-auto object-contain cursor-pointer"
//           />
//         </Link> */}


//         <div className="hidden md:flex gap-10 text-[17px] text-gray-700 font-medium">
//           <Link href="/" className="hover:text-blue-600 transition">Home</Link>
//           <Link href="/tests" className="hover:text-blue-600 transition">Tests</Link>
//           <Link href="/about" className="hover:text-blue-600 transition">About</Link>
//           <Link href="/contact" className="hover:text-blue-600 transition">Contact</Link>
//         </div>


//         <div className="flex items-center gap-5 relative">


//           <Link
//             href="/login"
//             className="text-base font-medium text-gray-700 hover:text-blue-600 transition"
//           >
//             Login
//           </Link>


//           <Link
//             href="/register"
//             className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md"
//           >
//             Register
//           </Link>


//           {/* <button
//             onClick={() => setOpen(!open)}
//             className="text-gray-600 hover:text-black transition text-lg"
//           >
//             ▼
//           </button> */}
//           <button
//             onClick={() => setOpen(!open)}
//             className="text-gray-600 transition text-lg hover:bg-gradient-to-r hover:from-cyan-400 hover:to-purple-600 hover:bg-clip-text hover:text-transparent"
//           >
//             ▼
//           </button>

//           {open && (
//             <div className="absolute right-0 top-14 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-2">
//               <button
//                 onClick={handleAdminAccess}
//                 className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition"
//                 disabled={checkingAuth}
//               >
//                 {checkingAuth ? "Checking..." : "Admin Access"}
//               </button>
//             </div>
//           )}
//         </div>

//       </div>
//     </nav>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://quizaro-backend-3fkj.onrender.com";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/user/profile`, {
          credentials: "include",
        });
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  const handleAdminAccess = () => {
    setOpen(false);
    router.push("/login?redirect=/admin-dashboard");
  };

  return (
    <nav className="w-full sticky top-0 z-50 bg-[#050816] border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Quizaro"
            className="h-16 w-auto object-contain cursor-pointer"
          />
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex gap-10 text-[16px] text-gray-300 font-medium">
          {[
            { name: "Home", href: "/" },
            { name: "Tests", href: "/tests" },
            { name: "About", href: "/about" },
            { name: "Contact", href: "/contact" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="hover:text-white transition relative group"
            >
              {item.name}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-500 transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5 relative">

          <Link
            href="/login"
            className="text-base font-medium text-gray-300 hover:text-white transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white 
            bg-gradient-to-r from-purple-500 to-cyan-500 
            hover:opacity-90 transition shadow-lg shadow-purple-500/20"
          >
            Register
          </Link>

          {/* Dropdown Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="text-gray-400 hover:text-white transition text-lg"
          >
            ▼
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-14 w-48 bg-[#0b0f2a] border border-white/10 rounded-xl shadow-xl py-2">
              <button
                onClick={handleAdminAccess}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition"
                disabled={checkingAuth}
              >
                {checkingAuth ? "Checking..." : "Admin Access"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Glow Line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"></div>
    </nav>
  );
}