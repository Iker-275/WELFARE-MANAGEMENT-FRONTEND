import api from "./api";
import {
  CreateAnnouncementPayload,
  MyAnnouncementsResponse,
  AnnouncementResponse,
  UnreadAnnouncementsResponse,
} from "../types/AnnouncementType";

export const getErrorMessage = (error: any): string => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong"
  );
};

export const announcementService = {
  async create(payload: CreateAnnouncementPayload) {
    const res = await api.post("/announcements", payload);
    return res.data;
  },

  async publish(id: string) {
    const res = await api.patch(`/announcements/${id}/publish`);
    return res.data;
  },

  async unpublish(id: string) {
    const res = await api.patch(`/announcements/${id}/unpublish`);
    return res.data;
  },

  async getMyAnnouncements(): Promise<MyAnnouncementsResponse> {
    const res = await api.get("/announcements/my");
    return res.data;
  },

  async markAsRead(id: string): Promise<AnnouncementResponse> {
    const res = await api.patch(`/announcements/${id}/read`);
    return res.data;
  },

  async markAllAsRead(): Promise<AnnouncementResponse> {
    const res = await api.patch("/announcements/read-all");
    return res.data;
  },

  async getUnreadCount(): Promise<UnreadAnnouncementsResponse> {
    const res = await api.get("/announcements/unread-count");
    return res.data;
  },
};