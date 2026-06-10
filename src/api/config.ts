export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const headers = {
  "Content-Type": "application/json",
};

// export const appName = "Tawakal Restaurant"

export const appName = "AOWAK"


export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/register",
    VERIFY_EMAIL: "/verify-email",
    LOGIN: "/login",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },
};