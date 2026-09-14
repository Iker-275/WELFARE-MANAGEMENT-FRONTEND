// export interface UserRole {
//   id: string;
//   name: string;
// }

// export interface UserRegion {
//   id: string;
//   name: string;
//   code: string | null;
//   description: string | null;
// }

// export interface User {
//   id: string;

//   email: string;

//   phoneNumber: string | null;

//   firstName: string | null;
//   lastName: string | null;

//   gender: string | null;

//   userType: string;
//   accountStatus: string;

//   emailVerified: boolean;
//   phoneVerified: boolean;

//   roleId: string | null;

//   createdAt: string;
//   updatedAt: string;

//   role?: UserRole | null;
//   region?: UserRegion | null;
// }

// export interface UserFilters {
//   accountStatus?: string;
//   userType?: string;
//   roleId?: string;
//  search?: string;
//   page?: number;
//   limit?: number;
// }

// export interface ProfileCompletion {
//   isComplete: boolean;
// }

// export interface UserStatistics {
//   total: number;
//   active: number;
//   pending: number;
//   suspended: number;
//   deactivated: number;
// }

// export interface UpdateUserStatusDto {
//   accountStatus: string;
// }
// export interface UpdateUserRoleDto {
//   roleId: string;
// }

// export interface UsersPagination {
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;
// }

// export interface UsersData {
//   users: User[];
//   pagination: UsersPagination;
// }

// export interface UserResponse {
//   success: boolean;
//   message: string;
//   data: User;
// }

// export interface UsersResponse {
//   success: boolean;
//   message: string;
//   data: UsersData;
// }

// export interface ProfileCompletionResponse {
//   success: boolean;
//   message: string;
//   data: ProfileCompletion;
// }

// export interface UserStatisticsResponse {
//   success: boolean;
//   message: string;
//   data: UserStatistics;
// }

// export interface UserActionResponse {
//   success: boolean;
//   message: string;
//   data?: boolean | null;
// }

export interface UserRole {
  id: string;

  name: string;

  slug: string;

  description: string | null;

  createdAt: string;

  updatedAt: string;

  isSystem: boolean;
}

export interface UserRegion {
  id: string;

  name: string;

  code: string | null;

  description: string | null;
}

export interface UserMember {
  id: string;

  userId: string;

  membershipNumber: string;

  status: string;

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
}

export interface User {
  id: string;

  email: string;

  phoneNumber: string | null;

  firstName: string | null;

  lastName: string | null;

  gender: string | null;

  userType: string;

  accountStatus: string;

  emailVerified: boolean;

  phoneVerified: boolean;

  roleId: string | null;

  createdAt: string;

  updatedAt: string;

  role?: UserRole | null;

  region?: UserRegion | null;

  member?: UserMember | null;
}

/* ----------------------------------
 * Filters
 * ---------------------------------- */

export interface UserFilters {
  accountStatus?: string;

  userType?: string;

  roleId?: string;

  search?: string;

  page?: number;

  limit?: number;
}

/* ----------------------------------
 * Profile Completion
 * ---------------------------------- */

export interface ProfileCompletion {
  isComplete: boolean;
}

/* ----------------------------------
 * Statistics
 * ---------------------------------- */

export interface UserStatistics {
  total: number;

  active: number;

  pending: number;

  suspended: number;

  deactivated: number;
}

/* ----------------------------------
 * User Update
 * ---------------------------------- */

export interface UpdateUserDto {
  accountStatus: string;

  roleId: string;
}

/* ----------------------------------
 * Pagination
 * ---------------------------------- */

export interface UsersPagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}

export interface UsersData {
  users: User[];

  pagination: UsersPagination;
}

/* ----------------------------------
 * Responses
 * ---------------------------------- */

export interface UserResponse {
  success: boolean;

  message: string;

  data: User;
}

export interface UsersResponse {
  success: boolean;

  message: string;

  data: UsersData;
}

export interface ProfileCompletionResponse {
  success: boolean;

  message: string;

  data: ProfileCompletion;
}

export interface UserStatisticsResponse {
  success: boolean;

  message: string;

  data: UserStatistics;
}

export interface UserActionResponse {
  success: boolean;

  message: string;

  data?: boolean | null;
}

