
import OptionsDropdown from "./OptionsDropdown";

import type { PenaltyType } from "../../types/PenaltyType";

interface PenaltyTypeDropdownProps {
    value: PenaltyType | "";
    onChange: (value: PenaltyType | "") => void;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    error?: string;
}

const PenaltyTypeDropdown = ({
    value,
    onChange,
    label = "Penalty Type",
    placeholder = "Select penalty type",
    disabled = false,
    required = false,
    error,
}: PenaltyTypeDropdownProps) => {
    const options = [
        {
            value: "FIXED",
            label: "Fixed Amount",
            description: "A fixed monetary penalty.",
        },
        {
            value: "PERCENTAGE",
            label: "Percentage",
            description: "A penalty calculated as a percentage.",
        },
        {
            value: "TIERED",
            label: "Tiered",
            description: "A penalty calculated using configured tiers.",
        },
    ];

    return (
        <OptionsDropdown
            options={options}
            value={value}
            onChange={(selectedValue) =>
                onChange(selectedValue as PenaltyType | "")
            }
            label={label}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            error={error}
        />
    );
};

export default PenaltyTypeDropdown;
