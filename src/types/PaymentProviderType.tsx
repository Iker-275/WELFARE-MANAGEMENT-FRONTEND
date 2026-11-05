
export type PaymentProviderType =
    | "BANK"
    | "CARD"
    | "MOBILE_MONEY"
    | "MPESA"
    | "MANUAL"
    | (string & {});

export interface PaymentProvider {
    id: string;
    name: string;
    code: string;
    type: PaymentProviderType;
    description: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;

    _count?: {
        payments: number;
        transactions: number;
    };
}

export interface CreatePaymentProviderDto {
    name: string;
    code: string;
    type: PaymentProviderType;
    description?: string;
}

export interface PaymentProviderFilters {
    search?: string;
    type?: PaymentProviderType;
    isActive?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface PaymentProviderListData {
    data: PaymentProvider[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaymentProviderResponse {
    success: boolean;
    message: string;
    data: PaymentProvider;
}

export interface PaymentProvidersResponse {
    success: boolean;
    message: string;
    data: PaymentProviderListData;
}

export interface PaymentProviderArrayResponse {
    success: boolean;
    message: string;
    data: PaymentProvider[];
}

export interface PaymentProviderActionResponse {
    success: boolean;
    message: string;
    data: PaymentProvider;
}
