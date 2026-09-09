export interface NextOfKin {
  id: string;
  memberId: string;

  fullName: string;
  relationship: string;
  phoneNumber: string;
  nationalId: string | null;
  address: string | null;

  createdAt: string;
  updatedAt: string;
}

/**
 * Payload used when creating a Next of Kin.
 */
export interface CreateNextOfKinPayload {
  fullName: string;
  relationship: string;
  phoneNumber: string;
  nationalId?: string | null;
  address?: string | null;
}

/**
 * Payload used when updating a Next of Kin.
 *
 * The current backend examples show all fields
 * being supplied, so we keep the fields required.
 */
export interface UpdateNextOfKinPayload {
  fullName: string;
  relationship: string;
  phoneNumber: string;
  nationalId?: string | null;
  address?: string | null;
}

/**
 * Generic single NOK response.
 */
export interface NextOfKinResponse {
  success: boolean;
  message: string;
  data: NextOfKin | null;
}