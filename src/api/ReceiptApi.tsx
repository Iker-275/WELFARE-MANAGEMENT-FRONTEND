
import api from "./api";

import {
    Receipt,
    ReceiptApiResponse,
    ReceiptFilters,
    ReceiptListData,
    VoidReceiptDto,
} from "../types/ReceiptType";

const BASE_URL = "/receipts";

export const receiptService = {
    // List receipts with filters and pagination
    getAll: async (
        filters?: ReceiptFilters
    ): Promise<ReceiptApiResponse<ReceiptListData>> => {
        const response = await api.get(BASE_URL, {
            params: filters,
        });

        return response.data;
    },

    // Get receipt by ID
    getById: async (
        id: string
    ): Promise<ReceiptApiResponse<Receipt>> => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    // Get receipt by receipt number
    getByNumber: async (
        receiptNumber: string
    ): Promise<ReceiptApiResponse<Receipt>> => {
        const response = await api.get(
            `${BASE_URL}/number/${encodeURIComponent(receiptNumber)}`
        );

        return response.data;
    },

    // Get receipt by payment ID
    getByPaymentId: async (
        paymentId: string
    ): Promise<ReceiptApiResponse<Receipt>> => {
        const response = await api.get(
            `${BASE_URL}/payment/${paymentId}`
        );

        return response.data;
    },

    // Issue a receipt for a payment
    issue: async (
        paymentId: string
    ): Promise<ReceiptApiResponse<Receipt>> => {
        const response = await api.post(
            `${BASE_URL}/payment/${paymentId}/issue`
        );

        return response.data;
    },

    // Void a receipt
    void: async (
        id: string,
        data: VoidReceiptDto
    ): Promise<ReceiptApiResponse<Receipt>> => {
        const response = await api.post(
            `${BASE_URL}/${id}/void`,
            data
        );

        return response.data;
    },

    // Retrieve receipt PDF
    getPdf: async (id: string): Promise<Blob> => {
        const response = await api.get(`${BASE_URL}/${id}/pdf`, {
            responseType: "blob",
        });

        return response.data;
    },
};
