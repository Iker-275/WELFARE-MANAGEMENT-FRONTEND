import api from "./api";

import {
  CreateEmploymentPayload,
  EmploymentActionResponse,
  EmploymentResponse,
  UpdateEmploymentPayload,
} from "../types/EmploymentType";

export const employmentService = {

  // ============================================================
  // SELF-SERVICE
  // ============================================================

  /**
   * Get employment information for the
   * currently authenticated member.
   */
  getMyEmployment: async (): Promise<EmploymentResponse> => {

    const { data } =
      await api.get<EmploymentResponse>(
        "/employment/me"
      );

    return data;
  },


  /**
   * Create employment information for
   * the currently authenticated member.
   */
  createMyEmployment: async (
    payload: CreateEmploymentPayload
  ): Promise<EmploymentResponse> => {

    const { data } =
      await api.post<EmploymentResponse>(
        "/employment/me",
        payload
      );

    return data;
  },


  /**
   * Update employment information for
   * the currently authenticated member.
   */
  updateMyEmployment: async (
    payload: UpdateEmploymentPayload
  ): Promise<EmploymentResponse> => {

    const { data } =
      await api.patch<EmploymentResponse>(
        "/employment/me",
        payload
      );

    return data;
  },


  /**
   * Delete employment information for
   * the currently authenticated member.
   */
  deleteMyEmployment: async (): Promise<EmploymentActionResponse> => {

    const { data } =
      await api.delete<EmploymentActionResponse>(
        "/employment/me"
      );

    return data;
  },


  // ============================================================
  // ADMIN / MEMBER MANAGEMENT
  // ============================================================

  /**
   * Create employment information for a member.
   */
  createMemberEmployment: async (
    memberId: string,
    payload: CreateEmploymentPayload
  ): Promise<EmploymentResponse> => {

    const { data } =
      await api.post<EmploymentResponse>(
        `/employment/member/${memberId}`,
        payload
      );

    return data;
  },


  /**
   * Get employment information for a member.
   */
  getMemberEmployment: async (
    memberId: string
  ): Promise<EmploymentResponse> => {

    const { data } =
      await api.get<EmploymentResponse>(
        `/employment/member/${memberId}`
      );

    return data;
  },


  /**
   * Update employment information for a member.
   */
  updateMemberEmployment: async (
    memberId: string,
    payload: UpdateEmploymentPayload
  ): Promise<EmploymentResponse> => {

    const { data } =
      await api.patch<EmploymentResponse>(
        `/employment/member/${memberId}`,
        payload
      );

    return data;
  },


  /**
   * Get a specific employment record by ID.
   */
  getEmployment: async (
    employmentId: string
  ): Promise<EmploymentResponse> => {

    const { data } =
      await api.get<EmploymentResponse>(
        `/member-employment/${employmentId}`
      );

    return data;
  },


  /**
   * Delete a specific employment record by ID.
   */
  deleteEmployment: async (
    employmentId: string
  ): Promise<EmploymentActionResponse> => {

    const { data } =
      await api.delete<EmploymentActionResponse>(
        `/member-employment/${employmentId}`
      );

    return data;
  },
};

export default employmentService;