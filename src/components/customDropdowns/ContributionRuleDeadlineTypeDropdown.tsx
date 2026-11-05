
import OptionsDropdown from "./OptionsDropdown";

import type {
  ContributionRuleDeadlineType,
} from "../../types/ContributionRuleType";

interface ContributionRuleDeadlineTypeDropdownProps {
  value: ContributionRuleDeadlineType | "";
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const ContributionRuleDeadlineTypeDropdown = ({
  value,
  onChange,
  label = "Deadline Type",
  placeholder = "Select deadline type",
  disabled = false,
  required = false,
  error,
}: ContributionRuleDeadlineTypeDropdownProps) => {
  return (
    <OptionsDropdown
      options={[
        {
          value: "FIXED_DAY_OF_MONTH",
          label: "Fixed Day of Month",
        },
        {
          value: "FIRST_WEEKDAY",
          label: "First Weekday",
        },
        {
          value: "LAST_WEEKDAY",
          label: "Last Weekday",
        },
        {
          value: "NTH_WEEKDAY",
          label: "Nth Weekday",
        },
        {
          value: "DAYS_AFTER_PERIOD_START",
          label: "Days After Period Start",
        },
        {
          value: "DAYS_BEFORE_PERIOD_END",
          label: "Days Before Period End",
        },
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

export default ContributionRuleDeadlineTypeDropdown;
