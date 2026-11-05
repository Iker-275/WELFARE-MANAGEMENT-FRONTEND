import ContributionPlanDropdown from "../customDropdowns/ContributionPlanDropdown";
import ContributionRuleScopeDropdown from "../customDropdowns/ContributionRuleScopeDropdown";
import ContributionRuleFrequencyDropdown from "../customDropdowns/ContributionRuleFrequencyDropdown";
import ContributionRuleDeadlineTypeDropdown from "../customDropdowns/ContributionRuleDeadlineTypeDropdown";

import type {
  ContributionRuleFilters,
} from "../../types/ContributionRuleType";

interface ContributionRuleFiltersProps {
  filters: ContributionRuleFilters;
  onChange: (filters: ContributionRuleFilters) => void;
  onReset: () => void;
}

const ContributionRuleFiltersComponent = ({
  filters,
  onChange,
  onReset,
}: ContributionRuleFiltersProps) => {
  const handleChange = (
    field: keyof ContributionRuleFilters,
    value: string | number | undefined
  ) => {
    onChange({
      ...filters,
      
      [field]: value,
      page: 1,
    });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">
          Filter Contribution Rules
        </h3>

        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-brand-500 hover:text-brand-600"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ContributionPlanDropdown
          value={filters.planId ?? ""}
          onChange={(value) => handleChange("planId", value || undefined)}
          label="Contribution Plan"
          placeholder="All plans"
        />

        <ContributionRuleScopeDropdown
          value={filters.scopeType ?? ""}
          onChange={(value) =>
            handleChange(
              "scopeType",
              value as ContributionRuleFilters["scopeType"] || undefined
            )
          }
          label="Rule Scope"
          placeholder="All scopes"
        />

        <ContributionRuleFrequencyDropdown
          value={filters.frequencyOverride ?? ""}
          onChange={(value) =>
            handleChange(
              "frequencyOverride",
              value as ContributionRuleFilters["frequencyOverride"] || undefined
            )
          }
          label="Frequency"
          placeholder="All frequencies"
        />

        <ContributionRuleDeadlineTypeDropdown
          value={filters.deadlineType ?? ""}
          onChange={(value) =>
            handleChange(
              "deadlineType",
              value as ContributionRuleFilters["deadlineType"] || undefined
            )
          }
          label="Deadline Type"
          placeholder="All deadline types"
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>

          <select
            value={
              filters.isActive === undefined
                ? ""
                : filters.isActive
                  ? "true"
                  : "false"
            }
            onChange={(event) => {
              const value = event.target.value;

              handleChange(
                "isActive",
                value === "" ? undefined : value === "true" ? 1 : 0
              );
            }}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
          >
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Priority
          </label>

          <input
            type="number"
            min="0"
            value={filters.priority ?? ""}
            onChange={(event) =>
              handleChange(
                "priority",
                event.target.value === ""
                  ? undefined
                  : Number(event.target.value)
              )
            }
            placeholder="Any priority"
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Effective From
          </label>

          <input
            type="date"
            value={filters.effectiveFrom ?? ""}
            onChange={(event) =>
              handleChange("effectiveFrom", event.target.value || undefined)
            }
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Effective To
          </label>

          <input
            type="date"
            value={filters.effectiveTo ?? ""}
            onChange={(event) =>
              handleChange("effectiveTo", event.target.value || undefined)
            }
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default ContributionRuleFiltersComponent;