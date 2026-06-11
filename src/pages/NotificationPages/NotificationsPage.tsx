import { useState } from "react";

import { useNotification } from "../../hooks/useNotification";

import NotificationViewModal from "../../components/customComponents/NotificationModal";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    loading,
    message,
  } = useNotification();

  const [
    selectedNotification,
    setSelectedNotification,
  ] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          Notifications
        </h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {unreadCount} unread
          </span>

          <button
            onClick={markAllAsRead}
            className="px-3 py-2 rounded-lg bg-blue-600 text-white"
          >
            Mark All As Read
          </button>
        </div>
      </div>

      {message && (
        <div className="text-sm">
          {message}
        </div>
      )}

      <div className="bg-white border rounded-xl">
        {loading && (
          <div className="py-10 text-center">
            Loading notifications...
          </div>
        )}

        {!loading &&
          notifications.length ===
            0 && (
            <div className="py-10 text-center text-gray-500">
              No notifications found
            </div>
          )}

        <ul>
          {notifications.map(
            (notif) => (
              <li
                key={notif.id}
                onClick={() =>
                  setSelectedNotification(
                    notif
                  )
                }
                className={`cursor-pointer border-b p-4 hover:bg-gray-50 ${
                  !notif.isRead
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">
                      {
                        notif.notification
                          .title
                      }
                    </p>

                    <p className="text-sm text-gray-500">
                      {
                        notif.notification
                          .message
                      }
                    </p>

                    <p className="text-xs text-gray-400">
                      {new Date(
                        notif.notification.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  {!notif.isRead && (
                    <span className="text-xs font-semibold">
                      New
                    </span>
                  )}
                </div>
              </li>
            )
          )}
        </ul>
      </div>

      <NotificationViewModal
        notification={
          selectedNotification
        }
        onClose={() =>
          setSelectedNotification(
            null
          )
        }
        onRead={async (
          id: string
        ) => {
          await markAsRead(id);

          await fetchNotifications();
        }}
      />
    </div>
  );
}