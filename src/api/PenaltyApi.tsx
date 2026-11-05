import api from "./api";

import {
    CreatePenaltyDto,
    GenerateBatchPenaltiesDto,
    GeneratePenaltyDto,
    PenaltyFilters,
    PenaltyListResponse,
    PenaltyOutstandingResponse,
    PenaltyResponse,
    UpdatePenaltyDto,
    WaivePenaltyDto,
    GeneratePenaltyResponse,
    GenerateBatchPenaltiesResponse,
    MemberOutstandingPenaltiesResponse,
} from "../types/PenaltyType";

export const penaltyApi = {
    create: async (payload: CreatePenaltyDto): Promise<PenaltyResponse> => {
        const response = await api.post("/penalties", payload);
        return response.data;
    },

    getAll: async (
        filters: PenaltyFilters = {},
    ): Promise<PenaltyListResponse> => {
        const response = await api.get("/penalties", { params: filters });
        return response.data;
    },

    getByMember: async (
        memberId: string,
        filters: PenaltyFilters = {},
    ): Promise<PenaltyListResponse> => {
        const response = await api.get(`/penalties/members/${memberId}`, {
            params: filters,
        });
        return response.data;
    },

    getMemberOutstanding: async (
        memberId: string,
        filters: PenaltyFilters = {},
    ): Promise<MemberOutstandingPenaltiesResponse> => {
        const response = await api.get(
            `/penalties/members/${memberId}/outstanding`,
            { params: filters },
        );
        return response.data;
    },

    getByContribution: async (
        memberContributionId: string,
        filters: PenaltyFilters = {},
    ): Promise<PenaltyListResponse> => {
        const response = await api.get(
            `/penalties/contributions/${memberContributionId}`,
            { params: filters },
        );
        return response.data;
    },

    getByRule: async (
        penaltyRuleId: string,
        filters: PenaltyFilters = {},
    ): Promise<PenaltyListResponse> => {
        const response = await api.get(`/penalties/rules/${penaltyRuleId}`, {
            params: filters,
        });
        return response.data;
    },

    getByStatus: async (
        status: string,
        filters: PenaltyFilters = {},
    ): Promise<PenaltyListResponse> => {
        const response = await api.get(`/penalties/status/${status}`, {
            params: filters,
        });
        return response.data;
    },

    getBySource: async (
        source: string,
        filters: PenaltyFilters = {},
    ): Promise<PenaltyListResponse> => {
        const response = await api.get(`/penalties/source/${source}`, {
            params: filters,
        });
        return response.data;
    },

    getById: async (id: string): Promise<PenaltyResponse> => {
        const response = await api.get(`/penalties/${id}`);
        return response.data;
    },

    getBasicById: async (id: string): Promise<PenaltyResponse> => {
        const response = await api.get(`/penalties/${id}/basic`);
        return response.data;
    },

    getOutstanding: async (
        id: string,
    ): Promise<PenaltyOutstandingResponse> => {
        const response = await api.get(`/penalties/${id}/outstanding`);
        return response.data;
    },

    generate: async (
        payload: GeneratePenaltyDto,
    ): Promise<GeneratePenaltyResponse> => {
        const response = await api.post("/penalties/generate", payload);
        return response.data;
    },

    generateBatch: async (
        payload: GenerateBatchPenaltiesDto,
    ): Promise<GenerateBatchPenaltiesResponse> => {
        const response = await api.post("/penalties/generate/batch", payload);
        return response.data;
    },

    update: async (
        id: string,
        payload: UpdatePenaltyDto,
    ): Promise<PenaltyResponse> => {
        const response = await api.patch(`/penalties/${id}`, payload);
        return response.data;
    },

    activate: async (id: string): Promise<PenaltyResponse> => {
        const response = await api.patch(`/penalties/${id}/activate`);
        return response.data;
    },

    pay: async (id: string): Promise<PenaltyResponse> => {
        const response = await api.patch(`/penalties/${id}/pay`);
        return response.data;
    },

    cancel: async (id: string): Promise<PenaltyResponse> => {
        const response = await api.patch(`/penalties/${id}/cancel`);
        return response.data;
    },

    waive: async (
        id: string,
        payload: WaivePenaltyDto,
    ): Promise<PenaltyResponse> => {
        const response = await api.patch(`/penalties/${id}/waive`, payload);
        return response.data;
    },
};