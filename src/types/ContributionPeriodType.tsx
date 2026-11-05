export type ContributionPeriodStatus =
    | "UPCOMING"
    | "OPEN"
    | "DUE"
    | "OVERDUE"
    | "CLOSED";

export interface ContributionPeriodCount {
    memberContributions: number;
}

export interface ContributionPeriodPlan {
    id: string;
    name: string;
    code: string;
    frequency: string;
    currency: string;
    status: string;
}

export interface ContributionPeriod {
    id: string;
    planId: string;
    name: string;
    periodStart: string;
    periodEnd: string;
    dueDate: string;
    status: ContributionPeriodStatus;
    generatedAt: string;
    closedAt: string | null;
    createdAt: string;
    updatedAt: string;

    plan?: ContributionPeriodPlan;
    _count?: ContributionPeriodCount;
}

export interface GenerateContributionPeriodDto {
    planId: string;
    periodStart: string;
    periodEnd: string;
    effectiveDate: string;
    name: string;
}

export interface GenerateContributionPeriodsBatchDto {
    planId: string;
    startDate: string;
    count: number;
}

export interface ContributionPeriodListData {
    data: ContributionPeriod[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface GenerateContributionPeriodsBatchData {
    planId: string;
    totalRequested: number;
    totalGenerated: number;
    periods: ContributionPeriod[];
}

export interface ContributionPeriodResponse {
    success: boolean;
    message: string;
    data: ContributionPeriod;
    code?: string | null;
    errors?: unknown;
}

export interface ContributionPeriodsResponse {
    success: boolean;
    message: string;
    data: ContributionPeriodListData;
    code?: string | null;
    errors?: unknown;
}

export interface GenerateContributionPeriodsBatchResponse {
    success: boolean;
    message: string;
    data: GenerateContributionPeriodsBatchData;
    code?: string | null;
    errors?: unknown;
}

export interface ContributionPeriodActionResponse {
    success: boolean;
    message: string;
    data?: ContributionPeriod;
    code?: string | null;
    errors?: unknown;
}