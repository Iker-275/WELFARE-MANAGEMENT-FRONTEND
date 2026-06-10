export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface Region {
  id: string;
  name: string;
  code: string | null;
  description: string;
}

export interface User {
  id: string;
  email: string;

  firstName: string | null;
  lastName: string | null;
  otherNames: string | null;

  phone: string | null;

  isEmailVerified: boolean;
  isPhoneVerified: boolean;

  signupCompleted: boolean;
  isActive: boolean;

  roleId: string;
  regionId: string;

  role?: Role;
  region?: Region;
}