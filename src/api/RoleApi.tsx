import api from "./api";

import {
  CreateRolePayload,
  UpdateRolePayload,
  SyncRolePermissionsPayload,
  RoleResponse,
  RolesResponse,
  RolePermissionsResponse,
  BasicRoleResponse,
} from "../types/RoleType";

export const roleService = {
  create: async (
    payload: CreateRolePayload
  ): Promise<RoleResponse> => {
    const { data } = await api.post(
      "/roles",
      payload
    );

    return data;
  },

  getRoles: async (): Promise<RolesResponse> => {
    const { data } =
      await api.get("/roles");

    return data;
  },

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

  delete: async (
    id: string
  ): Promise<BasicRoleResponse> => {
    const { data } = await api.delete(
      `/roles/${id}`
    );

    return data;
  },

  syncPermissions: async (
    roleId: string,
    payload: SyncRolePermissionsPayload
  ): Promise<BasicRoleResponse> => {
    const { data } = await api.put(
      `/roles/${roleId}/sync`,
      payload
    );
console.log("syncPermissions data:", data);
    return data;
  },

  getRolePermissions: async (
    roleId: string
  ): Promise<RolePermissionsResponse> => {
    const { data } = await api.get(
      `/permissions/${roleId}`
    );

    return data;
  },
};

export const getErrorMessage = (
  error: any
): string => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong"
  );
};