
import  React from "react";
import { useEffect } from "react";
import MetadataDropdown from "../ui/dropdown/MetadataDropdown";


import { useMembershipMetadata } from "../../hooks/useMembershipMetadata";

interface EmploymentStatusDropdownProps {
  value: string;
  onChange: (value: string) => void;

  label?: string;
  placeholder?: string;

  disabled?: boolean;
  required?: boolean;

  error?: string;
  className?: string;

  autoLoad?: boolean;
}

const EmploymentStatusDropdown: React.FC<
  EmploymentStatusDropdownProps
> = ({
  value,
  onChange,

  label = "Employment Status",
  placeholder = "Select employment status",

  disabled = false,
  required = false,

  error,
  className = "",

  autoLoad = true,
}) => {
  const {
    employmentStatuses,
    employmentStatusesLoading,
    loadEmploymentStatuses,
  } = useMembershipMetadata();

  useEffect(() => {
    if (
      autoLoad &&
      employmentStatuses.length === 0
    ) {
      void loadEmploymentStatuses();
    }
  }, [
    autoLoad,
    employmentStatuses.length,
    loadEmploymentStatuses,
  ]);

  return (
    <MetadataDropdown
      options={employmentStatuses}
      value={value}
      onChange={onChange}
      loading={employmentStatusesLoading}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      error={error}
      className={className}
    />
  );
};

export default EmploymentStatusDropdown;

