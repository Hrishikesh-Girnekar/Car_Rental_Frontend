import axios from "axios";
import * as Sentry from "@sentry/react";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

api.interceptors.request.use((config) => {
  Sentry.addBreadcrumb({
    category: "api",
    message: `Request: ${config.method?.toUpperCase()} ${config.url}`,
    level: "info",
  });
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    Sentry.addBreadcrumb({
      category: "api",
      message: `Response: ${response.status} ${response.config.url}`,
      level: "info",
    });
    return response;
  },
  (error) => {
    Sentry.captureException(error);
    return Promise.reject(error);
  },
);

export default api;
