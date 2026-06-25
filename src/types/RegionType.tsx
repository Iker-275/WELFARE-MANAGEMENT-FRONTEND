export interface Region {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;

  _count?: {
    users: number;
  };
}

export interface RegionUser {
  id: string;

  employeeId: string | null;
  membershipNumber: string | null;

  firstName: string | null;
  lastName: string | null;

  phone: string | null;
  email: string | null;

  membershipStatus: string;
  employmentStatus: string;

  isActive: boolean;
  isNecMember: boolean;

  role: {
    id: string;
    name: string;
  } | null;
}

export interface CreateRegionDto {
  name: string;
  code?: string;
  description?: string;
}
export interface UpdateRegionDto {
  name?: string;
  code?: string;
  description?: string;
}

export interface RegionFilters {
  search?: string;
}

export interface RegionUserFilters {
  page?: number;
  limit?: number;

  search?: string;

  membershipStatus?: string;
  employmentStatus?: string;

  roleId?: string;

  isActive?: boolean;
}