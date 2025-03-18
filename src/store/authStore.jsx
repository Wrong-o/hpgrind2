import { create } from "zustand";

const loadInitialState = () => {
    const token = localStorage.getItem("token") || null;

    const userData = JSON.parse(localStorage.getItem("userData")) || null;

    // Parse user data from localStorage or set to null
    return { token: token, userData};
};

const authStore = create((set, get) => ({
    ...loadInitialState(),
    setToken: (token) => {
        localStorage.setItem("token", token);
        set(() => ({ token }))
    }
}));

export default authStore;