import {
  createContext,
  ReactNode,
  useEffect,
  useState,
} from "react";

import {
  UserAnnouncement,
  CreateAnnouncementPayload,
} from "../types/AnnouncementType";

import {
  announcementService,
  getErrorMessage,
} from "../api/AnnouncementApi";

interface AnnouncementContextType {
  announcements: UserAnnouncement[];
  unreadCount: number;
  loading: boolean;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;

  fetchAnnouncements: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;

  createAnnouncement: (
    payload: CreateAnnouncementPayload
  ) => Promise<boolean>;

  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;

  publish: (id: string) => Promise<boolean>;
  unpublish: (id: string) => Promise<boolean>;
}

export const AnnouncementContext =
  createContext<AnnouncementContextType | null>(null);

export const AnnouncementProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [announcements, setAnnouncements] = useState<UserAnnouncement[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);

      const res = await announcementService.getMyAnnouncements();
      setAnnouncements(res.data);
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await announcementService.getUnreadCount();
      setUnreadCount(res.count);
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  const createAnnouncement = async (
    payload: CreateAnnouncementPayload
  ) => {
    try {
      setLoading(true);

      const res = await announcementService.create(payload);

      setMessage(res.message);

      await fetchAnnouncements();
      await fetchUnreadCount();

      return res.success;
    } catch (error) {
      setMessage(getErrorMessage(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      setLoading(true);

      const res = await announcementService.markAsRead(id);

      setMessage(res.message);

      await fetchAnnouncements();
      await fetchUnreadCount();

      return res.success;
    } catch (error) {
      setMessage(getErrorMessage(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);

      const res = await announcementService.markAllAsRead();

      setMessage(res.message);

      await fetchAnnouncements();
      await fetchUnreadCount();

      return res.success;
    } catch (error) {
      setMessage(getErrorMessage(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const publish = async (id: string) => {
    try {
      const res = await announcementService.publish(id);

      setMessage(res.message);

      await fetchAnnouncements();

      return res.success;
    } catch (error) {
      setMessage(getErrorMessage(error));
      return false;
    }
  };

  const unpublish = async (id: string) => {
    try {
      const res = await announcementService.unpublish(id);

      setMessage(res.message);

      await fetchAnnouncements();

      return res.success;
    } catch (error) {
      setMessage(getErrorMessage(error));
      return false;
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchUnreadCount();
  }, []);

  return (
    <AnnouncementContext.Provider
      value={{
        announcements,
        unreadCount,
        loading,
        message,
        setMessage,
        fetchAnnouncements,
        fetchUnreadCount,
        createAnnouncement,
        markAsRead,
        markAllAsRead,
        publish,
        unpublish,
      }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
};