
import { useEffect, useMemo } from "react";

import OptionsDropdown from "./OptionsDropdown";
import { usePayments } from "../../hooks/usePayments";

import { PaymentFilters } from "../../types/PaymentType";

interface PaymentDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const PaymentDropdown = ({
  value,
  onChange,
  label = "Payment",
  placeholder = "Select payment",
  disabled = false,
  required = false,
  error,
}: PaymentDropdownProps) => {
  const {
    payments,
    loading,
    fetchPayments,
  } = usePayments();

  useEffect(() => {
    const filters: PaymentFilters = {
      page: 1,
    //   limit: 100,
      status: "COMPLETED",
    };

    fetchPayments(filters);
  }, [fetchPayments]);

  const options = useMemo(
    () =>
      payments
        .filter((payment) => payment.status === "COMPLETED")
        .map((payment) => ({
          value: payment.id,
          label: `${payment.currency} ${Number(
            payment.amount,
          ).toLocaleString()} - ${payment.internalReference}`,
          description: [
            payment.member?.membershipNumber
              ? `Member: ${payment.member.membershipNumber}`
              : `Member ID: ${payment.memberId}`,
            `Method: ${payment.method}`,
            `Status: ${payment.status}`,
          ].join(" | "),
        })),
    [payments],
  );

  return (
    <OptionsDropdown
      label={label}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={
        loading ? "Loading payments..." : placeholder
      }
      disabled={disabled || loading}
      required={required}
      error={error}
      loading={loading}
      loadingText="Loading payments..."
      emptyMessage="No completed payments found"
    />
  );
};

export default PaymentDropdown;
