// import axios from "axios";
// import  api  from "./api";

// import {
//   RegisterPayload,
//   VerifyEmailPayload,
//   LoginPayload,
//   ForgotPasswordPayload,
//   ResetPasswordPayload,
//   AuthResponse,
// } from "../types/AuthTypes";



// export const getErrorMessage = (error: unknown): string => {
//   if (axios.isAxiosError(error)) {
//     return (
//       error.response?.data?.message ||
//       error.message ||
//       "Something went wrong"
//     );
//   }

//   if (error instanceof Error) {
//     return error.message;
//   }

//   return "Something went wrong";
// };

// export const registerApi = async (
//   payload: RegisterPayload
// ) => {
//   const response = await api.post(
//     "/register",
//     payload
//   );

//   return response.data;
// };

// export const verifyEmailApi = async (
//   payload: VerifyEmailPayload
// ): Promise<AuthResponse> => {
//   const response = await api.post(
//     "/verify-email",
//     payload
//   );

//   return response.data;
// };
// export const loginApi = async (
//   payload: LoginPayload
// ): Promise<AuthResponse> => {
//   const response = await api.post(
//     "/login",
//     payload
//   );

//   return response.data;
// };
// export const forgotPasswordApi = async (
//   payload: ForgotPasswordPayload
// ) => {
//   const response = await api.post(
//     "/forgot-password",
//     payload
//   );

//   return response.data;
// };

// export const resetPasswordApi = async (
//   payload: ResetPasswordPayload
// ) => {
//   const response = await api.post(
//     "/reset-password",
//     payload
//   );

//   return response.data;
// };

import axios from "axios";
import api from "./api";

import {
  RegisterPayload,
  VerifyEmailPayload,
  LoginPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  AuthResponse,
} from "../types/AuthTypes";

export const getErrorMessage = (
  error: unknown
): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Something went wrong"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

export const authService = {
  async register(
    payload: RegisterPayload
  ) {
    const response = await api.post(
      "/register",
      payload
    );

    return response.data;
  },

  async verifyEmail(
    payload: VerifyEmailPayload
  ): Promise<AuthResponse> {
    const response = await api.post(
      "/verify-email",
      payload
    );

    return response.data;
  },

  async login(
    payload: LoginPayload
  ): Promise<AuthResponse> {
    const response = await api.post(
      "/login",
      payload
    );

    return response.data;
  },

  async forgotPassword(
    payload: ForgotPasswordPayload
  ) {
    const response = await api.post(
      "/forgot-password",
      payload
    );

    return response.data;
  },

  async resetPassword(
    payload: ResetPasswordPayload
  ) {
    const response = await api.post(
      "/reset-password",
      payload
    );

    return response.data;
  },
};

export default authService;

