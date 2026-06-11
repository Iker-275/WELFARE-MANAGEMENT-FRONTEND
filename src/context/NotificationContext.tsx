import {
  createContext,
  ReactNode,
  useEffect,
  useState,
} from "react";

import {
  CreateNotificationPayload,
  UserNotification,
} from "../types/NotificationType";

import {
  notificationService,
  getErrorMessage,
} from "../api/NotificationApi";

interface NotificationContextType {
  notifications: UserNotification[];

  unreadCount: number;

  loading: boolean;

  message: string;

  setMessage: React.Dispatch<
    React.SetStateAction<string>
  >;

  fetchNotifications: () => Promise<void>;

  fetchUnreadCount: () => Promise<void>;

  createNotification: (
    payload: CreateNotificationPayload
  ) => Promise<boolean>;

  markAsRead: (
    id: string
  ) => Promise<boolean>;

  markAllAsRead: () => Promise<boolean>;
}

export const NotificationContext =
  createContext<NotificationContextType | null>(
    null
  );

interface Props {
  children: ReactNode;
}

export const NotificationProvider = ({
  children,
}: Props) => {
  const [notifications, setNotifications] =
    useState<UserNotification[]>([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const fetchNotifications =
    async (): Promise<void> => {
      try {
        setLoading(true);

        const response =
          await notificationService.getMyNotifications();

        setNotifications(response.data);
      } catch (error) {
        setMessage(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

  const fetchUnreadCount =
    async (): Promise<void> => {
      try {
        const response =
          await notificationService.getUnreadCount();

        setUnreadCount(response.count);
      } catch (error) {
        setMessage(getErrorMessage(error));
      }
    };

  const createNotification = async (
    payload: CreateNotificationPayload
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response =
        await notificationService.create(
          payload
        );

      setMessage(response.message);

      return response.success;
    } catch (error) {
      setMessage(getErrorMessage(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (
    id: string
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response =
        await notificationService.markAsRead(
          id
        );

      setMessage(response.message);

      await fetchNotifications();
      await fetchUnreadCount();

      return response.success;
    } catch (error) {
      setMessage(getErrorMessage(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead =
    async (): Promise<boolean> => {
      try {
        setLoading(true);

        const response =
          await notificationService.markAllAsRead();

        setMessage(response.message);

        await fetchNotifications();
        await fetchUnreadCount();

        return response.success;
      } catch (error) {
        setMessage(getErrorMessage(error));
        return false;
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        message,
        setMessage,
        fetchNotifications,
        fetchUnreadCount,
        createNotification,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};