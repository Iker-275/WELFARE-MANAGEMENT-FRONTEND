import api from "./api";

import {
  RegisterPayload,
  RegisterResponse,
  VerifyEmailPayload,
  VerifyEmailResponse,
  LoginPayload,
  LoginResponse,
  VerifyLoginPayload,
  VerifyLoginResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
  LogoutPayload,
  LogoutResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "../types/AuthTypes";

export const authApi = {

  async register(
    payload: RegisterPayload
  ): Promise<RegisterResponse> {

    const response = await api.post(
      "/auth/register",
      payload
    );

    return response.data;
  },

  async verifyEmail(
    payload: VerifyEmailPayload
  ): Promise<VerifyEmailResponse> {

    const response = await api.post(
      "/auth/verify-email",
      payload
    );

    return response.data;
  },

  async login(
    payload: LoginPayload
  ): Promise<LoginResponse> {

    const response = await api.post(
      "/auth/login",
      payload
    );

    return response.data;
  },

  async verifyLogin(
    payload: VerifyLoginPayload
  ): Promise<VerifyLoginResponse> {

    const response = await api.post(
      "/auth/verify-login",
      payload
    );

    return response.data;
  },

  async refreshToken(
    payload: RefreshTokenPayload
  ): Promise<RefreshTokenResponse> {

    const response = await api.post(
      "/auth/refresh-token",
      payload
    );

    return response.data;
  },

  async logout(
    payload: LogoutPayload
  ): Promise<LogoutResponse> {

    const response = await api.post(
      "/auth/logout",
      payload
    );

    return response.data;
  },

  async forgotPassword(
    payload: ForgotPasswordPayload
  ): Promise<ForgotPasswordResponse> {

    const response = await api.post(
      "/auth/forgot-password",
      payload
    );

    return response.data;
  },

  async resetPassword(
    payload: ResetPasswordPayload
  ): Promise<ResetPasswordResponse> {

    const response = await api.post(
      "/auth/reset-password",
      payload
    );

    return response.data;
  },
};

export default authApi;