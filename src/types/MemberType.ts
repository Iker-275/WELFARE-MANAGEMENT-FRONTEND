import type { Gender } from "./GenderType";

/* =====================================================
 * ENUM TYPES
 * ===================================================== */

export type MembershipStatus =
  | "PENDING"
  | "ACTIVE"
  | "SUSPENDED"
  | "RETIRED"
  | "RESIGNED";

/* =====================================================
 * MEMBER PROFILE
 * ===================================================== */

export interface MemberProfile {
  id: string;

  memberId: string;

  firstName: string;
  lastName: string;
  otherNames: string | null;

  gender: Gender | null;

  dateOfBirth: string | null;

  nationalId: string | null;

  address: string | null;

  profilePhotoId: string | null;

  createdAt: string;
  updatedAt: string;
}

/* =====================================================
 * MEMBER
 * ===================================================== */

export interface Member {
  id: string;

  userId: string;

  membershipNumber: string;

  status: MembershipStatus;

  regionId: string | null;
  branchId: string | null;
  chapterId: string | null;
  countyId: string | null;
  groupId: string | null;

  joinedAt: string;

  activatedAt: string | null;
  suspendedAt: string | null;
  retiredAt: string | null;
  resignedAt: string | null;

  createdAt: string;
  updatedAt: string;

  profile: MemberProfile;
}

/* =====================================================
 * LOCATION
 * ===================================================== */

export interface MemberLocation {
  id: string;

  name: string;

  code: string | null;

  description: string | null;

  createdAt: string;
  updatedAt: string;
}

/* =====================================================
 * MEMBER DETAILS
 * ===================================================== */

import type { Employment } from "./EmploymentType";
import type { NextOfKin } from "./NextOfKinType";
import type { Dependant } from "./DependantType";

export interface MemberDetails extends Member {
  employment: Employment | null;

  nextOfKin: NextOfKin | null;

  dependants: Dependant[];

  region: MemberLocation | null;

  branch: MemberLocation | null;

  chapter: MemberLocation | null;

  county: MemberLocation | null;

  group: MemberLocation | null;
}

/* =====================================================
 * CREATE MEMBER PROFILE
 * ===================================================== */

export interface CreateMemberProfileDto {
  firstName: string;
  lastName: string;

  otherNames?: string | null;

  gender: Gender | null;

  dateOfBirth: string;

  nationalId?: string | null;

  address?: string | null;

  profilePhotoId?: string | null;
}

/* =====================================================
 * CREATE MEMBER
 * ===================================================== */

export interface CreateMemberDto {
  userId: string;

  profile: CreateMemberProfileDto;

  regionId: string;
}

/* =====================================================
 * UPDATE MEMBER PROFILE
 * ===================================================== */

export interface UpdateMemberProfileDto {
  firstName?: string;
  lastName?: string;

  otherNames?: string | null;

  gender?: Gender | null;

  dateOfBirth?: string | null;

  nationalId?: string | null;

  address?: string | null;

  profilePhotoId?: string | null;
  regionId: string | null;
}

/* =====================================================
 * MEMBER ACTIONS
 * ===================================================== */

export interface MemberActionReasonDto {
  reason: string;
}

/* =====================================================
 * MEMBER FILTERS
 * ===================================================== */

export interface MemberFilters {
  page?: number;
  limit?: number;

  search?: string;

  status?: MembershipStatus;

  regionId?: string;

  branchId?: string;

  chapterId?: string;

  countyId?: string;

  groupId?: string;
}

/* =====================================================
 * PAGINATION
 * ===================================================== */

export interface MemberPagination {
  page: number;
  limit: number;

  total: number;
  totalPages: number;

  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/* =====================================================
 * RESPONSES
 * ===================================================== */

export interface MembersResponse {
  success: boolean;

  message: string;

  data: Member[];

  pagination: MemberPagination;

  filters?: Record<string, unknown>;
}

export interface MemberResponse {
  success: boolean;

  message: string;

  data: Member | MemberDetails;
}

export interface MemberProfileResponse {
  success: boolean;

  message: string;

  data: MemberProfile;
}

export interface MemberActionResponse {
  success: boolean;

  message: string;

  data: Member | MemberDetails;
}

export interface MemberDetailsResponse {
  success: boolean;

  message: string;

  data: MemberDetails;
}

export interface MemberProfileFormData {
  firstName: string;
  lastName: string;
  otherNames: string | null;
  gender: Gender | null;
  dateOfBirth: string | null;
  nationalId: string | null;
  address: string | null;
  profilePhotoId: string | null;
}