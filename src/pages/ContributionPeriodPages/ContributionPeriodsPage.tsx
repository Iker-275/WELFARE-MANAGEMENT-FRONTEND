
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { ContributionPeriodTable } from "../../components/tables/BasicTables/BasicTableOne";
import ContributionPeriodFilters from "../../components/customComponents/ContributionPeriodFilters";

import { useContributionPeriods } from "../../hooks/useContributionPeriods";

interface PeriodFilters {
  planId: string;
  status: string;
}

const initialFilters: PeriodFilters = {
  planId: "",
  status: "",
};

const DEFAULT_LIMIT = 10;

const ContributionPeriodsPage = () => {
  const {
    periods,
    pagination,
    loading,
    fetchPeriods,
    fetchPeriodsByPlan,
  } = useContributionPeriods();

  const [filters, setFilters] = useState<PeriodFilters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_LIMIT);

  /**
   * Fetch the selected page whenever pagination
   * or the contribution plan filter changes.
   */
  useEffect(() => {
    if (filters.planId) {
      void fetchPeriodsByPlan(
        filters.planId,
        currentPage,
        pageSize
      );
    } else {
      void fetchPeriods(currentPage, pageSize);
    }
  }, [
    filters.planId,
    currentPage,
    pageSize,
    fetchPeriods,
    fetchPeriodsByPlan,
  ]);

  /**
   * Handle filter changes.
   */
  const handleFilterChange = (updatedFilters: PeriodFilters) => {
    if (updatedFilters.planId !== filters.planId) {
      setCurrentPage(1);
    }

    setFilters(updatedFilters);
  };

  /**
   * Reset filters and pagination.
   */
  const handleResetFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  /**
   * Change page size and return to the first page.
   */
  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  /**
   * Navigate between pages.
   */
  const handlePreviousPage = () => {
    if (pagination?.hasPreviousPage) {
      setCurrentPage((previous) => previous - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      setCurrentPage((previous) => previous + 1);
    }
  };

  /**
   * Status filtering remains local because the API
   * currently does not expose a status filter parameter.
   */
  const filteredPeriods = useMemo(() => {
    if (!filters.status) {
      return periods;
    }

    return periods.filter(
      (period) => period.status === filters.status
    );
  }, [periods, filters.status]);

  return (
    <>
      <PageMeta
        title="Contribution Periods"
        description="Manage generated contribution periods."
      />

      <PageBreadcrumb pageTitle="Contribution Periods" />

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Contribution Periods
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View and manage contribution periods generated for your plans.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/contribution-periods/generate"
              className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              Generate One Period
            </Link>

            <Link
              to="/contribution-periods/generate-batch"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
            >
              Generate Multiple
            </Link>
          </div>
        </div>

        <ContributionPeriodFilters
          planId={filters.planId}
          status={filters.status}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <ComponentCard title="Contribution Periods">
          <ContributionPeriodTable
            periods={filteredPeriods}
            loading={loading}
          />

          {pagination && (
            <div className="mt-4 flex flex-col gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {filteredPeriods.length} of {pagination.total} periods
                  {filters.status ? " on this page matching the selected status" : ""}
                </div>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="period-page-size"
                    className="text-sm text-gray-500 dark:text-gray-400"
                  >
                    Rows per page:
                  </label>

                  <select
                    id="period-page-size"
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    disabled={loading}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePreviousPage}
                    disabled={!pagination.hasPreviousPage || loading}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={!pagination.hasNextPage || loading}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
};

export default ContributionPeriodsPage;

