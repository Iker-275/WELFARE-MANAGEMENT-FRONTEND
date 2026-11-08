
import OptionsDropdown from "./OptionsDropdown";
import { ReceiptStatus } from "../../types/ReceiptType";

interface ReceiptStatusDropdownProps {
  value: string;
  onChange: (value: ReceiptStatus | "") => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const statusOptions = [
  {
    value: "",
    label: "All Receipt Statuses",
    description: "Show receipts regardless of status",
  },
  {
    value: "GENERATED",
    label: "Generated",
    description: "Receipt has been successfully generated",
  },
  {
    value: "VOIDED",
    label: "Voided",
    description: "Receipt has been voided",
  },
];

const ReceiptStatusDropdown = ({
  value,
  onChange,
  label = "Receipt Status",
  placeholder = "Select receipt status",
  disabled = false,
  required = false,
  error,
}: ReceiptStatusDropdownProps) => {
  return (
    <OptionsDropdown
      label={label}
      options={statusOptions}
      value={value}
      onChange={(selectedValue) =>
        onChange(selectedValue as ReceiptStatus | "")
      }
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      error={error}
      emptyMessage="No receipt statuses available"
    />
  );
};

export default ReceiptStatusDropdown;
