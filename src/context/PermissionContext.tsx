// import {
//   createContext,
//   ReactNode,
//   useCallback,
//   useEffect,
//   useState,
// } from "react";

// import {
//   Permission,
//   CreatePermissionPayload,
//   UpdatePermissionPayload,
// } from "../types/PermissionType";

// import permissionService from "../api/PermissionApi";

// import { getApiError } from "../utils/apiError";


// interface PermissionContextType {

//   permissions: Permission[];

//   loading: boolean;

//   message: string;

//   setMessage: React.Dispatch<
//     React.SetStateAction<string>
//   >;

//   fetchPermissions: () => Promise<boolean>;

//   fetchPermission: (
//     id: string
//   ) => Promise<Permission | null>;

//   createPermission: (
//     payload: CreatePermissionPayload
//   ) => Promise<boolean>;

//   updatePermission: (
//     id: string,
//     payload: UpdatePermissionPayload
//   ) => Promise<boolean>;

//   deletePermission: (
//     id: string
//   ) => Promise<boolean>;

//   clearMessage: () => void;
// }


// export const PermissionContext =
//   createContext<PermissionContextType | null>(
//     null
//   );


// interface Props {
//   children: ReactNode;
// }


// export const PermissionProvider = ({
//   children,
// }: Props) => {

//   const [
//     permissions,
//     setPermissions,
//   ] = useState<Permission[]>([]);


//   const [
//     loading,
//     setLoading,
//   ] = useState(false);


//   const [
//     message,
//     setMessage,
//   ] = useState("");


//   /**
//    * Fetch all permissions
//    */
//   const fetchPermissions =
//     useCallback(async (): Promise<boolean> => {

//       try {

//         setLoading(true);

//         const response =
//           await permissionService.getAll();


//         if (!response.success) {

//           setMessage(
//             response.message
//           );

//           return false;
//         }


//         setPermissions(
//           response.data
//         );


//         setMessage(
//           response.message
//         );


//         return true;

//       } catch (error) {

//         setMessage(
//           getApiError(error).message
//         );

//         return false;

//       } finally {

//         setLoading(false);
//       }

//     }, []);


//   /**
//    * Fetch single permission
//    */
//   const fetchPermission =
//     useCallback(async (
//       id: string
//     ): Promise<Permission | null> => {

//       /*
//        * There is currently no GET /permissions/:id
//        * endpoint in the backend contract you provided.
//        *
//        * Therefore we resolve the permission from the
//        * already-loaded permissions collection.
//        */

//       const permission =
//         permissions.find(
//           (item) => item.id === id
//         );


//       if (!permission) {

//         setMessage(
//           "Permission not found"
//         );

//         return null;
//       }


//       return permission;

//     }, [permissions]);


//   /**
//    * Create permission
//    */
//   const createPermission =
//     useCallback(async (
//       payload: CreatePermissionPayload
//     ): Promise<boolean> => {

//       try {

//         setLoading(true);

//         const response =
//           await permissionService.create(
//             payload
//           );


//         setMessage(
//           response.message
//         );


//         if (!response.success) {
//           return false;
//         }


//         await fetchPermissions();


//         return true;

//       } catch (error) {

//         setMessage(
//           getApiError(error).message
//         );

//         return false;

//       } finally {

//         setLoading(false);
//       }

//     }, [fetchPermissions]);


//   /**
//    * Update permission
//    */
//   const updatePermission =
//     useCallback(async (
//       id: string,
//       payload: UpdatePermissionPayload
//     ): Promise<boolean> => {

//       try {

//         setLoading(true);

//         const response =
//           await permissionService.update(
//             id,
//             payload
//           );


//         setMessage(
//           response.message
//         );


//         if (!response.success) {
//           return false;
//         }


//         await fetchPermissions();


//         return true;

//       } catch (error) {

//         setMessage(
//           getApiError(error).message
//         );

//         return false;

//       } finally {

//         setLoading(false);
//       }

//     }, [fetchPermissions]);


//   /**
//    * Delete permission
//    */
//   const deletePermission =
//     useCallback(async (
//       id: string
//     ): Promise<boolean> => {

//       try {

//         setLoading(true);

//         const response =
//           await permissionService.delete(
//             id
//           );


//         setMessage(
//           response.message
//         );


//         if (!response.success) {
//           return false;
//         }


//         await fetchPermissions();


//         return true;

//       } catch (error) {

//         setMessage(
//           getApiError(error).message
//         );

//         return false;

//       } finally {

//         setLoading(false);
//       }

//     }, [fetchPermissions]);


//   /**
//    * Clear message
//    */
//   const clearMessage =
//     useCallback(() => {

//       setMessage("");

//     }, []);


//   /**
//    * Initial permissions loading
//    */
//   useEffect(() => {

//     fetchPermissions();

//   }, [fetchPermissions]);


//   return (
//     <PermissionContext.Provider
//       value={{
//         permissions,

//         loading,

//         message,
//         setMessage,

//         fetchPermissions,
//         fetchPermission,

//         createPermission,
//         updatePermission,
//         deletePermission,

//         clearMessage,
//       }}
//     >
//       {children}
//     </PermissionContext.Provider>
//   );
// };
import {
  createContext,
  ReactNode,
  useCallback,
  useState,
} from "react";

import permissionService from "../api/PermissionApi";

import {
  Permission,
  CreatePermissionPayload,
  UpdatePermissionPayload,
} from "../types/PermissionType";

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
    permissionId: string
  ) => Promise<Permission | null>;

  createPermission: (
    payload: CreatePermissionPayload
  ) => Promise<boolean>;

  updatePermission: (
    permissionId: string,
    payload: UpdatePermissionPayload
  ) => Promise<boolean>;

  deletePermission: (
    permissionId: string
  ) => Promise<boolean>;

  clearMessage: () => void;
}

export const PermissionContext =
  createContext<PermissionContextType | null>(
    null
  );

interface PermissionProviderProps {
  children: ReactNode;
}

export const PermissionProvider = ({
  children,
}: PermissionProviderProps) => {
  const [permissions, setPermissions] =
    useState<Permission[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  /*
   * ============================================================
   * LOAD PERMISSIONS
   * ============================================================
   *
   * Internal loader used by both fetchPermissions()
   * and fetchPermission().
   *
   * It returns the actual collection so callers do not
   * have to wait for React state to update.
   */

  const loadPermissions = useCallback(
    async (): Promise<Permission[] | null> => {
      try {
        const response =
          await permissionService.getAll();

        setMessage(response.message);

        if (!response.success) {
          return null;
        }

        setPermissions(response.data);

        return response.data;
      } catch (error) {
        const apiError =
          getApiError(error);

        setMessage(apiError.message);

        return null;
      }
    },
    []
  );

  /*
   * ============================================================
   * FETCH ALL PERMISSIONS
   * ============================================================
   */

  const fetchPermissions = useCallback(
    async (): Promise<boolean> => {
      try {
        setLoading(true);

        const data =
          await loadPermissions();

        return data !== null;
      } finally {
        setLoading(false);
      }
    },
    [loadPermissions]
  );

  /*
   * ============================================================
   * FETCH SINGLE PERMISSION
   * ============================================================
   *
   * The backend currently does not expose a dedicated
   *
   * GET /permissions/:id
   *
   * endpoint.
   *
   * Therefore:
   *
   * 1. Use the existing collection when available.
   * 2. Load the collection when it has not been loaded yet.
   * 3. Find the requested permission.
   */

  const fetchPermission = useCallback(
    async (
      permissionId: string
    ): Promise<Permission | null> => {
      try {
        setLoading(true);

        let currentPermissions =
          permissions;

        /*
         * If the collection has not been loaded,
         * load it first.
         */
        if (currentPermissions.length === 0) {
          const data =
            await loadPermissions();

          if (!data) {
            return null;
          }

          currentPermissions = data;
        }

        const permission =
          currentPermissions.find(
            (item) =>
              item.id === permissionId
          );

        if (!permission) {
          setMessage(
            "Permission not found"
          );

          return null;
        }

        return permission;
      } catch (error) {
        const apiError =
          getApiError(error);

        setMessage(apiError.message);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [
      permissions,
      loadPermissions,
    ]
  );

  /*
   * ============================================================
   * CREATE PERMISSION
   * ============================================================
   */

  const createPermission = useCallback(
    async (
      payload: CreatePermissionPayload
    ): Promise<boolean> => {
      try {
        setLoading(true);

        const response =
          await permissionService.create(
            payload
          );

        setMessage(response.message);

        if (!response.success) {
          return false;
        }

        /*
         * Refresh collection so the newly
         * created permission appears in the list.
         */
        await loadPermissions();

        return true;
      } catch (error) {
        const apiError =
          getApiError(error);

        setMessage(apiError.message);

        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadPermissions]
  );

  /*
   * ============================================================
   * UPDATE PERMISSION
   * ============================================================
   */

  const updatePermission = useCallback(
    async (
      permissionId: string,
      payload: UpdatePermissionPayload
    ): Promise<boolean> => {
      try {
        setLoading(true);

        const response =
          await permissionService.update(
            permissionId,
            payload
          );

        setMessage(response.message);

        if (!response.success) {
          return false;
        }

        /*
         * Refresh collection so the updated
         * permission is reflected everywhere.
         */
        await loadPermissions();

        return true;
      } catch (error) {
        const apiError =
          getApiError(error);

        setMessage(apiError.message);

        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadPermissions]
  );

  /*
   * ============================================================
   * DELETE PERMISSION
   * ============================================================
   */

  const deletePermission = useCallback(
    async (
      permissionId: string
    ): Promise<boolean> => {
      try {
        setLoading(true);

        const response =
          await permissionService.delete(
            permissionId
          );

        setMessage(response.message);

        if (!response.success) {
          return false;
        }

        /*
         * Update local state immediately.
         *
         * No need to make another GET request
         * after a successful delete.
         */
        setPermissions(
          (currentPermissions) =>
            currentPermissions.filter(
              (permission) =>
                permission.id !==
                permissionId
            )
        );

        return true;
      } catch (error) {
        const apiError =
          getApiError(error);

        setMessage(apiError.message);

        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /*
   * ============================================================
   * CLEAR MESSAGE
   * ============================================================
   */

  const clearMessage = useCallback(() => {
    setMessage("");
  }, []);

  /*
   * ============================================================
   * PROVIDER
   * ============================================================
   */

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