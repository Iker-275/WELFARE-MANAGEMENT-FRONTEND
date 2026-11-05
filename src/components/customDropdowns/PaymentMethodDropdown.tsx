
import {
  PaymentMethod,
} from "../../types/PaymentType";

import OptionsDropdown from "./OptionsDropdown";

interface PaymentMethodDropdownProps {
  value: PaymentMethod | "";
  onChange: (value: PaymentMethod) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const methodOptions = [
  {
    value: "MPESA",
    label: "M-Pesa",
    description: "Mobile money payment",
  },
  {
    value: "CASH",
    label: "Cash",
    description: "Cash payment",
  },
  {
    value: "BANK",
    label: "Bank Transfer",
    description: "Bank payment",
  },
  {
    value: "CARD",
    label: "Card",
    description: "Card payment",
  },
  {
    value: "CHEQUE",
    label: "Cheque",
    description: "Cheque payment",
  },
];

const PaymentMethodDropdown = ({
  value,
  onChange,
  label = "Payment Method",
  placeholder = "Select payment method",
  disabled = false,
  required = false,
  error,
}: PaymentMethodDropdownProps) => {
  return (
    <OptionsDropdown
      label={label}
      options={methodOptions}
      value={value}
      onChange={(selectedValue) =>
        onChange(selectedValue as PaymentMethod)
      }
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      error={error}
      emptyMessage="No payment methods available"
    />
  );
};

export default PaymentMethodDropdown;
