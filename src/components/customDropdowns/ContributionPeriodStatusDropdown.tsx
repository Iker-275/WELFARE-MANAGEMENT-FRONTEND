
import OptionsDropdown, {
  DropdownOption,
} from "./OptionsDropdown";


interface ContributionPeriodStatusDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
}

const statusOptions: DropdownOption[] = [
  {
    value: "UPCOMING",
    label: "Upcoming",
    description: "Period has not started yet.",
  },
  {
    value: "OPEN",
    label: "Open",
    description: "Period is currently open.",
  },
  {
    value: "DUE",
    label: "Due",
    description: "Contribution payment is due.",
  },
  {
    value: "OVERDUE",
    label: "Overdue",
    description: "Contribution payment deadline has passed.",
  },
  {
    value: "CLOSED",
    label: "Closed",
    description: "Period has been closed.",
  },
];

const ContributionPeriodStatusDropdown = ({
  value,
  onChange,
  label = "Period Status",
  placeholder = "Select period status",
  disabled = false,
  required = false,
  error,
  includeAllOption = false,
  allOptionLabel = "All Statuses",
}: ContributionPeriodStatusDropdownProps) => {
  return (
    <OptionsDropdown
      options={statusOptions}
      value={value}
      onChange={(selectedValue) => {
        onChange(selectedValue);
      }}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      error={error}
      includeAllOption={includeAllOption}
      allOptionLabel={allOptionLabel}
    />
  );
};

export default ContributionPeriodStatusDropdown;
