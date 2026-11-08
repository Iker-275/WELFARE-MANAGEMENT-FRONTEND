
import OptionsDropdown from "../customDropdowns/OptionsDropdown";
import PenaltyAdjustmentTypeDropdown from "../customDropdowns/PenaltyAdjustmentTypeDropdown";

import { PenaltyAdjustmentListFilters, PenaltyAdjustmentType } from "../../types/PenaltyAdjustmentType";

interface PenaltyAdjustmentFiltersProps {
  filters: PenaltyAdjustmentListFilters;
  adjustmentType?: PenaltyAdjustmentType | "";
  onChange: (filters: PenaltyAdjustmentListFilters) => void;
  onTypeChange: (type: PenaltyAdjustmentType | "") => void;
  onReset: () => void;
}

const sortByOptions = [
  {
    value: "createdAt",
    label: "Date Created",
  },
  {
    value: "updatedAt",
    label: "Last Updated",
  },
  {
    value: "amount",
    label: "Amount",
  },
];

const sortOrderOptions = [
  {
    value: "desc",
    label: "Newest First",
  },
  {
    value: "asc",
    label: "Oldest First",
  },
];

const PenaltyAdjustmentFilters = ({
  filters,
  adjustmentType = "",
  onChange,
  onTypeChange,
  onReset,
}: PenaltyAdjustmentFiltersProps) => {
  const handleSortByChange = (value: string) => {
    onChange({
      ...filters,
      page: 1,
      sortBy: value,
    });
  };

  const handleSortOrderChange = (value: string) => {
    onChange({
      ...filters,
      page: 1,
      sortOrder: value as "asc" | "desc",
    });
  };

  const handleTypeChange = (value: PenaltyAdjustmentType) => {
    onTypeChange(value);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Adjustment type */}
        <PenaltyAdjustmentTypeDropdown
          value={adjustmentType}
          onChange={handleTypeChange}
          label="Adjustment Type"
          placeholder="All adjustment types"
        />

        {/* Sort by */}
        <OptionsDropdown
          label="Sort By"
          options={sortByOptions}
          value={filters.sortBy || "createdAt"}
          onChange={handleSortByChange}
          placeholder="Sort by"
        />

        {/* Sort order */}
        <OptionsDropdown
          label="Sort Order"
          options={sortOrderOptions}
          value={filters.sortOrder || "desc"}
          onChange={handleSortOrderChange}
          placeholder="Sort order"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default PenaltyAdjustmentFilters;
