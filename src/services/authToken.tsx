// services/authToken.ts

import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: string;
  email: string;
  roleId: string;
  exp: number;
  iat: number;
}

export const authToken = {
  decode(token: string): JwtPayload | null {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  },

  isExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);

      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  getExpiryTime(token: string): number | null {
    try {
      const decoded = jwtDecode<JwtPayload>(token);

      return decoded.exp * 1000;
    } catch {
      return null;
    }
  },
};