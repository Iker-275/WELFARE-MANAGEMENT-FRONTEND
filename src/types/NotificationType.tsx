export interface CreateNotificationPayload {
  title: string;
  message: string;
  type: string;
  sendToAll: boolean;
  roleIds: string[];
  regionIds: string[];
}

export interface NotificationResponse {
  success: boolean;
  message: string;
}

export interface NotificationCreator {
  id: string;
  firstName: string | null;
  lastName: string | null;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  sendToAll: boolean;
  metadata: unknown;
  createdById: string;
  createdAt: string;
  updatedAt: string;

  createdBy?: NotificationCreator;
}

export interface UserNotification {
  id: string;
  notificationId: string;
  userId: string;
  isRead: boolean;
  readAt: string | null;
  deliveredAt: string | null;
  createdAt: string;

  notification: Notification;
}

export interface MyNotificationsResponse {
  success: boolean;
  data: UserNotification[];
}

export interface UnreadCountResponse {
  success: boolean;
  count: number;
}