import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
    }
    return Promise.reject(error);
  }
);

export default API;
