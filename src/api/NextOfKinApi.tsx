import api from "./api";

import {
  CreateNextOfKinPayload,
  NextOfKinResponse,
  UpdateNextOfKinPayload,
} from "../types/NextOfKinType";

export const nextOfKinService = {

  // =========================================================
  // SELF SERVICE
  // =========================================================

  /**
   * Get the currently authenticated user's
   * Next of Kin.
   *
   * GET /nok/me
   */
  getMyNextOfKin: async (): Promise<NextOfKinResponse> => {

    const { data } =
      await api.get<NextOfKinResponse>(
        "/nok/me"
      );

    return data;
  },

  /**
   * Create the currently authenticated user's
   * Next of Kin.
   *
   * POST /nok/me
   */
  createMyNextOfKin: async (
    payload: CreateNextOfKinPayload
  ): Promise<NextOfKinResponse> => {

    const { data } =
      await api.post<NextOfKinResponse>(
        "/nok/me",
        payload
      );

    return data;
  },

  /**
   * Update the currently authenticated user's
   * Next of Kin.
   *
   * PATCH /nok/me
   */
  updateMyNextOfKin: async (
    payload: UpdateNextOfKinPayload
  ): Promise<NextOfKinResponse> => {

    const { data } =
      await api.patch<NextOfKinResponse>(
        "/nok/me",
        payload
      );

    return data;
  },

  /**
   * Delete the currently authenticated user's
   * Next of Kin.
   *
   * DELETE /nok/me/:nextOfKinId
   */
  deleteMyNextOfKin: async (
    nextOfKinId: string
  ): Promise<NextOfKinResponse> => {

    const { data } =
      await api.delete<NextOfKinResponse>(
        `/nok/me/${nextOfKinId}`
      );

    return data;
  },


  // =========================================================
  // ADMIN
  // =========================================================

  /**
   * Get a member's Next of Kin.
   *
   * GET /nok/member/:memberId
   */
  getMemberNextOfKin: async (
    memberId: string
  ): Promise<NextOfKinResponse> => {

    const { data } =
      await api.get<NextOfKinResponse>(
        `/nok/member/${memberId}`
      );

    return data;
  },

  /**
   * Get a specific Next of Kin.
   *
   * GET /nok/:nextOfKinId
   */
  getNextOfKin: async (
    nextOfKinId: string
  ): Promise<NextOfKinResponse> => {

    const { data } =
      await api.get<NextOfKinResponse>(
        `/nok/${nextOfKinId}`
      );

    return data;
  },

  /**
   * Create a Next of Kin for a member.
   *
   * POST /nok/member/:memberId
   */
  createMemberNextOfKin: async (
    memberId: string,
    payload: CreateNextOfKinPayload
  ): Promise<NextOfKinResponse> => {

    const { data } =
      await api.post<NextOfKinResponse>(
        `/nok/member/${memberId}`,
        payload
      );

    return data;
  },

  /**
   * Update a member's Next of Kin.
   *
   * PATCH /nok/member/:memberId
   */
  updateMemberNextOfKin: async (
    memberId: string,
    payload: UpdateNextOfKinPayload
  ): Promise<NextOfKinResponse> => {

    const { data } =
      await api.patch<NextOfKinResponse>(
        `/nok/member/${memberId}`,
        payload
      );

    return data;
  },

  /**
   * Delete a specific Next of Kin.
   *
   * DELETE /nok/:nextOfKinId
   */
  deleteNextOfKin: async (
    nextOfKinId: string
  ): Promise<NextOfKinResponse> => {

    const { data } =
      await api.delete<NextOfKinResponse>(
        `/nok/${nextOfKinId}`
      );

    return data;
  },
};

export default nextOfKinService;