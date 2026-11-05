import OptionsDropdown from "./OptionsDropdown";

interface ContributionRuleWeekdayDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const ContributionRuleWeekdayDropdown = ({
  value,
  onChange,
  label = "Weekday",
  placeholder = "Select weekday",
  disabled = false,
  required = false,
  error,
}: ContributionRuleWeekdayDropdownProps) => {
  return (
    <OptionsDropdown
      options={[
        { value: "1", label: "Monday" },
        { value: "2", label: "Tuesday" },
        { value: "3", label: "Wednesday" },
        { value: "4", label: "Thursday" },
        { value: "5", label: "Friday" },
        { value: "6", label: "Saturday" },
        { value: "7", label: "Sunday" },
      ]}
      value={value}
      onChange={onChange}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      error={error}
    />
  );
};

export default ContributionRuleWeekdayDropdown;