import axios from "axios";

export interface NormalizedApiError {
  message: string;
  code: string | null;
  errors: unknown;
}

export const getApiError = (
  error: unknown
): NormalizedApiError => {

  if (axios.isAxiosError(error)) {

    const data = error.response?.data;

    if (data) {
      return {
        message:
          data.message ||
          "Something went wrong",

        code:
          data.code ?? null,

        errors:
          data.errors ?? null,
      };
    }

    return {
      message:
        error.message ||
        "Network error. Please try again.",

      code: null,
      errors: null,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: null,
      errors: null,
    };
  }

  return {
    message: "Something went wrong",
    code: null,
    errors: null,
  };
};