import { User } from "./UserType";

export type OtpChannel =
  | "EMAIL"
  | "SMS"
  | "WHATSAPP";

export type Gender =
  | "MALE"
  | "FEMALE"
  | "OTHER";

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code: string | null;
  errors: unknown;
}

/* =========================
   REGISTER
========================= */

export interface RegisterPayload {
  email: string;
  phoneNumber: string;
  password: string;
  otpChannel: OtpChannel;
  firstName: string;
  lastName: string;
  gender: Gender;
}

export type RegisterResponse =
  ApiResponse;

/* =========================
   VERIFY EMAIL
========================= */

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface MemberSummary {
  id: string;
  membershipNumber: string;
  status: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  requiresProfileCompletion: boolean;
  user: User;
  member: MemberSummary;
}

/* =========================
   LOGIN
========================= */

export interface LoginPayload {
  identifier: string;
  password: string;
  otpChannel: OtpChannel;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  requiresOtp: boolean;
}

/* =========================
   VERIFY LOGIN
========================= */

export interface VerifyLoginPayload {
  identifier: string;
  otp: string;
}

export interface VerifyLoginResponse {
  success: boolean;
  message: string;
  requiresProfileCompletion: boolean;
  accessToken: string;
  refreshToken: string;
  user: User;
}

/* =========================
   REFRESH TOKEN
========================= */

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

/* =========================
   LOGOUT
========================= */

export interface LogoutPayload {
  refreshToken: string;
  allSessions: boolean;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

/* =========================
   FORGOT PASSWORD
========================= */

export interface ForgotPasswordPayload {
  identifier: string;
  otpChannel: OtpChannel;
}

export type ForgotPasswordResponse =
  ApiResponse;

/* =========================
   RESET PASSWORD
========================= */

export interface ResetPasswordPayload {
  identifier: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export type ResetPasswordResponse =
  ApiResponse;


  