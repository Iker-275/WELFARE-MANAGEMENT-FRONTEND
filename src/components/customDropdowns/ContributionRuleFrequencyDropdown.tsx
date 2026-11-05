import OptionsDropdown from "./OptionsDropdown";

import type {
  ContributionRuleFrequency,
} from "../../types/ContributionRuleType";

interface ContributionRuleFrequencyDropdownProps {
  value: ContributionRuleFrequency | "";
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const ContributionRuleFrequencyDropdown = ({
  value,
  onChange,
  label = "Frequency Override",
  placeholder = "Select frequency",
  disabled = false,
  required = false,
  error,
}: ContributionRuleFrequencyDropdownProps) => {
  return (
    <OptionsDropdown
      options={[
        { value: "WEEKLY", label: "Weekly" },
        { value: "MONTHLY", label: "Monthly" },
        { value: "QUARTERLY", label: "Quarterly" },
        { value: "ANNUALLY", label: "Annually" },
        { value: "CUSTOM", label: "Custom" },
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

export default ContributionRuleFrequencyDropdown;