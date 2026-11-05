
import {
  PaymentStatus,
} from "../../types/PaymentType";

import OptionsDropdown from "./OptionsDropdown";

interface PaymentStatusDropdownProps {
  value: PaymentStatus | "";
  onChange: (value: PaymentStatus) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const statusOptions = [
  {
    value: "INITIATED",
    label: "Initiated",
    description: "Payment has been initiated",
  },
  {
    value: "PENDING",
    label: "Pending",
    description: "Payment is awaiting completion",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    description: "Payment completed successfully",
  },
  {
    value: "FAILED",
    label: "Failed",
    description: "Payment failed",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    description: "Payment was cancelled",
  },
];

const PaymentStatusDropdown = ({
  value,
  onChange,
  label = "Payment Status",
  placeholder = "Select payment status",
  disabled = false,
  required = false,
  error,
}: PaymentStatusDropdownProps) => {
  return (
    <OptionsDropdown
      label={label}
      options={statusOptions}
      value={value}
      onChange={(selectedValue) =>
        onChange(selectedValue as PaymentStatus)
      }
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      error={error}
      emptyMessage="No payment statuses available"
    />
  );
};

export default PaymentStatusDropdown;
