
import { jwtDecode } from "jwt-decode";

export interface AccessTokenPayload {
  id: string;
  sessionId: string;
  roleId: string;
  email: string;
  jti: string;
  iat: number;
  exp: number;
}

export const decodeAccessToken = (
  token: string
): AccessTokenPayload | null => {

  try {

    return jwtDecode<AccessTokenPayload>(
      token
    );

  } catch {

    return null;
  }
};


export const isTokenExpired = (
  token: string
): boolean => {

  const payload =
    decodeAccessToken(token);

  if (!payload?.exp) {
    return true;
  }

  return (
    payload.exp * 1000 <= Date.now()
  );
};


export const getTokenExpiry = (
  token: string
): number | null => {

  const payload =
    decodeAccessToken(token);

  if (!payload?.exp) {
    return null;
  }

  return payload.exp * 1000;
};


export const authToken = {

  decode: decodeAccessToken,

  isExpired: isTokenExpired,

  getExpiry: getTokenExpiry,
};


export default authToken;