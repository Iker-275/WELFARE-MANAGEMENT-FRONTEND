
import type React from "react";

import { useEffect, useState } from "react";

import {
  Dropdown,

} from "./Dropdown";

import {
 
  DropdownItem,
} from "./DropdownItem";

export interface MetadataOption {
  code: string;
  name: string;
  description?: string | null;
}

interface MetadataDropdownProps {
  options: MetadataOption[];
  value: string;
  onChange: (value: string) => void;

  loading?: boolean;

  label?: string;
  placeholder?: string;

  disabled?: boolean;
  required?: boolean;

  error?: string;
  className?: string;
}

const MetadataDropdown: React.FC<
  MetadataDropdownProps
> = ({
  options,
  value,
  onChange,

  loading = false,

  label,
  placeholder = "Select an option",

  disabled = false,
  required = false,

  error,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(
    (option) => option.code === value
  );

  useEffect(() => {
    if (disabled || loading) {
      setIsOpen(false);
    }
  }, [disabled, loading]);

  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}

          {required && (
            <span className="ml-1 text-error-500">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled || loading}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`
            dropdown-toggle
            flex h-11 w-full items-center justify-between
            rounded-lg border
            bg-transparent
            px-4 py-2.5
            text-left text-sm
            outline-none
            transition
            disabled:cursor-not-allowed
            disabled:opacity-60
            dark:bg-gray-900
            ${
              error
                ? "border-error-500 focus:border-error-500"
                : "border-gray-300 focus:border-brand-500 dark:border-gray-700"
            }
          `}
        >
          <span
            className={
              selectedOption
                ? "text-gray-800 dark:text-white"
                : "text-gray-400 dark:text-gray-500"
            }
          >
            {loading
              ? "Loading..."
              : selectedOption?.name ?? placeholder}
          </span>

          <svg
            className={`h-4 w-4 text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
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
          onClose={() => setIsOpen(false)}
          className="left-0 right-auto w-full min-w-full"
        >
          <div className="max-h-60 overflow-y-auto py-1">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                No options available.
              </div>
            ) : (
              options.map((option) => (
                <DropdownItem
                  key={option.code}
                  onClick={() =>
                    handleSelect(option.code)
                  }
                  className={
                    option.code === value
                      ? "bg-gray-100 font-medium dark:bg-gray-800"
                      : ""
                  }
                >
                  <div className="flex flex-col">
                    <span>
                      {option.name}
                    </span>

                    {option.description && (
                      <span className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </span>
                    )}
                  </div>
                </DropdownItem>
              ))
            )}
          </div>
        </Dropdown>
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-error-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default MetadataDropdown;
