
import { useEffect, useMemo } from "react";

import OptionsDropdown from "./OptionsDropdown";
import { useContributionPlans } from "../../hooks/useContributionPlans";

interface ContributionPlanDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const ContributionPlanDropdown = ({
  value,
  onChange,
  label = "Contribution Plan",
  placeholder = "Select contribution plan",
  disabled = false,
  required = false,
  error,
}: ContributionPlanDropdownProps) => {
  const {
    plans,
    loading,
    ensurePlansLoaded,
  } = useContributionPlans();

  // Load contribution plans when the dropdown is mounted.
  useEffect(() => {
    ensurePlansLoaded();
  }, [ensurePlansLoaded]);

  // Convert fetched plans into dropdown options.
  const options = useMemo(
    () =>
      plans.map((plan) => ({
        value: plan.id,
        label: `${plan.name} (${plan.code})`,
      })),
    [plans]
  );

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
      loadingText="Loading contribution plans..."
      emptyMessage="No contribution plans available."
    />
  );
};

export default ContributionPlanDropdown;
