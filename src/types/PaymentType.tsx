export type PaymentMethod =
    | "MPESA"
    | "CASH"
    | "BANK"
    | "CARD"
    | "CHEQUE"
    | (string & {});

export type PaymentStatus =
    | "INITIATED"
    | "PENDING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED"
    | (string & {});

export type PaymentTransactionType =
    | "INITIATION"
    | "STATUS_CHECK"
    | "CALLBACK"
    | "COMPLETION"
    | (string & {});

export type PaymentTransactionStatus =
    | "PENDING"
    | "SUCCESS"
    | "FAILED"
    | (string & {});

export interface PaymentMemberSummary {
    id: string;
    userId?: string;
    membershipNumber?: string;
    status?: string;
    regionId?: string | null;
    branchId?: string | null;
    chapterId?: string | null;
    countyId?: string | null;
    groupId?: string | null;
    joinedAt?: string | null;
    activatedAt?: string | null;
    suspendedAt?: string | null;
    retiredAt?: string | null;
    resignedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaymentProviderSummary {
    id: string;
    name: string;
    code: string;
    type: string;
    description?: string | null;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaymentCreatorSummary {
    id: string;
    email?: string;
    phoneNumber?: string | null;
    firstName?: string;
    lastName?: string;
    userType?: string;
    accountStatus?: string;
}

export interface PaymentTransaction {
    id: string;
    paymentId: string;
    providerId?: string | null;
    type: PaymentTransactionType;
    status: PaymentTransactionStatus;
    externalTransactionId?: string | null;
    externalReference?: string | null;
    requestPayload?: Record<string, unknown> | null;
    responsePayload?: Record<string, unknown> | null;
    errorCode?: string | null;
    errorMessage?: string | null;
    processedAt?: string | null;
    createdAt: string;
    updatedAt?: string;
}

export interface PaymentAllocation {
    id: string;
    paymentId?: string;
    amount?: string | number;
    currency?: string;
    memberContributionId?: string | null;
    contributionId?: string | null;
    createdAt?: string;
    [key: string]: unknown;
}

export interface PaymentReceipt {
    id: string;
    paymentId: string;
    receiptNumber: string;
    amount: string | number;
    currency: string;
    status: string;
    issuedAt?: string | null;
    generatedById?: string | null;
    pdfFileId?: string | null;
    voidedAt?: string | null;
    voidedById?: string | null;
    voidReason?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaymentCount {
    transactions: number;
    allocations: number;
}

export interface Payment {
    id: string;
    memberId: string;
    amount: string | number;
    currency: string;
    method: PaymentMethod;
    status: PaymentStatus;
    providerId: string | null;
    internalReference: string;
    externalReference: string | null;
    description: string | null;
    metadata: Record<string, unknown> | null;
    initiatedAt: string | null;
    completedAt: string | null;
    failedAt: string | null;
    createdById: string;
    createdAt: string;
    updatedAt: string;

    member?: PaymentMemberSummary;
    provider?: PaymentProviderSummary;
    createdBy?: PaymentCreatorSummary;
    transactions?: PaymentTransaction[];
    allocations?: PaymentAllocation[];
    receipt?: PaymentReceipt | null;
    _count?: PaymentCount;
}

export interface CreatePaymentDto {
    memberId: string;
    amount: number;
    currency: string;
    method: PaymentMethod;
    providerId: string;
    externalReference?: string;
    description?: string;
    metadata?: Record<string, unknown>;
}

export interface CompleteManualPaymentDto {
    externalReference?: string;
    notes?: string;
}

export interface InitiateMpesaStkPushResponse {
    paymentId: string;
    internalReference: string;
    status: PaymentStatus;
    checkoutRequestId?: string | null;
    merchantRequestId?: string | null;
    requestTimeStamp?: string | null;
    message?: string;
}

export interface CheckMpesaPaymentStatusResponse {
    paymentId: string;
    status: PaymentStatus;
    message?: string;
}

export interface PaymentFilters {
    memberId?: string;
    providerId?: string;
    method?: PaymentMethod;
    status?: PaymentStatus;
    currency?: string;
    internalReference?: string;
    externalReference?: string;
    minAmount?: number;
    maxAmount?: number;
    initiatedFrom?: string;
    initiatedTo?: string;
    completedFrom?: string;
    completedTo?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface PaymentListData {
    data: Payment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaymentTotalsFilters {
    memberId?: string;
    providerId?: string;
    method?: PaymentMethod;
    status?: PaymentStatus;
    currency?: string;
    completedFrom?: string;
    completedTo?: string;
}

export interface PaymentTotal {
    total: string | number;
}

export interface MemberPaymentFilters {
    status?: PaymentStatus;
    method?: PaymentMethod;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface ProviderPaymentFilters {
    status?: PaymentStatus;
    method?: PaymentMethod;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface PaymentStatusFilters {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface PaymentResponse {
    success: boolean;
    message: string;
    data: Payment;
}

export interface PaymentsResponse {
    success: boolean;
    message: string;
    data: PaymentListData;
}

export interface PaymentTotalResponse {
    success: boolean;
    message: string;
    data: PaymentTotal;
}

export interface InitiateMpesaStkPushApiResponse {
    success: boolean;
    message: string;
    data: InitiateMpesaStkPushResponse;
}

export interface CheckMpesaPaymentStatusApiResponse {
    success: boolean;
    message: string;
    data: CheckMpesaPaymentStatusResponse;
}