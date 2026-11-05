export type ContributionRuleScope =
  | "GLOBAL"
  | "REGION"
  | "BRANCH"
  | "CHAPTER"
  | "GROUP"
  | "MEMBER";

export type ContributionRuleDeadlineType =
  | "FIXED_DAY_OF_MONTH"
  | "FIRST_WEEKDAY"
  | "LAST_WEEKDAY"
  | "NTH_WEEKDAY"
  | "DAYS_AFTER_PERIOD_START"
  | "DAYS_BEFORE_PERIOD_END";

export type ContributionRuleFrequency =
  | "WEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "ANNUALLY"
  | "CUSTOM";

export interface ContributionRulePlan {
  id: string;
  name: string;
  code: string;
  description: string | null;
  status: string;
  frequency: ContributionRuleFrequency;
  frequencyOverride: string | null;
  currency: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContributionRuleLocation {
  id: string;
  name: string;
  code?: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContributionRuleMember {
  id: string;
  membershipNumber?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ContributionRuleCreator {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface ContributionRule {
  id: string;
  planId: string;
  name: string;

  scopeType: ContributionRuleScope;

  regionId: string | null;
  branchId: string | null;
  chapterId: string | null;
  groupId: string | null;
  memberId: string | null;

  amount: string | number;
  currency: string;

  frequencyOverride: ContributionRuleFrequency | null;

  deadlineType: ContributionRuleDeadlineType;
  deadlineDay: number | null;
  deadlineWeekday: number | null;
  deadlineWeek: number | null;
  deadlineOffsetDays: number | null;
  deadlineConfig: unknown | null;

  effectiveFrom: string;
  effectiveTo: string | null;

  priority: number;
  isActive: boolean;

  createdById: string;
  createdAt: string;
  updatedAt: string;

  plan?: ContributionRulePlan | null;

  region?: ContributionRuleLocation | null;
  branch?: ContributionRuleLocation | null;
  chapter?: ContributionRuleLocation | null;
  group?: ContributionRuleLocation | null;
  member?: ContributionRuleMember | null;

  createdBy?: ContributionRuleCreator | null;
}

/**
 * Create contribution rule.
 *
 * Scope-specific IDs are optional because they depend
 * on the selected scopeType.
 */
export interface CreateContributionRuleDto {
  planId: string;
  name: string;

  scopeType: ContributionRuleScope;

  regionId?: string | null;
  branchId?: string | null;
  chapterId?: string | null;
  groupId?: string | null;
  memberId?: string | null;

  amount: number;
  currency: string;

  frequencyOverride?: ContributionRuleFrequency | null;

  deadlineType: ContributionRuleDeadlineType;
  deadlineDay?: number | null;
  deadlineWeekday?: number | null;
  deadlineWeek?: number | null;
  deadlineOffsetDays?: number | null;

  effectiveFrom: string;
  effectiveTo?: string | null;

  priority: number;
  isActive: boolean;
}

/**
 * The backend's accepted PATCH fields are not confirmed yet.
 * Keep this flexible until the update validation schema
 * has been verified.
 */
export type UpdateContributionRuleDto =
  Record<string, unknown>;

export interface ContributionRuleFilters {
  planId?: string;
  scopeType?: ContributionRuleScope;

  regionId?: string;
  branchId?: string;
  chapterId?: string;
  groupId?: string;
  memberId?: string;

  frequencyOverride?: ContributionRuleFrequency;
  deadlineType?: ContributionRuleDeadlineType;

  isActive?: boolean;

  effectiveFrom?: string;
  effectiveTo?: string;

  priority?: number;

  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ContributionRuleListData {
  data: ContributionRule[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ContributionRuleResponse {
  success: boolean;
  message: string;
  data: ContributionRule;
  code?: string | null;
  errors?: unknown;
}

export interface ContributionRulesResponse {
  success: boolean;
  message: string;
  data: ContributionRuleListData;
  code?: string | null;
  errors?: unknown;
}

export interface ContributionRuleActionResponse {
  success: boolean;
  message: string;
  data?: ContributionRule;
  code?: string | null;
  errors?: unknown;
}