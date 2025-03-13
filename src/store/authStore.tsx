import { create } from "zustand";

const loadInitialState = () => {
    const token = localStorage.getItem("token") || null;
    const userData = JSON.parse(localStorage.getItem("userData") || null);

    return { token: token, userData };
};

const authStore = create((set, get) => ({
    ...loadInitialState(),
    setToken: (token) => {
        localStorage.setItem("token", token);
        set(() => ({ token: token }));
    },
    logout: () => {
        localStorage.removeItem("token");
        set(() => ({
            token: null,
        }));
    },
}));

export default authStore;

