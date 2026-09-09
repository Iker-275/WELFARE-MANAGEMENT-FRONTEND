import api from "./api";

import {
  CreateRolePayload,
  UpdateRolePayload,
  RolePermissionsPayload,
  RoleResponse,
  RolesResponse,
  RolePermissionsResponse,
  RoleActionResponse,
} from "../types/RoleType";

export const roleService = {

  /**
   * Create role
   */
  create: async (
    payload: CreateRolePayload
  ): Promise<RoleResponse> => {
    const { data } = await api.post(
      "/roles",
      payload
    );

    return data;
  },

  /**
   * Get all roles
   */
  getRoles: async (): Promise<RolesResponse> => {
    const { data } = await api.get(
      "/roles"
    );

    return data;
  },

  /**
   * Get single role
   */
  getRole: async (
    id: string
  ): Promise<RoleResponse> => {
    const { data } = await api.get(
      `/roles/${id}`
    );

    return data;
  },

  /**
   * Update role
   */
  update: async (
    id: string,
    payload: UpdateRolePayload
  ): Promise<RoleResponse> => {
    const { data } = await api.patch(
      `/roles/${id}`,
      payload
    );

    return data;
  },

  /**
   * Delete role
   */
  delete: async (
    id: string
  ): Promise<RoleActionResponse> => {
    const { data } = await api.delete(
      `/roles/${id}`
    );

    return data;
  },

  /**
   * Get permissions assigned to role
   */
  getRolePermissions: async (
    roleId: string
  ): Promise<RolePermissionsResponse> => {
    const { data } = await api.get(
      `/roles/${roleId}/permissions`
    );

    return data;
  },

  /**
   * Synchronize role permissions
   *
   * Replaces the role's current permissions
   * with the supplied permission IDs.
   */
  syncPermissions: async (
    roleId: string,
    payload: RolePermissionsPayload
  ): Promise<RoleActionResponse> => {
    const { data } = await api.put(
      `/roles/${roleId}/permissions`,
      payload
    );

    return data;
  },

  /**
   * Add permissions to role
   */
  addPermissions: async (
    roleId: string,
    payload: RolePermissionsPayload
  ): Promise<RoleActionResponse> => {
    const { data } = await api.post(
      `/roles/${roleId}/permissions`,
      payload
    );

    return data;
  },

  /**
   * Remove permissions from role
   */
  removePermissions: async (
    roleId: string,
    payload: RolePermissionsPayload
  ): Promise<RoleActionResponse> => {
    const { data } = await api.delete(
      `/roles/${roleId}/permissions`,
      {
        data: payload,
      }
    );

    return data;
  },
};

export default roleService;