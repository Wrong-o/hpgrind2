import { create } from "zustand";

const loadInitialState = () => {
    const token = localStorage.getItem("token") || null;

    const userData = localStorage.getItem("userData") 
        ? JSON.parse(localStorage.getItem("userData")) 
        : null;
    return { token, userData };
};

const authStore = create((set, get) => ({
  token: loadInitialState().token,
  userData: loadInitialState().userData,
  isLoggedIn: !!loadInitialState().token,
  isLoading: false,
  error: null,
  
  initializeAuth: () => {
    const token = localStorage.getItem("token");
    set({ 
      token,
      isLoggedIn: !!token 
    });
  },

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ 
      token,
      isLoggedIn: !!token 
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ 
      token: null,
      isLoggedIn: false,
      userData: null 
    });
  }
}));

export default authStore;