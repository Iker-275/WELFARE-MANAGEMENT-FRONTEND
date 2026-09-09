import { Gender } from "./GenderType";

export interface Dependant {
  id: string;
  memberId: string;

  fullName: string;
  relationship: string;

  dateOfBirth: string | null;
  gender: Gender | null;

  nationalId: string | null;
  birthNotificationNo: string | null;

  isActive: boolean;

  deathDate: string | null;
  burialPermitNo: string | null;

  createdAt: string;
  updatedAt: string;
}

/**
 * Payload used when creating a dependant.
 */
export interface CreateDependantPayload {
  fullName: string;
  relationship: string;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  nationalId?: string | null;
  birthNotificationNo?: string | null;
}

/**
 * Payload used when updating a dependant.
 */
export interface UpdateDependantPayload {
  fullName: string;
  relationship: string;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  nationalId?: string | null;
  birthNotificationNo?: string | null;
}

/**
 * Standard single dependant response.
 */
export interface DependantResponse {
  success: boolean;
  message: string;
  data: Dependant | null;
}

/**
 * Response containing multiple dependants.
 */
export interface DependantsResponse {
  success: boolean;
  message: string;
  data: Dependant[];
}