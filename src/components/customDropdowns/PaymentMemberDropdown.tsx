
import { useEffect } from "react";

import { useMember } from "../../hooks/useMember";

import OptionsDropdown from "./OptionsDropdown";

interface PaymentMemberDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const PaymentMemberDropdown = ({
  value,
  onChange,
  label = "Member",
  placeholder = "Select member",
  disabled = false,
  required = false,
  error,
}: PaymentMemberDropdownProps) => {
  const {
    members,
    loading,
    fetchMembers,
  } = useMember();

  useEffect(() => {
    fetchMembers({
      // status: "ACTIVE",
      page: 1,
      limit: 100,
    });
  }, [fetchMembers]);

  const options = members.map((member) => {
    const profile = member.profile;

    const fullName = [
      profile?.firstName,
      profile?.otherNames,
      profile?.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    return {
      value: member.id,
      label: `${fullName} (${member.membershipNumber})`,
      description: `Membership No: ${member.membershipNumber}`,
    };
  });

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
      loadingText="Loading active members..."
      emptyMessage="No active members available"
    />
  );
};

export default PaymentMemberDropdown;
