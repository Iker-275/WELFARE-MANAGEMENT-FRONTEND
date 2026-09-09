export type ImportType =
  | "MEMBERS"
  | "USERS"
  | "EMPLOYMENT"
  | "DEPENDANTS"
  | "NEXT_OF_KIN";

export type ImportStatus =
  | "UPLOADED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export interface ImportJob {
  id: string;
  type: ImportType;
  status: ImportStatus;

  filename: string;
  originalName: string;

  fileId: string;
  createdById: string;

  totalRows: number;
  validRows: number;
  invalidRows: number;
  processedRows: number;
  successfulRows: number;
  failedRows: number;

  columnMapping: Record<string, string>;

  errorMessage: string | null;

  createdAt: string;
  updatedAt: string;

  startedAt: string | null;
  completedAt: string | null;

  fileUploadId: string | null;
}

/**
 * Individual validation error returned
 * against a preview row.
 *
 * The backend currently returns strings,
 * but keeping this type flexible allows
 * structured errors later.
 */
export type ImportRowError =
  | string
  | {
      field?: string;
      message: string;
      [key: string]: unknown;
    };

/**
 * Dynamic row returned by the preview API.
 */
export interface ImportPreviewRow {
  rowNumber: number;
  valid: boolean;

  /**
   * Dynamic spreadsheet columns.
   *
   * Example:
   * {
   *   firstName: "Member001",
   *   lastName: "Test001",
   *   email: "member001@example.com",
   *   phoneNumber: "+254710000001",
   *   gender: "MALE"
   * }
   */
  data: Record<string, unknown>;

  errors: ImportRowError[];
}

export interface ImportPreviewSummary {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  ready: boolean;
}

export interface ImportPreview {
  summary: ImportPreviewSummary;

  /**
   * These determine the table columns.
   */
  columns: string[];

  rows: ImportPreviewRow[];

  errors: ImportRowError[];
}

export interface ImportPreviewData {
  importJob: ImportJob;
  preview: ImportPreview;
}

export interface ImportPreviewResponse {
  success: boolean;
  message?: string;
  data: ImportPreviewData;
}

export interface ImportsResponse {
  success: boolean;
  message?: string;
  data: ImportJob[];
}

export interface ImportResponse {
  success: boolean;
  message?: string;
  data: ImportJob;
}

/**
 * GET /imports/:importId returns
 * the import job plus processed rows.
 */
export interface ImportDetails extends ImportJob {
  rows: ImportPreviewRow[];
}

export interface ImportDetailsResponse {
  success: boolean;
  message?: string;
  data: ImportDetails;
}

export interface ImportErrorsResponse {
  success: boolean;
  message?: string;
  data: ImportRowError[];
}

/**
 * Form-data payload for preview.
 */
export interface ImportPreviewPayload {
  file: File;
  type: ImportType;
}