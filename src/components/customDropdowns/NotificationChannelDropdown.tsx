import {
  useEffect,
  useState,
} from "react";

import {
  Dropdown,

} from "../ui/dropdown/Dropdown";
import {
 
  DropdownItem,
} from "../ui/dropdown/DropdownItem";
import {
  useNotifications,
} from "../../hooks/useNotification";


import {
  OtpChannel,
} from "../../types/AuthTypes";

interface NotificationChannelDropdownProps {
  value: OtpChannel;

  onChange: (
    value: OtpChannel
  ) => void;

  label?: string;
  placeholder?: string;

  disabled?: boolean;
  required?: boolean;

  error?: string;

  className?: string;
}

export default function NotificationChannelDropdown({
  value,
  onChange,
  label = "Notification Channel",
  placeholder = "Select notification channel",
  disabled = false,
  required = false,
  error,
  className = "",
}: NotificationChannelDropdownProps) {
  const {
    channels,
    loading,
    loadChannels,
  } = useNotifications();

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  useEffect(() => {
    if (channels.length === 0) {
      loadChannels();
    }
  }, [
    channels.length,
    loadChannels,
  ]);

  const selectedChannel =
    channels.find(
      (channel) =>
        channel.code === value
    );

  const displayValue =
    selectedChannel?.name ??
    placeholder;

  const handleSelect = (
    channelCode: string
  ) => {
    onChange(channelCode as OtpChannel);
    setIsOpen(false);
  };

  return (
    <div className={`w-full ${className}`}>

      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}

          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">

        <button
          type="button"
          disabled={
            disabled || loading
          }
          onClick={() =>
            setIsOpen(
              (previous) => !previous
            )
          }
          className={`
            dropdown-toggle
            flex
            w-full
            items-center
            justify-between
            rounded-lg
            border
            bg-white
            px-4
            py-2.5
            text-left
            text-sm
            dark:bg-gray-dark
            ${
              error
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            }
            ${
              disabled || loading
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer"
            }
          `}
        >
          <span
            className={
              selectedChannel
                ? "text-gray-800 dark:text-white"
                : "text-gray-400"
            }
          >
            {loading
              ? "Loading channels..."
              : displayValue}
          </span>

          <svg
            className={`
              h-4 w-4
              text-gray-500
              transition-transform
              ${
                isOpen
                  ? "rotate-180"
                  : ""
              }
            `}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <Dropdown
          isOpen={isOpen}
          onClose={() =>
            setIsOpen(false)
          }
          className="left-0 right-auto w-full min-w-full"
        >
          <div className="max-h-60 overflow-y-auto py-1">

            {channels.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                No notification channels available.
              </div>
            ) : (
              channels.map((channel) => (
                <DropdownItem
                  key={channel.code}
                  onClick={() =>
                    handleSelect(
                      channel.code
                    )
                  }
                  className={
                    channel.code === value
                      ? "bg-gray-100 font-medium dark:bg-gray-800"
                      : ""
                  }
                >
                  <div className="flex items-center justify-between">
                    <span>
                      {channel.name}
                    </span>

                    {channel.code === value && (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3.25-3.25a1 1 0 011.42-1.42l6.54-6.54a1 1 0 011.42 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </DropdownItem>
              ))
            )}

          </div>
        </Dropdown>

      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}

    </div>
  );
}