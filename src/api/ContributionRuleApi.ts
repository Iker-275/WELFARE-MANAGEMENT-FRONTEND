import api from "./api";

import {
  ContributionRuleResponse,
  ContributionRulesResponse,
  ContributionRuleActionResponse,
  CreateContributionRuleDto,
  UpdateContributionRuleDto,
  ContributionRuleFilters,
} from "../types/ContributionRuleType";

export const contributionRuleService = {

  /**
   * Create contribution rule
   */
  create: async (
    payload: CreateContributionRuleDto
  ): Promise<ContributionRuleResponse> => {

    const { data } =
      await api.post<ContributionRuleResponse>(
        "/contribution-rules",
        payload
      );

    return data;
  },

  /**
   * Get all contribution rules
   */
  getAll: async (
    filters?: ContributionRuleFilters
  ): Promise<ContributionRulesResponse> => {

    const { data } =
      await api.get<ContributionRulesResponse>(
        "/contribution-rules",
        {
          params: filters,
        }
      );

    return data;
  },

  /**
   * Get a single contribution rule
   */
  getById: async (
    ruleId: string
  ): Promise<ContributionRuleResponse> => {

    const { data } =
      await api.get<ContributionRuleResponse>(
        `/contribution-rules/${ruleId}`
      );

    return data;
  },

  /**
   * Update contribution rule
   *
   * Accepted PATCH fields still need confirmation
   * from the backend validation schema.
   */
  update: async (
    ruleId: string,
    payload: UpdateContributionRuleDto
  ): Promise<ContributionRuleResponse> => {

    const { data } =
      await api.patch<ContributionRuleResponse>(
        `/contribution-rules/${ruleId}`,
        payload
      );

    return data;
  },

  /**
   * Activate contribution rule
   */
  activate: async (
    ruleId: string
  ): Promise<ContributionRuleActionResponse> => {

    const { data } =
      await api.patch<ContributionRuleActionResponse>(
        `/contribution-rules/${ruleId}/activate`
      );

    return data;
  },

  /**
   * Deactivate contribution rule
   */
  deactivate: async (
    ruleId: string
  ): Promise<ContributionRuleActionResponse> => {

    const { data } =
      await api.patch<ContributionRuleActionResponse>(
        `/contribution-rules/${ruleId}/deactivate`
      );

    return data;
  },

  /**
   * Delete contribution rule
   */
  delete: async (
    ruleId: string
  ): Promise<ContributionRuleActionResponse> => {

    const { data } =
      await api.delete<ContributionRuleActionResponse>(
        `/contribution-rules/${ruleId}`
      );

    return data;
  },
};

export default contributionRuleService;