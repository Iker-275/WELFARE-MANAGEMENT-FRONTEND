// import {
//   useEffect,
//   useState,
// } from "react";

// import { Link } from "react-router-dom";

// import PageMeta from "../../components/common/PageMeta";
// import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import ComponentCard from "../../components/common/ComponentCard";

// import { ContributionRuleTable } from "../../components/tables/BasicTables/BasicTableOne";
// import ContributionRuleFiltersComponent from "../../components/customComponents/ContributionRuleFilters";

// import { useContributionRules } from "../../hooks/useContributionRules";

// import type {
//   ContributionRuleFilters,
// } from "../../types/ContributionRuleType";

// const ContributionRulesPage = () => {
//   const {
//     pagination,
//     loading,
//     fetchRules,
//   } = useContributionRules();

//   const [filters, setFilters] =
//     useState<ContributionRuleFilters>({
//       page: 1,
//     //   limit: 10,
//     //   sortBy: "createdAt",
//     //   sortOrder: "desc",
//     });

//   useEffect(() => {
//     void fetchRules(filters);
//   }, [filters, fetchRules]);

//   const updateFilters = (
//     updates: Partial<ContributionRuleFilters>
//   ) => {
//     setFilters((previous) => ({
//       ...previous,
//       ...updates,
//       page: 1,
//     }));
//   };

//   const handleReset = () => {
//     setFilters({
//       page: 1,
//       limit: 10,
//       sortBy: "createdAt",
//       sortOrder: "desc",
//     });
//   };

//   const handlePageChange = (page: number) => {
//     setFilters((previous) => ({
//       ...previous,
//       page,
//     }));
//   };

//   const handleLimitChange = (limit: number) => {
//     setFilters((previous) => ({
//       ...previous,
//       limit,
//       page: 1,
//     }));
//   };

//   return (
//     <>
//       <PageMeta
//         title="Contribution Rules | Welfare Management"
//         description="Manage contribution rules."
//       />

//       <PageBreadcrumb
//         pageTitle="Contribution Rules"
//       />

//       <div className="space-y-6">
//         {/* PAGE HEADER */}

//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
//               Contribution Rules
//             </h1>

//             <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//               Manage contribution amounts, scopes, frequencies, and deadlines.
//             </p>
//           </div>

//           <Link
//             to="/contribution-rules/create"
//             className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
//           >
//             + Add Contribution Rule
//           </Link>
//         </div>

//         {/* FILTERS */}

//         <ContributionRuleFiltersComponent
//           filters={filters}
//           onChange={(updatedFilters) => {
//             setFilters((previous) => ({
//               ...previous,
//               ...updatedFilters,
//             }));
//           }}
//           onReset={handleReset}
//         />

//         {/* TABLE */}

//         <ComponentCard
//           title="Contribution Rules"
//         >
//           <ContributionRuleTable onEdit={naviga} />

//           {/* PAGINATION */}

//           {pagination && (
//             <div className="mt-5 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-5 dark:border-gray-800 sm:flex-row">
//               <div className="text-sm text-gray-500 dark:text-gray-400">
//                 Showing page {pagination.page} of{" "}
//                 {pagination.totalPages} ({pagination.total} records)
//               </div>

//               <div className="flex items-center gap-3">
//                 <select
//                   value={filters.limit ?? 10}
//                   onChange={(event) =>
//                     handleLimitChange(
//                       Number(event.target.value)
//                     )
//                   }
//                   className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700 dark:text-white"
//                 >
//                   <option value={10}>10 per page</option>
//                   <option value={20}>20 per page</option>
//                   <option value={50}>50 per page</option>
//                   <option value={100}>100 per page</option>
//                 </select>

//                 <button
//                   type="button"
//                   disabled={
//                     loading || pagination.page <= 1
//                   }
//                   onClick={() =>
//                     handlePageChange(pagination.page - 1)
//                   }
//                   className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700"
//                 >
//                   Previous
//                 </button>

//                 <button
//                   type="button"
//                   disabled={
//                     loading ||
//                     pagination.page >= pagination.totalPages
//                   }
//                   onClick={() =>
//                     handlePageChange(pagination.page + 1)
//                   }
//                   className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </ComponentCard>
//       </div>
//     </>
//   );
// };

// export default ContributionRulesPage;



import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { ContributionRuleTable } from "../../components/tables/BasicTables/BasicTableOne";
import ContributionRuleFiltersComponent from "../../components/customComponents/ContributionRuleFilters";

import { useContributionRules } from "../../hooks/useContributionRules";

import type {
    ContributionRule,
  ContributionRuleFilters,
} from "../../types/ContributionRuleType";

const ContributionRulesPage = () => {
  const navigate = useNavigate();

  const {
    pagination,
    loading,
    fetchRules,
  } = useContributionRules();

  const [filters, setFilters] =
    useState<ContributionRuleFilters>({
      page: 1,
    //   limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

  /*
   * ============================================================
   * FETCH CONTRIBUTION RULES
   * ============================================================
   */

  useEffect(() => {
    void fetchRules(filters);
  }, [filters, fetchRules]);

  /*
   * ============================================================
   * FILTER HANDLERS
   * ============================================================
   */

  const updateFilters = (
    updates: Partial<ContributionRuleFilters>
  ) => {
    setFilters((previous) => ({
      ...previous,
      ...updates,
      page: 1,
    }));
  };

  const handleReset = () => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  /*
   * ============================================================
   * PAGINATION HANDLERS
   * ============================================================
   */

  const handlePageChange = (page: number) => {
    setFilters((previous) => ({
      ...previous,
      page,
    }));
  };

  const handleLimitChange = (limit: number) => {
    setFilters((previous) => ({
      ...previous,
      limit,
      page: 1,
    }));
  };

  /*
   * ============================================================
   * NAVIGATION
   * ============================================================
   */

 

  const handleEdit = (rule: ContributionRule) => {
  navigate(`/contribution-rules/edit/${rule.id}`);
};

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <>
      <PageMeta
        title="Contribution Rules | Welfare Management"
        description="Manage contribution rules."
      />

      <PageBreadcrumb
        pageTitle="Contribution Rules"
      />

      <div className="space-y-6">

        {/* PAGE HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Contribution Rules
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage contribution amounts, scopes, frequencies, and deadlines.
            </p>
          </div>

          <Link
            to="/contribution-rules/create"
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            + Add Contribution Rule
          </Link>
        </div>

        {/* FILTERS */}

        <ContributionRuleFiltersComponent
          filters={filters}
          onChange={updateFilters}
          onReset={handleReset}
        />

        {/* TABLE */}

        <ComponentCard title="Contribution Rules">
          <ContributionRuleTable
            onEdit={handleEdit}
          />

          {/* PAGINATION */}

          {pagination && (
            <div className="mt-5 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-5 dark:border-gray-800 sm:flex-row">

              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing page {pagination.page} of{" "}
                {pagination.totalPages} ({pagination.total} records)
              </div>

              <div className="flex items-center gap-3">

                <select
                  value={filters.limit ?? 10}
                  onChange={(event) =>
                    handleLimitChange(
                      Number(event.target.value)
                    )
                  }
                  className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700 dark:text-white"
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>

                <button
                  type="button"
                  disabled={
                    loading || pagination.page <= 1
                  }
                  onClick={() =>
                    handlePageChange(pagination.page - 1)
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={
                    loading ||
                    pagination.page >= pagination.totalPages
                  }
                  onClick={() =>
                    handlePageChange(pagination.page + 1)
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700"
                >
                  Next
                </button>

              </div>
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
};

export default ContributionRulesPage;
