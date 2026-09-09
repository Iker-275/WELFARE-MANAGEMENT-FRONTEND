import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import importTypeService from "../api/ImportTypeApi";

import {
  ImportType,
} from "../types/ImportType";

import {
  getApiError,
} from "../utils/apiError";

interface ImportTypeContextType {

  importTypes: ImportType[];

  loading: boolean;

  message: string;

  fetchImportTypes: () => Promise<boolean>;

  clearMessage: () => void;

  setMessage: React.Dispatch<
    React.SetStateAction<string>
  >;
}

export const ImportTypeContext =
  createContext<
    ImportTypeContextType | undefined
  >(undefined);

interface ImportTypeProviderProps {
  children: ReactNode;
}

export const ImportTypeProvider = ({
  children,
}: ImportTypeProviderProps) => {

  const [importTypes, setImportTypes] =
    useState<ImportType[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  /**
   * Fetch available import types.
   */
  const fetchImportTypes =
    useCallback(async (): Promise<boolean> => {

      setLoading(true);

      try {

        const response =
          await importTypeService.getAll();

        if (!response.success) {

          setMessage(
            response.message ||
              "Failed to retrieve import types."
          );

          return false;
        }

        setImportTypes(
          response.data
        );

        return true;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return false;

      } finally {

        setLoading(false);
      }
    }, []);

  /**
   * Clear current message.
   */
  const clearMessage = useCallback(() => {

    setMessage("");

  }, []);

  /**
   * Load import types when provider mounts.
   */
  useEffect(() => {

    fetchImportTypes();

  }, [fetchImportTypes]);

  return (
    <ImportTypeContext.Provider
      value={{
        importTypes,
        loading,
        message,

        fetchImportTypes,

        clearMessage,
        setMessage,
      }}
    >
      {children}
    </ImportTypeContext.Provider>
  );
};

export default ImportTypeProvider;