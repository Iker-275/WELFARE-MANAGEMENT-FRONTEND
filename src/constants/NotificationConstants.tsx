import {
  NotificationChannel,
  NotificationType,
  NotificationPriority,
} from "../types/NotificationType";

export const NOTIFICATION_CHANNELS: NotificationChannel[] = [
  "EMAIL",
  "SMS",
  "WHATSAPP",
  "PUSH",
  "SYSTEM",
];

export const NOTIFICATION_TYPES: NotificationType[] = [
  "SYSTEM",
  "ANNOUNCEMENT",
  "OTP",
  "SECURITY_ALERT",
  "PAYMENT",
  "CONTRIBUTION",
  "CLAIM",
  "MEETING",
  "ELECTION",
  "REMINDER",
];

export const NOTIFICATION_PRIORITIES:
  NotificationPriority[] = [
    "LOW",
    "NORMAL",
    "HIGH",
    "URGENT",
  ];