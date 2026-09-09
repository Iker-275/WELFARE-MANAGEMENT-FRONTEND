import {
  createContext,
  ReactNode,
  useCallback,
  useState,
} from "react";

import genderApi from "../api/GenderApi";

import {
  GenderOption,
} from "../types/GenderType";

import {
  getApiError,
} from "../utils/apiError";

interface GenderContextType {

  genders: GenderOption[];

  loading: boolean;

  message: string;

  loadGenders(): Promise<boolean>;

  clearMessage(): void;
}

interface GenderProviderProps {
  children: ReactNode;
}

export const GenderContext =
  createContext<
    GenderContextType | null
  >(null);

export const GenderProvider = ({
  children,
}: GenderProviderProps) => {

  const [
    genders,
    setGenders,
  ] = useState<GenderOption[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const loadGenders = useCallback(
    async (): Promise<boolean> => {

      try {

        setLoading(true);
        setMessage("");

        const response =
          await genderApi
            .getGenders();

        setMessage(
          response.message
        );

        if (response.success) {

          setGenders(
            response.data
          );
        }

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
    },
    []
  );

  const clearMessage = () => {
    setMessage("");
  };

  const value: GenderContextType = {

    genders,

    loading,

    message,

    loadGenders,

    clearMessage,
  };

  return (
    <GenderContext.Provider
      value={value}
    >
      {children}
    </GenderContext.Provider>
  );
};