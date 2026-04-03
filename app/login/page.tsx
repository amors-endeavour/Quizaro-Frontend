// "use client";

// import { useState } from "react";
// import { Mail, Lock, LogIn } from "lucide-react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const redirect = searchParams.get("redirect") || "";

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       console.log("Attempting login with:", email);
      
//       const res = await fetch(`${API_URL}/user/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       console.log("Login response status:", res.status);
//       console.log("Login response data:", data);

//       if (!res.ok) {
//         throw new Error(data.message || `Login failed with status ${res.status}`);
//       }

//       let role = data?.role || data?.user?.role;
//       if (!role) {
//         role = data?.user?.role;
//       }
//       role = role?.toString().toLowerCase();

//       console.log("Extracted role:", role);

//       if (!role) {
//         throw new Error("Role not found in response. Please check your credentials.");
//       }

//       // Redirect based on role or the redirect parameter
//       if (role === "admin" || redirect === "/admin-dashboard") {
//         router.replace("/admin-dashboard");
//       } else {
//         router.replace("/user-dashboard");
//       }

//     } catch (err: any) {
//       console.error("Login error catch:", err);
//       console.error("Error message:", err.message);
//       setError(err.message || "Login failed. Please check your credentials.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
//       >
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
//           <p className="text-gray-500 mt-2">Sign in to your account</p>
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
//             {error}
//           </div>
//         )}

//         <div className="space-y-4">
//           <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
//             <Mail className="text-gray-400 mr-2" size={20} />
//             <input
//               type="email"
//               placeholder="Email address"
//               className="w-full p-2 outline-none bg-transparent"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
//             <Lock className="text-gray-400 mr-2" size={20} />
//             <input
//               type="password"
//               placeholder="Password"
//               className="w-full p-2 outline-none bg-transparent"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
//           >
//             {loading ? (
//               <>
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 Signing in...
//               </>
//             ) : (
//               <>
//                 <LogIn size={18} />
//                 Sign In
//               </>
//             )}
//           </button>
//         </div>

//         <p className="text-center text-gray-500 mt-6 text-sm">
//           Don&apos;t have an account?{" "}
//           <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
//             Register here
//           </Link>
//         </p>

//         <p className="text-center text-gray-500 mt-3 text-sm">
//           <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
//             Forgot Password?
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }


// "use client";

// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";

// export default function LoginContent() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const redirect = searchParams.get("redirect") || "";

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch(`${API_URL}/user/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Login failed");
//       }

//       let role = data?.role || data?.user?.role;
//       role = role?.toString().toLowerCase();

//       if (!role) throw new Error("Role not found");

//       if (role === "admin" || redirect === "/admin-dashboard") {
//         router.replace("/admin-dashboard");
//       } else {
//         router.replace("/user-dashboard");
//       }

//     } catch (err: any) {
//       setError(err.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
//       <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">

//         <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>

//         {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

//         <input type="email" placeholder="Email"
//           value={email} onChange={(e) => setEmail(e.target.value)}
//           className="w-full mb-3 p-2 border rounded" required />

//         <input type="password" placeholder="Password"
//           value={password} onChange={(e) => setPassword(e.target.value)}
//           className="w-full mb-3 p-2 border rounded" required />

//         <button className="w-full bg-blue-600 text-white py-2 rounded">
//           {loading ? "Signing in..." : "Sign In"}
//         </button>

//         <p className="text-sm mt-4 text-center">
//           <Link href="/forgot-password">Forgot Password?</Link>
//         </p>

//       </form>
//     </div>
//   );
// }


"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      let role = data?.role || data?.user?.role;
      role = role?.toString().toLowerCase();

      if (!role) throw new Error("Role not found");

      if (role === "admin" || redirect === "/admin-dashboard") {
        router.replace("/admin-dashboard");
      } else {
        router.replace("/user-dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-sm mt-4 text-center">
          <Link href="/forgot-password">Forgot Password?</Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}