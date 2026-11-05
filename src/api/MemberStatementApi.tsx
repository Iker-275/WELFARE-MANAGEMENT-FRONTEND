
import api from "./api";

import {
    MemberStatement,
    MemberStatementApiResponse,
    MemberStatementFilters,
} from "../types/MemberStatementType";

const BASE_URL = "/statement";

export const memberStatementService = {
    // Get the authenticated member's statement
    getMyStatement: async (
        filters?: MemberStatementFilters
    ): Promise<MemberStatementApiResponse<MemberStatement>> => {
        const response = await api.get(`${BASE_URL}/me`, {
            params: filters,
        });

        return response.data;
    },

    // Get a specific member's statement
    getMemberStatement: async (
        memberId: string,
        filters?: MemberStatementFilters
    ): Promise<MemberStatementApiResponse<MemberStatement>> => {
        const response = await api.get(
            `${BASE_URL}/${memberId}`,
            {
                params: filters,
            }
        );

        return response.data;
    },

    // Get the authenticated member's statement PDF
    getMyStatementPdf: async (
        filters?: MemberStatementFilters
    ): Promise<Blob> => {
        const response = await api.get(`${BASE_URL}/me/pdf`, {
            params: filters,
            responseType: "blob",
        });

        return response.data;
    },

    // Get a specific member's statement PDF
    getMemberStatementPdf: async (
        memberId: string,
        filters?: MemberStatementFilters
    ): Promise<Blob> => {
        const response = await api.get(
            `${BASE_URL}/${memberId}/pdf`,
            {
                params: filters,
                responseType: "blob",
            }
        );

        return response.data;
    },
};
