
import  React from "react";
import { useEffect } from "react";
import MetadataDropdown from "../ui/dropdown/MetadataDropdown";

import { useMembershipMetadata } from "../../hooks/useMembershipMetadata";

interface MembershipStatusDropdownProps {
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

const MembershipStatusDropdown: React.FC<
    MembershipStatusDropdownProps
> = ({
    value,
    onChange,

    label = "Membership Status",
    placeholder = "Select membership status",

    disabled = false,
    required = false,

    error,
    className = "",

    autoLoad = true,
}) => {
        const {
            membershipStatuses,
            membershipStatusesLoading,
            loadMembershipStatuses,
        } = useMembershipMetadata();

        useEffect(() => {
            if (
                autoLoad &&
                membershipStatuses.length === 0
            ) {
                void loadMembershipStatuses();
            }
        }, [
            autoLoad,
            membershipStatuses.length,
            loadMembershipStatuses,
        ]);

        return (
            <MetadataDropdown
                options={membershipStatuses}
                value={value}
                onChange={onChange}
                loading={membershipStatusesLoading}
                label={label}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                error={error}
                className={className}
            />
        );
    };

export default MembershipStatusDropdown;

