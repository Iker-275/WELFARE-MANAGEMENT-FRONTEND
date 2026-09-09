import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Permission,
  CreatePermissionPayload,
  UpdatePermissionPayload,
} from "../types/PermissionType";

import permissionService from "../api/PermissionApi";

import { getApiError } from "../utils/apiError";


interface PermissionContextType {

  permissions: Permission[];

  loading: boolean;

  message: string;

  setMessage: React.Dispatch<
    React.SetStateAction<string>
  >;

  fetchPermissions: () => Promise<boolean>;

  fetchPermission: (
    id: string
  ) => Promise<Permission | null>;

  createPermission: (
    payload: CreatePermissionPayload
  ) => Promise<boolean>;

  updatePermission: (
    id: string,
    payload: UpdatePermissionPayload
  ) => Promise<boolean>;

  deletePermission: (
    id: string
  ) => Promise<boolean>;

  clearMessage: () => void;
}


export const PermissionContext =
  createContext<PermissionContextType | null>(
    null
  );


interface Props {
  children: ReactNode;
}


export const PermissionProvider = ({
  children,
}: Props) => {

  const [
    permissions,
    setPermissions,
  ] = useState<Permission[]>([]);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    message,
    setMessage,
  ] = useState("");


  /**
   * Fetch all permissions
   */
  const fetchPermissions =
    useCallback(async (): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await permissionService.getAll();


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
   * Fetch single permission
   */
  const fetchPermission =
    useCallback(async (
      id: string
    ): Promise<Permission | null> => {

      /*
       * There is currently no GET /permissions/:id
       * endpoint in the backend contract you provided.
       *
       * Therefore we resolve the permission from the
       * already-loaded permissions collection.
       */

      const permission =
        permissions.find(
          (item) => item.id === id
        );


      if (!permission) {

        setMessage(
          "Permission not found"
        );

        return null;
      }


      return permission;

    }, [permissions]);


  /**
   * Create permission
   */
  const createPermission =
    useCallback(async (
      payload: CreatePermissionPayload
    ): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await permissionService.create(
            payload
          );


        setMessage(
          response.message
        );


        if (!response.success) {
          return false;
        }


        await fetchPermissions();


        return true;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return false;

      } finally {

        setLoading(false);
      }

    }, [fetchPermissions]);


  /**
   * Update permission
   */
  const updatePermission =
    useCallback(async (
      id: string,
      payload: UpdatePermissionPayload
    ): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await permissionService.update(
            id,
            payload
          );


        setMessage(
          response.message
        );


        if (!response.success) {
          return false;
        }


        await fetchPermissions();


        return true;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return false;

      } finally {

        setLoading(false);
      }

    }, [fetchPermissions]);


  /**
   * Delete permission
   */
  const deletePermission =
    useCallback(async (
      id: string
    ): Promise<boolean> => {

      try {

        setLoading(true);

        const response =
          await permissionService.delete(
            id
          );


        setMessage(
          response.message
        );


        if (!response.success) {
          return false;
        }


        await fetchPermissions();


        return true;

      } catch (error) {

        setMessage(
          getApiError(error).message
        );

        return false;

      } finally {

        setLoading(false);
      }

    }, [fetchPermissions]);


  /**
   * Clear message
   */
  const clearMessage =
    useCallback(() => {

      setMessage("");

    }, []);


  /**
   * Initial permissions loading
   */
  useEffect(() => {

    fetchPermissions();

  }, [fetchPermissions]);


  return (
    <PermissionContext.Provider
      value={{
        permissions,

        loading,

        message,
        setMessage,

        fetchPermissions,
        fetchPermission,

        createPermission,
        updatePermission,
        deletePermission,

        clearMessage,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};