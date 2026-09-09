export interface Permission {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}


export interface CreatePermissionPayload {
  name: string;
  description?: string | null;
}


export interface UpdatePermissionPayload {
  name: string;
  description?: string | null;
}


export interface PermissionResponse {
  success: boolean;
  message: string;
  data: Permission;
}


export interface PermissionsResponse {
  success: boolean;
  message: string;
  data: Permission[];
}


export interface BasicPermissionResponse {
  success: boolean;
  message: string;
  data?: boolean;
}