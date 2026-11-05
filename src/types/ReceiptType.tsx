
export type ReceiptStatus = "GENERATED" | "VOIDED" | (string & {});

export interface ReceiptUser {
    id?: string;
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
}

export interface ReceiptMember {
    id: string;
    membershipNumber: string;
    user: ReceiptUser;
}

export interface ReceiptPayment {
    id: string;
    memberId: string;
    amount: string | number;
    currency: string;
    method: string;
    status: string;
    internalReference: string;
    externalReference: string | null;
    description: string | null;
    initiatedAt: string;
    completedAt: string | null;
    member?: ReceiptMember;
}

export interface Receipt {
    id: string;
    paymentId: string;
    receiptNumber: string;
    amount: string | number;
    currency: string;
    status: ReceiptStatus;
    issuedAt: string;

    generatedById: string | null;
    pdfFileId: string | null;

    voidedAt: string | null;
    voidedById: string | null;
    voidReason: string | null;

    createdAt: string;
    updatedAt: string;

    payment?: ReceiptPayment;
    generatedBy?: ReceiptUser | null;
    voidedBy?: ReceiptUser | null;
}

export interface ReceiptFilters {
    page?: number;
    limit?: number;
    status?: ReceiptStatus;
    paymentId?: string;
    memberId?: string;
    receiptNumber?: string;
    currency?: string;
    issuedFrom?: string;
    issuedTo?: string;
}

export interface ReceiptPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
}

export interface ReceiptListData {
    data: Receipt[];
    pagination: ReceiptPagination;
}

export interface VoidReceiptDto {
    voidReason: string;
}

export interface ReceiptApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    code?: string | null;
    errors?: unknown;
}
