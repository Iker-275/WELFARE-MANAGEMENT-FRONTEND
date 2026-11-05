
import OptionsDropdown from "./OptionsDropdown";

import type {
  ContributionFrequency,
} from "../../types/ContributionPlanType";


interface ContributionFrequencyDropdownProps {
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


const frequencyOptions = [
  {
    value: "WEEKLY",
    label: "Weekly",
  },
  {
    value: "MONTHLY",
    label: "Monthly",
  },
  {
    value: "QUARTERLY",
    label: "Quarterly",
  },
  {
    value: "ANNUALLY",
    label: "Annually",
  },
  {
    value: "CUSTOM",
    label: "Custom",
  },
] satisfies {
  value: ContributionFrequency;
  label: string;
}[];


export default function ContributionFrequencyDropdown({
  value,
  onChange,

  label = "Contribution Frequency",
  placeholder = "Select frequency",

  disabled = false,
  required = false,

  error,

  includeAllOption = false,
  allOptionLabel = "All Frequencies",

  className = "",
}: ContributionFrequencyDropdownProps) {

  return (

    <OptionsDropdown

      options={frequencyOptions}

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
