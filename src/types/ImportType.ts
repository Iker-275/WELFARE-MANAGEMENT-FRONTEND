export interface ImportType {
  code: string;
  name: string;
  description: string;
}

export interface ImportTypesResponse {
  success: boolean;
  message: string;
  data: ImportType[];
}