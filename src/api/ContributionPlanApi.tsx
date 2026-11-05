
import api from "./api";

import {
  ContributionPlanResponse,
  ContributionPlansResponse,
  ContributionPlanActionResponse,
  CreateContributionPlanDto,
  UpdateContributionPlanDto,
  ContributionPlanFilters,
} from "../types/ContributionPlanType";

export const contributionPlanService = {

  /*
   * ============================================================
   * CREATE CONTRIBUTION PLAN
   * POST /contribution-plans
   * ============================================================
   */

  create: async (
    payload: CreateContributionPlanDto
  ): Promise<ContributionPlanResponse> => {

    const { data } =
      await api.post<ContributionPlanResponse>(
        "/contribution-plans",
        payload
      );

    return data;
  },


  /*
   * ============================================================
   * GET ALL CONTRIBUTION PLANS
   * GET /contribution-plans
   * ============================================================
   */

  getAll: async (
    filters?: ContributionPlanFilters
  ): Promise<ContributionPlansResponse> => {

    const { data } =
      await api.get<ContributionPlansResponse>(
        "/contribution-plans",
        {
          params: filters,
        }
      );

    return data;
  },


  /*
   * ============================================================
   * GET CONTRIBUTION PLAN BY ID
   * GET /contribution-plans/:id
   * ============================================================
   */

  getById: async (
    planId: string
  ): Promise<ContributionPlanResponse> => {

    const { data } =
      await api.get<ContributionPlanResponse>(
        `/contribution-plans/${planId}`
      );

    return data;
  },


  /*
   * ============================================================
   * GET CONTRIBUTION PLAN BY CODE
   * GET /contribution-plans/code/:code
   * ============================================================
   */

  getByCode: async (
    code: string
  ): Promise<ContributionPlanResponse> => {

    const { data } =
      await api.get<ContributionPlanResponse>(
        `/contribution-plans/code/${encodeURIComponent(code)}`
      );

    return data;
  },


  /*
   * ============================================================
   * UPDATE CONTRIBUTION PLAN
   * PATCH /contribution-plans/:id
   * ============================================================
   */

  update: async (
    planId: string,
    payload: UpdateContributionPlanDto
  ): Promise<ContributionPlanResponse> => {

    const { data } =
      await api.patch<ContributionPlanResponse>(
        `/contribution-plans/${planId}`,
        payload
      );

    return data;
  },


  /*
   * ============================================================
   * ACTIVATE CONTRIBUTION PLAN
   * PATCH /contribution-plans/:id/activate
   * ============================================================
   */

  activate: async (
    planId: string
  ): Promise<ContributionPlanActionResponse> => {

    const { data } =
      await api.patch<ContributionPlanActionResponse>(
        `/contribution-plans/${planId}/activate`
      );

    return data;
  },


  /*
   * ============================================================
   * DEACTIVATE CONTRIBUTION PLAN
   * PATCH /contribution-plans/:id/deactivate
   * ============================================================
   */

  deactivate: async (
    planId: string
  ): Promise<ContributionPlanActionResponse> => {

    const { data } =
      await api.patch<ContributionPlanActionResponse>(
        `/contribution-plans/${planId}/deactivate`
      );

    return data;
  },


  /*
   * ============================================================
   * ARCHIVE CONTRIBUTION PLAN
   * PATCH /contribution-plans/:id/archive
   * ============================================================
   */

  archive: async (
    planId: string
  ): Promise<ContributionPlanActionResponse> => {

    const { data } =
      await api.patch<ContributionPlanActionResponse>(
        `/contribution-plans/${planId}/archive`
      );

    return data;
  },

};

export default contributionPlanService;
