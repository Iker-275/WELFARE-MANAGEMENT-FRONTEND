export type PenaltyType =
    | "FIXED"
    | "PERCENTAGE"
    | "TIERED"
    | (string & {});

export type PenaltyScopeType =
    | "GLOBAL"
    | "REGION"
    | "BRANCH"
    | "CHAPTER"
    | "GROUP"
    | "MEMBER"
    | (string & {});

/**
 * The API documentation shows tiers as an array but does not
 * document the individual tier fields. Keep this extensible
 * until the backend tier contract is available.
 */
export interface PenaltyRuleTier {
    id?: string;
    [key: string]: unknown;
}

export interface PenaltyContributionPlan {
    id: string;
    name: string;
    code: string;
    description?: string | null;
    status?: string;
    frequency?: string;
    frequencyOverride?: string | null;
    currency?: string;
    effectiveFrom?: string;
    effectiveTo?: string | null;
    createdById?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface PenaltyRuleRegion {
    id: string;
    name?: string;
    code?: string;
    [key: string]: unknown;
}

export interface PenaltyRuleBranch {
    id: string;
    name?: string;
    code?: string;
    [key: string]: unknown;
}

export interface PenaltyRuleChapter {
    id: string;
    name?: string;
    code?: string;
    [key: string]: unknown;
}

export interface PenaltyRuleGroup {
    id: string;
    name?: string;
    code?: string;
    [key: string]: unknown;
}

export interface PenaltyRuleMember {
    id: string;
    membershipNumber?: string;
    [key: string]: unknown;
}

export interface PenaltyRuleCreator {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    [key: string]: unknown;
}

export interface PenaltyRuleCount {
    penalties: number;
    tiers: number;
}

export interface PenaltyRule {
    id: string;
    name: string;
    code: string;
    description: string | null;

    penaltyType: PenaltyType;
    contributionPlanId: string;

    scopeType: PenaltyScopeType;

    regionId: string | null;
    branchId: string | null;
    chapterId: string | null;
    groupId: string | null;
    memberId: string | null;

    fixedAmount: string | number | null;
    percentage: string | number | null;

    gracePeriodDays: number;

    capAmount: string | number | null;
    capPercentage: string | number | null;

    effectiveFrom: string;
    effectiveTo: string | null;

    priority: number;
    isActive: boolean;

    createdById: string | null;
    createdAt: string;
    updatedAt: string;

    contributionPlan?: PenaltyContributionPlan | null;

    region?: PenaltyRuleRegion | null;
    branch?: PenaltyRuleBranch | null;
    chapter?: PenaltyRuleChapter | null;
    group?: PenaltyRuleGroup | null;
    member?: PenaltyRuleMember | null;
    createdBy?: PenaltyRuleCreator | null;

    tiers?: PenaltyRuleTier[];
    _count?: PenaltyRuleCount;
}

export interface CreatePenaltyRuleDto {
    name: string;
    code: string;
    description?: string | null;

    penaltyType: PenaltyType;
    contributionPlanId: string;

    scopeType: PenaltyScopeType;

    regionId?: string | null;
    branchId?: string | null;
    chapterId?: string | null;
    groupId?: string | null;
    memberId?: string | null;

    fixedAmount?: number | null;
    percentage?: number | null;

    gracePeriodDays: number;

    capAmount?: number | null;
    capPercentage?: number | null;

    effectiveFrom: string;
    effectiveTo?: string | null;

    priority?: number;
    isActive?: boolean;

    tiers?: PenaltyRuleTier[];
}

export interface PenaltyRuleFilters {
    page?: number;
    limit?: number;

    search?: string;
    code?: string;
    penaltyType?: PenaltyType;
    scopeType?: PenaltyScopeType;

    contributionPlanId?: string;
    regionId?: string;
    branchId?: string;
    chapterId?: string;
    groupId?: string;
    memberId?: string;

    isActive?: boolean;
    effectiveDate?: string;

    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface PenaltyRuleListData {
    data: PenaltyRule[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PenaltyRuleResponse {
    success: boolean;
    message: string;
    data: PenaltyRule;
}

export interface PenaltyRulesResponse {
    success: boolean;
    message: string;
    data: PenaltyRuleListData;
}

export interface ApplicablePenaltyRulesResponse {
    success: boolean;
    message: string;
    data: PenaltyRule[];
}

export interface PenaltyRuleActionResponse {
    success: boolean;
    message: string;
    data: PenaltyRule;
}