
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// import PageMeta from "../../components/common/PageMeta";
// import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import ComponentCard from "../../components/common/ComponentCard";

// import { MemberContributionTable } from "../../components/tables/BasicTables/BasicTableOne";
// import MemberContributionFilters from "../../components/customComponents/MemberContributionFilters";

// import { useMemberContributions } from "../../hooks/useMemberContributions";
// import { MemberContributionFilters as MemberContributionFiltersType } from "../../types/MemberContributionType";

// const MemberContributionsPage = () => {
//   const {
//     pagination,
//     loading,
//     fetchContributions,
//     ensureContributionsLoaded,
//   } = useMemberContributions();

//   const [filters, setFilters] =
//     useState<MemberContributionFiltersType>({});

//   useEffect(() => {
//     ensureContributionsLoaded();
//   }, [ensureContributionsLoaded]);

//   const handleFilterChange = (
//     updatedFilters: MemberContributionFiltersType,
//   ) => {
//     const newFilters = {
//       ...updatedFilters,
//       page: 1,
//     };

//     setFilters(newFilters);
//     fetchContributions(newFilters);
//   };

//   const handleResetFilters = () => {
//     const resetFilters = { page: 1 };

//     setFilters(resetFilters);
//     fetchContributions(resetFilters);
//   };

//   const handlePageChange = (newPage: number) => {
//     if (
//       loading ||
//       newPage < 1 ||
//       newPage > (pagination?.totalPages ?? 1)
//     ) {
//       return;
//     }

//     const newFilters = {
//       ...filters,
//       page: newPage,
//     };

//     setFilters(newFilters);
//     fetchContributions(newFilters);
//   };

//   const currentPage = pagination?.page ?? 1;
//   const totalPages = pagination?.totalPages ?? 1;
//   const totalRecords = pagination?.total ?? 0;

//   return (
//     <>
//       <PageMeta
//         title="Member Contributions | Welfare Management"
//         description="Manage and monitor member contributions."
//       />

//       <PageBreadcrumb pageTitle="Member Contributions" />

//       <div className="space-y-6">
//         <ComponentCard title="Member Contributions">
//           <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               View, filter, and manage member contributions.
//             </p>

//             <div className="flex flex-wrap gap-3">
//               <Link
//                 to="/member-contributions/generate"
//                 className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
//               >
//                 Generate Single
//               </Link>

//               <Link
//                 to="/member-contributions/generate-bulk"
//                 className="inline-flex items-center justify-center rounded-lg bg-success-500 px-4 py-2 text-sm font-medium text-white hover:bg-success-600"
//               >
//                 Generate Bulk
//               </Link>
//             </div>
//           </div>

//           <div className="mb-5">
//             <MemberContributionFilters
//               filters={filters}
//               onChange={handleFilterChange}
//               onReset={handleResetFilters}
//             />
//           </div>

//           <MemberContributionTable />

//           {/* Pagination */}
//           <div className="mt-5 flex flex-col gap-3 border-t border-gray-200 pt-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               Showing page{" "}
//               <span className="font-medium text-gray-800 dark:text-white">
//                 {currentPage}
//               </span>{" "}
//               of{" "}
//               <span className="font-medium text-gray-800 dark:text-white">
//                 {totalPages}
//               </span>
//               {" "}({totalRecords} contributions)
//             </p>

//             <div className="flex items-center gap-2">
//               <button
//                 type="button"
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={loading || currentPage <= 1}
//                 className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
//               >
//                 Previous
//               </button>

//               <span className="px-2 text-sm text-gray-600 dark:text-gray-400">
//                 {currentPage} / {totalPages}
//               </span>

//               <button
//                 type="button"
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={loading || currentPage >= totalPages}
//                 className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </ComponentCard>
//       </div>
//     </>
//   );
// };

// export default MemberContributionsPage;


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { MemberContributionTable } from "../../components/tables/BasicTables/BasicTableOne";
import MemberContributionFilters from "../../components/customComponents/MemberContributionFilters";

import { useMemberContributions } from "../../hooks/useMemberContributions";
import { MemberContributionFilters as MemberContributionFiltersType } from "../../types/MemberContributionType";

const MemberContributionsPage = () => {
  const {
    pagination,
    loading,
    fetchContributions,
    ensureContributionsLoaded,
  } = useMemberContributions();

  const [filters, setFilters] =
    useState<MemberContributionFiltersType>({});

  useEffect(() => {
    ensureContributionsLoaded();
  }, [ensureContributionsLoaded]);

  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const totalRecords = pagination?.total ?? 0;

  const handleFilterChange = (
    updatedFilters: MemberContributionFiltersType,
  ) => {
    const newFilters: MemberContributionFiltersType = {
      ...updatedFilters,
      page: 1,
    };

    setFilters(newFilters);
    fetchContributions(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: MemberContributionFiltersType = {
      page: 1,
    };

    setFilters(resetFilters);
    fetchContributions(resetFilters);
  };

  const handlePageChange = (newPage: number) => {
    if (
      loading ||
      !pagination ||
      newPage < 1 ||
      newPage > totalPages ||
      newPage === currentPage
    ) {
      return;
    }

    const newFilters: MemberContributionFiltersType = {
      ...filters,
      page: newPage,
    };

    setFilters(newFilters);
    fetchContributions(newFilters);
  };

  const getPageNumbers = () => {
    const pages: number[] = [];

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }

    return pages;
  };

  return (
    <>
      <PageMeta
        title="Member Contributions | Welfare Management"
        description="Manage and monitor member contributions."
      />

      <PageBreadcrumb pageTitle="Member Contributions" />

      <div className="space-y-6">
        <ComponentCard title="Member Contributions">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View, filter, and manage member contributions.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/member-contributions/generate"
                className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
              >
                Generate Single
              </Link>

              <Link
                to="/member-contributions/generate-bulk"
                className="inline-flex items-center justify-center rounded-lg bg-success-500 px-4 py-2 text-sm font-medium text-white hover:bg-success-600"
              >
                Generate Bulk
              </Link>
            </div>
          </div>

          <div className="mb-5">
            <MemberContributionFilters
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          <MemberContributionTable />

          {/* Pagination */}
          <div className="mt-5 flex flex-col gap-4 border-t border-gray-200 pt-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page{" "}
              <span className="font-medium text-gray-800 dark:text-white">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-800 dark:text-white">
                {totalPages}
              </span>
              {" · "}
              <span className="font-medium text-gray-800 dark:text-white">
                {totalRecords}
              </span>{" "}
              contributions
            </p>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={loading || !pagination?.hasPreviousPage}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                >
                  Previous
                </button>

                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    disabled={loading || page === currentPage}
                    className={`min-w-9 rounded-lg border px-3 py-2 text-sm font-medium ${
                      page === currentPage
                        ? "border-brand-500 bg-brand-500 text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                    } disabled:cursor-not-allowed`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={loading || !pagination?.hasNextPage}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </ComponentCard>
      </div>
    </>
  );
};

export default MemberContributionsPage;

