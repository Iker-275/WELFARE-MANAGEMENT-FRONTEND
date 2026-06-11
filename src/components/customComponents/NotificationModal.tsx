interface Props {
  notification: any;
  onClose: () => void;
  onRead: (id: string) => void;
}

export default function NotificationViewModal({
  notification,
  onClose,
  onRead
}: Props) {

  if (!notification) return null;

  const handleOpen = () => {
    onRead(notification.notificationId
    );
  };

  return (

    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >

      <div
        className="bg-white rounded-xl p-6 w-[400px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >

        <h2 className="text-lg font-semibold mb-3">
          Notification
        </h2>

        <p className="text-gray-700 mb-4">
          {notification.message}
        </p>

        <p className="text-xs text-gray-500 mb-6">
          {new Date(notification.createdAt).toLocaleString()}
        </p>

        <div className="flex justify-end gap-2">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Close
          </button>

          <button
            onClick={() => {
              handleOpen();
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Mark as Read
          </button>

        </div>

      </div>

    </div>
  );
}