export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code: string | null;
  errors: unknown;
}


export interface ApiFeedback {
  type: "success" | "error";
  message: string;
}