import { User } from "./UserType";

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

// export interface AuthResponse {
//   success: boolean;
//   message: string;

//   accessToken?: string | null;
//   refreshToken?: string | null;

//   signupCompleted?: boolean;

//   user?: User;
// }
export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  signupCompleted?: boolean;
  user: User;
}