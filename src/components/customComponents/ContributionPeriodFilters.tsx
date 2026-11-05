
// import ContributionPlanDropdown from "../customDropdowns/ContributionPlanDropdown";
// import ContributionPeriodStatusDropdown from "../customDropdowns/ContributionPeriodStatusDropdown";

// interface ContributionPeriodFiltersProps {
//   planId: string;
//   status: string;
//   onChange: (filters: {
//     planId: string;
//     status: string;
//   }) => void;
//   onReset: () => void;
// }

// const ContributionPeriodFilters = ({
//   planId,
//   status,
//   onChange,
//   onReset,
// }: ContributionPeriodFiltersProps) => {
//   const handleChange = (
//     field: "planId" | "status",
//     value: string
//   ) => {
//     onChange({
//       planId: field === "planId" ? value : planId,
//       status: field === "status" ? value : status,
//     });
//   };

//   const hasFilters = Boolean(planId || status);

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//         <ContributionPlanDropdown
//           value={planId}
//           onChange={(value) => handleChange("planId", value)}
//           label="Contribution Plan"
//           placeholder="All Plans"
//         //   includeAllOption
//         //   allOptionLabel="All Plans"
//         />

//         <ContributionPeriodStatusDropdown
//           value={status}
//           onChange={(value) => handleChange("status", value)}
//           label="Period Status"
//           placeholder="All Statuses"
//           includeAllOption
//           allOptionLabel="All Statuses"
//         />
//       </div>

//       <div className="mt-4 flex justify-end">
//         <button
//           type="button"
//           onClick={onReset}
//           disabled={!hasFilters}
//           className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
//         >
//           Reset Filters
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ContributionPeriodFilters;

import ContributionPlanDropdown from "../customDropdowns/ContributionPlanDropdown";
import ContributionPeriodStatusDropdown from "../customDropdowns/ContributionPeriodStatusDropdown";

interface ContributionPeriodFiltersProps {
  planId: string;
  status: string;
  onChange: (filters: {
    planId: string;
    status: string;
  }) => void;
  onReset: () => void;
}

const ContributionPeriodFilters = ({
  planId,
  status,
  onChange,
  onReset,
}: ContributionPeriodFiltersProps) => {
  const handleChange = (
    field: "planId" | "status",
    value: string
  ) => {
    onChange({
      planId: field === "planId" ? value : planId,
      status: field === "status" ? value : status,
    });
  };

  const hasFilters = Boolean(planId || status);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ContributionPlanDropdown
          value={planId}
          onChange={(value) => handleChange("planId", value)}
          label="Contribution Plan"
          placeholder="All Plans"
        //   includeAllOption
        //   allOptionLabel="All Plans"
        />

        <ContributionPeriodStatusDropdown
          value={status}
          onChange={(value) => handleChange("status", value)}
          label="Period Status"
          placeholder="All Statuses"
          includeAllOption
          allOptionLabel="All Statuses"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onReset}
          disabled={!hasFilters}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default ContributionPeriodFilters;
