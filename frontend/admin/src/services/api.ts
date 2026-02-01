import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "https://airtime-backend.onrender.com/api",
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
