// import api from "./api";
// import axios from "axios";

// import {
//   CreateNotificationPayload,
//   NotificationResponse,
//   MyNotificationsResponse,
//   UnreadCountResponse,
// } from "../types/NotificationType";

// export const getErrorMessage = (
//   error: unknown
// ): string => {
//   if (axios.isAxiosError(error)) {
//     return (
//       error.response?.data?.message ||
//       error.message ||
//       "Something went wrong"
//     );
//   }

//   if (error instanceof Error) {
//     return error.message;
//   }

//   return "Something went wrong";
// };

// export const notificationService = {
//   async create(
//     payload: CreateNotificationPayload
//   ): Promise<NotificationResponse> {
//     const response = await api.post(
//       "/notifications",
//       payload
//     );

//     return response.data;
//   },

//   async getMyNotifications(): Promise<MyNotificationsResponse> {
//     const response = await api.get(
//       "/notifications/my"
//     );

//     return response.data;
//   },

//   async getUnreadCount(): Promise<UnreadCountResponse> {
//     const response = await api.get(
//       "/notifications/unread-count"
//     );

//     return response.data;
//   },

//   async markAsRead(
//     id: string
//   ): Promise<NotificationResponse> {
//     const response = await api.patch(
//       `/notifications/${id}/read`
//     );

//     return response.data;
//   },

//   async markAllAsRead(): Promise<NotificationResponse> {
//     const response = await api.patch(
//       "/notifications/read-all"
//     );

//     return response.data;
//   },
// };

import api from "./api";

import {
  NotificationMetadataResponse,
} from "../types/NotificationType";

export const notificationApi = {

  async getChannels():
    Promise<NotificationMetadataResponse> {

    const response =
      await api.get(
        "/notif/channels"
      );

    return response.data;
  },

  async getTypes():
    Promise<NotificationMetadataResponse> {

    const response =
      await api.get(
        "/notif/types"
      );

    return response.data;
  },

  async getPriorities():
    Promise<NotificationMetadataResponse> {

    const response =
      await api.get(
        "/notif/priorities"
      );

    return response.data;
  },
};

export default notificationApi;