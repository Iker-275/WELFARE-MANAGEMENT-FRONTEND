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
  useImportTypes,
} from "../../hooks/useImportTypes";

interface ImportTypeDropdownProps {
  value: string;

  onChange: (
    type: string
  ) => void;

  label?: string;
  placeholder?: string;

  disabled?: boolean;
  required?: boolean;

  error?: string;

  className?: string;
}

export default function ImportTypeDropdown({
  value,
  onChange,

  label = "Import Type",
  placeholder = "Select import type",

  disabled = false,
  required = false,

  error,

  className = "",
}: ImportTypeDropdownProps) {

  const {
    importTypes,
    loading,
    fetchImportTypes,
  } = useImportTypes();

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  useEffect(() => {

    if (
      importTypes.length === 0
    ) {
      void fetchImportTypes();
    }

  }, [
    importTypes.length,
    fetchImportTypes,
  ]);

  const selectedType =
    importTypes.find(
      type =>
        type.code === value
    );

  const handleSelect = (
    typeCode: string
  ) => {

    onChange(typeCode);

    setIsOpen(false);
  };

  return (
    <div className={className}>

      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">

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
          className={`dropdown-toggle flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-left text-sm shadow-theme-xs outline-none transition-colors dark:border-gray-700 dark:bg-gray-dark ${
            disabled || loading
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          } ${
            error
              ? "border-error-500"
              : "focus:border-brand-500"
          }`}
          onClick={() => {

            if (
              disabled ||
              loading
            ) {
              return;
            }

            setIsOpen(
              previous =>
                !previous
            );

          }}
          disabled={
            disabled ||
            loading
          }
        >

          <span
            className={
              selectedType
                ? "text-gray-800 dark:text-white/90"
                : "text-gray-400 dark:text-gray-500"
            }
          >
            {loading
              ? "Loading import types..."
              : selectedType?.name ||
                placeholder}
          </span>

          <svg
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isOpen
                ? "rotate-180"
                : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01-.02-1.06z"
              clipRule="evenodd"
            />
          </svg>

        </button>

        <Dropdown
          isOpen={isOpen}
          onClose={() =>
            setIsOpen(false)
          }
          className="left-0 right-0 w-full"
        >

          {importTypes.length === 0 &&
          !loading ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              No import types available.
            </div>
          ) : (
            importTypes.map(
              type => (
                <DropdownItem
                  key={type.code}
                  onClick={() =>
                    handleSelect(
                      type.code
                    )
                  }
                  className={
                    type.code === value
                      ? "bg-gray-100 dark:bg-gray-800"
                      : ""
                  }
                >
                  {type.name}
                </DropdownItem>
              )
            )
          )}

        </Dropdown>

      </div>

      {error && (
        <p className="mt-1 text-xs text-error-500">
          {error}
        </p>
      )}

    </div>
  );
}