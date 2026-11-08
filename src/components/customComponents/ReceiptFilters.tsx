
import { ReceiptFilters as ReceiptFiltersType, ReceiptStatus } from "../../types/ReceiptType";

import ReceiptStatusDropdown from "../customDropdowns/ReceiptStatusDropdown";

interface ReceiptFiltersProps {
  filters: ReceiptFiltersType;
  status?: ReceiptStatus | "";
  onChange: (filters: ReceiptFiltersType) => void;
  onStatusChange: (status: ReceiptStatus | "") => void;
  onReset: () => void;
}

const ReceiptFilters = ({
  filters,
  status = "",
  onChange,
  onStatusChange,
  onReset,
}: ReceiptFiltersProps) => {
  const handleChange = (
    field: keyof ReceiptFiltersType,
    value: string,
  ) => {
    onChange({
      ...filters,
      page: 1,
      [field]: value || undefined,
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Receipt Status */}
        <ReceiptStatusDropdown
          value={status}
          onChange={onStatusChange}
          label="Receipt Status"
          placeholder="All receipt statuses"
        />

        {/* Receipt Number */}
        <div>
          <label
            htmlFor="receiptNumber"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Receipt Number
          </label>

          <input
            id="receiptNumber"
            type="text"
            value={filters.receiptNumber || ""}
            onChange={(event) =>
              handleChange("receiptNumber", event.target.value)
            }
            placeholder="Search receipt number"
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>

        {/* Payment ID */}
        <div>
          <label
            htmlFor="paymentId"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Payment ID
          </label>

          <input
            id="paymentId"
            type="text"
            value={filters.paymentId || ""}
            onChange={(event) =>
              handleChange("paymentId", event.target.value)
            }
            placeholder="Enter payment ID"
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>

        {/* Member ID */}
        <div>
          <label
            htmlFor="memberId"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Member ID
          </label>

          <input
            id="memberId"
            type="text"
            value={filters.memberId || ""}
            onChange={(event) =>
              handleChange("memberId", event.target.value)
            }
            placeholder="Enter member ID"
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>

        {/* Currency */}
        <div>
          <label
            htmlFor="currency"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Currency
          </label>

          <input
            id="currency"
            type="text"
            value={filters.currency || ""}
            onChange={(event) =>
              handleChange("currency", event.target.value.toUpperCase())
            }
            placeholder="e.g. KES"
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm uppercase text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>

        {/* Issued From */}
        <div>
          <label
            htmlFor="issuedFrom"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Issued From
          </label>

          <input
            id="issuedFrom"
            type="date"
            value={filters.issuedFrom || ""}
            onChange={(event) =>
              handleChange("issuedFrom", event.target.value)
            }
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>

        {/* Issued To */}
        <div>
          <label
            htmlFor="issuedTo"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Issued To
          </label>

          <input
            id="issuedTo"
            type="date"
            min={filters.issuedFrom || undefined}
            value={filters.issuedTo || ""}
            onChange={(event) =>
              handleChange("issuedTo", event.target.value)
            }
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default ReceiptFilters;
