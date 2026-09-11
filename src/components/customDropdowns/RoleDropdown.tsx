import {
  useEffect,
  useState,
} from "react";

import {
  useRoles,
} from "../../hooks/useRoles";

import {
  Dropdown,
} from "../ui/dropdown/Dropdown";

import {
  DropdownItem,
} from "../ui/dropdown/DropdownItem";


interface RoleDropdownProps {
  value: string;
  onChange: (roleId: string) => void;

  label?: string;
  placeholder?: string;

  disabled?: boolean;
  required?: boolean;

  error?: string;

  includeAllOption?: boolean;
  allOptionLabel?: string;

  className?: string;
}


export default function RoleDropdown({
  value,
  onChange,
  label = "Role",
  placeholder = "Select role",
  disabled = false,
  required = false,
  error,
  includeAllOption = false,
  allOptionLabel = "All Roles",
  className = "",
}: RoleDropdownProps) {

  const {
    roles,
    loading,
    fetchRoles,
  } = useRoles();


  const [
    isOpen,
    setIsOpen,
  ] = useState(false);


  useEffect(() => {
    if (roles.length === 0) {
      void fetchRoles();
    }
  }, [
    roles.length,
    fetchRoles,
  ]);


  const selectedRole =
    roles.find(
      (role) =>
        role.id === value
    );


  const selectedLabel =
    selectedRole?.name ??
    (
      includeAllOption &&
      value === ""
    )
      ? allOptionLabel
      : placeholder;


  const handleSelect = (
    roleId: string
  ) => {
    onChange(roleId);
    setIsOpen(false);
  };


  const isDisabled =
    disabled || loading;


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
        disabled={isDisabled}
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
          dark:border-gray-700
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
            selectedRole ||
            (
              includeAllOption &&
              value === ""
            )
              ? ""
              : "text-gray-400"
          }
        >
          {loading
            ? "Loading roles..."
            : selectedLabel}
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
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 011.08 1.04l-4.25-4.51a.75.75 0 01-1.08-1.06z"
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


          {roles.length === 0 &&
          !loading ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              No roles found.
            </div>
          ) : (
            roles.map(
              (role) => (
                <DropdownItem
                  key={role.id}
                  tag="button"
                  onClick={() =>
                    handleSelect(
                      role.id
                    )
                  }
                  className={
                    value === role.id
                      ? "bg-gray-100 font-medium dark:bg-gray-800"
                      : ""
                  }
                >

                  <div className="flex flex-col">

                    <span>
                      {role.name}
                    </span>

                    {role.slug && (
                      <span className="text-xs text-gray-400">
                        {role.slug}
                      </span>
                    )}

                  </div>

                </DropdownItem>
              )
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