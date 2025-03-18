import { create } from "zustand";
import axios from "axios";
const loadInitialState = () => {
  const token = localStorage.getItem("token") || null;
  const userData = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : null;
  return {
    token,
    userData
  };
};
const authStore = create((set, get) => ({
  ...loadInitialState(),
  setToken: token => {
    localStorage.setItem("token", token);
    set(() => ({
      token
    }));
  },
  login: async (email, password) => {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    const response = await axios.post("/api/v1/token", formData);
    const token = response.data.access_token;
    localStorage.setItem("token", token);
    set({
      token
    });
  },
  register: async userData => {
    await axios.post("/api/v1/user/create", userData);
  },
  logout: async () => {
    try {
      const token = get().token;
      if (token) {
        await axios.delete("/api/v1/logout", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      set({
        token: null,
        userData: null
      });
    }
  }
}));
export default authStore;
