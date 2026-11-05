import { useEffect, useMemo } from "react";

import OptionsDropdown, {
    DropdownOption,
} from "./OptionsDropdown";

import { useContributionPeriods } from "../../hooks/useContributionPeriods";

interface ContributionPeriodDropdownProps {
    value: string;
    onChange: (value: string) => void;

    planId?: string;

    label?: string;
    placeholder?: string;

    disabled?: boolean;
    required?: boolean;
    error?: string;

    includeAllOption?: boolean;
    allOptionLabel?: string;

    className?: string;
}

const ContributionPeriodDropdown = ({
    value,
    onChange,
    planId,
    label = "Contribution Period",
    placeholder = "Select contribution period",
    disabled = false,
    required = false,
    error,
    includeAllOption = false,
    allOptionLabel = "All Periods",
    className = "",
}: ContributionPeriodDropdownProps) => {
    const {
        periods,
        loading,
        fetchPeriods,
        fetchPeriodsByPlan,
    } = useContributionPeriods();

    useEffect(() => {
        if (planId) {
            void fetchPeriodsByPlan(planId);
        } else {
            void fetchPeriods();
        }
    }, [planId, fetchPeriods, fetchPeriodsByPlan]);

    const options: DropdownOption[] = useMemo(
        () =>
            periods.map((period) => ({
                value: period.id,
                label: period.name,
                description: `${period.periodStart} - ${period.periodEnd} • ${period.status}`,
            })),
        [periods],
    );

    return (
        <OptionsDropdown
            options={options}
            value={value}
            onChange={onChange}
            label={label}
            placeholder={placeholder}
            disabled={disabled}
            loading={loading}
            required={required}
            error={error}
            includeAllOption={includeAllOption}
            allOptionLabel={allOptionLabel}
            className={className}
            loadingText="Loading contribution periods..."
            emptyMessage="No contribution periods found."
        />
    );
};

export default ContributionPeriodDropdown;