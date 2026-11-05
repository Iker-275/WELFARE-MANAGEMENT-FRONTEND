import OptionsDropdown, {
  DropdownOption,
} from "../customDropdowns/OptionsDropdown";

interface MemberContributionStatusDropdownProps {
  value: string;
  onChange: (value: string) => void;

  label?: string;
  placeholder?: string;

  disabled?: boolean;
  required?: boolean;
  error?: string;

  includeAllOption?: boolean;
  allOptionLabel?: string;

  className?: string;
}

const contributionStatusOptions: DropdownOption[] = [
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "PARTIALLY_PAID",
    label: "Partially Paid",
  },
  {
    value: "PAID",
    label: "Paid",
  },
  {
    value: "OVERDUE",
    label: "Overdue",
  },
  {
    value: "WAIVED",
    label: "Waived",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
];

const MemberContributionStatusDropdown = ({
  value,
  onChange,
  label = "Contribution Status",
  placeholder = "Select status",
  disabled = false,
  required = false,
  error,
  includeAllOption = false,
  allOptionLabel = "All Statuses",
  className = "",
}: MemberContributionStatusDropdownProps) => {
  return (
    <OptionsDropdown
      options={contributionStatusOptions}
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
};

export default MemberContributionStatusDropdown;