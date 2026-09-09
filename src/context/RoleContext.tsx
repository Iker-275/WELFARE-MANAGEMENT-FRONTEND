import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Role,
  RolePermission,
  CreateRolePayload,
  UpdateRolePayload,
} from "../types/RoleType";

import roleService from "../api/RoleApi";

import { getApiError } from "../utils/apiError";


interface RoleContextType {

  roles: Role[];

  permissions: RolePermission[];

  loading: boolean;

  message: string;

  setMessage: React.Dispatch<
    React.SetStateAction<string>
  >;

  fetchRoles: () => Promise<boolean>;

  fetchRole: (
    id: string
  ) => Promise<Role | null>;

  fetchRolePermissions: (
    roleId: string
  ) => Promise<boolean>;

  createRole: (
    payload: CreateRolePayload
  ) => Promise<boolean>;

  updateRole: (
    id: string,
    payload: UpdateRolePayload
  ) => Promise<boolean>;

  deleteRole: (
    id: string
  ) => Promise<boolean>;

  syncPermissions: (
    roleId: string,
    permissionIds: string[]
  ) => Promise<boolean>;

  addPermissions: (
    roleId: string,
    permissionIds: string[]
  ) => Promise<boolean>;

  removePermissions: (
    roleId: string,
    permissionIds: string[]
  ) => Promise<boolean>;

  clearMessage: () => void;
}


export const RoleContext =
  createContext<RoleContextType | null>(
    null
  );


interface Props {
  children: ReactNode;
}


export const RoleProvider = ({
  children,
}: Props) => {

  const [roles, setRoles] =
    useState<Role[]>([]);

  const [permissions, setPermissions] =
    useState<RolePermission[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");


  /**
   * Fetch all roles
   */
  const fetchRoles =
    useCallback(async (): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await roleService.getRoles();

        if (!response.success) {

          setMessage(
            response.message
          );

          return false;
        }

        setRoles(
          response.data
        );

        setMessage(
          response.message
        );

        return true;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return false;

      } finally {

        setLoading(false);
      }

    }, []);


  /**
   * Fetch single role
   */
  const fetchRole =
    useCallback(async (
      id: string
    ): Promise<Role | null> => {

      try {

        setLoading(true);

        const response =
          await roleService.getRole(id);

        if (!response.success) {

          setMessage(
            response.message
          );

          return null;
        }

        setMessage(
          response.message
        );

        return response.data;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return null;

      } finally {

        setLoading(false);
      }

    }, []);


  /**
   * Fetch permissions assigned to role
   */
  const fetchRolePermissions =
    useCallback(async (
      roleId: string
    ): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await roleService.getRolePermissions(
            roleId
          );

        if (!response.success) {

          setMessage(
            response.message
          );

          return false;
        }

        setPermissions(
          response.data
        );

        setMessage(
          response.message
        );

        return true;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return false;

      } finally {

        setLoading(false);
      }

    }, []);


  /**
   * Create role
   */
  const createRole =
    useCallback(async (
      payload: CreateRolePayload
    ): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await roleService.create(
            payload
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        await fetchRoles();

        return true;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return false;

      } finally {

        setLoading(false);
      }

    }, [fetchRoles]);


  /**
   * Update role
   */
  const updateRole =
    useCallback(async (
      id: string,
      payload: UpdateRolePayload
    ): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await roleService.update(
            id,
            payload
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        await fetchRoles();

        return true;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return false;

      } finally {

        setLoading(false);
      }

    }, [fetchRoles]);


  /**
   * Delete role
   */
  const deleteRole =
    useCallback(async (
      id: string
    ): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await roleService.delete(
            id
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        await fetchRoles();

        return true;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return false;

      } finally {

        setLoading(false);
      }

    }, [fetchRoles]);


  /**
   * Synchronize permissions
   */
  const syncPermissions =
    useCallback(async (
      roleId: string,
      permissionIds: string[]
    ): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await roleService.syncPermissions(
            roleId,
            {
              permissionIds,
            }
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        await fetchRolePermissions(
          roleId
        );

        return true;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return false;

      } finally {

        setLoading(false);
      }

    }, [fetchRolePermissions]);


  /**
   * Add permissions
   */
  const addPermissions =
    useCallback(async (
      roleId: string,
      permissionIds: string[]
    ): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await roleService.addPermissions(
            roleId,
            {
              permissionIds,
            }
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        await fetchRolePermissions(
          roleId
        );

        return true;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return false;

      } finally {

        setLoading(false);
      }

    }, [fetchRolePermissions]);


  /**
   * Remove permissions
   */
  const removePermissions =
    useCallback(async (
      roleId: string,
      permissionIds: string[]
    ): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await roleService.removePermissions(
            roleId,
            {
              permissionIds,
            }
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        await fetchRolePermissions(
          roleId
        );

        return true;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return false;

      } finally {

        setLoading(false);
      }

    }, [fetchRolePermissions]);


  /**
   * Clear message
   */
  const clearMessage =
    useCallback(() => {

      setMessage("");

    }, []);


  /**
   * Initial role loading
   */
  useEffect(() => {

    fetchRoles();

  }, [fetchRoles]);


  return (
    <RoleContext.Provider
      value={{
        roles,
        permissions,

        loading,

        message,
        setMessage,

        fetchRoles,
        fetchRole,
        fetchRolePermissions,

        createRole,
        updateRole,
        deleteRole,

        syncPermissions,
        addPermissions,
        removePermissions,

        clearMessage,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};