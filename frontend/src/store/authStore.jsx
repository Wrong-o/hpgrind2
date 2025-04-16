import { create } from "zustand";

const loadInitialState = () => {
    const token = localStorage.getItem("token") || null;
    const userData = localStorage.getItem("userData") 
        ? JSON.parse(localStorage.getItem("userData")) 
        : null;
    return { 
        token, 
        userData,
        isPremium: userData?.isPremium || false 
    };
};

const authStore = create((set, get) => ({
  token: loadInitialState().token,
  userData: loadInitialState().userData,
  isPremium: loadInitialState().isPremium,
  isLoggedIn: !!loadInitialState().token,
  isLoading: false,
  error: null,
  
  initializeAuth: () => {
    const { token, userData } = loadInitialState();
    set({ 
      token,
      userData,
      isPremium: userData?.isPremium || false,
      isLoggedIn: !!token 
    });
  },

  setToken: (token, isPremium = false) => {
    localStorage.setItem("token", token);
    const userData = get().userData || {};
    userData.isPremium = isPremium;
    localStorage.setItem("userData", JSON.stringify(userData));
    set({ 
      token,
      userData,
      isPremium,
      isLoggedIn: !!token 
    });
  },

  setUserData: (userData) => {
    localStorage.setItem("userData", JSON.stringify(userData));
    set({ 
      userData,
      isPremium: userData?.isPremium || false
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    set({ 
      token: null,
      isLoggedIn: false,
      userData: null,
      isPremium: false
    });
  }
}));

export default authStore;