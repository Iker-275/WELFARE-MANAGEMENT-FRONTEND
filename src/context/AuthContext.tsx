
import {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
  ForgotPasswordPayload,
} from "../types/AuthTypes";
import {User} from "../types/UserType";
import { authService } from "../api/AuthApi";
import { tokenService } from "../services/tokenService";
import { getErrorMessage } from "../api/AuthApi";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  message: string;

  setMessage: React.Dispatch<React.SetStateAction<string>>;

  login: (payload: LoginPayload) => Promise<boolean>;

  register: (
    payload: RegisterPayload
  ) => Promise<boolean>;

  verifyEmail: (
    payload: VerifyEmailPayload
  ) => Promise<boolean>;

  forgotPassword: (
    payload: ForgotPasswordPayload
  ) => Promise<boolean>;

  resetPassword: (
    payload: ResetPasswordPayload
  ) => Promise<boolean>;

  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext =
  createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = async (
    payload: RegisterPayload
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response =
        await authService.register(payload);

      setMessage(response.message);

      return response.success;
    } catch (error) {
      setMessage(getErrorMessage(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    payload: LoginPayload
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response =
        await authService.login(payload);

      setMessage(response.message);

      tokenService.setTokens(
        response.accessToken,
        response.refreshToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      setUser(response.user);

      return response.success;
    } catch (error) {
      setMessage(getErrorMessage(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (
    payload: VerifyEmailPayload
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response =
        await authService.verifyEmail(payload);

      setMessage(response.message);

      tokenService.setTokens(
        response.accessToken,
        response.refreshToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      setUser(response.user);

      return response.success;
    } catch (error) {
      setMessage(getErrorMessage(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (
    payload: ForgotPasswordPayload
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response =
        await authService.forgotPassword(payload);

      setMessage(response.message);

      return response.success;
    } catch (error) {
      setMessage(getErrorMessage(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (
    payload: ResetPasswordPayload
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response =
        await authService.resetPassword(payload);

      setMessage(response.message);

      return response.success;
    } catch (error) {
      setMessage(getErrorMessage(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    tokenService.clearTokens();

    localStorage.removeItem("user");

    setUser(null);

    setMessage("Logged out successfully");
  };

  const value: AuthContextType = {
    user,
    loading,
    message,
    setMessage,
    login,
    register,
    verifyEmail,
    forgotPassword,
    resetPassword,
    logout,
  };

  

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// useEffect(() => {
//   const accessToken =
//     tokenService.getAccessToken();

//   const storedUser =
//     localStorage.getItem("user");

//   if (!accessToken || !storedUser) return;

//   if (authToken.isExpired(accessToken)) {
//     logout();
//     return;
//   }

//   setUser(JSON.parse(storedUser));
// }, []);

//automatic logout
// useEffect(() => {
//   const accessToken =
//     tokenService.getAccessToken();

//   if (!accessToken) return;

//   const expiry =
//     authToken.getExpiryTime(accessToken);

//   if (!expiry) return;

//   const remaining =
//     expiry - Date.now();

//   if (remaining <= 0) {
//     logout();
//     return;
//   }

//   const timeout = setTimeout(() => {
//     logout();
//   }, remaining);

//   return () => clearTimeout(timeout);
// }, [user]);