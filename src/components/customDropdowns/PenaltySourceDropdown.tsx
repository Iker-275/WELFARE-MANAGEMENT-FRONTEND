
import OptionsDropdown from "./OptionsDropdown";

import type { PenaltySource } from "../../types/PenaltyType";

interface PenaltySourceDropdownProps {
    value: PenaltySource | "";
    onChange: (value: PenaltySource | "") => void;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    error?: string;
}

const PenaltySourceDropdown = ({
    value,
    onChange,
    label = "Penalty Source",
    placeholder = "Select penalty source",
    disabled = false,
    required = false,
    error,
}: PenaltySourceDropdownProps) => {
    const options = [
        {
            value: "MANUAL",
            label: "Manual",
            description: "Penalty created manually by an authorized user.",
        },
        {
            value: "AUTOMATIC",
            label: "Automatic",
            description: "Penalty generated automatically by the system.",
        },
    ];

    return (
        <OptionsDropdown
            options={options}
            value={value}
            onChange={(selectedValue) =>
                onChange(selectedValue as PenaltySource | "")
            }
            label={label}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            error={error}
        />
    );
};

export default PenaltySourceDropdown;
