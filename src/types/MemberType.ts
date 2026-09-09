export type MembershipStatus =
  | "PENDING"
  | "ACTIVE"
  | "SUSPENDED"
  | "RETIRED"
  | "RESIGNED";

export type Gender =
  | "MALE"
  | "FEMALE"
  | "OTHER";

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

export interface MemberEmployment {
  id: string;
  memberId: string;

  employeeId?: string | null;
  employer?: string | null;
  position?: string | null;

  employmentStatus?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface MemberNextOfKin {
  id: string;
  memberId: string;

  firstName?: string | null;
  lastName?: string | null;

  relationship?: string | null;

  phoneNumber?: string | null;
  email?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface MemberDependant {
  id: string;
  memberId: string;

  firstName?: string | null;
  lastName?: string | null;

  relationship?: string | null;

  dateOfBirth?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface MemberLocation {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface MemberDetails extends Member {
  employment: MemberEmployment[];

  nextOfKin: MemberNextOfKin | null;

  dependants: MemberDependant[];

  region: MemberLocation | null;
  branch: MemberLocation | null;
  chapter: MemberLocation | null;
  county: MemberLocation | null;
  group: MemberLocation | null;
}

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

export interface CreateMemberDto {
  userId: string;

  profile: CreateMemberProfileDto;

  regionId: string;
}

export interface UpdateMemberProfileDto {
  firstName?: string;

  lastName?: string;

  otherNames?: string | null;

  gender?: Gender | null;

  dateOfBirth?: string;

  nationalId?: string | null;

  address?: string | null;

  profilePhotoId?: string | null;

  regionId?: string | null;
}

export interface MemberActionReasonDto {
  reason: string;
}

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

export interface MemberPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface MembersResponse {
  success: boolean;
  message?: string;

  data: Member[];

  pagination: MemberPagination;

  filters?: Record<string, unknown>;
}

export interface MemberResponse {
  success: boolean;
  message?: string;

  data: Member | MemberDetails;
}

export interface MemberProfileResponse {
  success: boolean;
  message?: string;

  data: MemberProfile;
}

export interface MemberActionResponse {
  success: boolean;
  message?: string;

  data: Member | MemberDetails;
}