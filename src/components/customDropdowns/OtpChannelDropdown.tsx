import {
  useState,
} from "react";

import {
  Dropdown,
} from "../ui/dropdown/Dropdown";

import {
  DropdownItem,
} from "../ui/dropdown/DropdownItem";

import {
  OtpChannel,
} from "../../types/AuthTypes";

interface OtpChannelOption {
  code: OtpChannel;
  name: string;
  description: string;
}

/*
 * ======================================================
 * PUBLIC OTP CHANNELS
 *
 * IMPORTANT:
 * These are intentionally hardcoded because authentication
 * happens before the user has an authenticated session.
 *
 * Later these can be replaced with a public configuration
 * endpoint without changing the AuthForm API.
 * ======================================================
 */

const OTP_CHANNELS: OtpChannelOption[] = [
  {
    code: "EMAIL",
    name: "Email",
    description:
      "Receive the verification code by email.",
  },
  {
    code: "SMS",
    name: "SMS",
    description:
      "Receive the verification code by SMS.",
  },
];

interface OtpChannelDropdownProps {
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

export default function OtpChannelDropdown({
  value,
  onChange,
  label = "Verification Method",
  placeholder = "Select verification method",
  disabled = false,
  required = false,
  error,
  className = "",
}: OtpChannelDropdownProps) {
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const selectedChannel =
    OTP_CHANNELS.find(
      (channel) =>
        channel.code === value
    );

  const displayValue =
    selectedChannel?.name ??
    placeholder;

  const handleSelect = (
    channel: OtpChannel
  ) => {
    onChange(channel);

    setIsOpen(false);
  };

  return (
    <div
      className={`w-full ${className}`}
    >
      {/* LABEL */}

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

        {/* SELECT BUTTON */}

        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            setIsOpen(
              (previous) =>
                !previous
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
            transition
            dark:bg-gray-dark
            ${
              error
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            }
            ${
              disabled
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
            {displayValue}
          </span>

          {/* CHEVRON */}

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
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25 4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* DROPDOWN */}

        <Dropdown
          isOpen={isOpen}
          onClose={() =>
            setIsOpen(false)
          }
          className="left-0 right-auto w-full min-w-full"
        >
          <div className="py-1">

            {OTP_CHANNELS.map(
              (channel) => (
                <DropdownItem
                  key={channel.code}
                  onClick={() =>
                    handleSelect(
                      channel.code
                    )
                  }
                  className={
                    channel.code === value
                      ? "bg-gray-100 dark:bg-gray-800"
                      : ""
                  }
                >
                  <div className="flex items-center justify-between gap-3">

                    <div className="flex flex-col">

                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {channel.name}
                      </span>

                      <span className="text-xs text-gray-500">
                        {channel.description}
                      </span>

                    </div>

                    {/* CHECK */}

                    {channel.code === value && (
                      <svg
                        className="h-4 w-4 shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3.25-3.25a1 1 0 011.42-1.42l2.54 2.54 6.54-6.54a1 1 0 011.42 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}

                  </div>
                </DropdownItem>
              )
            )}

          </div>
        </Dropdown>
      </div>

      {/* ERROR */}

      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}