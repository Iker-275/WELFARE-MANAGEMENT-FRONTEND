import { useEffect } from "react";

import { usePaymentProviders } from "../../hooks/usePaymentProviders";
import { PaymentProviderType } from "../../types/PaymentProviderType";

import OptionsDropdown from "./OptionsDropdown";

interface PaymentProviderDropdownProps {
  value: string;
  onChange: (value: string) => void;
  type?: PaymentProviderType;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const PaymentProviderDropdown = ({
  value,
  onChange,
  type,
  label = "Payment Provider",
  placeholder = "Select payment provider",
  disabled = false,
  required = false,
  error,
}: PaymentProviderDropdownProps) => {
  const {
    activeProviders,
    activeProvidersByType,
    loading,
    fetchActiveProviders,
    fetchActiveProvidersByType,
  } = usePaymentProviders();

  useEffect(() => {
    if (type) {
      fetchActiveProvidersByType(type);
    } else {
      fetchActiveProviders();
    }
  }, [type, fetchActiveProviders, fetchActiveProvidersByType]);

  const providers = type
    ? activeProvidersByType
    : activeProviders;

  const options = providers.map((provider) => ({
    value: provider.id,
    label: `${provider.name} (${provider.code})`,
    description: provider.description,
  }));

  return (
    <OptionsDropdown
      label={label}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled || loading}
      loading={loading}
      required={required}
      error={error}
      loadingText="Loading payment providers..."
      emptyMessage="No active payment providers available"
    />
  );
};

export default PaymentProviderDropdown;