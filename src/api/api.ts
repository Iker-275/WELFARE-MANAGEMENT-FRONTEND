

// import axios, {
//   AxiosError,
//   InternalAxiosRequestConfig,
// } from "axios";

// import tokenService from "../services/tokenService";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL ||
//   "http://localhost:3000/api";

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   timeout: 30000,
// });

// const refreshClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// let refreshPromise: Promise<string | null> | null = null;

// api.interceptors.request.use(
//   (config) => {

//     const accessToken =
//       tokenService.getAccessToken();

//     if (accessToken) {

//       config.headers.Authorization =
//         `Bearer ${accessToken}`;
//     }

//     return config;
//   }
// );

// api.interceptors.response.use(

//   (response) =>
//     response,

//   async (error: AxiosError) => {

//     const originalRequest =
//       error.config as
//         | InternalAxiosRequestConfig & {
//             _retry?: boolean;
//           }
//         | undefined;

//     if (
//       error.response?.status !== 401 ||
//       !originalRequest ||
//       originalRequest._retry
//     ) {
//       return Promise.reject(error);
//     }

//     /*
//      * Never refresh the refresh endpoint itself.
//      */
//     if (
//       originalRequest.url?.includes(
//         "/auth/refresh-token"
//       )
//     ) {
//       tokenService.clearTokens();

//       return Promise.reject(error);
//     }

//     originalRequest._retry = true;

//     const refreshToken =
//       tokenService.getRefreshToken();

//     if (!refreshToken) {

//       tokenService.clearTokens();

//       return Promise.reject(error);
//     }

//     try {

//       if (!refreshPromise) {

//         refreshPromise =
//           refreshAccessToken(
//             refreshToken
//           );
//       }

//       const newAccessToken =
//         await refreshPromise;

//       refreshPromise = null;

//       if (!newAccessToken) {

//         tokenService.clearTokens();

//         return Promise.reject(error);
//       }

//       originalRequest.headers.Authorization =
//         `Bearer ${newAccessToken}`;

//       return api.request(
//         originalRequest
//       );

//     } catch (refreshError) {

//       refreshPromise = null;

//       tokenService.clearTokens();

//       return Promise.reject(
//         refreshError
//       );
//     }
//   }
// );

// const refreshAccessToken = async (
//   refreshToken: string
// ): Promise<string | null> => {

//   const response =
//     await refreshClient.post(
//       "/auth/refresh-token",
//       {
//         refreshToken,
//       }
//     );

//   const {
//     accessToken,
//     refreshToken: newRefreshToken,
//   } = response.data;

//   tokenService.setTokens(
//     accessToken,
//     newRefreshToken
//   );

//   return accessToken;
// };

// export default api;

import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import tokenService from "../services/tokenService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 30000,
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 30000,
});

let refreshPromise: Promise<string | null> | null =
  null;

/**
 * Notify AuthContext that the current
 * authentication session is no longer valid.
 */
const notifyAuthenticationFailure = () => {

  window.dispatchEvent(
    new Event("auth:logout")
  );
};

/**
 * Attach access token to every request.
 */
api.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig
  ) => {

    const accessToken =
      tokenService.getAccessToken();

    if (accessToken) {

      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

/**
 * Handle authentication failures.
 */
api.interceptors.response.use(

  (response) =>
    response,

  async (error: AxiosError) => {

    const originalRequest =
      error.config as
        | (
            InternalAxiosRequestConfig & {
              _retry?: boolean;
            }
          )
        | undefined;

    /**
     * Only handle 401 responses.
     */
    if (
      error.response?.status !== 401 ||
      !originalRequest
    ) {

      return Promise.reject(error);
    }

    /**
     * Never attempt to refresh the refresh-token
     * request itself.
     */
    if (
      originalRequest.url?.includes(
        "/auth/refresh-token"
      )
    ) {

      tokenService.clearTokens();

      notifyAuthenticationFailure();

      return Promise.reject(error);
    }

    /**
     * Prevent infinite retry loops.
     */
    if (originalRequest._retry) {

      tokenService.clearTokens();

      notifyAuthenticationFailure();

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken =
      tokenService.getRefreshToken();

    /**
     * No refresh token means the session
     * cannot be recovered.
     */
    if (!refreshToken) {

      tokenService.clearTokens();

      notifyAuthenticationFailure();

      return Promise.reject(error);
    }

    try {

      /**
       * If another request is already refreshing,
       * wait for that request instead of creating
       * another refresh request.
       */
      if (!refreshPromise) {

        refreshPromise =
          refreshAccessToken(
            refreshToken
          );
      }

      const newAccessToken =
        await refreshPromise;

      refreshPromise = null;

      /**
       * Refresh failed.
       */
      if (!newAccessToken) {

        tokenService.clearTokens();

        notifyAuthenticationFailure();

        return Promise.reject(error);
      }

      /**
       * Retry original request with
       * the newly issued access token.
       */
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api.request(
        originalRequest
      );

    } catch (refreshError) {

      refreshPromise = null;

      tokenService.clearTokens();

      notifyAuthenticationFailure();

      return Promise.reject(
        refreshError
      );
    }
  }
);

/**
 * Refresh the authentication tokens.
 */
const refreshAccessToken = async (
  refreshToken: string
): Promise<string | null> => {

  const response =
    await refreshClient.post(
      "/auth/refresh-token",
      {
        refreshToken,
      }
    );

  /**
   * Adjust this section if your refresh endpoint
   * wraps tokens inside `data`.
   */
  const {
    accessToken,
    refreshToken: newRefreshToken,
  } =
    response.data;

  if (
    !accessToken ||
    !newRefreshToken
  ) {

    return null;
  }

  tokenService.setTokens(
    accessToken,
    newRefreshToken
  );

  return accessToken;
};

export default api;