import { useContext } from "react";
import { AnnouncementContext } from "../context/AnnouncementContext";

export const useAnnouncement = () => {
  const context = useContext(AnnouncementContext);

  if (!context) {
    throw new Error(
      "useAnnouncement must be used inside AnnouncementProvider"
    );
  }

  return context;
};