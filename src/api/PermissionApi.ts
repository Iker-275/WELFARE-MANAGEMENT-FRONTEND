import api from "./api";

import {
  CreatePermissionPayload,
  UpdatePermissionPayload,
  PermissionResponse,
  PermissionsResponse,
  BasicPermissionResponse,
} from "../types/PermissionType";


export const permissionService = {

  /**
   * Create permission
   */
  create: async (
    payload: CreatePermissionPayload
  ): Promise<PermissionResponse> => {

    const { data } =
      await api.post(
        "/permissions",
        payload
      );

    return data;
  },


  /**
   * Get all permissions
   */
  getAll: async (): Promise<PermissionsResponse> => {

    const { data } =
      await api.get(
        "/permissions"
      );

    return data;
  },


  /**
   * Update permission
   */
  update: async (
    id: string,
    payload: UpdatePermissionPayload
  ): Promise<PermissionResponse> => {

    const { data } =
      await api.patch(
        `/permissions/${id}`,
        payload
      );

    return data;
  },


  /**
   * Delete permission
   */
  delete: async (
    id: string
  ): Promise<BasicPermissionResponse> => {

    const { data } =
      await api.delete(
        `/permissions/${id}`
      );

    return data;
  },
};


export default permissionService;