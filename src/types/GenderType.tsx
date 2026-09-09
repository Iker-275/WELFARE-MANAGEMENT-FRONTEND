export interface GenderOption {
  code: string;
  name: string;
  description: string;
}

export type Gender =
  | "MALE"
  | "FEMALE"
  | "OTHER";

export interface GenderResponse {
  success: boolean;
  message: string;
  data: GenderOption[];
}