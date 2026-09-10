import {
  useEffect,
  useState,
} from "react";

import {
  useGenders,
} from "../../hooks/useGenders";

import {
  Dropdown,
} from "../ui/dropdown/Dropdown";

import {
  DropdownItem,
} from "../ui/dropdown/DropdownItem";

interface GenderDropdownProps {

  value: string;

  onChange: (
    gender: string
  ) => void;

  label?: string;

  placeholder?: string;

  disabled?: boolean;

  required?: boolean;

  error?: string;

  includeAllOption?: boolean;

  allOptionLabel?: string;

  className?: string;

  autoLoad?: boolean;
}

const GenderDropdown = ({
  value,
  onChange,
  label = "Gender",
  placeholder = "Select gender",
  disabled = false,
  required = false,
  error,
  includeAllOption = false,
  allOptionLabel = "All Genders",
  className = "",
  autoLoad = true,
}: GenderDropdownProps) => {

  const {
    genders,
    loading,
    loadGenders,
  } = useGenders();

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  useEffect(() => {

    if (
      autoLoad &&
      genders.length === 0
    ) {
      void loadGenders();
    }

  }, [
    autoLoad,
    genders.length,
    loadGenders,
  ]);

  const selectedGender =
    genders.find(
      (gender) =>
        gender.code === value
    );

  const selectedLabel =
    selectedGender?.name ??
    (
      includeAllOption &&
      value === ""
        ? allOptionLabel
        : placeholder
    );

  const handleSelect = (
    genderCode: string
  ) => {

    onChange(genderCode);

    setIsOpen(false);
  };

  const isDisabled =
    disabled || loading;

  return (
    <div
      className={`relative ${className}`}
    >

      {label && (
        <label
          className="
            mb-1.5
            block
            text-sm
            font-medium
            text-gray-700
            dark:text-gray-300
          "
        >
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
              ? `
                cursor-not-allowed
                bg-gray-100
                text-gray-400
                dark:bg-gray-800
              `
              : `
                text-gray-700
                hover:border-gray-400
                dark:text-gray-200
              `
          }
        `}
      >

        <span
          className={
            selectedGender ||
            (
              includeAllOption &&
              value === ""
            )
              ? ""
              : "text-gray-400"
          }
        >
          {loading
            ? "Loading genders..."
            : selectedLabel}
        </span>

        <svg
          className={`
            h-4
            w-4
            transition-transform
            ${isOpen ? "rotate-180" : ""}
          `}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="
              M5.23 7.21a.75.75 0 011.06.02
              L10 11.168l3.71-3.938
              a.75.75 0 111.08 1.04
              l-4.25 4.51
              a.75.75 0 01-1.08 0
              l-4.25-4.51
              a.75.75 0 01.02-1.06z
            "
            clipRule="evenodd"
          />
        </svg>

      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={() =>
          setIsOpen(false)
        }
        className="
          left-0
          right-auto
          w-full
          min-w-full
        "
      >

        <div
          className="
            max-h-60
            overflow-y-auto
            py-1
          "
        >

          {includeAllOption && (
            <DropdownItem
              tag="button"
              onClick={() =>
                handleSelect("")
              }
              className={
                value === ""
                  ? `
                    bg-gray-100
                    font-medium
                    dark:bg-gray-800
                  `
                  : ""
              }
            >
              {allOptionLabel}
            </DropdownItem>
          )}

          {genders.length === 0 &&
          !loading ? (
            <div
              className="
                px-4
                py-3
                text-sm
                text-gray-500
              "
            >
              No genders found.
            </div>
          ) : (

            genders.map(
              (gender) => (
                <DropdownItem
                  key={gender.code}
                  tag="button"
                  onClick={() =>
                    handleSelect(
                      gender.code
                    )
                  }
                  className={
                    value === gender.code
                      ? `
                        bg-gray-100
                        font-medium
                        dark:bg-gray-800
                      `
                      : ""
                  }
                >

                  <div
                    className="
                      flex
                      flex-col
                    "
                  >

                    <span>
                      {gender.name}
                    </span>

                    {gender.description && (
                      <span
                        className="
                          text-xs
                          text-gray-400
                        "
                      >
                        {gender.description}
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
        <p
          className="
            mt-1.5
            text-sm
            text-red-500
          "
        >
          {error}
        </p>
      )}

    </div>
  );
};

export default GenderDropdown;