
import type {
    PenaltyFilters as PenaltyFiltersType,
} from "../../types/PenaltyType";

import PenaltyStatusDropdown from "../customDropdowns/PenaltyStatusDropdown";
import PenaltySourceDropdown from "../customDropdowns/PenaltySourceDropdown";
import PenaltyTypeDropdown from "../customDropdowns/PenaltyTypeDropdown";
import PenaltyRuleDropdown from "../customDropdowns/PenaltyRuleDropdown";
import OptionsDropdown from "../customDropdowns/OptionsDropdown";

interface PenaltyFiltersProps {
    filters: PenaltyFiltersType;
    onChange: (filters: PenaltyFiltersType) => void;
    onReset: () => void;
}

const PenaltyFilters = ({
    filters,
    onChange,
    onReset,
}: PenaltyFiltersProps) => {
    const handleChange = (
        field: keyof PenaltyFiltersType,
        value: string | number | undefined,
    ) => {
        onChange({
            ...filters,
            [field]: value,
            page: 1,
        });
    };

    const sortOptions = [
        { value: "createdAt", label: "Date Created" },
        { value: "updatedAt", label: "Last Updated" },
        { value: "amount", label: "Penalty Amount" },
        { value: "status", label: "Status" },
    ];

    const sortOrderOptions = [
        { value: "desc", label: "Descending" },
        { value: "asc", label: "Ascending" },
    ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <PenaltyRuleDropdown
                    value={filters.penaltyRuleId ?? ""}
                    onChange={(value) =>
                        handleChange("penaltyRuleId", value || undefined)
                    }
                    label="Penalty Rule"
                    placeholder="All penalty rules"
                />

                <PenaltyStatusDropdown
                    value={filters.status ?? ""}
                    onChange={(value) =>
                        handleChange("status", value || undefined)
                    }
                    label="Status"
                    placeholder="All statuses"
                />

                <PenaltySourceDropdown
                    value={filters.source ?? ""}
                    onChange={(value) =>
                        handleChange("source", value || undefined)
                    }
                    label="Source"
                    placeholder="All sources"
                />

                <PenaltyTypeDropdown
                    value={filters.type ?? ""}
                    onChange={(value) =>
                        handleChange("type", value || undefined)
                    }
                    label="Penalty Type"
                    placeholder="All penalty types"
                />

                <OptionsDropdown
                    options={sortOptions}
                    value={filters.sortBy ?? "createdAt"}
                    onChange={(value) =>
                        handleChange("sortBy", value || undefined)
                    }
                    label="Sort By"
                    placeholder="Select sort field"
                />

                <OptionsDropdown
                    options={sortOrderOptions}
                    value={filters.sortOrder ?? "desc"}
                    onChange={(value) =>
                        handleChange(
                            "sortOrder",
                            value as "asc" | "desc",
                        )
                    }
                    label="Sort Order"
                    placeholder="Select sort order"
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={onReset}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    Reset Filters
                </button>
            </div>
        </div>
    );
};

export default PenaltyFilters;
