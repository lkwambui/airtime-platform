import axios, { InternalAxiosRequestConfig } from "axios";

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly PROD: boolean;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

function resolveBaseUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL;

  if (!raw) {
    if (import.meta.env.PROD) {
      throw new Error("VITE_API_BASE_URL is not set");
    }

    return "http://localhost:4000/api";
  }

  return raw.replace(/\/+$/, "");
}

const api = axios.create({
  baseURL: resolveBaseUrl(),
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
