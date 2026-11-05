
import {
  PaymentFilters as PaymentFiltersType,
} from "../../types/PaymentType";

import PaymentMethodDropdown from "../customDropdowns/PaymentMethodDropdown";
import PaymentStatusDropdown from "../customDropdowns/PaymentStatusDropdown";
import PaymentProviderDropdown from "../customDropdowns/PaymentProviderDropdown";

interface PaymentFiltersProps {
  filters: PaymentFiltersType;
  onChange: (filters: PaymentFiltersType) => void;
  onReset: () => void;
}

const PaymentFilters = ({
  filters,
  onChange,
  onReset,
}: PaymentFiltersProps) => {
  const updateFilter = <K extends keyof PaymentFiltersType>(
    key: K,
    value: PaymentFiltersType[K],
  ) => {
    onChange({
      ...filters,
      [key]: value,
      page: 1,
    });
  };

  const handleTextChange = (
    key: keyof PaymentFiltersType,
    value: string,
  ) => {
    updateFilter(
      key,
      value === "" ? undefined : value,
    );
  };

  const handleNumberChange = (
    key: "minAmount" | "maxAmount",
    value: string,
  ) => {
    updateFilter(
      key,
      value === "" ? undefined : Number(value),
    );
  };

  const inputClasses =
    "w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white";

  const labelClasses =
    "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="space-y-5">
      {/* General filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

        <div>
          <label className={labelClasses}>
            Member ID
          </label>

          <input
            type="text"
            value={filters.memberId ?? ""}
            onChange={(e) =>
              handleTextChange("memberId", e.target.value)
            }
            placeholder="Enter member ID"
            className={inputClasses}
          />
        </div>

        <div>
          <PaymentProviderDropdown
            value={filters.providerId ?? ""}
            onChange={(value) =>
              updateFilter("providerId", value || undefined)
            }
            label="Payment Provider"
            placeholder="All providers"
          />
        </div>

        <div>
          <PaymentMethodDropdown
            value={filters.method ?? ""}
            onChange={(value) =>
              updateFilter("method", value)
            }
            label="Payment Method"
            placeholder="All methods"
          />
        </div>

        <div>
          <PaymentStatusDropdown
            value={filters.status ?? ""}
            onChange={(value) =>
              updateFilter("status", value)
            }
            label="Payment Status"
            placeholder="All statuses"
          />
        </div>

        <div>
          <label className={labelClasses}>
            Currency
          </label>

          <input
            type="text"
            value={filters.currency ?? ""}
            onChange={(e) =>
              handleTextChange("currency", e.target.value)
            }
            placeholder="e.g. KES"
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>
            Internal Reference
          </label>

          <input
            type="text"
            value={filters.internalReference ?? ""}
            onChange={(e) =>
              handleTextChange(
                "internalReference",
                e.target.value,
              )
            }
            placeholder="Search internal reference"
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>
            External Reference
          </label>

          <input
            type="text"
            value={filters.externalReference ?? ""}
            onChange={(e) =>
              handleTextChange(
                "externalReference",
                e.target.value,
              )
            }
            placeholder="Search external reference"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Amount range */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white">
          Amount Range
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClasses}>
              Minimum Amount
            </label>

            <input
              type="number"
              min="0"
              value={filters.minAmount ?? ""}
              onChange={(e) =>
                handleNumberChange("minAmount", e.target.value)
              }
              placeholder="Minimum amount"
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>
              Maximum Amount
            </label>

            <input
              type="number"
              min="0"
              value={filters.maxAmount ?? ""}
              onChange={(e) =>
                handleNumberChange("maxAmount", e.target.value)
              }
              placeholder="Maximum amount"
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Initiation date range */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white">
          Initiation Date Range
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClasses}>
              Initiated From
            </label>

            <input
              type="date"
              value={filters.initiatedFrom ?? ""}
              onChange={(e) =>
                handleTextChange("initiatedFrom", e.target.value)
              }
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>
              Initiated To
            </label>

            <input
              type="date"
              value={filters.initiatedTo ?? ""}
              onChange={(e) =>
                handleTextChange("initiatedTo", e.target.value)
              }
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Completion date range */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white">
          Completion Date Range
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClasses}>
              Completed From
            </label>

            <input
              type="date"
              value={filters.completedFrom ?? ""}
              onChange={(e) =>
                handleTextChange("completedFrom", e.target.value)
              }
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>
              Completed To
            </label>

            <input
              type="date"
              value={filters.completedTo ?? ""}
              onChange={(e) =>
                handleTextChange("completedTo", e.target.value)
              }
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default PaymentFilters;
