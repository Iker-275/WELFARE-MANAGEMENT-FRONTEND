
import {
  useState,
} from "react";

import {
  Dropdown,
} from "../ui/dropdown/Dropdown";

import {
  DropdownItem,
} from "../ui/dropdown/DropdownItem";


export interface DropdownOption {
  value: string;
  label: string;
  description?: string | null;
}


interface OptionsDropdownProps {
  options: DropdownOption[];

  value: string;

  onChange: (
    value: string
  ) => void;

  label?: string;
  placeholder?: string;

  disabled?: boolean;
  loading?: boolean;
  required?: boolean;

  error?: string;

  includeAllOption?: boolean;
  allOptionLabel?: string;

  className?: string;
  loadingText?: string;
  emptyMessage?: string;
}


export default function OptionsDropdown({
  options,
  value,
  onChange,

  label,
  placeholder = "Select an option",

  disabled = false,
  loading = false,
  required = false,

  error,

  includeAllOption = false,
  allOptionLabel = "All",

  className = "",
  loadingText = "Loading...",
  emptyMessage = "No options found.",
}: OptionsDropdownProps) {

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);


  /*
   * Derive selected option from
   * the controlled value.
   */
  const selectedOption =
    options.find(
      (option) =>
        option.value === value
    );


  let selectedLabel = placeholder;

  if (selectedOption) {
    selectedLabel =
      selectedOption.label;
  } else if (
    includeAllOption &&
    value === ""
  ) {
    selectedLabel =
      allOptionLabel;
  }


  const handleSelect = (
    selectedValue: string
  ) => {

    onChange(selectedValue);

    setIsOpen(false);

  };


  const isDisabled =
    disabled || loading;


  const hasSelectedValue =
    Boolean(selectedOption) ||
    (
      includeAllOption &&
      value === ""
    );


  return (

    <div
      className={`relative w-full ${className}`}
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
        disabled={isDisabled}
        aria-expanded={isOpen}
        onClick={() =>
          setIsOpen(
            (open) => !open
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
          shadow-sm
          transition
          dark:bg-gray-900
          ${
            error
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-700"
          }
          ${
            isDisabled
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
          {loading
            ? loadingText
            : selectedLabel}
        </span>


        <svg
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
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


          {loading ? (

            <div className="px-4 py-3 text-sm text-gray-500">
              {loadingText}
            </div>

          ) : options.length === 0 ? (

            <div className="px-4 py-3 text-sm text-gray-500">
              {emptyMessage}
            </div>

          ) : (

            options.map((option) => (

              <DropdownItem
                key={option.value}
                tag="button"
                onClick={() =>
                  handleSelect(
                    option.value
                  )
                }
                className={
                  value === option.value
                    ? "bg-gray-100 font-medium dark:bg-gray-800"
                    : ""
                }
              >

                <div className="flex flex-col">

                  <span>
                    {option.label}
                  </span>

                  {option.description && (

                    <span className="text-xs text-gray-400">
                      {option.description}
                    </span>

                  )}

                </div>

              </DropdownItem>

            ))

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
