
import {
  useState,
} from "react";

import {
  Dropdown,
} from "../ui/dropdown/Dropdown";

import {
  DropdownItem,
} from "../ui/dropdown/DropdownItem";


export const ACCOUNT_STATUSES = [
  {
    label: "Active",
    value: "ACTIVE",
  },
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "Suspended",
    value: "SUSPENDED",
  },
  {
    label: "Deactivated",
    value: "DEACTIVATED",
  },
];


interface AccountStatusDropdownProps {
  value: string;

  onChange: (
    status: string
  ) => void;

  label?: string;
  placeholder?: string;

  disabled?: boolean;
  required?: boolean;

  error?: string;

  includeAllOption?: boolean;
  allOptionLabel?: string;

  className?: string;
}


export default function AccountStatusDropdown({
  value,
  onChange,
  label = "Account Status",
  placeholder = "Select account status",
  disabled = false,
  required = false,
  error,
  includeAllOption = false,
  allOptionLabel = "All Statuses",
  className = "",
}: AccountStatusDropdownProps) {

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);


  /*
   * Always derive the selected status
   * from the controlled value.
   */
  const selectedStatus =
    ACCOUNT_STATUSES.find(
      (status) =>
        status.value === value
    );


  let selectedLabel = placeholder;

  if (selectedStatus) {
    selectedLabel =
      selectedStatus.label;
  } else if (
    includeAllOption &&
    value === ""
  ) {
    selectedLabel =
      allOptionLabel;
  }


  const handleSelect = (
    status: string
  ) => {
    onChange(status);

    setIsOpen(false);
  };


  const hasSelectedValue =
    Boolean(selectedStatus) ||
    (
      includeAllOption &&
      value === ""
    );


  return (
    <div
      className={`relative ${className}`}
    >

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


      <button
        type="button"
        disabled={disabled}
        onClick={() =>
          setIsOpen(
            (open) => !open
          )
        }
        className={`
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
          shadow-sm
          transition
          dark:bg-gray-900
          ${
            error
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-700"
          }
          ${
            disabled
              ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800"
              : "text-gray-700 hover:border-gray-400 dark:text-gray-200"
          }
        `}
      >

        <span
          className={
            hasSelectedValue
              ? ""
              : "text-gray-400"
          }
        >
          {selectedLabel}
        </span>


        <svg
          className={`h-4 w-4 transition-transform ${
            isOpen
              ? "rotate-180"
              : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01-.02-1.06z"
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

          {includeAllOption && (
            <DropdownItem
              tag="button"
              onClick={() =>
                handleSelect("")
              }
              className={
                value === ""
                  ? "bg-gray-100 font-medium dark:bg-gray-800"
                  : ""
              }
            >
              {allOptionLabel}
            </DropdownItem>
          )}


          {ACCOUNT_STATUSES.map(
            (status) => (
              <DropdownItem
                key={status.value}
                tag="button"
                onClick={() =>
                  handleSelect(
                    status.value
                  )
                }
                className={
                  value ===
                  status.value
                    ? "bg-gray-100 font-medium dark:bg-gray-800"
                    : ""
                }
              >
                {status.label}
              </DropdownItem>
            )
          )}

        </div>

      </Dropdown>


      {error && (
        <p className="mt-1.5 text-sm text-red-500">
          {error}
        </p>
      )}

    </div>
  );
}