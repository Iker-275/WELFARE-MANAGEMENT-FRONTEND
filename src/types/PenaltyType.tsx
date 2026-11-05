
import { Pagination } from "./SharedTypes";

export type PenaltyType = "FIXED" | "PERCENTAGE" | "TIERED" | (string & {});
export type PenaltySource = "MANUAL" | "AUTOMATIC" | (string & {});
export type PenaltyStatus =
    | "PENDING"
    | "ACTIVE"
    | "PAID"
    | "WAIVED"
    | "CANCELLED"
    | (string & {});

export interface PenaltyMember {
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

export interface PenaltyContribution {
    id: string;
    memberId?: string;
    planId?: string;
    periodId?: string;
    contributionRuleId?: string | null;
    amountDue?: string | number;
    amountPaid?: string | number;
    amountWaived?: string | number;
    currency?: string;
    status?: string;
    dueAt?: string | null;
    settledAt?: string | null;
    generatedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    plan?: Record<string, unknown>;
    period?: Record<string, unknown>;
}

export interface PenaltyRuleSummary {
    id: string;
    name?: string;
    code?: string;
    description?: string | null;
    penaltyType?: PenaltyType;
    contributionPlanId?: string | null;
    scopeType?: string;
    fixedAmount?: string | number | null;
    percentage?: string | number | null;
    gracePeriodDays?: number;
    capAmount?: string | number | null;
    capPercentage?: string | number | null;
    effectiveFrom?: string;
    effectiveTo?: string | null;
    priority?: number;
    isActive?: boolean;
    tiers?: Record<string, unknown>[];
}

export interface PenaltyAllocation {
    id?: string;
    amount?: string | number;
    [key: string]: unknown;
}

export interface PenaltyAdjustment {
    id?: string;
    amount?: string | number;
    reason?: string;
    [key: string]: unknown;
}

export interface Penalty {
    id: string;
    memberId: string;
    memberContributionId: string | null;
    penaltyRuleId: string | null;
    type: PenaltyType;
    source: PenaltySource;
    status: PenaltyStatus;
    baseAmount: string | number | null;
    percentage: string | number | null;
    amount: string | number;
    currency: string;
    reason: string | null;
    createdById: string | null;
    waivedById: string | null;
    waivedAt: string | null;
    waiverReason: string | null;
    createdAt: string;
    updatedAt: string;

    member?: PenaltyMember | null;
    memberContribution?: PenaltyContribution | null;
    penaltyRule?: PenaltyRuleSummary | null;
    allocations?: PenaltyAllocation[];
    adjustments?: PenaltyAdjustment[];
    createdBy?: Record<string, unknown> | null;
    waivedBy?: Record<string, unknown> | null;
}

export interface PenaltyFilters {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: PenaltyStatus;
    source?: PenaltySource;
    type?: PenaltyType;
    memberId?: string;
    memberContributionId?: string;
    penaltyRuleId?: string;
}

export interface PenaltyListData {
    items: Penalty[];
    pagination: Pagination;
}

export interface PenaltyListResponse {
    success: boolean;
    message: string;
    data: PenaltyListData;
}

export interface PenaltyResponse {
    success: boolean;
    message: string;
    data: Penalty;
}

export interface CreatePenaltyDto {
    memberId: string;
    memberContributionId?: string;
    penaltyRuleId?: string;
    type: PenaltyType;
    baseAmount?: number | string;
    percentage?: number | string;
    amount: number | string;
    currency?: string;
    reason?: string;
    source?: "MANUAL";
    status?: "PENDING" | "ACTIVE";
}

export interface GeneratePenaltyDto {
    memberContributionId: string;
    penaltyRuleId?: string;
    effectiveDate?: string;
    allowDuplicate?: boolean;
}

export interface GenerateBatchPenaltiesDto {
    memberContributionIds: string[];
    penaltyRuleId?: string;
    effectiveDate?: string;
    allowDuplicate?: boolean;
}

export interface UpdatePenaltyDto {
    reason?: string;
}

export interface WaivePenaltyDto {
    waiverReason: string;
}

export interface PenaltyOutstandingAmount {
    penaltyId: string;
    outstandingAmount: number | string;
}

export interface PenaltyOutstandingResponse {
    success: boolean;
    message: string;
    data: PenaltyOutstandingAmount;
}

export interface MemberOutstandingPenalties {
    items?: Penalty[];
    totalOutstanding?: number | string;
    outstandingAmount?: number | string;
    pagination?: Pagination;
    [key: string]: unknown;
}

export interface MemberOutstandingPenaltiesResponse {
    success: boolean;
    message: string;
    data: MemberOutstandingPenalties | PenaltyListData;
}

export interface GeneratePenaltyResponse {
    success: boolean;
    message: string;
    data: Penalty;
}

export interface GenerateBatchPenaltiesResult {
    [key: string]: unknown;
}

export interface GenerateBatchPenaltiesResponse {
    success: boolean;
    message: string;
    data: GenerateBatchPenaltiesResult;
}