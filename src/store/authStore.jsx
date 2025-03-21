import { create } from "zustand";

const loadInitialState = () => {
    const token = localStorage.getItem("token") || null;

    const userData = localStorage.getItem("userData") 
        ? JSON.parse(localStorage.getItem("userData")) 
        : null;
    return { token, userData };
};

const authStore = create((set, get) => ({
    ...loadInitialState(),
    token: null,
    userData: null,
    isLoading: false,
    error: null,

    setToken: (token) => {
        localStorage.setItem("token", token);
        set(() => ({ token }))
    },
    logout: () => {
      localStorage.removeItem("token");
      set(() => ({
        token: null,
      }));
    },
}));

export default authStore;