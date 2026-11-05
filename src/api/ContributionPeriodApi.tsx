// import api from "./api";

// import {
//     ContributionPeriodResponse,
//     ContributionPeriodsResponse,
//     ContributionPeriodActionResponse,
//     GenerateContributionPeriodDto,
//     GenerateContributionPeriodsBatchDto,
//     GenerateContributionPeriodsBatchResponse,
// } from "../types/ContributionPeriodType";

// const BASE_URL = "/contribution-periods";

// export const contributionPeriodService = {
//     /**
//      * Get all contribution periods.
//      */
//     getAll: async (): Promise<ContributionPeriodsResponse> => {
//         const response = await api.get<ContributionPeriodsResponse>(
//             BASE_URL
//         );

//         return response.data;
//     },

//     /**
//      * Get contribution periods belonging to a specific plan.
//      */
//     getByPlan: async (
//         planId: string
//     ): Promise<ContributionPeriodsResponse> => {
//         const response = await api.get<ContributionPeriodsResponse>(
//             `${BASE_URL}/plan/${planId}`
//         );

//         return response.data;
//     },

//     /**
//      * Get a single contribution period.
//      */
//     getById: async (
//         periodId: string
//     ): Promise<ContributionPeriodResponse> => {
//         const response = await api.get<ContributionPeriodResponse>(
//             `${BASE_URL}/${periodId}`
//         );

//         return response.data;
//     },

//     /**
//      * Generate one contribution period manually.
//      */
//     generate: async (
//         payload: GenerateContributionPeriodDto
//     ): Promise<ContributionPeriodResponse> => {
//         const response = await api.post<ContributionPeriodResponse>(
//             BASE_URL,
//             payload
//         );

//         return response.data;
//     },

//     /**
//      * Generate multiple contribution periods automatically.
//      */
//     generateBatch: async (
//         payload: GenerateContributionPeriodsBatchDto
//     ): Promise<GenerateContributionPeriodsBatchResponse> => {
//         const response =
//             await api.post<GenerateContributionPeriodsBatchResponse>(
//                 `${BASE_URL}/batch`,
//                 payload
//             );

//         return response.data;
//     },

//     /**
//      * Open a contribution period.
//      */
//     open: async (
//         periodId: string
//     ): Promise<ContributionPeriodActionResponse> => {
//         const response =
//             await api.patch<ContributionPeriodActionResponse>(
//                 `${BASE_URL}/${periodId}/open`
//             );

//         return response.data;
//     },
//     close: async (periodId: string) => {
//         const response =
//             await api.patch<ContributionPeriodActionResponse>(
//             `/contribution-periods/${periodId}/close`
//         );
//         return response.data;
//     },

//     /**
//      * Mark a contribution period as due.
//      */
//     markDue: async (
//         periodId: string
//     ): Promise<ContributionPeriodActionResponse> => {
//         const response =
//             await api.patch<ContributionPeriodActionResponse>(
//                 `${BASE_URL}/${periodId}/due`
//             );

//         return response.data;
//     },

//     /**
//      * Mark a contribution period as overdue.
//      */
//     markOverdue: async (
//         periodId: string
//     ): Promise<ContributionPeriodActionResponse> => {
//         const response =
//             await api.patch<ContributionPeriodActionResponse>(
//                 `${BASE_URL}/${periodId}/overdue`
//             );

//         return response.data;
//     },
// };

// export default contributionPeriodService;



import api from "./api";

import {
    ContributionPeriodResponse,
    ContributionPeriodsResponse,
    ContributionPeriodActionResponse,
    GenerateContributionPeriodDto,
    GenerateContributionPeriodsBatchDto,
    GenerateContributionPeriodsBatchResponse,
} from "../types/ContributionPeriodType";

const BASE_URL = "/contribution-periods";

export const contributionPeriodService = {
    /**
     * Get all contribution periods with pagination.
     */
    getAll: async (
        page: number,
        limit: number
    ): Promise<ContributionPeriodsResponse> => {
        const response = await api.get<ContributionPeriodsResponse>(
            BASE_URL,
            {
                params: { page, limit },
            }
        );

        return response.data;
    },

    /**
     * Get contribution periods belonging to a specific plan with pagination.
     */
    getByPlan: async (
        planId: string,
        page: number,
        limit: number
    ): Promise<ContributionPeriodsResponse> => {
        const response = await api.get<ContributionPeriodsResponse>(
            `${BASE_URL}/plan/${planId}`,
            {
                params: { page, limit },
            }
        );

        return response.data;
    },

    /**
     * Get a single contribution period.
     */
    getById: async (
        periodId: string
    ): Promise<ContributionPeriodResponse> => {
        const response = await api.get<ContributionPeriodResponse>(
            `${BASE_URL}/${periodId}`
        );

        return response.data;
    },

    /**
     * Generate one contribution period manually.
     */
    generate: async (
        payload: GenerateContributionPeriodDto
    ): Promise<ContributionPeriodResponse> => {
        const response = await api.post<ContributionPeriodResponse>(
            BASE_URL,
            payload
        );

        return response.data;
    },

    /**
     * Generate multiple contribution periods automatically.
     */
    generateBatch: async (
        payload: GenerateContributionPeriodsBatchDto
    ): Promise<GenerateContributionPeriodsBatchResponse> => {
        const response =
            await api.post<GenerateContributionPeriodsBatchResponse>(
                `${BASE_URL}/batch`,
                payload
            );

        return response.data;
    },

    /**
     * Open a contribution period.
     */
    open: async (
        periodId: string
    ): Promise<ContributionPeriodActionResponse> => {
        const response =
            await api.patch<ContributionPeriodActionResponse>(
                `${BASE_URL}/${periodId}/open`
            );

        return response.data;
    },

    /**
     * Close a contribution period.
     */
    close: async (
        periodId: string
    ): Promise<ContributionPeriodActionResponse> => {
        const response =
            await api.patch<ContributionPeriodActionResponse>(
                `${BASE_URL}/${periodId}/close`
            );

        return response.data;
    },

    /**
     * Mark a contribution period as due.
     */
    markDue: async (
        periodId: string
    ): Promise<ContributionPeriodActionResponse> => {
        const response =
            await api.patch<ContributionPeriodActionResponse>(
                `${BASE_URL}/${periodId}/due`
            );

        return response.data;
    },

    /**
     * Mark a contribution period as overdue.
     */
    markOverdue: async (
        periodId: string
    ): Promise<ContributionPeriodActionResponse> => {
        const response =
            await api.patch<ContributionPeriodActionResponse>(
                `${BASE_URL}/${periodId}/overdue`
            );

        return response.data;
    },
};

export default contributionPeriodService;
