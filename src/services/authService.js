import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.headers.post["Content-Type"] = "application/json";

// Request interceptor to add JWT token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export async function registerUser(data) {
  return axios.post("/api/auth/register", data);
}

export async function loginUser(data) {
  return axios.post("/api/auth/login", data);
}

export async function refreshToken(refreshToken) {
  return axios.post("/api/auth/refresh", { refreshToken });
}

