import api from "./api";

import {
  CreateDependantPayload,
  DependantResponse,
  DependantsResponse,
  UpdateDependantPayload,
} from "../types/DependantType";

export const dependantService = {

  // =========================================================
  // SELF SERVICE
  // =========================================================

  /**
   * Get dependants belonging to the
   * currently authenticated member.
   *
   * GET /dependants/me
   */
  getMyDependants: async (): Promise<DependantsResponse> => {

    const { data } =
      await api.get<DependantsResponse>(
        "/dependants/me"
      );

    return data;
  },

  /**
   * Create a dependant for the
   * currently authenticated member.
   *
   * POST /dependants/me
   */
  createMyDependant: async (
    payload: CreateDependantPayload
  ): Promise<DependantResponse> => {

    const { data } =
      await api.post<DependantResponse>(
        "/dependants/me",
        payload
      );

    return data;
  },

  /**
   * Update one of the currently authenticated
   * member's dependants.
   *
   * PATCH /dependants/me/:dependantId
   */
  updateMyDependant: async (
    dependantId: string,
    payload: UpdateDependantPayload
  ): Promise<DependantResponse> => {

    const { data } =
      await api.patch<DependantResponse>(
        `/dependants/me/${dependantId}`,
        payload
      );

    return data;
  },

  /**
   * Delete one of the currently authenticated
   * member's dependants.
   *
   * DELETE /dependants/me/:dependantId
   */
  deleteMyDependant: async (
    dependantId: string
  ): Promise<DependantResponse> => {

    const { data } =
      await api.delete<DependantResponse>(
        `/dependants/me/${dependantId}`
      );

    return data;
  },


  // =========================================================
  // ADMIN
  // =========================================================

  /**
   * Get all dependants belonging to a member.
   *
   * GET /dependants/members/:memberId
   */
  getMemberDependants: async (
    memberId: string
  ): Promise<DependantsResponse> => {

    const { data } =
      await api.get<DependantsResponse>(
        `/dependants/members/${memberId}`
      );

    return data;
  },

  /**
   * Get a specific dependant.
   *
   * GET /dependants/:dependantId
   */
  getDependant: async (
    dependantId: string
  ): Promise<DependantResponse> => {

    const { data } =
      await api.get<DependantResponse>(
        `/dependants/${dependantId}`
      );

    return data;
  },

  /**
   * Create a dependant for a member.
   *
   * POST /dependants/members/:memberId
   */
  createMemberDependant: async (
    memberId: string,
    payload: CreateDependantPayload
  ): Promise<DependantResponse> => {

    const { data } =
      await api.post<DependantResponse>(
        `/dependants/members/${memberId}`,
        payload
      );

    return data;
  },

  /**
   * Update a dependant from admin side.
   *
   * PATCH /dependants/:dependantId
   */
  updateDependant: async (
    dependantId: string,
    payload: UpdateDependantPayload
  ): Promise<DependantResponse> => {

    const { data } =
      await api.patch<DependantResponse>(
        `/dependants/${dependantId}`,
        payload
      );

    return data;
  },

  /**
   * Delete a dependant from admin side.
   *
   * DELETE /dependants/:dependantId
   */
  deleteDependant: async (
    dependantId: string
  ): Promise<DependantResponse> => {

    const { data } =
      await api.delete<DependantResponse>(
        `/dependants/${dependantId}`
      );

    return data;
  },
};

export default dependantService;