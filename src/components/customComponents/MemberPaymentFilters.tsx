import {
  MemberPaymentFilters as MemberPaymentFiltersType,
} from "../../types/PaymentType";

import PaymentMethodDropdown from "../customDropdowns/PaymentMethodDropdown";
import PaymentStatusDropdown from "../customDropdowns/PaymentStatusDropdown";

interface MemberPaymentFiltersProps {
  filters: MemberPaymentFiltersType;
  onChange: (filters: MemberPaymentFiltersType) => void;
  onReset: () => void;
}

const MemberPaymentFilters = ({
  filters,
  onChange,
  onReset,
}: MemberPaymentFiltersProps) => {
  const updateFilter = <K extends keyof MemberPaymentFiltersType>(
    key: K,
    value: MemberPaymentFiltersType[K],
  ) => {
    onChange({
      ...filters,
      [key]: value,
      page: 1,
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <PaymentMethodDropdown
          value={filters.method ?? ""}
          onChange={(value) => updateFilter("method", value)}
          label="Payment Method"
          placeholder="All methods"
        />

        <PaymentStatusDropdown
          value={filters.status ?? ""}
          onChange={(value) => updateFilter("status", value)}
          label="Payment Status"
          placeholder="All statuses"
        />
      </div>

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

export default MemberPaymentFilters;