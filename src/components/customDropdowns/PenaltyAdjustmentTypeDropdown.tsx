
import OptionsDropdown from "./OptionsDropdown";

import { PenaltyAdjustmentType } from "../../types/PenaltyAdjustmentType";

interface PenaltyAdjustmentTypeDropdownProps {
  value: string;
  onChange: (value: PenaltyAdjustmentType) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const adjustmentTypeOptions = [
  {
    value: "WAIVER",
    label: "Waiver",
    description: "Waive an amount of the penalty.",
  },
  {
    value: "REDUCTION",
    label: "Reduction",
    description: "Reduce the existing penalty amount.",
  },
  {
    value: "INCREASE",
    label: "Increase",
    description: "Increase the existing penalty amount.",
  },
];

const PenaltyAdjustmentTypeDropdown = ({
  value,
  onChange,
  label = "Adjustment Type",
  placeholder = "Select adjustment type",
  disabled = false,
  required = false,
  error,
}: PenaltyAdjustmentTypeDropdownProps) => {
  return (
    <OptionsDropdown
      label={label}
      options={adjustmentTypeOptions}
      value={value}
      onChange={(selectedValue) =>
        onChange(selectedValue as PenaltyAdjustmentType)
      }
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      error={error}
      emptyMessage="No adjustment types available"
    />
  );
};

export default PenaltyAdjustmentTypeDropdown;
