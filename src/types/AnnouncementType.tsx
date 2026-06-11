export interface CreateAnnouncementPayload {
  title: string;
  content: string;
  type: string;
  sendToAll: boolean;
  roleIds: string[];
  regionIds: string[];
  isPublished: boolean;
}

export interface AnnouncementResponse {
  success: boolean;
  message: string;
}

export interface AnnouncementCreator {
  id: string;
  firstName: string | null;
  lastName: string | null;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  sendToAll: boolean;
  isPublished: boolean;
  publishedAt: string | null;
  expiresAt: string | null;
  attachments: unknown;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: AnnouncementCreator;
}

export interface UserAnnouncement {
  id: string;
  announcementId: string;
  userId: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;

  announcement: Announcement;
}

export interface MyAnnouncementsResponse {
  success: boolean;
  data: UserAnnouncement[];
}

export interface UnreadAnnouncementsResponse {
  success: boolean;
  count: number;
}