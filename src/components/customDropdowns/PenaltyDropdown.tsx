
import { useEffect, useMemo } from "react";

import OptionsDropdown from "./OptionsDropdown";

import { usePenaltyContext } from "../../hooks/usePenalties";

interface PenaltyDropdownProps {
  value: string;
  onChange: (value: string) => void;
  ruleId: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const PenaltyDropdown = ({
  value,
  onChange,
  ruleId,
  label = "Penalty",
  placeholder = "Select penalty",
  disabled = false,
  required = false,
  error,
}: PenaltyDropdownProps) => {
  const {
    penalties,
    loading,
    fetchPenaltiesByRule,
  } = usePenaltyContext();

  useEffect(() => {
    if (!ruleId) {
      onChange("");
      return;
    }

    onChange("");

    fetchPenaltiesByRule(ruleId, {
      page: 1,
    //   limit: 100,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  }, [ruleId, fetchPenaltiesByRule]);

  const options = useMemo(
    () =>
      penalties.map((penalty) => {
        const memberNumber =
          penalty.member?.membershipNumber || penalty.memberId;

        return {
          value: penalty.id,
          label: `${memberNumber} - ${penalty.currency} ${penalty.amount}`,
          description: [
            penalty.reason || "No reason provided",
            `Status: ${penalty.status}`,
          ].join(" | "),
        };
      }),
    [penalties],
  );

  return (
    <OptionsDropdown
      label={label}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={
        !ruleId
          ? "Select a penalty rule first"
          : loading
            ? "Loading penalties..."
            : placeholder
      }
      disabled={disabled || !ruleId || loading}
      loading={loading}
      required={required}
      error={error}
      loadingText="Loading penalties..."
      emptyMessage="No penalties found for this rule"
    />
  );
};

export default PenaltyDropdown;
