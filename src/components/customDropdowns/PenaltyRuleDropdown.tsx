
import { useEffect } from "react";

import OptionsDropdown from "./OptionsDropdown";

import { usePenaltyRules } from "../../hooks/usePenaltyRules";

interface PenaltyRuleDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const PenaltyRuleDropdown = ({
  value,
  onChange,
  label = "Penalty Rule",
  placeholder = "Select penalty rule",
  disabled = false,
  required = false,
  error,
}: PenaltyRuleDropdownProps) => {
  const {
    penaltyRules,
    loading,
    ensurePenaltyRulesLoaded,
  } = usePenaltyRules();

  useEffect(() => {
    ensurePenaltyRulesLoaded();
  }, [ensurePenaltyRulesLoaded]);

  const options = penaltyRules.map((rule) => ({
    value: rule.id,
    label: `${rule.name} (${rule.code})`,
    description: `${rule.penaltyType.replace(/_/g, " ")} · ${rule.scopeType.replace(/_/g, " ")}`,
  }));

  return (
    <OptionsDropdown
      options={options}
      value={value}
      onChange={onChange}
      label={label}
      placeholder={placeholder}
      disabled={disabled || loading}
      loading={loading}
      required={required}
      error={error}
      loadingText="Loading penalty rules..."
      emptyMessage="No penalty rules available."
    />
  );
};

export default PenaltyRuleDropdown;
