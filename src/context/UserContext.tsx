import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import userService from "../api/UserApi";

import {
  User,
  UserFilters,
  ProfileCompletion,
  UserStatistics,
  UpdateUserStatusDto,
} from "../types/UserType";

import { Pagination } from "../types/SharedTypes";

import { getApiError } from "../utils/apiError";

interface UserContextType {

  users: User[];

  selectedUser: User | null;

  profileCompletion:
    ProfileCompletion | null;

  statistics:
    UserStatistics | null;

  pagination:
    Pagination | null;

  loading: boolean;

  message: string;

  setMessage: React.Dispatch<
    React.SetStateAction<string>
  >;

  fetchUsers: (
    filters?: UserFilters
  ) => Promise<boolean>;

  fetchUser: (
    userId: string
  ) => Promise<User | null>;

  fetchProfileCompletion: (
    userId: string
  ) => Promise<ProfileCompletion | null>;

  fetchStatistics: () => Promise<boolean>;

  updateUserStatus: (
    userId: string,
    payload: UpdateUserStatusDto
  ) => Promise<boolean>;

  restoreUser: (
    userId: string
  ) => Promise<boolean>;

  deleteUser: (
    userId: string
  ) => Promise<boolean>;

  clearMessage: () => void;
}

export const UserContext =
  createContext<UserContextType | null>(
    null
  );

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({
  children,
}: UserProviderProps) => {

  const [users, setUsers] =
    useState<User[]>([]);

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [
    profileCompletion,
    setProfileCompletion,
  ] = useState<ProfileCompletion | null>(
    null
  );

  const [statistics, setStatistics] =
    useState<UserStatistics | null>(
      null
    );

  const [pagination, setPagination] =
    useState<Pagination | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  /**
   * Get all users
   */
  const fetchUsers = useCallback(
    async (
      filters?: UserFilters
    ): Promise<boolean> => {

      setLoading(true);

      try {

        const response =
          await userService.getAll(
            filters
          );

        if (!response.success) {

          setMessage(
            response.message
          );

          return false;
        }

        setUsers(
          response.data.users
        );

        /**
         * Backend returns:
         *
         * page
         * limit
         * total
         * totalPages
         *
         * Derive the frontend pagination flags.
         */
        setPagination({
          ...response.data.pagination,

          hasNextPage:
            response.data.pagination.page <
            response.data.pagination.totalPages,

          hasPreviousPage:
            response.data.pagination.page >
            1,
        });

        setMessage(
          response.message
        );

        return true;

      } catch (error) {

        const apiError =
          getApiError(error);

        setMessage(
          apiError.message
        );

        return false;

      } finally {

        setLoading(false);
      }
    },
    []
  );

  /**
   * Get a single user
   */
  const fetchUser = useCallback(
    async (
      userId: string
    ): Promise<User | null> => {

      setLoading(true);

      try {

        const response =
          await userService.getById(
            userId
          );

        if (!response.success) {

          setMessage(
            response.message
          );

          return null;
        }

        setSelectedUser(
          response.data
        );

        setMessage(
          response.message
        );

        return response.data;

      } catch (error) {

        const apiError =
          getApiError(error);

        setMessage(
          apiError.message
        );

        return null;

      } finally {

        setLoading(false);
      }
    },
    []
  );

  /**
   * Get profile completion
   */
  const fetchProfileCompletion =
    useCallback(
      async (
        userId: string
      ): Promise<ProfileCompletion | null> => {

        setLoading(true);

        try {

          const response =
            await userService.getProfileCompletion(
              userId
            );

          if (!response.success) {

            setMessage(
              response.message
            );

            return null;
          }

          setProfileCompletion(
            response.data
          );

          setMessage(
            response.message
          );

          return response.data;

        } catch (error) {

          const apiError =
            getApiError(error);

          setMessage(
            apiError.message
          );

          return null;

        } finally {

          setLoading(false);
        }
      },
      []
    );

  /**
   * Get dashboard statistics
   */
  const fetchStatistics =
    useCallback(
      async (): Promise<boolean> => {

        setLoading(true);

        try {

          const response =
            await userService.getStatistics();

          if (!response.success) {

            setMessage(
              response.message
            );

            return false;
          }

          setStatistics(
            response.data
          );

          setMessage(
            response.message
          );

          return true;

        } catch (error) {

          const apiError =
            getApiError(error);

          setMessage(
            apiError.message
          );

          return false;

        } finally {

          setLoading(false);
        }
      },
      []
    );

  /**
   * Update user account status
   */
  const updateUserStatus =
    useCallback(
      async (
        userId: string,
        payload: UpdateUserStatusDto
      ): Promise<boolean> => {

        setLoading(true);

        try {

          const response =
            await userService.updateStatus(
              userId,
              payload
            );

          setMessage(
            response.message
          );

          if (!response.success) {
            return false;
          }

          setSelectedUser(
            response.data
          );

          await fetchUsers();

          return true;

        } catch (error) {

          const apiError =
            getApiError(error);

          setMessage(
            apiError.message
          );

          return false;

        } finally {

          setLoading(false);
        }
      },
      [fetchUsers]
    );

  /**
   * Restore user
   */
  const restoreUser = useCallback(
    async (
      userId: string
    ): Promise<boolean> => {

      setLoading(true);

      try {

        const response =
          await userService.restore(
            userId
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        setSelectedUser(
          response.data
        );

        await fetchUsers();

        return true;

      } catch (error) {

        const apiError =
          getApiError(error);

        setMessage(
          apiError.message
        );

        return false;

      } finally {

        setLoading(false);
      }
    },
    [fetchUsers]
  );

  /**
   * Soft delete user
   */
  const deleteUser = useCallback(
    async (
      userId: string
    ): Promise<boolean> => {

      setLoading(true);

      try {

        const response =
          await userService.delete(
            userId
          );

        setMessage(
          response.message
        );

        if (!response.success) {
          return false;
        }

        setSelectedUser(null);

        await fetchUsers();

        return true;

      } catch (error) {

        const apiError =
          getApiError(error);

        setMessage(
          apiError.message
        );

        return false;

      } finally {

        setLoading(false);
      }
    },
    [fetchUsers]
  );

  /**
   * Clear message
   */
  const clearMessage = useCallback(() => {
    setMessage("");
  }, []);

  /**
   * Load users when provider mounts.
   */
  useEffect(() => {

    fetchUsers();

  }, [fetchUsers]);

  return (
    <UserContext.Provider
      value={{

        users,

        selectedUser,

        profileCompletion,

        statistics,

        pagination,

        loading,

        message,

        setMessage,

        fetchUsers,

        fetchUser,

        fetchProfileCompletion,

        fetchStatistics,

        updateUserStatus,

        restoreUser,

        deleteUser,

        clearMessage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};