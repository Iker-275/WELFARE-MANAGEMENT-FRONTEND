import {
  MemberContributionFilters as MemberContributionFiltersType,
} from "../../types/MemberContributionType";

import ContributionPlanDropdown from "../customDropdowns/ContributionPlanDropdown";
import ContributionPeriodDropdown from "../customDropdowns/ContributionPeriodDropdown";
import MemberContributionStatusDropdown from "../customDropdowns/MemberContributionStatusDropdown";

interface MemberMyContributionFiltersProps {
  filters: MemberContributionFiltersType;
  onChange: (filters: MemberContributionFiltersType) => void;
  onReset: () => void;
}

const inputClassName =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white";

const labelClassName =
  "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

const MemberMyContributionFilters = ({
  filters,
  onChange,
  onReset,
}: MemberMyContributionFiltersProps) => {
  const handleChange = (
    field: keyof MemberContributionFiltersType,
    value: string | number | undefined
  ) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  const handleAmountChange = (
    field: keyof MemberContributionFiltersType,
    value: string
  ) => {
    handleChange(field, value === "" ? undefined : Number(value));
  };

  const hasFilters = Boolean(
    filters.planId ||
      filters.periodId ||
      filters.status ||
      filters.minAmountDue !== undefined ||
      filters.maxAmountDue !== undefined ||
      filters.minAmountPaid !== undefined ||
      filters.maxAmountPaid !== undefined ||
      filters.dueDateFrom ||
      filters.dueDateTo ||
      filters.settledDateFrom ||
      filters.settledDateTo ||
      filters.sortBy ||
      filters.sortOrder
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white">
          Filter My Contributions
        </h3>

        <button
          type="button"
          onClick={onReset}
          disabled={!hasFilters}
          className="text-sm font-medium text-brand-500 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Contribution Plan */}
        <ContributionPlanDropdown
          value={filters.planId ?? ""}
          onChange={(value) =>
            onChange({
              ...filters,
              planId: value || undefined,
              periodId: undefined,
            })
          }
          label="Contribution Plan"
          placeholder="Select plan"
        />

        {/* Contribution Period */}
        <ContributionPeriodDropdown
          value={filters.periodId ?? ""}
          onChange={(value) =>
            handleChange("periodId", value || undefined)
          }
          planId={filters.planId}
          label="Contribution Period"
          placeholder="Select period"
          includeAllOption
          allOptionLabel="All Periods"
        />

        {/* Contribution Status */}
        <MemberContributionStatusDropdown
          value={filters.status ?? ""}
          onChange={(value) =>
            handleChange("status", value || undefined)
          }
          label="Contribution Status"
          placeholder="Select status"
          includeAllOption
          allOptionLabel="All Statuses"
        />

        {/* Amount Due */}
        <div>
          <label className={labelClassName}>Minimum Amount Due</label>
          <input
            type="number"
            min="0"
            value={filters.minAmountDue ?? ""}
            onChange={(e) =>
              handleAmountChange("minAmountDue", e.target.value)
            }
            placeholder="Minimum amount"
            className={inputClassName}
          />
        </div>

        <div>
          <label className={labelClassName}>Maximum Amount Due</label>
          <input
            type="number"
            min="0"
            value={filters.maxAmountDue ?? ""}
            onChange={(e) =>
              handleAmountChange("maxAmountDue", e.target.value)
            }
            placeholder="Maximum amount"
            className={inputClassName}
          />
        </div>

        {/* Amount Paid */}
        <div>
          <label className={labelClassName}>Minimum Amount Paid</label>
          <input
            type="number"
            min="0"
            value={filters.minAmountPaid ?? ""}
            onChange={(e) =>
              handleAmountChange("minAmountPaid", e.target.value)
            }
            placeholder="Minimum amount"
            className={inputClassName}
          />
        </div>

        <div>
          <label className={labelClassName}>Maximum Amount Paid</label>
          <input
            type="number"
            min="0"
            value={filters.maxAmountPaid ?? ""}
            onChange={(e) =>
              handleAmountChange("maxAmountPaid", e.target.value)
            }
            placeholder="Maximum amount"
            className={inputClassName}
          />
        </div>

        {/* Due Date Range */}
        <div>
          <label className={labelClassName}>Due Date From</label>
          <input
            type="date"
            value={filters.dueDateFrom ?? ""}
            onChange={(e) =>
              handleChange("dueDateFrom", e.target.value || undefined)
            }
            className={inputClassName}
          />
        </div>

        <div>
          <label className={labelClassName}>Due Date To</label>
          <input
            type="date"
            value={filters.dueDateTo ?? ""}
            onChange={(e) =>
              handleChange("dueDateTo", e.target.value || undefined)
            }
            className={inputClassName}
          />
        </div>

        {/* Settled Date Range */}
        <div>
          <label className={labelClassName}>Settled Date From</label>
          <input
            type="date"
            value={filters.settledDateFrom ?? ""}
            onChange={(e) =>
              handleChange("settledDateFrom", e.target.value || undefined)
            }
            className={inputClassName}
          />
        </div>

        <div>
          <label className={labelClassName}>Settled Date To</label>
          <input
            type="date"
            value={filters.settledDateTo ?? ""}
            onChange={(e) =>
              handleChange("settledDateTo", e.target.value || undefined)
            }
            className={inputClassName}
          />
        </div>

        {/* Sorting */}
        <div>
          <label className={labelClassName}>Sort By</label>
          <select
            value={filters.sortBy ?? ""}
            onChange={(e) =>
              handleChange("sortBy", e.target.value || undefined)
            }
            className={inputClassName}
          >
            <option value="">Default</option>
            <option value="createdAt">Created Date</option>
            <option value="dueAt">Due Date</option>
            <option value="amountDue">Amount Due</option>
            <option value="amountPaid">Amount Paid</option>
            <option value="settledAt">Settled Date</option>
            <option value="status">Status</option>
          </select>
        </div>

        <div>
          <label className={labelClassName}>Sort Order</label>
          <select
            value={filters.sortOrder ?? ""}
            onChange={(e) =>
              handleChange("sortOrder", e.target.value || undefined)
            }
            className={inputClassName}
          >
            <option value="">Default</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default MemberMyContributionFilters;