import api from "./api";

import {
    MemberContributionFilters,
    MemberContributionResponse,
    MemberContributionsResponse,
    MemberContributionActionResponse,
    PeriodContributionFilters,
    PayMemberContributionDto,
    WaiveMemberContributionDto,
    GenerateMemberContributionDto,
    GenerateMemberContributionResponse,
    GenerateBulkMemberContributionsDto,
    GenerateBulkMemberContributionsResponse,
    OverdueContributionFilters,
    OverdueContributionsResponse,
    ContributionTotalsFilters,
    ContributionTotalsResponse,
    ContributionStatusCountFilters,
    ContributionStatusCountsResponse,
    MemberContributionHistoryFilters,
    MemberContributionHistoryResponse,
    PlanContributionFilters,
    PlanContributionsResponse,
} from "../types/MemberContributionType";

export const memberContributionService = {
    /**
     * Get all member contributions with optional filters.
     */
    getAll: async (
        filters: MemberContributionFilters = {}
    ): Promise<MemberContributionsResponse> => {
        const response = await api.get<MemberContributionsResponse>(
            "/member-contributions",
            {
                params: filters,
            }
        );

        return response.data;
    },

    /**
     * Get contributions belonging to a specific period.
     */
    getByPeriod: async (
        periodId: string,
        filters: PeriodContributionFilters = {}
    ): Promise<MemberContributionsResponse> => {
        const response = await api.get<MemberContributionsResponse>(
            `/contribution-periods/${periodId}/contributions`,
            {
                params: filters,
            }
        );

        return response.data;
    },

    /**
     * Get one member contribution with its related records.
     */
    getById: async (
        contributionId: string
    ): Promise<MemberContributionResponse> => {
        const response = await api.get<MemberContributionResponse>(
            `/member-contributions/${contributionId}`
        );

        return response.data;
    },

    /**
     * Generate a contribution for one member.
     */
    generate: async (
        payload: GenerateMemberContributionDto
    ): Promise<GenerateMemberContributionResponse> => {
        const response =
            await api.post<GenerateMemberContributionResponse>(
                "/member-contributions/generate",
                payload
            );

        return response.data;
    },

    /**
     * Generate contributions for multiple members.
     */
    generateBulk: async (
        payload: GenerateBulkMemberContributionsDto
    ): Promise<GenerateBulkMemberContributionsResponse> => {
        const response =
            await api.post<GenerateBulkMemberContributionsResponse>(
                "/member-contributions/generate/bulk",
                payload
            );

        return response.data;
    },

    /**
     * Get overdue member contributions with optional filters.
     */
    getOverdue: async (
        filters: OverdueContributionFilters = {}
    ): Promise<OverdueContributionsResponse> => {
        const response =
            await api.get<OverdueContributionsResponse>(
                "/member-contributions/overdue",
                {
                    params: filters,
                }
            );

        return response.data;
    },

    /**
     * Get aggregated contribution totals.
     */
    getTotals: async (
        filters: ContributionTotalsFilters = {}
    ): Promise<ContributionTotalsResponse> => {
        const response =
            await api.get<ContributionTotalsResponse>(
                "/member-contributions/totals",
                {
                    params: filters,
                }
            );

        return response.data;
    },

    /**
     * Get contribution counts grouped by status.
     */
    getStatusCounts: async (
        filters: ContributionStatusCountFilters = {}
    ): Promise<ContributionStatusCountsResponse> => {
        const response =
            await api.get<ContributionStatusCountsResponse>(
                "/member-contributions/status-counts",
                {
                    params: filters,
                }
            );

        return response.data;
    },

    /**
     * Get contribution history for a specific member.
     */
    getMemberHistory: async (
        memberId: string,
        filters: MemberContributionHistoryFilters = {}
    ): Promise<MemberContributionHistoryResponse> => {
        const response =
            await api.get<MemberContributionHistoryResponse>(
                `/members/${memberId}/contributions`,
                {
                    params: filters,
                }
            );

        return response.data;
    },

    /**
     * Get contributions belonging to a specific plan.
     */
    getByPlan: async (
        planId: string,
        filters: PlanContributionFilters = {}
    ): Promise<PlanContributionsResponse> => {
        const response =
            await api.get<PlanContributionsResponse>(
                `/contribution-plans/${planId}/contributions`,
                {
                    params: filters,
                }
            );

        return response.data;
    },

    /**
     * Record a payment against a member contribution.
     */
    pay: async (
        contributionId: string,
        payload: PayMemberContributionDto
    ): Promise<MemberContributionActionResponse> => {
        const response =
            await api.patch<MemberContributionActionResponse>(
                `/member-contributions/${contributionId}/pay`,
                payload
            );

        return response.data;
    },

    /**
     * Mark a member contribution as overdue.
     */
    markOverdue: async (
        contributionId: string
    ): Promise<MemberContributionActionResponse> => {
        const response =
            await api.patch<MemberContributionActionResponse>(
                `/member-contributions/${contributionId}/overdue`
            );

        return response.data;
    },

    /**
     * Waive all or part of a member contribution.
     */
    waive: async (
        contributionId: string,
        payload: WaiveMemberContributionDto
    ): Promise<MemberContributionActionResponse> => {
        const response =
            await api.patch<MemberContributionActionResponse>(
                `/member-contributions/${contributionId}/waive`,
                payload
            );

        return response.data;
    },

    /**
     * Cancel a member contribution.
     */
    cancel: async (
        contributionId: string
    ): Promise<MemberContributionActionResponse> => {
        const response =
            await api.patch<MemberContributionActionResponse>(
                `/member-contributions/${contributionId}/cancel`
            );

        return response.data;
    },
};

export default memberContributionService;