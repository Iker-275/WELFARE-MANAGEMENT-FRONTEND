import api from "./api";

import {
  ImportDetailsResponse,
  ImportErrorsResponse,
  ImportPreviewPayload,
  ImportPreviewResponse,
  ImportResponse,
  ImportsResponse,
} from "../types/ImportTypes";

export const importService = {

  /**
   * Generate an import preview.
   *
   * POST /imports/preview
   *
   * multipart/form-data:
   * - file
   * - type
   */
  preview: async (
    payload: ImportPreviewPayload
  ): Promise<ImportPreviewResponse> => {

    const formData = new FormData();

    formData.append(
      "file",
      payload.file
    );

    formData.append(
      "type",
      payload.type
    );

    const { data } =
      await api.post<ImportPreviewResponse>(
        "/imports/preview",
        formData
      );

    return data;
  },

  /**
   * Execute a previously previewed import.
   *
   * POST /imports/:importId/execute
   */
  execute: async (
    importId: string
  ): Promise<ImportResponse> => {

    const { data } =
      await api.post<ImportResponse>(
        `/imports/${importId}/execute`
      );

    return data;
  },

  /**
   * Get all import jobs.
   *
   * GET /imports
   */
  getAll: async (): Promise<ImportsResponse> => {

    const { data } =
      await api.get<ImportsResponse>(
        "/imports"
      );

    return data;
  },

  /**
   * Get a single import job.
   *
   * GET /imports/:importId
   */
  getById: async (
    importId: string
  ): Promise<ImportDetailsResponse> => {

    const { data } =
      await api.get<ImportDetailsResponse>(
        `/imports/${importId}`
      );

    return data;
  },

  /**
   * Get errors belonging to an import.
   *
   * GET /imports/:importId/errors
   */
  getErrors: async (
    importId: string
  ): Promise<ImportErrorsResponse> => {

    const { data } =
      await api.get<ImportErrorsResponse>(
        `/imports/${importId}/errors`
      );

    return data;
  },
};

export default importService;