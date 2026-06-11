import { useState } from "react";
import { useAnnouncement } from "../../hooks/useAnnouncement";
import { useAuth } from "../../hooks/useAuth";

export default function AnnouncementsPage() {
  const {
    announcements,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchAnnouncements,
    publish,
    unpublish,
    loading,
    message,
  } = useAnnouncement();

  const { user } = useAuth();

  const [selected, setSelected] = useState<any>(null);

  const isOwner = (item: any) =>
    item.announcement.createdById === user?.id;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          Announcements
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

      {/* MESSAGE */}
      {message && (
        <div className="text-sm">{message}</div>
      )}

      {/* LIST */}
      <div className="border rounded-xl bg-white">
        {loading && (
          <div className="py-10 text-center">
            Loading announcements...
          </div>
        )}

        {!loading &&
          announcements.length === 0 && (
            <div className="py-10 text-center text-gray-500">
              No announcements found
            </div>
          )}

        <ul>
          {announcements.map((item) => (
            <li
              key={item.id}
              className={`border-b p-4 hover:bg-gray-50 cursor-pointer ${
                !item.isRead
                  ? "bg-blue-50"
                  : ""
              }`}
              onClick={() => setSelected(item)}
            >
              <div className="flex justify-between">

                {/* LEFT */}
                <div>
                  <p className="font-semibold">
                    {item.announcement.title}
                  </p>

                  <p className="text-sm text-gray-500">
                    {item.announcement.content}
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(
                      item.announcement.createdAt
                    ).toLocaleString()}
                  </p>

                  {/* STATUS */}
                  <p className="text-xs mt-1">
                    {item.announcement.isPublished
                      ? "Published"
                      : "Draft"}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-end gap-2">

                  {!item.isRead && (
                    <span className="text-xs font-semibold">
                      New
                    </span>
                  )}

                  {/* 🔥 OWNER ACTIONS */}
                  {isOwner(item) && (
                    <div className="flex gap-2">
                      {item.announcement.isPublished ? (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            await unpublish(item.announcement.id);
                            await fetchAnnouncements();
                          }}
                          className="text-xs px-2 py-1 bg-red-100 rounded"
                        >
                          Unpublish
                        </button>
                      ) : (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            await publish(item.announcement.id);
                            await fetchAnnouncements();
                          }}
                          className="text-xs px-2 py-1 bg-green-100 rounded"
                        >
                          Publish
                        </button>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* OPTIONAL: simple modal placeholder */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="font-semibold mb-2">
              {selected.announcement.title}
            </h2>

            <p className="text-sm mb-4">
              {selected.announcement.content}
            </p>

            <button
              onClick={async () => {
                await markAsRead(selected.announcement.id);
                setSelected(null);
                await fetchAnnouncements();
              }}
              className="px-3 py-2 bg-blue-600 text-white rounded"
            >
              Mark as Read
            </button>
          </div>
        </div>
      )}

    </div>
  );
}