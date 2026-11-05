import { PaymentProviderFilters as PaymentProviderFilterType } from "../../types/PaymentProviderType";

import OptionsDropdown from "../customDropdowns/OptionsDropdown";


interface PaymentProviderFiltersProps {
  filters: PaymentProviderFilterType & {
    providerId?: string;
  };
  onFilterChange: (
    filters: PaymentProviderFilterType & {
      providerId?: string;
    },
  ) => void;
}

const statusOptions = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const PaymentProviderFilters = ({
  filters,
  onFilterChange,
}: PaymentProviderFiltersProps) => {
  const handleReset = () => {
    onFilterChange({
      page: 1,
      limit: filters.limit,
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Search */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search
          </label>

          <input
            type="text"
            value={filters.search ?? ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                search: e.target.value || undefined,
                page: 1,
              })
            }
            placeholder="Search by name or code..."
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* Payment Provider */}
        {/* <PaymentProviderDropdown
          label="Payment Provider"
          value={filters.providerId ?? ""}
          onChange={(value) =>
            onFilterChange({
              ...filters,
              providerId: value || undefined,
              page: 1,
            })
          }
          placeholder="All payment providers"
        /> */}

        {/* Status */}
        <OptionsDropdown
          label="Status"
          options={statusOptions}
          value={
            filters.isActive === undefined
              ? ""
              : String(filters.isActive)
          }
          onChange={(value) =>
            onFilterChange({
              ...filters,
              isActive: value === "" ? undefined : value === "true",
              page: 1,
            })
          }
          placeholder="All statuses"
          includeAllOption
          allOptionLabel="All statuses"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default PaymentProviderFilters;