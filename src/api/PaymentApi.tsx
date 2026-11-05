import api from "./api";

import {
    CheckMpesaPaymentStatusApiResponse,
    CompleteManualPaymentDto,
    CreatePaymentDto,
    InitiateMpesaStkPushApiResponse,
    MemberPaymentFilters,
    PaymentFilters,
    PaymentResponse,
    PaymentsResponse,
    PaymentTotalResponse,
    PaymentTotalsFilters,
    ProviderPaymentFilters,
} from "../types/PaymentType";

export const paymentService = {
    // Create a payment
    create: async (payload: CreatePaymentDto): Promise<PaymentResponse> => {
        const response = await api.post<PaymentResponse>(
            "/payments",
            payload,
        );

        return response.data;
    },

    // Get all payments with filters and pagination
    getAll: async (
        filters: PaymentFilters = {},
    ): Promise<PaymentsResponse> => {
        const response = await api.get<PaymentsResponse>("/payments", {
            params: filters,
        });

        return response.data;
    },

    // Get payment by ID
    getById: async (paymentId: string): Promise<PaymentResponse> => {
        const response = await api.get<PaymentResponse>(
            `/payments/${encodeURIComponent(paymentId)}`,
        );

        return response.data;
    },

    // Get payment by internal reference
    getByInternalReference: async (
        internalReference: string,
    ): Promise<PaymentResponse> => {
        const response = await api.get<PaymentResponse>(
            `/payments/internal-reference/${encodeURIComponent(internalReference)}`,
        );

        return response.data;
    },

    // Get payment by external reference
    getByExternalReference: async (
        externalReference: string,
    ): Promise<PaymentResponse> => {
        const response = await api.get<PaymentResponse>(
            `/payments/external-reference/${encodeURIComponent(externalReference)}`,
        );

        return response.data;
    },

    // Initiate M-Pesa STK Push
    initiateMpesaStkPush: async (
        paymentId: string,
    ): Promise<InitiateMpesaStkPushApiResponse> => {
        const response =
            await api.post<InitiateMpesaStkPushApiResponse>(
                `/payments/${encodeURIComponent(paymentId)}/mpesa/stk-push`,
            );

        return response.data;
    },

    // Check M-Pesa payment status
    checkMpesaStatus: async (
        paymentId: string,
    ): Promise<CheckMpesaPaymentStatusApiResponse> => {
        const response =
            await api.post<CheckMpesaPaymentStatusApiResponse>(
                `/payments/${encodeURIComponent(paymentId)}/mpesa/status-check`,
            );

        return response.data;
    },

    // Complete a manual payment
    completeManual: async (
        paymentId: string,
        payload: CompleteManualPaymentDto,
    ): Promise<PaymentResponse> => {
        const response = await api.post<PaymentResponse>(
            `/payments/${encodeURIComponent(paymentId)}/complete-manual`,
            payload,
        );

        return response.data;
    },

    // Get payment totals
    getTotals: async (
        filters: PaymentTotalsFilters = {},
    ): Promise<PaymentTotalResponse> => {
        const response = await api.get<PaymentTotalResponse>(
            "/payments/totals",
            {
                params: filters,
            },
        );

        return response.data;
    },

    // Get payments belonging to a member
    getByMember: async (
        memberId: string,
        filters: MemberPaymentFilters = {},
    ): Promise<PaymentsResponse> => {
        const response = await api.get<PaymentsResponse>(
            `/payments/member/${encodeURIComponent(memberId)}`,
            {
                params: filters,
            },
        );

        return response.data;
    },

    // Get total payments belonging to a member
    getMemberTotal: async (
        memberId: string,
        filters: MemberPaymentFilters = {},
    ): Promise<PaymentTotalResponse> => {
        const response = await api.get<PaymentTotalResponse>(
            `/payments/member/${encodeURIComponent(memberId)}/total`,
            {
                params: filters,
            },
        );

        return response.data;
    },

    // Get payments belonging to a provider
    getByProvider: async (
        providerId: string,
        filters: ProviderPaymentFilters = {},
    ): Promise<PaymentsResponse> => {
        const response = await api.get<PaymentsResponse>(
            `/payments/provider/${encodeURIComponent(providerId)}`,
            {
                params: filters,
            },
        );

        return response.data;
    },

    // Get payments by status
    getByStatus: async (
        status: string,
        filters: PaymentFilters = {},
    ): Promise<PaymentsResponse> => {
        const response = await api.get<PaymentsResponse>(
            `/payments/status/${encodeURIComponent(status)}`,
            {
                params: filters,
            },
        );

        return response.data;
    },
};

export default paymentService;