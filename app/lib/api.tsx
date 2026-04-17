import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com",
  withCredentials: true,
  timeout: 60000, 
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    // Add auth token if available in localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", error?.response?.status, error?.message);
    
    // Auto-logout on 401 Unauthorized if in browser
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      // Don't auto-redirect from landing page or login pages to prevent loops
      const isPublicPage = window.location.pathname === "/" || window.location.pathname.includes("/login") || window.location.pathname.includes("/admin-login");
      if (!isPublicPage) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
