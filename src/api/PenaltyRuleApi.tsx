import api from "./api";

import {
    ApplicablePenaltyRulesResponse,
    CreatePenaltyRuleDto,
    PenaltyRuleActionResponse,
    PenaltyRuleFilters,
    PenaltyRuleResponse,
    PenaltyRulesResponse,
} from "../types/PenaltyRuleType";

export const penaltyRuleService = {
    // ---------------------------------------------------------
    // CREATE PENALTY RULE
    // ---------------------------------------------------------

    create: async (
        payload: CreatePenaltyRuleDto,
    ): Promise<PenaltyRuleResponse> => {
        const response = await api.post<PenaltyRuleResponse>(
            "/penalty-rules",
            payload,
        );

        return response.data;
    },

    // ---------------------------------------------------------
    // GET ALL PENALTY RULES
    // ---------------------------------------------------------

    getAll: async (
        filters: PenaltyRuleFilters = {},
    ): Promise<PenaltyRulesResponse> => {
        const response = await api.get<PenaltyRulesResponse>(
            "/penalty-rules",
            {
                params: filters,
            },
        );

        return response.data;
    },

    // ---------------------------------------------------------
    // GET APPLICABLE PENALTY RULES
    // ---------------------------------------------------------

    getApplicable: async (): Promise<ApplicablePenaltyRulesResponse> => {
        const response =
            await api.get<ApplicablePenaltyRulesResponse>(
                "/penalty-rules/applicable",
            );

        return response.data;
    },

    // ---------------------------------------------------------
    // GET PENALTY RULE BY CODE
    // ---------------------------------------------------------

    getByCode: async (
        code: string,
    ): Promise<PenaltyRuleResponse> => {
        const response = await api.get<PenaltyRuleResponse>(
            `/penalty-rules/code/${encodeURIComponent(code)}`,
        );

        return response.data;
    },

    // ---------------------------------------------------------
    // GET PENALTY RULES BY CONTRIBUTION PLAN
    // ---------------------------------------------------------

    getByPlan: async (
        contributionPlanId: string,
        filters: PenaltyRuleFilters = {},
    ): Promise<PenaltyRulesResponse> => {
        const response = await api.get<PenaltyRulesResponse>(
            `/penalty-rules/plan/${encodeURIComponent(contributionPlanId)}`,
            {
                params: filters,
            },
        );

        return response.data;
    },

    // ---------------------------------------------------------
    // GET PENALTY RULE BY ID
    // ---------------------------------------------------------

    getById: async (
        penaltyRuleId: string,
    ): Promise<PenaltyRuleResponse> => {
        const response = await api.get<PenaltyRuleResponse>(
            `/penalty-rules/${encodeURIComponent(penaltyRuleId)}`,
        );

        return response.data;
    },

    // ---------------------------------------------------------
    // ACTIVATE PENALTY RULE
    // ---------------------------------------------------------

    activate: async (
        penaltyRuleId: string,
    ): Promise<PenaltyRuleActionResponse> => {
        const response = await api.patch<PenaltyRuleActionResponse>(
            `/penalty-rules/${encodeURIComponent(penaltyRuleId)}/activate`,
        );

        return response.data;
    },

    // ---------------------------------------------------------
    // DEACTIVATE PENALTY RULE
    // ---------------------------------------------------------

    deactivate: async (
        penaltyRuleId: string,
    ): Promise<PenaltyRuleActionResponse> => {
        const response = await api.patch<PenaltyRuleActionResponse>(
            `/penalty-rules/${encodeURIComponent(penaltyRuleId)}/deactivate`,
        );

        return response.data;
    },
};

export default penaltyRuleService;