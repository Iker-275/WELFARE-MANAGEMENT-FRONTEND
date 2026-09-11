
import {
  createContext,
  ReactNode,
  useCallback,
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

import {
  getApiError,
} from "../utils/apiError";

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
   * Current import preview.
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
   *
   * Collection fetching is controlled
   * by the page.
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

  /**
   * Clear current preview.
   */
  clearPreview: () => void;

  /**
   * Clear notification message.
   */
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

  const [
    imports,
    setImports,
  ] = useState<ImportJob[]>([]);

  const [
    selectedImport,
    setSelectedImport,
  ] = useState<ImportDetails | null>(
    null
  );

  const [
    preview,
    setPreview,
  ] = useState<ImportPreview | null>(
    null
  );

  const [
    errors,
    setErrors,
  ] = useState<ImportRowError[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  /*
   * ============================================================
   * PREVIEW IMPORT
   * ============================================================
   */

  const previewImport =
    useCallback(
      async (
        payload: ImportPreviewPayload
      ): Promise<boolean> => {

        setLoading(true);
        setMessage("");
        setErrors([]);

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

          /*
           * Store the dynamic preview.
           */
          setPreview(
            response.data.preview
          );

          /*
           * The preview endpoint creates
           * the import job as well.
           *
           * The returned job is the job
           * that will later be executed.
           */
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

  /*
   * ============================================================
   * EXECUTE IMPORT
   * ============================================================
   */

  const executeImport =
    useCallback(
      async (
        importId: string
      ): Promise<boolean> => {

        setLoading(true);
        setMessage("");

        try {

          const response =
            await importService.execute(
              importId
            );

          if (!response.success) {

            setMessage(
              response.message ??
                "Import execution failed."
            );

            return false;
          }

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

  /*
   * ============================================================
   * FETCH IMPORTS
   * ============================================================
   */

  const fetchImports =
    useCallback(
      async (): Promise<boolean> => {

        setLoading(true);
        setMessage("");

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

  /*
   * ============================================================
   * FETCH IMPORT
   * ============================================================
   */

  const fetchImport =
    useCallback(
      async (
        importId: string
      ): Promise<ImportDetails | null> => {

        setLoading(true);
        setMessage("");

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

          setSelectedImport(
            null
          );

          return null;

        } finally {

          setLoading(false);
        }
      },
      []
    );

  /*
   * ============================================================
   * FETCH IMPORT ERRORS
   * ============================================================
   */

  const fetchImportErrors =
    useCallback(
      async (
        importId: string
      ): Promise<boolean> => {

        setLoading(true);
        setMessage("");

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

          setErrors([]);

          return false;

        } finally {

          setLoading(false);
        }
      },
      []
    );

  /*
   * ============================================================
   * CLEAR PREVIEW
   * ============================================================
   */

  const clearPreview =
    useCallback(() => {

      setPreview(null);

      setSelectedImport(null);

      setErrors([]);

      setMessage("");

    }, []);

  /*
   * ============================================================
   * CLEAR MESSAGE
   * ============================================================
   */

  const clearMessage =
    useCallback(() => {

      setMessage("");

    }, []);

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