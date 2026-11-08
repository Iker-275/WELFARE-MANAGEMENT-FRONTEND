import { useState } from "react";

import type { PenaltyRuleFilters as PenaltyRuleFiltersType } from "../../types/PenaltyRuleType";

import OptionsDropdown from "../customDropdowns/OptionsDropdown";
import ContributionPlanDropdown from "../customDropdowns/ContributionPlanDropdown";
import RegionDropdown from "../customDropdowns/RegionDropdown";
import PenaltyRuleScopeDropdown from "../customDropdowns/PenaltyRuleScopeDropdown";

interface PenaltyRuleFiltersProps {
  filters: PenaltyRuleFiltersType;
  onChange: (filters: PenaltyRuleFiltersType) => void;
  onReset: () => void;
}

const penaltyTypeOptions = [
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

const activeStatusOptions = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const sortByOptions = [
  { value: "createdAt", label: "Date Created" },
  { value: "name", label: "Name" },
  { value: "code", label: "Code" },
  { value: "priority", label: "Priority" },
  { value: "effectiveFrom", label: "Effective Date" },
];

const sortOrderOptions = [
  { value: "desc", label: "Descending" },
  { value: "asc", label: "Ascending" },
];

const PenaltyRuleFilters = ({
  filters,
  onChange,
  onReset,
}: PenaltyRuleFiltersProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const updateFilter = <K extends keyof PenaltyRuleFiltersType>(
    key: K,
    value: PenaltyRuleFiltersType[K]
  ) => {
    onChange({
      ...filters,
      [key]: value,
      page: 1,
    });
  };

  const handleTextChange = (
    key: "search" | "code",
    value: string
  ) => {
    updateFilter(key, value || undefined);
  };

  const handleActiveStatusChange = (value: string) => {
    updateFilter(
      "isActive",
      value === "" ? undefined : value === "true"
    );
  };

  const handleReset = () => {
    setShowAdvancedFilters(false);
    onReset();
  };

  const hasAdvancedFilters = Boolean(
    filters.code ||
      filters.penaltyType ||
      filters.scopeType ||
      filters.contributionPlanId ||
      filters.regionId ||
      filters.isActive !== undefined ||
      filters.effectiveDate ||
      filters.sortBy ||
      filters.sortOrder
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white">
            Filter Penalty Rules
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Search and filter penalty rules using the available criteria.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAdvancedFilters((previous) => !previous)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
          >
            {showAdvancedFilters ? "Hide Filters" : "More Filters"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Basic Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search
          </label>

          <input
            type="text"
            value={filters.search ?? ""}
            onChange={(event) =>
              handleTextChange("search", event.target.value)
            }
            placeholder="Search by name or description..."
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white"
          />
        </div>

        <ContributionPlanDropdown
          value={filters.contributionPlanId ?? ""}
          onChange={(value) =>
            updateFilter("contributionPlanId", value || undefined)
          }
          label="Contribution Plan"
          placeholder="All contribution plans"
        />
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-800">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Rule Code */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Rule Code
              </label>

              <input
                type="text"
                value={filters.code ?? ""}
                onChange={(event) =>
                  handleTextChange("code", event.target.value)
                }
                placeholder="Enter rule code"
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white"
              />
            </div>

            {/* Penalty Type */}
            <OptionsDropdown
              options={penaltyTypeOptions}
              value={filters.penaltyType ?? ""}
              onChange={(value) =>
                updateFilter(
                  "penaltyType",
                  (value || undefined) as PenaltyRuleFiltersType["penaltyType"]
                )
              }
              label="Penalty Type"
              placeholder="All penalty types"
              includeAllOption
              allOptionLabel="All penalty types"
            />

            {/* Scope */}
            <PenaltyRuleScopeDropdown
              value={filters.scopeType ?? ""}
              onChange={(value) =>
                updateFilter(
                  "scopeType",
                  value || undefined
                )
              }
              label="Penalty Scope"
              placeholder="All scopes"
            />

            {/* Region */}
            {filters.scopeType === "REGION" && (
              <RegionDropdown
                value={filters.regionId ?? ""}
                onChange={(value) =>
                  updateFilter("regionId", value || undefined)
                }
                label="Region"
                placeholder="All regions"
                includeAllOption
                allOptionLabel="All regions"
              />
            )}

            {/* Active Status */}
            <OptionsDropdown
              options={activeStatusOptions}
              value={
                filters.isActive === undefined
                  ? ""
                  : String(filters.isActive)
              }
              onChange={handleActiveStatusChange}
              label="Status"
              placeholder="All statuses"
              includeAllOption
              allOptionLabel="All statuses"
            />

            {/* Effective Date */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Effective Date
              </label>

              <input
                type="date"
                value={filters.effectiveDate ?? ""}
                onChange={(event) =>
                  updateFilter(
                    "effectiveDate",
                    event.target.value || undefined
                  )
                }
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white"
              />
            </div>

            {/* Sort By */}
            <OptionsDropdown
              options={sortByOptions}
              value={filters.sortBy ?? ""}
              onChange={(value) =>
                updateFilter("sortBy", value || undefined)
              }
              label="Sort By"
              placeholder="Default sorting"
              includeAllOption
              allOptionLabel="Default sorting"
            />

            {/* Sort Order */}
            <OptionsDropdown
              options={sortOrderOptions}
              value={filters.sortOrder ?? "desc"}
              onChange={(value) =>
                updateFilter(
                  "sortOrder",
                  value as "asc" | "desc"
                )
              }
              label="Sort Order"
              placeholder="Select sort order"
            />
          </div>
        </div>
      )}

      {hasAdvancedFilters && (
        <div className="mt-3 flex justify-end">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Advanced filters applied
          </span>
        </div>
      )}
    </div>
  );
};

export default PenaltyRuleFilters;