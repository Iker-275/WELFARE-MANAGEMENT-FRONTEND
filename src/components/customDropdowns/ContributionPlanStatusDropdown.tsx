
import OptionsDropdown from "./OptionsDropdown";

import type {
  ContributionPlanStatus,
} from "../../types/ContributionPlanType";


interface ContributionPlanStatusDropdownProps {
  value: string;

  onChange: (
    value: string
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


const statusOptions = [
  {
    value: "DRAFT",
    label: "Draft",
  },
  {
    value: "ACTIVE",
    label: "Active",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
  },
  {
    value: "ARCHIVED",
    label: "Archived",
  },
] satisfies {
  value: ContributionPlanStatus;
  label: string;
}[];


export default function ContributionPlanStatusDropdown({
  value,
  onChange,

  label = "Plan Status",
  placeholder = "Select plan status",

  disabled = false,
  required = false,

  error,

  includeAllOption = false,
  allOptionLabel = "All Statuses",

  className = "",
}: ContributionPlanStatusDropdownProps) {

  return (

    <OptionsDropdown

      options={statusOptions}

      value={value}

      onChange={onChange}

      label={label}

      placeholder={placeholder}

      disabled={disabled}

      required={required}

      error={error}

      includeAllOption={includeAllOption}

      allOptionLabel={allOptionLabel}

      className={className}

    />

  );

}
