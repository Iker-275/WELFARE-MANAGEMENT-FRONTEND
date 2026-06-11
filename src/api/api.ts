// import axios from "axios";
// import { API_BASE_URL } from "./config";

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   // withCredentials: true
// });

// export default api;

import axios from "axios";
import { API_BASE_URL } from "./config";
import { tokenService } from "../services/tokenService";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token =
      tokenService.getAccessToken();

     

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;