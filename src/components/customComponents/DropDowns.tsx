

import { useState, useEffect, useRef } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SelectOption | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Set default value
  useEffect(() => {
    if (defaultValue) {
      const option = options.find((o) => o.value === defaultValue);
      if (option) setSelected(option);
    }
  }, [defaultValue, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option: SelectOption) => {
    if (disabled) return; // ignore if disabled
    setSelected(option);
    onChange(option.value);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative w-full ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {/* Selected Value */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`h-11 flex items-center justify-between rounded-lg border px-4 text-sm ${
          disabled
            ? "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700"
            : "border-gray-300 cursor-pointer dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        }`}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span className="text-xs">{!disabled && "▼"}</span>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {/* Search */}
          <div className="p-2">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Options */}
          <ul className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 && (
              <li className="px-4 py-2 text-sm text-gray-500">No results</li>
            )}

            {filteredOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;