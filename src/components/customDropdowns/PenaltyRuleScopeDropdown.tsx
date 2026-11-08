
import OptionsDropdown from "./OptionsDropdown";

import type {
  PenaltyScopeType,
} from "../../types/PenaltyRuleType";

interface PenaltyRuleScopeDropdownProps {
  value: PenaltyScopeType | "";
  onChange: (value: PenaltyScopeType | "") => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const PenaltyRuleScopeDropdown = ({
  value,
  onChange,
  label = "Penalty Scope",
  placeholder = "Select penalty scope",
  disabled = false,
  required = false,
  error,
}: PenaltyRuleScopeDropdownProps) => {
  const options = [
    {
      value: "GLOBAL",
      label: "Global",
      description: "Applies across the entire organization.",
    },
    {
      value: "REGION",
      label: "Region",
      description: "Applies to a specific region.",
    },
    {
      value: "BRANCH",
      label: "Branch",
      description: "Applies to a specific branch.",
    },
    {
      value: "CHAPTER",
      label: "Chapter",
      description: "Applies to a specific chapter.",
    },
    {
      value: "GROUP",
      label: "Group",
      description: "Applies to a specific group.",
    },
    {
      value: "MEMBER",
      label: "Individual Member",
      description: "Applies to a specific member.",
    },
  ];

  return (
    <OptionsDropdown
      options={options}
      value={value}
      onChange={(selectedValue) =>
        onChange(selectedValue as PenaltyScopeType | "")
      }
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      error={error}
    />
  );
};

export default PenaltyRuleScopeDropdown;
