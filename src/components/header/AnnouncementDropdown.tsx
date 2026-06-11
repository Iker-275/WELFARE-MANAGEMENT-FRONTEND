import { useState } from "react";

import { Link } from "react-router-dom";

import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

import { useAnnouncement } from "../../hooks/useAnnouncement";

export default function AnnouncementDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    announcements,
    unreadCount,
    markAsRead,
  } = useAnnouncement();

  const toggleDropdown = () =>
    setIsOpen(!isOpen);

  const closeDropdown = () =>
    setIsOpen(false);

  const handleItemClick = async (id: string) => {
    await markAsRead(id);
    closeDropdown();
  };

  return (
    <div className="relative">

      {/* 🔔 BUTTON */}
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full h-11 w-11"
      >
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] text-white bg-red-600 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}

        {/* ICON (same as notifications for consistency) */}
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
        >
          <path d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248Z" />
        </svg>
      </button>

      {/* DROPDOWN */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-4 w-[360px] max-h-[480px] flex flex-col rounded-2xl border bg-white p-3 shadow-lg"
      >

        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b">
          <h5 className="text-lg font-semibold">
            Announcements
          </h5>

          <span className="text-sm text-gray-500">
            {unreadCount} unread
          </span>
        </div>

        {/* LIST */}
        <ul className="flex flex-col overflow-y-auto">

          {announcements.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No announcements
            </div>
          )}

          {announcements
            .slice(0, 5)
            .map((item) => (
              <li key={item.id}>
                <DropdownItem
                  onItemClick={() =>
                    handleItemClick(item.id)
                  }
                  className={`flex flex-col gap-1 border-b p-3 hover:bg-gray-100 ${
                    !item.isRead ? "bg-blue-50" : ""
                  }`}
                >

                  {/* TITLE */}
                  <span className="font-medium">
                    {item.announcement.title}
                  </span>

                  {/* MESSAGE */}
                  <span className="text-sm text-gray-500">
                    {item.announcement.content}
                  </span>

                  {/* TIME */}
                  <span className="text-xs text-gray-400">
                    {new Date(
                      item.announcement.createdAt
                    ).toLocaleString()}
                  </span>

                </DropdownItem>
              </li>
            ))}
        </ul>

        {/* FOOTER */}
        <Link
          to="/announcements"
          onClick={closeDropdown}
          className="mt-3 text-center text-sm font-medium text-blue-600 hover:underline"
        >
          View All Announcements
        </Link>
      </Dropdown>
    </div>
  );
}