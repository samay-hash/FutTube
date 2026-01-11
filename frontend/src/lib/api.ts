import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.token = token;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  // User (Creator) auth
  userSignup: (data: { email: string; password: string; name: string; creatorId?: string; role?: string }) =>
    api.post("/api/v1/user/signup", data),

  userSignin: (data: { email: string; password: string }) =>
    api.post("/api/v1/user/signin", data),

  // Admin auth
  adminSignup: (data: { email: string; password: string; name: string }) =>
    api.post("/api/v1/admin/signup", data),

  adminSignin: (data: { email: string; password: string }) =>
    api.post("/api/v1/admin/signin", data),

  // Editor auth
  editorSignup: (data: { email: string; password: string }) =>
    api.post("/api/editor/signup", data),
};

// Video APIs
export const videoAPI = {
  upload: (formData: FormData) =>
    api.post("/api/v1/videos/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getPending: () => api.get("/api/v1/videos/pending"),

  approve: (id: string) => api.post(`/api/v1/videos/${id}/approve`),

  reject: (id: string) => api.post(`/api/v1/videos/${id}/reject`),

  storeYouTubeTokens: (data: { accessToken: string; refreshToken?: string }) =>
    api.post("/api/v1/videos/store-youtube-tokens", data),
};

// Invite APIs
export const inviteAPI = {
  sendInvite: (email: string) => api.post("/api/v1/invite", { email }),

  verifyInvite: (token: string) => api.get(`/api/v1/verify?token=${token}`),
};

// Google OAuth
export const getGoogleAuthUrl = () => `${API_BASE_URL}/auth/google`;

export default api;
