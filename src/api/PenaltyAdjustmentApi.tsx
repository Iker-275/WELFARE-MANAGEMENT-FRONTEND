
import api from "./api";

import {
    CreatePenaltyAdjustmentDto,
    PenaltyAdjustment,
    PenaltyAdjustmentApiResponse,
    PenaltyAdjustmentListData,
    PenaltyAdjustmentListFilters,
} from "../types/PenaltyAdjustmentType";

const BASE_URL = "/penalty-adjustments";

export const penaltyAdjustmentService = {
    // Create a penalty adjustment
    create: async (
        data: CreatePenaltyAdjustmentDto
    ): Promise<PenaltyAdjustmentApiResponse<PenaltyAdjustment>> => {
        const response = await api.post(BASE_URL, data);
        return response.data;
    },

    // List pending penalty adjustments
    getPending: async (
        filters?: PenaltyAdjustmentListFilters
    ): Promise<PenaltyAdjustmentApiResponse<PenaltyAdjustmentListData>> => {
        const response = await api.get(`${BASE_URL}/pending`, {
            params: filters,
        });

        return response.data;
    },

    // List adjustments belonging to a penalty
    getByPenalty: async (
        penaltyId: string,
        filters?: PenaltyAdjustmentListFilters
    ): Promise<PenaltyAdjustmentApiResponse<PenaltyAdjustmentListData>> => {
        const response = await api.get(`${BASE_URL}/${penaltyId}`, {
            params: filters,
        });

        return response.data;
    },

    // List adjustments by adjustment type
    getByType: async (
        type: string,
        filters?: PenaltyAdjustmentListFilters
    ): Promise<PenaltyAdjustmentApiResponse<PenaltyAdjustmentListData>> => {
        const response = await api.get(`${BASE_URL}/types/${type}`, {
            params: filters,
        });

        return response.data;
    },

    // List adjustments created by a specific user
    getByCreator: async (
        createdById: string,
        filters?: PenaltyAdjustmentListFilters
    ): Promise<PenaltyAdjustmentApiResponse<PenaltyAdjustmentListData>> => {
        const response = await api.get(
            `${BASE_URL}/creators/${createdById}`,
            { params: filters }
        );

        return response.data;
    },

    // List adjustments approved by a specific user
    getByApprover: async (
        approvedById: string,
        filters?: PenaltyAdjustmentListFilters
    ): Promise<PenaltyAdjustmentApiResponse<PenaltyAdjustmentListData>> => {
        const response = await api.get(
            `${BASE_URL}/approvers/${approvedById}`,
            { params: filters }
        );

        return response.data;
    },

    // Get one adjustment by its ID
    getById: async (
        id: string
    ): Promise<PenaltyAdjustmentApiResponse<PenaltyAdjustment>> => {
        const response = await api.get(
            `${BASE_URL}/adjustment/${id}`
        );

        return response.data;
    },

    // Approve a penalty adjustment
    approve: async (
        id: string
    ): Promise<PenaltyAdjustmentApiResponse<PenaltyAdjustment>> => {
        const response = await api.patch(
            `${BASE_URL}/${id}/approve`
        );

        return response.data;
    },
};
