
import api from "./api";

import {
    CreatePaymentProviderDto,
    PaymentProviderFilters,
    PaymentProviderResponse,
    PaymentProvidersResponse,
    PaymentProviderArrayResponse,
    PaymentProviderActionResponse,
    PaymentProviderType,
} from "../types/PaymentProviderType";

export const paymentProviderService = {
    /**
     * Create a payment provider.
     */
    create: async (
        payload: CreatePaymentProviderDto,
    ): Promise<PaymentProviderResponse> => {
        const response = await api.post<PaymentProviderResponse>(
            "/payment-providers",
            payload,
        );

        return response.data;
    },

    /**
     * Get all payment providers with optional filters.
     */
    getAll: async (
        filters: PaymentProviderFilters = {},
    ): Promise<PaymentProvidersResponse> => {
        const response = await api.get<PaymentProvidersResponse>(
            "/payment-providers",
            {
                params: filters,
            },
        );

        return response.data;
    },

    /**
     * Get all active payment providers.
     */
    getActive: async (): Promise<PaymentProviderArrayResponse> => {
        const response =
            await api.get<PaymentProviderArrayResponse>(
                "/payment-providers/active",
            );

        return response.data;
    },

    /**
     * Get active payment providers by type.
     */
    getActiveByType: async (
        type: PaymentProviderType,
    ): Promise<PaymentProviderArrayResponse> => {
        const response =
            await api.get<PaymentProviderArrayResponse>(
                `/payment-providers/active/${encodeURIComponent(type)}`,
            );

        return response.data;
    },

    /**
     * Get payment providers by type.
     */
    getByType: async (
        type: PaymentProviderType,
    ): Promise<PaymentProviderArrayResponse> => {
        const response =
            await api.get<PaymentProviderArrayResponse>(
                `/payment-providers/type/${encodeURIComponent(type)}`,
            );

        return response.data;
    },

    /**
     * Get a payment provider by its ID.
     */
    getById: async (
        providerId: string,
    ): Promise<PaymentProviderResponse> => {
        const response = await api.get<PaymentProviderResponse>(
            `/payment-providers/${providerId}`,
        );

        return response.data;
    },

    /**
     * Get a payment provider by its unique code.
     */
    getByCode: async (
        code: string,
    ): Promise<PaymentProviderResponse> => {
        const response = await api.get<PaymentProviderResponse>(
            `/payment-providers/code/${encodeURIComponent(code)}`,
        );

        return response.data;
    },

    /**
     * Activate a payment provider.
     */
    activate: async (
        providerId: string,
    ): Promise<PaymentProviderActionResponse> => {
        const response =
            await api.patch<PaymentProviderActionResponse>(
                `/payment-providers/${providerId}/activate`,
            );

        return response.data;
    },

    /**
     * Deactivate a payment provider.
     */
    deactivate: async (
        providerId: string,
    ): Promise<PaymentProviderActionResponse> => {
        const response =
            await api.patch<PaymentProviderActionResponse>(
                `/payment-providers/${providerId}/deactivate`,
            );

        return response.data;
    },
};

export default paymentProviderService;
