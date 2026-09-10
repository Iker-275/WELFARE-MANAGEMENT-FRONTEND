
import  React from "react";
import { useEffect } from "react";
import MetadataDropdown from "../ui/dropdown/MetadataDropdown";


import { useMembershipMetadata } from "../../hooks/useMembershipMetadata";

interface DependantRelationshipDropdownProps {
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

const DependantRelationshipDropdown: React.FC<
  DependantRelationshipDropdownProps
> = ({
  value,
  onChange,

  label = "Relationship",
  placeholder = "Select relationship",

  disabled = false,
  required = false,

  error,
  className = "",

  autoLoad = true,
}) => {
  const {
    dependantRelationships,
    dependantRelationshipsLoading,
    loadDependantRelationships,
  } = useMembershipMetadata();

 useEffect(() => {
    if (
      autoLoad &&
      dependantRelationships.length === 0
    ) {
      void loadDependantRelationships();
    }
  }, [
    autoLoad,
    dependantRelationships.length,
    loadDependantRelationships,
  ]);

  return (
    <MetadataDropdown
      options={dependantRelationships}
      value={value}
      onChange={onChange}
      loading={dependantRelationshipsLoading}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      error={error}
      className={className}
    />
  );
};

export default DependantRelationshipDropdown;

