
export type ContributionPlanStatus =
  | "DRAFT"
  | "ACTIVE"
  | "INACTIVE"
  | "ARCHIVED";

export type ContributionFrequency =
  | "WEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "ANNUALLY"
  | "CUSTOM";

export interface ContributionPlanCount {
  rules: number;
  periods: number;
  memberContributions: number;
  penaltyRules: number;
}

export interface ContributionPlanCreator {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

export interface ContributionPlan {
  id: string;
  name: string;
  code: string;
  description: string | null;
  status: ContributionPlanStatus;
  frequency: ContributionFrequency;
  frequencyOverride: string | null;
  currency: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;

  createdBy?: ContributionPlanCreator;

  _count?: ContributionPlanCount;
}

export interface CreateContributionPlanDto {
  name: string;
  code: string;
  description: string;
  frequency: ContributionFrequency;
  currency: string;
  effectiveFrom: string;
  effectiveTo: string | null;
}

/**
 * The backend has not yet confirmed the accepted
 * update fields. Keep this flexible until the
 * actual update validation schema is provided.
 */
export interface UpdateContributionPlanDto {
  // [key: string]: unknown;
  name: string;
  code: string;
  description: string;
  frequency: ContributionFrequency;
  currency: string;
  effectiveFrom: string;
  effectiveTo: string | null;
}

export interface ContributionPlanFilters {
  search?: string;
  status?: ContributionPlanStatus;
  frequency?: ContributionFrequency;
  currency?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  createdById?: string;

  page?: number;
 limit?: number;

  sortBy?: string;
   sortOrder?: "asc" | "desc";
}

export interface ContributionPlanListData {
  data: ContributionPlan[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ContributionPlanResponse {
  success: boolean;
  message: string;
  data: ContributionPlan;
  code?: string | null;
  errors?: unknown;
}

export interface ContributionPlansResponse {
  success: boolean;
  message: string;
  data: ContributionPlanListData;
  code?: string | null;
  errors?: unknown;
}

export interface ContributionPlanActionResponse {
  success: boolean;
  message: string;
  data?: ContributionPlan;
  code?: string | null;
  errors?: unknown;
}
