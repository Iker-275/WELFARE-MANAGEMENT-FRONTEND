import {
  createContext,
  ReactNode,
  useEffect,
  useState,
} from "react";

import {
  Role,
  RolePermission,
  CreateRolePayload,
  UpdateRolePayload,
} from "../types/RoleType";

import {
  roleService,
  getErrorMessage,
} from "../api/RoleApi";

interface RoleContextType {
  roles: Role[];

  permissions: RolePermission[];

  loading: boolean;

  message: string;

  setMessage: React.Dispatch<
    React.SetStateAction<string>
  >;

  fetchRoles: () => Promise<void>;

  fetchRolePermissions: (
    roleId: string
  ) => Promise<void>;

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

  const fetchRoles =
    async (): Promise<void> => {
      try {
        setLoading(true);

        const response =
          await roleService.getRoles();

        setRoles(response.data);
      } catch (error) {
        setMessage(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

  const fetchRolePermissions =
    async (
      roleId: string
    ): Promise<void> => {
      try {
        setLoading(true);

        const response =
          await roleService.getRolePermissions(
            roleId
          );

        setPermissions(
          response.permissions
        );
      } catch (error) {
        setMessage(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

  const createRole = async (
    payload: CreateRolePayload
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response =
        await roleService.create(
          payload
        );

      setMessage(response.message);

      await fetchRoles();

      return response.success;
    } catch (error) {
      setMessage(getErrorMessage(error));

      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (
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

      setMessage(response.message);

      await fetchRoles();

      return response.success;
    } catch (error) {
      setMessage(getErrorMessage(error));

      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (
    id: string
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response =
        await roleService.delete(id);

      setMessage(response.message);

      await fetchRoles();

      return response.success;
    } catch (error) {
      setMessage(getErrorMessage(error));

      return false;
    } finally {
      setLoading(false);
    }
  };

  const syncPermissions = async (
    roleId: string,
    permissionIds: string[]
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response =
        await roleService.syncPermissions(
          roleId,
          { permissionIds }
        );

      setMessage(response.message);

      await fetchRolePermissions(
        roleId
      );

      return response.success;
    } catch (error) {
      setMessage(getErrorMessage(error));

      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <RoleContext.Provider
      value={{
        roles,
        permissions,
        loading,
        message,
        setMessage,
        fetchRoles,
        fetchRolePermissions,
        createRole,
        updateRole,
        deleteRole,
        syncPermissions,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};