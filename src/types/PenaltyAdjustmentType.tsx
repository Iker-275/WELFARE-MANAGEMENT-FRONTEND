
export type PenaltyAdjustmentType =
    | "WAIVER"
    | "REDUCTION"
    | "INCREASE"
    | (string & {});

export interface PenaltyAdjustmentUser {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
}

export interface PenaltyAdjustmentPenalty {
    id: string;
    memberId: string;
    memberContributionId: string | null;
    penaltyRuleId: string | null;
    type: string;
    source: string;
    status: string;
    baseAmount: string | number;
    percentage: string | number | null;
    amount: string | number;
    currency: string;
    reason: string | null;
    createdById: string;
    waivedById: string | null;
    waivedAt: string | null;
    waiverReason: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface PenaltyAdjustment {
    id: string;
    penaltyId: string;
    type: PenaltyAdjustmentType;
    amount: string | number;
    reason: string;
    createdById: string;
    approvedById: string | null;
    createdAt: string;
    updatedAt: string;

    penalty?: PenaltyAdjustmentPenalty;
    createdBy?: PenaltyAdjustmentUser | null;
    approvedBy?: PenaltyAdjustmentUser | null;
}

export interface CreatePenaltyAdjustmentDto {
    penaltyId: string;
    type: PenaltyAdjustmentType;
    amount: number;
    reason: string;
}

export interface PenaltyAdjustmentPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PenaltyAdjustmentListData {
    items: PenaltyAdjustment[];
    pagination: PenaltyAdjustmentPagination;
}

export interface PenaltyAdjustmentListFilters {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface PenaltyAdjustmentApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    code?: string | null;
    errors?: unknown;
}
