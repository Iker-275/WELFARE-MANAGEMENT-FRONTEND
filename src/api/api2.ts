import axios from "axios";

import tokenService from "../services/tokenService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000/api";

const api2 = axios.create({
  baseURL: API_BASE_URL,

  timeout: 30000,
});

/**
 * Attach access token to every request.
 */
api2.interceptors.request.use(
  config => {

    const accessToken =
      tokenService.getAccessToken();

    if (accessToken) {

      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },

  error =>
    Promise.reject(error)
);

export default api2;