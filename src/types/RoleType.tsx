export interface Role {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  isSystem: boolean;
}

export interface Permission {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  createdAt: string;
  permission: Permission;
}

/* ----------------------------------
 * Payloads
 * ---------------------------------- */

export interface CreateRolePayload {
  name: string;
  isSystem: boolean;
  description?: string | null;
}

export interface UpdateRolePayload {
  name: string;
  isSystem: boolean;
  description?: string | null;
}

export interface RolePermissionsPayload {
  permissionIds: string[];
}

/* ----------------------------------
 * Responses
 * ---------------------------------- */

export interface RoleResponse {
  success: boolean;
  message: string;
  data: Role;
}

export interface RolesResponse {
  success: boolean;
  message: string;
  data: Role[];
}

export interface RolePermissionsResponse {
  success: boolean;
  message: string;
  data: RolePermission[];
}

export interface RoleActionResponse {
  success: boolean;
  message: string;
  data: boolean | {
    count: number;
  };
}