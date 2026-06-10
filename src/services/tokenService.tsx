const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";

export const tokenService = {
  setTokens(accessToken: string | null, refreshToken: string | null) {
    localStorage.setItem(ACCESS_TOKEN, accessToken || "");
    localStorage.setItem(REFRESH_TOKEN, refreshToken || "");
  },

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN);
  },

  clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  },
};