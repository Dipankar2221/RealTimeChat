import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";


export const useAuthStore = create((set) => ({
  authUser: null,
  socket: null,
  onlineUsers: [],
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  _initSocket: (userId) => {
    try {
      const socket = io(BASE_URL, { query: { userId } });
      socket.on("connect", () => {
        // connected
      });

      socket.on("getOnlineUsers", (users) => {
        set({ onlineUsers: users });
      });

      set({ socket });
    } catch (err) {
      console.warn("Socket init failed", err);
    }
  },

  _destroySocket: () => {
    const current = useAuthStore.getState();
    if (current.socket) {
      current.socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      const user = res.data;
      const normalized = { ...user, profilePic: user.profilePic || user.avatar };
      set({ authUser: normalized });
      if (user && user._id) {
        useAuthStore.getState()._initSocket(user._id);
      }
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      const user = res.data;
      const normalized = { ...user, profilePic: user.profilePic || user.avatar };
      set({ authUser: normalized });
      toast.success("Account created successfully");
      if (user && user._id) useAuthStore.getState()._initSocket(user._id);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);
      const user = res.data;
      const normalized = { ...user, profilePic: user.profilePic || user.avatar };
      set({ authUser: normalized });
      toast.success("Logged in successfully");
      if (user && user._id) useAuthStore.getState()._initSocket(user._id);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      useAuthStore.getState()._destroySocket();
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.put("/auth/update-profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const user = res.data;
      const normalized = { ...user, profilePic: user.profilePic || user.avatar };
      set({ authUser: normalized });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));