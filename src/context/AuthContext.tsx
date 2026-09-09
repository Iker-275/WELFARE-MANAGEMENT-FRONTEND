import {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  RegisterPayload,
  VerifyEmailPayload,
  LoginPayload,
  VerifyLoginPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from "../types/AuthTypes";

import { User } from "../types/UserType";

import authApi from "../api/AuthApi";

import tokenService from "../services/tokenService";
import authStorage from "../services/authStorage";
import authToken from "../services/authToken";
import { getApiError } from "../utils/apiError";


interface AuthContextType {
  user: User | null;

  loading: boolean;

  authReady: boolean;

  message: string;

  requiresOtp: boolean;

  requiresProfileCompletion: boolean;

  setMessage: React.Dispatch<
    React.SetStateAction<string>
  >;

  register(
    payload: RegisterPayload
  ): Promise<boolean>;

  verifyEmail(
    payload: VerifyEmailPayload
  ): Promise<boolean>;

  login(
    payload: LoginPayload
  ): Promise<boolean>;

  verifyLogin(
    payload: VerifyLoginPayload
  ): Promise<boolean>;

  forgotPassword(
    payload: ForgotPasswordPayload
  ): Promise<boolean>;

  resetPassword(
    payload: ResetPasswordPayload
  ): Promise<boolean>;

  logout(
    allSessions?: boolean
  ): Promise<boolean>;
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

  const [requiresOtp, setRequiresOtp] =
    useState(false);

  const [
    requiresProfileCompletion,
    setRequiresProfileCompletion,
  ] = useState(false);

  const [authReady, setAuthReady] =
  useState(false);


useEffect(() => {
  const restoreAuthentication = () => {
    try {
      const storedUser =
        authStorage.getUser();

      const accessToken =
        tokenService.getAccessToken();

      const refreshToken =
        tokenService.getRefreshToken();

      /*
       * No valid persisted authentication
       */
      if (
        !storedUser ||
        !accessToken ||
        !refreshToken
      ) {
        setUser(null);
        return;
      }

      /*
       * Check whether access token is expired
       */
      if (
        authToken.isExpired(accessToken)
      ) {
        tokenService.clearTokens();
        authStorage.clearUser();
        setUser(null);
        return;
      }

      /*
       * Restore authenticated user
       */
      setUser(storedUser);

    } finally {
      /*
       * Authentication state has now
       * been restored/checked.
       */
      setAuthReady(true);
    }
  };

  restoreAuthentication();
}, []);
  const register = async (
    payload: RegisterPayload
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setMessage("");

      setRequiresOtp(false);

      const response =
        await authApi.register(payload);

      setMessage(
        response.message
      );

      setRequiresOtp(
        response.success
      );

      return response.success;

    } catch (error) {
      const apiError =
        getApiError(error);

      setMessage(
        apiError.message
      );

      return false;

    } finally {
      setLoading(false);
    }
  };
  /*
   * VERIFY EMAIL
   */
  const verifyEmail = async (
    payload: VerifyEmailPayload
  ): Promise<boolean> => {

    try {

      setLoading(true);
      setMessage("");

      const response =
        await authApi.verifyEmail(
          payload
        );

      setMessage(
        response.message
      );

      setUser(
        response.user
      );

      authStorage.setUser(
        response.user
      );

      setRequiresProfileCompletion(
        response.requiresProfileCompletion
      );

      return response.success;

    } catch (error) {

      const apiError =
        getApiError(error);

      setMessage(
        apiError.message
      );

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
      setMessage("");

      setRequiresOtp(false);

      const response =
        await authApi.login(payload);

      setMessage(
        response.message
      );

      setRequiresOtp(
        response.requiresOtp
      );

      return response.success;

    } catch (error) {
      const apiError =
        getApiError(error);

      setMessage(
        apiError.message
      );

      return false;

    } finally {
      setLoading(false);
    }
  };
  /*
   * VERIFY LOGIN
   *
   * This is where authentication actually completes.
   */
  const verifyLogin = async (
    payload: VerifyLoginPayload
  ): Promise<boolean> => {

    try {

      setLoading(true);
      setMessage("");

      const response =
        await authApi.verifyLogin(
          payload
        );

      setMessage(
        response.message
      );

      /*
       * Store authentication tokens
       */
      tokenService.setTokens(
        response.accessToken,
        response.refreshToken
      );

      /*
       * Store authenticated user
       */
      authStorage.setUser(
        response.user
      );

      setUser(
        response.user
      );

      /*
       * OTP flow completed
       */
      setRequiresOtp(false);

      /*
       * Navigation decision
       */
      setRequiresProfileCompletion(
        response.requiresProfileCompletion
      );

      return response.success;

    } catch (error) {

      const apiError =
        getApiError(error);

      setMessage(
        apiError.message
      );

      return false;

    } finally {

      setLoading(false);
    }
  };

  /*
   * FORGOT PASSWORD
   */
  const forgotPassword = async (
    payload: ForgotPasswordPayload
  ): Promise<boolean> => {

    try {

      setLoading(true);
      setMessage("");

      const response =
        await authApi.forgotPassword(
          payload
        );

      setMessage(
        response.message
      );

      return response.success;

    } catch (error) {

      const apiError =
        getApiError(error);

      setMessage(
        apiError.message
      );

      return false;

    } finally {

      setLoading(false);
    }
  };

  /*
   * RESET PASSWORD
   */
  const resetPassword = async (
    payload: ResetPasswordPayload
  ): Promise<boolean> => {

    try {

      setLoading(true);
      setMessage("");

      const response =
        await authApi.resetPassword(
          payload
        );

      setMessage(
        response.message
      );

      return response.success;

    } catch (error) {

      const apiError =
        getApiError(error);

      setMessage(
        apiError.message
      );

      return false;

    } finally {

      setLoading(false);
    }
  };

  /*
   * LOGOUT
   */
  const logout = async (
    allSessions = true
  ): Promise<boolean> => {

    try {

      setLoading(true);

      const refreshToken =
        tokenService.getRefreshToken();

      /*
       * Try to notify backend.
       */
      if (refreshToken) {

        const response =
          await authApi.logout({
            refreshToken,
            allSessions,
          });

        setMessage(
          response.message
        );
      }

      return true;

    } catch (error) {

      const apiError =
        getApiError(error);

      setMessage(
        apiError.message
      );

      return false;

    } finally {

      /*
       * Always clear local authentication
       */
      tokenService.clearTokens();

      authStorage.clearUser();

      setUser(null);

      setRequiresOtp(false);

      setRequiresProfileCompletion(false);

      setLoading(false);
    }
  };

 
  const value: AuthContextType = {
  user,

  loading,

  authReady,

  message,

  requiresOtp,

  requiresProfileCompletion,

  setMessage,

  register,

  verifyEmail,

  login,

  verifyLogin,

  forgotPassword,

  resetPassword,

  logout,
};
  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};