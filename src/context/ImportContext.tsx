import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import importService from "../api/ImportApi";

import {
  ImportDetails,
  ImportJob,
  ImportPreview,
  ImportPreviewPayload,
  ImportRowError,
} from "../types/ImportTypes";

import { getApiError } from "../utils/apiError";

interface ImportContextType {

  /**
   * Import jobs.
   */
  imports: ImportJob[];

  /**
   * Currently selected import.
   */
  selectedImport: ImportDetails | null;

  /**
   * Current preview.
   */
  preview: ImportPreview | null;

  /**
   * Errors returned by the
   * import errors endpoint.
   */
  errors: ImportRowError[];

  loading: boolean;

  message: string;

  /**
   * Generate preview from spreadsheet.
   */
  previewImport: (
    payload: ImportPreviewPayload
  ) => Promise<boolean>;

  /**
   * Execute import.
   */
  executeImport: (
    importId: string
  ) => Promise<boolean>;

  /**
   * Get all imports.
   */
  fetchImports: () => Promise<boolean>;

  /**
   * Get a specific import.
   */
  fetchImport: (
    importId: string
  ) => Promise<ImportDetails | null>;

  /**
   * Get import errors.
   */
  fetchImportErrors: (
    importId: string
  ) => Promise<boolean>;

  clearPreview: () => void;

  clearMessage: () => void;

  setMessage: React.Dispatch<
    React.SetStateAction<string>
  >;
}

export const ImportContext =
  createContext<ImportContextType | undefined>(
    undefined
  );

interface ImportProviderProps {
  children: ReactNode;
}

export const ImportProvider = ({
  children,
}: ImportProviderProps) => {

  const [imports, setImports] =
    useState<ImportJob[]>([]);

  const [selectedImport, setSelectedImport] =
    useState<ImportDetails | null>(null);

  const [preview, setPreview] =
    useState<ImportPreview | null>(null);

  const [errors, setErrors] =
    useState<ImportRowError[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  /**
   * Preview import.
   */
  const previewImport = useCallback(
    async (
      payload: ImportPreviewPayload
    ): Promise<boolean> => {

      setLoading(true);
      setMessage("");

      try {

        const response =
          await importService.preview(
            payload
          );

        if (!response.success) {

          setMessage(
            response.message ??
              "Import preview failed."
          );

          return false;
        }

        setPreview(
          response.data.preview
        );

        setSelectedImport(
          response.data.importJob as ImportDetails
        );

        setMessage(
          response.message ?? ""
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
    },
    []
  );

  /**
   * Execute import.
   */
//   const executeImport = useCallback(
//     async (
//       importId: string
//     ): Promise<boolean> => {

//       setLoading(true);
//       setMessage("");

//       try {

//         const response =
//           await importService.execute(
//             importId
//           );

//         if (!response.success) {

//           setMessage(
//             response.message ??
//               "Import execution failed."
//           );

//           return false;
//         }

//         setMessage(
//           response.message ?? ""
//         );

//         /**
//          * Refresh the import list so the
//          * latest status is available.
//          */
//         await fetchImports();

//         /**
//          * Refresh the individual import.
//          */
//         await fetchImport(importId);

//         return true;

//       } catch (error) {

//         /**
//          * IMPORTANT:
//          *
//          * If backend returns:
//          *
//          * Unique constraint failed on
//          * the fields: (email)
//          *
//          * getApiError preserves that message.
//          */
//         setMessage(
//           getApiError(error).message
//         );

//         /**
//          * Even when execution fails at HTTP level,
//          * refresh the import because the backend may
//          * have changed its status to FAILED.
//          */
//         await fetchImports();
//         await fetchImport(importId);

//         return false;

//       } finally {

//         setLoading(false);
//       }
//     },
//     []
//   );
const executeImport = useCallback(
  async (importId: string): Promise<boolean> => {
    setLoading(true);
    setMessage("");

    try {
      const response =
        await importService.execute(importId);

      if (!response.success) {
        setMessage(
          response.message ??
            "Import execution failed."
        );

        return false;
      }

      setMessage(response.message ?? "");

      return true;

    } catch (error) {
      setMessage(
        getApiError(error).message
      );

      return false;

    } finally {
      setLoading(false);
    }
  },
  []
);
  /**
   * Get all imports.
   */
  const fetchImports = useCallback(
    async (): Promise<boolean> => {

      setLoading(true);

      try {

        const response =
          await importService.getAll();

        if (!response.success) {

          setMessage(
            response.message ??
              "Failed to retrieve imports."
          );

          return false;
        }

        setImports(
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
    },
    []
  );

  /**
   * Get one import.
   */
  const fetchImport = useCallback(
    async (
      importId: string
    ): Promise<ImportDetails | null> => {

      setLoading(true);

      try {

        const response =
          await importService.getById(
            importId
          );

        if (!response.success) {

          setMessage(
            response.message ??
              "Failed to retrieve import."
          );

          return null;
        }

        setSelectedImport(
          response.data
        );

        return response.data;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return null;

      } finally {

        setLoading(false);
      }
    },
    []
  );

  /**
   * Get import errors.
   */
  const fetchImportErrors = useCallback(
    async (
      importId: string
    ): Promise<boolean> => {

      setLoading(true);

      try {

        const response =
          await importService.getErrors(
            importId
          );

        if (!response.success) {

          setMessage(
            response.message ??
              "Failed to retrieve import errors."
          );

          return false;
        }

        setErrors(
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
    },
    []
  );

  /**
   * Clear current preview.
   */
  const clearPreview = useCallback(() => {

    setPreview(null);
    setSelectedImport(null);
    setMessage("");

  }, []);

  /**
   * Clear notification message.
   */
  const clearMessage = useCallback(() => {

    setMessage("");

  }, []);

  useEffect(() => {

    fetchImports();

  }, [fetchImports]);

  return (
    <ImportContext.Provider
      value={{
        imports,
        selectedImport,
        preview,
        errors,

        loading,
        message,

        previewImport,
        executeImport,
        fetchImports,
        fetchImport,
        fetchImportErrors,

        clearPreview,
        clearMessage,

        setMessage,
      }}
    >
      {children}
    </ImportContext.Provider>
  );
};

export default ImportProvider;