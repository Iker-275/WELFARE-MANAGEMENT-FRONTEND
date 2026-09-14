
// import api from "./api";

// import {
//   UserResponse,
//   UsersResponse,
//   ProfileCompletionResponse,
//   UserStatisticsResponse,
//   UserActionResponse,
//   UserFilters,
//   UpdateUserStatusDto,
//   UpdateUserRoleDto,
// } from "../types/UserType";

// export const userService = {

//   /**
//    * Get all users
//    */
//   getAll: async (
//     filters?: UserFilters
//   ): Promise<UsersResponse> => {

//     const { data } =
//       await api.get<UsersResponse>(
//         "/users",
//         {
//           params: filters,
//         }
//       );

//     return data;
//   },

//   /**
//    * Get a single user
//    */
//   getById: async (
//     userId: string
//   ): Promise<UserResponse> => {

//     const { data } =
//       await api.get<UserResponse>(
//         `/users/${userId}`
//       );

//     return data;
//   },

//   /**
//    * Get user profile completion status
//    */
//   getProfileCompletion: async (
//     userId: string
//   ): Promise<ProfileCompletionResponse> => {

//     const { data } =
//       await api.get<ProfileCompletionResponse>(
//         `/users/${userId}/profile-completion`
//       );

//     return data;
//   },

//   /**
//    * Get dashboard user statistics
//    */
//   getStatistics: async (): Promise<UserStatisticsResponse> => {

//     const { data } =
//       await api.get<UserStatisticsResponse>(
//         "/users/statistics"
//       );

//     return data;
//   },

//   /**
//    * Update account status
//    */
//   updateStatus: async (
//     userId: string,
//     payload: UpdateUserStatusDto
//   ): Promise<UserResponse> => {

//     const { data } =
//       await api.patch<UserResponse>(
//         `/users/${userId}/status`,
//         payload
//       );

//     return data;
//   },

//   /**
//    * Update user role
//    */
//   updateRole: async (
//     userId: string,
//     payload: UpdateUserRoleDto
//   ): Promise<UserResponse> => {

//     const { data } =
//       await api.patch<UserResponse>(
//         `/users/${userId}/role`,
//         payload
//       );

//     return data;
//   },

//   /**
//    * Restore user
//    */
//   restore: async (
//     userId: string
//   ): Promise<UserResponse> => {

//     const { data } =
//       await api.patch<UserResponse>(
//         `/users/${userId}/restore`
//       );

//     return data;
//   },

//   /**
//    * Soft delete user
//    */
//   delete: async (
//     userId: string
//   ): Promise<UserActionResponse> => {

//     const { data } =
//       await api.delete<UserActionResponse>(
//         `/users/${userId}`
//       );

//     return data;
//   },
// };

// export default userService;


import api from "./api";

import {
  UserResponse,
  UsersResponse,
  ProfileCompletionResponse,
  UserStatisticsResponse,
  UserActionResponse,
  UserFilters,
  UpdateUserDto,
} from "../types/UserType";

export const userService = {

  /**
   * Get all users
   */
  getAll: async (
    filters?: UserFilters
  ): Promise<UsersResponse> => {

    const { data } =
      await api.get<UsersResponse>(
        "/users",
        {
          params: filters,
        }
      );

    return data;
  },

  /**
   * Get a single user
   */
  getById: async (
    userId: string
  ): Promise<UserResponse> => {

    const { data } =
      await api.get<UserResponse>(
        `/users/${userId}`
      );

    return data;
  },

  /**
   * Get user profile completion status
   */
  getProfileCompletion: async (
    userId: string
  ): Promise<ProfileCompletionResponse> => {

    const { data } =
      await api.get<ProfileCompletionResponse>(
        `/users/${userId}/profile-completion`
      );

    return data;
  },

  /**
   * Get dashboard user statistics
   */
  getStatistics: async (): Promise<UserStatisticsResponse> => {

    const { data } =
      await api.get<UserStatisticsResponse>(
        "/users/statistics"
      );

    return data;
  },

  /**
   * Update user
   *
   * Updates account status and role
   * in a single request.
   */
  update: async (
    userId: string,
    payload: UpdateUserDto
  ): Promise<UserResponse> => {

    const { data } =
      await api.patch<UserResponse>(
        `/users/${userId}/update`,
        payload
      );

    return data;
  },

  /**
   * Restore user
   */
  restore: async (
    userId: string
  ): Promise<UserResponse> => {

    const { data } =
      await api.patch<UserResponse>(
        `/users/${userId}/restore`
      );

    return data;
  },

  /**
   * Soft delete user
   */
  delete: async (
    userId: string
  ): Promise<UserActionResponse> => {

    const { data } =
      await api.delete<UserActionResponse>(
        `/users/${userId}`
      );

    return data;
  },
};

export default userService;

