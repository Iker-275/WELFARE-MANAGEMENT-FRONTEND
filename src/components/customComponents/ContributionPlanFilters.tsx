
// import { useEffect, useState } from "react";
// import type { Dispatch, SetStateAction } from "react";

// import {
//   ContributionPlanFilters as ContributionPlanFiltersType,
//   ContributionPlanStatus,
//   ContributionFrequency,
// } from "../../types/ContributionPlanType";

// import ContributionPlanStatusDropdown from "../customDropdowns/ContributionPlanStatusDropdown";
// import ContributionFrequencyDropdown from "../customDropdowns/ContributionFrequencyDropdown";

// interface ContributionPlanFiltersProps {
//   filters: ContributionPlanFiltersType;
//   setFilters: Dispatch<SetStateAction<ContributionPlanFiltersType>>;
//   onReset?: () => void;
// }

// const ContributionPlanFilters = ({
//   filters,
//   setFilters,
//   onReset,
// }: ContributionPlanFiltersProps) => {
//   const [search, setSearch] = useState(filters.search ?? "");

//   // Keep local search synchronized when the parent resets or externally
//   // changes the search filter.
//   useEffect(() => {
//     setSearch(filters.search ?? "");
//   }, [filters.search]);

//   // Debounce search to avoid making an API request on every keystroke.
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const searchValue = search.trim() || undefined;

//       setFilters((previous) => {
//         if (previous.search === searchValue) {
//           return previous;
//         }

//         return {
//           ...previous,
//           search: searchValue,
//           page: 1,
//         };
//       });
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [search, setFilters]);

//   const updateFilter = (
//     updates: Partial<ContributionPlanFiltersType>
//   ) => {
//     setFilters((previous) => ({
//       ...previous,
//       ...updates,
//       page: 1,
//     }));
//   };

//   const handleCurrencyChange = (value: string) => {
//     updateFilter({
//       currency: value.trim().toUpperCase() || undefined,
//     });
//   };

//   const handleStatusChange = (value: string) => {
//     updateFilter({
//       status: value
//         ? (value as ContributionPlanStatus)
//         : undefined,
//     });
//   };

//   const handleFrequencyChange = (value: string) => {
//     updateFilter({
//       frequency: value
//         ? (value as ContributionFrequency)
//         : undefined,
//     });
//   };

//   const handleEffectiveFromChange = (value: string) => {
//     updateFilter({
//       effectiveFrom: value || undefined,
//     });
//   };

//   const handleEffectiveToChange = (value: string) => {
//     updateFilter({
//       effectiveTo: value || undefined,
//     });
//   };

//   const handleReset = () => {
//     setSearch("");
//     setFilters({});
//     onReset?.();
//   };

//   const hasActiveFilters = Boolean(
//     filters.search ||
//       filters.status ||
//       filters.frequency ||
//       filters.currency ||
//       filters.effectiveFrom ||
//       filters.effectiveTo
//   );

//   return (
//     <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
//       <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
//             Filter Contribution Plans
//           </h3>

//           <p className="text-sm text-gray-500 dark:text-gray-400">
//             Search and filter contribution plans using the available
//             criteria.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={handleReset}
//           disabled={!hasActiveFilters && !search}
//           className="text-sm font-medium text-brand-500 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           Reset Filters
//         </button>
//       </div>

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
//         {/* Search */}
//         <div>
//           <label
//             htmlFor="contribution-plan-search"
//             className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
//           >
//             Search
//           </label>

//           <input
//             id="contribution-plan-search"
//             type="text"
//             value={search}
//             onChange={(event) => setSearch(event.target.value)}
//             placeholder="Search by name or code..."
//             className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-800 shadow-theme-xs outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
//           />
//         </div>

//         {/* Status */}
//         <div>
//           <ContributionPlanStatusDropdown
//             value={filters.status ?? ""}
//             onChange={handleStatusChange}
//             includeAllOption
//             allOptionLabel="All Statuses"
//             label="Status"
//             placeholder="Select status"
//           />
//         </div>

//         {/* Frequency */}
//         <div>
//           <ContributionFrequencyDropdown
//             value={filters.frequency ?? ""}
//             onChange={handleFrequencyChange}
//             includeAllOption
//             allOptionLabel="All Frequencies"
//             label="Frequency"
//             placeholder="Select frequency"
//           />
//         </div>

//         {/* Currency */}
//         <div>
//           <label
//             htmlFor="contribution-plan-currency"
//             className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
//           >
//             Currency
//           </label>

//           <input
//             id="contribution-plan-currency"
//             type="text"
//             value={filters.currency ?? ""}
//             onChange={(event) =>
//               handleCurrencyChange(event.target.value)
//             }
//             placeholder="e.g. KES, USD"
//             maxLength={3}
//             className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm uppercase text-gray-800 shadow-theme-xs outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
//           />
//         </div>

//         {/* Effective From */}
//         <div>
//           <label
//             htmlFor="contribution-plan-effective-from"
//             className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
//           >
//             Effective From
//           </label>

//           <input
//             id="contribution-plan-effective-from"
//             type="date"
//             value={filters.effectiveFrom ?? ""}
//             onChange={(event) =>
//               handleEffectiveFromChange(event.target.value)
//             }
//             className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-800 shadow-theme-xs outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
//           />
//         </div>

//         {/* Effective To */}
//         <div>
//           <label
//             htmlFor="contribution-plan-effective-to"
//             className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
//           >
//             Effective To
//           </label>

//           <input
//             id="contribution-plan-effective-to"
//             type="date"
//             value={filters.effectiveTo ?? ""}
//             min={filters.effectiveFrom || undefined}
//             onChange={(event) =>
//               handleEffectiveToChange(event.target.value)
//             }
//             className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-800 shadow-theme-xs outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContributionPlanFilters;


import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import type {
  ContributionPlanFilters as ContributionPlanFiltersType,
  ContributionPlanStatus,
  ContributionFrequency,
} from "../../types/ContributionPlanType";

import OptionsDropdown from "../customDropdowns/OptionsDropdown";
import ContributionPlanStatusDropdown from "../customDropdowns/ContributionPlanStatusDropdown";
import ContributionFrequencyDropdown from "../customDropdowns/ContributionFrequencyDropdown";

interface ContributionPlanFiltersProps {
  filters: ContributionPlanFiltersType;
  setFilters: Dispatch<SetStateAction<ContributionPlanFiltersType>>;
  onReset?: () => void;
}

const ContributionPlanFilters = ({
  filters,
  setFilters,
  onReset,
}: ContributionPlanFiltersProps) => {
  const [search, setSearch] = useState(filters.search ?? "");

  // Keep local search synchronized when the parent resets or externally
  // changes the search filter.
  useEffect(() => {
    setSearch(filters.search ?? "");
  }, [filters.search]);

  // Debounce search to avoid making an API request on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      const searchValue = search.trim() || undefined;

      setFilters((previous) => {
        if (previous.search === searchValue) {
          return previous;
        }

        return {
          ...previous,
          search: searchValue,
          page: 1,
        };
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [search, setFilters]);

  const updateFilter = (
    updates: Partial<ContributionPlanFiltersType>
  ) => {
    setFilters((previous) => ({
      ...previous,
      ...updates,
      page: 1,
    }));
  };

  const handleCurrencyChange = (value: string) => {
    updateFilter({
      currency: value || undefined,
    });
  };

  const handleStatusChange = (value: string) => {
    updateFilter({
      status: value
        ? (value as ContributionPlanStatus)
        : undefined,
    });
  };

  const handleFrequencyChange = (value: string) => {
    updateFilter({
      frequency: value
        ? (value as ContributionFrequency)
        : undefined,
    });
  };

  const handleEffectiveFromChange = (value: string) => {
    updateFilter({
      effectiveFrom: value || undefined,
    });
  };

  const handleEffectiveToChange = (value: string) => {
    updateFilter({
      effectiveTo: value || undefined,
    });
  };

  const handleReset = () => {
    setSearch("");
    setFilters({});
    onReset?.();
  };

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.status ||
      filters.frequency ||
      filters.currency ||
      filters.effectiveFrom ||
      filters.effectiveTo
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Filter Contribution Plans
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Search and filter contribution plans using the available
            criteria.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          disabled={!hasActiveFilters && !search}
          className="text-sm font-medium text-brand-500 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Search */}
        <div>
          <label
            htmlFor="contribution-plan-search"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Search
          </label>

          <input
            id="contribution-plan-search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or code..."
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-800 shadow-theme-xs outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>

        {/* Status */}
        <div>
          <ContributionPlanStatusDropdown
            value={filters.status ?? ""}
            onChange={handleStatusChange}
            includeAllOption
            allOptionLabel="All Statuses"
            label="Status"
            placeholder="Select status"
          />
        </div>

        {/* Frequency */}
        <div>
          <ContributionFrequencyDropdown
            value={filters.frequency ?? ""}
            onChange={handleFrequencyChange}
            includeAllOption
            allOptionLabel="All Frequencies"
            label="Frequency"
            placeholder="Select frequency"
          />
        </div>

        {/* Currency */}
        <div>
          <OptionsDropdown
            options={[
              {
                value: "KES",
                label: "Kenyan Shilling (KES)",
              },
            ]}
            value={filters.currency ?? ""}
            onChange={handleCurrencyChange}
            label="Currency"
            placeholder="Select currency"
          />
        </div>

        {/* Effective From */}
        <div>
          <label
            htmlFor="contribution-plan-effective-from"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Effective From
          </label>

          <input
            id="contribution-plan-effective-from"
            type="date"
            value={filters.effectiveFrom ?? ""}
            onChange={(event) =>
              handleEffectiveFromChange(event.target.value)
            }
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-800 shadow-theme-xs outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>

        {/* Effective To */}
        <div>
          <label
            htmlFor="contribution-plan-effective-to"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Effective To
          </label>

          <input
            id="contribution-plan-effective-to"
            type="date"
            value={filters.effectiveTo ?? ""}
            min={filters.effectiveFrom || undefined}
            onChange={(event) =>
              handleEffectiveToChange(event.target.value)
            }
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-800 shadow-theme-xs outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>
      </div>
    </div>
  );
};

export default ContributionPlanFilters;

