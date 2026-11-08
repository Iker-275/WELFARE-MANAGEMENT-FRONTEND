
import OptionsDropdown from "./OptionsDropdown";

import type { PenaltyStatus } from "../../types/PenaltyType";

interface PenaltyStatusDropdownProps {
    value: PenaltyStatus | "";
    onChange: (value: PenaltyStatus | "") => void;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    error?: string;
}

const PenaltyStatusDropdown = ({
    value,
    onChange,
    label = "Penalty Status",
    placeholder = "Select penalty status",
    disabled = false,
    required = false,
    error,
}: PenaltyStatusDropdownProps) => {
    const options = [
        {
            value: "PENDING",
            label: "Pending",
            description: "Penalty awaiting activation or processing.",
        },
        {
            value: "ACTIVE",
            label: "Active",
            description: "Penalty currently active and outstanding.",
        },
        {
            value: "PAID",
            label: "Paid",
            description: "Penalty has been fully paid.",
        },
        {
            value: "WAIVED",
            label: "Waived",
            description: "Penalty has been waived.",
        },
        {
            value: "CANCELLED",
            label: "Cancelled",
            description: "Penalty has been cancelled.",
        },
    ];

    return (
        <OptionsDropdown
            options={options}
            value={value}
            onChange={(selectedValue) =>
                onChange(selectedValue as PenaltyStatus | "")
            }
            label={label}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            error={error}
        />
    );
};

export default PenaltyStatusDropdown;
