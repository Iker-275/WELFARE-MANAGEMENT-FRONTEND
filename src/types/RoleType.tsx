export interface Role {
  id: string;
  name: string;
  description: string | null;
  isNecRole: boolean;
  isSystem: boolean;
  termYears: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  createdAt: string;

  permission: Permission;
}

export interface CreateRolePayload {
  name: string;
}

export interface UpdateRolePayload {
  name: string;
}

export interface SyncRolePermissionsPayload {
  permissionIds: string[];
}

export interface RoleResponse {
  success: boolean;
  message: string;
  data: Role;
}

export interface RolesResponse {
  success: boolean;
  data: Role[];
}

export interface RolePermissionsResponse {
  success: boolean;
  permissions: RolePermission[];
}

export interface BasicRoleResponse {
  success: boolean;
  message: string;
}