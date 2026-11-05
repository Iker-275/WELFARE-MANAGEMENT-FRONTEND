
import OptionsDropdown from "./OptionsDropdown";

import type {
  ContributionRuleScope,
} from "../../types/ContributionRuleType";

interface ContributionRuleScopeDropdownProps {
  value: ContributionRuleScope | "";
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const ContributionRuleScopeDropdown = ({
  value,
  onChange,
  label = "Rule Scope",
  placeholder = "Select rule scope",
  disabled = false,
  required = false,
  error,
}: ContributionRuleScopeDropdownProps) => {
  return (
    <OptionsDropdown
      options={[
        {
          value: "GLOBAL",
          label: "Global",
        },
        {
          value: "REGION",
          label: "Region",
        },
        {
          value: "BRANCH",
          label: "Branch",
        },
        {
          value: "CHAPTER",
          label: "Chapter",
        },
        {
          value: "GROUP",
          label: "Group",
        },
        {
          value: "MEMBER",
          label: "Individual Member",
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

export default ContributionRuleScopeDropdown;
