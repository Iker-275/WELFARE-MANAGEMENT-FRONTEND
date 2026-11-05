
export type MemberContributionStatus =
    | "PENDING"
    | "PARTIALLY_PAID"
    | "PAID"
    | "OVERDUE"
    | "WAIVED"
    | "CANCELLED"
    | (string & {});

export interface ContributionPaymentAllocation {
    amount: string | number;
}

export interface ContributionMember {
    id: string;
    userId: string;
    membershipNumber: string;
    status: string;
    regionId: string | null;
    branchId: string | null;
    chapterId: string | null;
    countyId: string | null;
    groupId: string | null;
    joinedAt: string | null;
    activatedAt: string | null;
    suspendedAt: string | null;
    retiredAt: string | null;
    resignedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ContributionPlanSummary {
    id: string;
    name: string;
    code: string;
    description: string | null;
    status: string;
    frequency: string;
    frequencyOverride?: string | null;
    currency: string;
    effectiveFrom: string;
    effectiveTo: string | null;
    createdById?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ContributionPeriodSummary {
    id: string;
    planId: string;
    name: string;
    periodStart: string;
    periodEnd: string;
    dueDate: string | null;
    status: string;
    generatedAt: string | null;
    closedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ContributionRuleSummary {
    id: string;
    planId: string;
    name: string;
    scopeType: string;
    regionId: string | null;
    branchId: string | null;
    chapterId: string | null;
    groupId: string | null;
    memberId: string | null;
    amount: string | number;
    currency: string;
    frequencyOverride: string | null;
    deadlineType: string | null;
    deadlineDay: number | null;
    deadlineWeekday: number | null;
    deadlineWeek: number | null;
    deadlineOffsetDays: number | null;
    deadlineConfig: unknown;
    effectiveFrom: string;
    effectiveTo: string | null;
    priority: number;
    isActive: boolean;
    createdById: string;
    createdAt: string;
    updatedAt: string;
}

export interface ContributionPenalty {
    id: string;
    memberId: string;
    memberContributionId: string;
    penaltyRuleId: string | null;
    type: string;
    source: string;
    status: string;
    baseAmount: string | number;
    percentage: number | null;
    amount: string | number;
    currency: string;
    reason: string | null;
    createdById: string | null;
    waivedById: string | null;
    waivedAt: string | null;
    waiverReason: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface MemberContribution {
    id: string;
    memberId: string;
    planId: string;
    periodId: string;
    contributionRuleId: string | null;

    amountDue: string | number;
    amountPaid: string | number;
    amountWaived: string | number;
    currency: string;
    status: MemberContributionStatus;

    dueAt: string | null;
    settledAt: string | null;
    generatedAt: string;
    createdAt: string;
    updatedAt: string;

    paymentAllocations: ContributionPaymentAllocation[];
    outstandingAmount: string | number;

    member?: ContributionMember;
    plan?: ContributionPlanSummary;
    period?: ContributionPeriodSummary;
    contributionRule?: ContributionRuleSummary | null;
    penalties?: ContributionPenalty[];
}

export interface MemberContributionFilters {
    memberId?: string;
    planId?: string;
    periodId?: string;
    status?: MemberContributionStatus;

    minAmountDue?: number;
    maxAmountDue?: number;
    minAmountPaid?: number;
    maxAmountPaid?: number;

    dueDateFrom?: string;
    dueDateTo?: string;
    settledDateFrom?: string;
    settledDateTo?: string;

    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface PeriodContributionFilters {
    status?: MemberContributionStatus;
    memberId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface MemberContributionListData {
    data: MemberContribution[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface MemberContributionResponse {
    success: boolean;
    message: string;
    data: MemberContribution;
}

export interface MemberContributionsResponse {
    success: boolean;
    message: string;
    data: MemberContributionListData;
}

export interface MemberContributionActionResponse {
    success: boolean;
    message: string;
    code: string | null;
    errors: unknown;
    data?: MemberContribution;
}

export interface PayMemberContributionDto {
    amount: number;
}

export interface WaiveMemberContributionDto {
    reason: string;
    amount: string;
}

// ==========================================
// 1. GENERATE SINGLE MEMBER CONTRIBUTION
// POST /member-contributions/generate
// ==========================================

export interface GenerateMemberContributionDto {
    memberId: string;
    periodId: string;
    planId: string;
}

// The response uses the detailed contribution structure.
export interface GenerateMemberContributionResponse {
    success: boolean;
    message: string;
    data: MemberContribution & {
        member: ContributionMember;
        plan: ContributionPlanSummary;
        period: ContributionPeriodSummary;
        contributionRule: ContributionRuleSummary | null;
    };
}

// ==========================================
// 2. GENERATE BULK CONTRIBUTIONS
// POST /member-contributions/generate/bulk
// ==========================================

export interface GenerateBulkMemberContributionsDto {
    memberIds: string[];
    periodId: string;
    planId: string;
}

export interface BulkGenerationError {
    [key: string]: unknown;
}

export interface BulkGenerationResult {
    requested: number;
    created: number;
    existing: number;
    failed: number;
    batches: number;
    errors: BulkGenerationError[];
}

export interface GenerateBulkMemberContributionsResponse {
    success: boolean;
    message: string;
    data: BulkGenerationResult;
}

// ==========================================
// 3. OVERDUE CONTRIBUTIONS
// GET /member-contributions/overdue
// ==========================================

export interface OverdueContributionFilters {
    memberId?: string;
    planId?: string;
    periodId?: string;
    dueAt?: string;
    page?: number;
    limit?: number;
}

export interface OverdueContributionsResponse {
    success: boolean;
    message: string;
    data: MemberContributionListData;
}

// ==========================================
// 4. CONTRIBUTION TOTALS
// GET /member-contributions/totals
// ==========================================

export interface ContributionTotalsFilters {
    memberId?: string;
    planId?: string;
    periodId?: string;
    status?: MemberContributionStatus;
}

export interface ContributionTotals {
    _sum: {
        amountDue: string | number | null;
        amountPaid: string | number | null;
        amountWaived: string | number | null;
    };
    _count: {
        id: number;
    };
}

export interface ContributionTotalsResponse {
    success: boolean;
    message: string;
    data: ContributionTotals;
}

// ==========================================
// 5. CONTRIBUTION STATUS COUNTS
// GET /member-contributions/status-counts
// ==========================================

export interface ContributionStatusCountFilters {
    memberId?: string;
    planId?: string;
    periodId?: string;
}

export interface ContributionStatusCount {
    _count: {
        id: number;
    };
    status: MemberContributionStatus;
}

export interface ContributionStatusCountsResponse {
    success: boolean;
    message: string;
    data: ContributionStatusCount[];
}

// ==========================================
// 6. MEMBER CONTRIBUTION HISTORY
// GET /members/:memberId/contributions
// ==========================================

export interface MemberContributionHistoryFilters {
    status?: MemberContributionStatus;
    planId?: string;
    periodId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface MemberContributionHistoryResponse {
    success: boolean;
    message: string;
    data: MemberContributionListData;
}

// ==========================================
// 7. PLAN CONTRIBUTIONS
// GET /contribution-plans/:planId/contributions
// ==========================================

export interface PlanContributionFilters {
    status?: MemberContributionStatus;
    periodId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface PlanContributionsResponse {
    success: boolean;
    message: string;
    data: MemberContributionListData;
}
